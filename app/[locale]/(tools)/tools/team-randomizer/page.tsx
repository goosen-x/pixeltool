'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
	Users,
	Shuffle,
	Copy,
	RotateCcw,
	AlertCircle,
	Info,
	Download
} from 'lucide-react'

interface Team {
	id: number
	name: string
	members: string[]
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array]
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

// Distribute participants into teams
function distributeIntoTeams(
	participants: string[],
	numberOfTeams: number
): Team[] {
	if (participants.length === 0 || numberOfTeams === 0) return []

	const shuffledParticipants = shuffleArray(participants)
	const teams: Team[] = []

	// Initialize teams
	for (let i = 0; i < numberOfTeams; i++) {
		teams.push({
			id: i + 1,
			name: `Team ${i + 1}`,
			members: []
		})
	}

	// Distribute participants round-robin style for fairness
	shuffledParticipants.forEach((participant, index) => {
		const teamIndex = index % numberOfTeams
		teams[teamIndex].members.push(participant.trim())
	})

	return teams
}

export default function TeamRandomizerPage() {
	const t = useTranslations('widgets.teamRandomizer')
	const [participantsInput, setParticipantsInput] = useState('')
	const [numberOfTeams, setNumberOfTeams] = useState(2)
	const [preferredTeamSize, setPreferredTeamSize] = useState('')
	const [teams, setTeams] = useState<Team[]>([])
	const [participants, setParticipants] = useState<string[]>([])
	const [errors, setErrors] = useState<string[]>([])

	// Parse participants from input
	useEffect(() => {
		const parsed = participantsInput
			.split('\n')
			.map(name => name.trim())
			.filter(name => name.length > 0)
		setParticipants(parsed)
	}, [participantsInput])

	// Validate inputs
	const validateInputs = (): string[] => {
		const validationErrors: string[] = []

		if (participants.length < 2) {
			validationErrors.push(t('validationErrors.minParticipants'))
		}

		if (numberOfTeams < 2) {
			validationErrors.push(t('validationErrors.minTeams'))
		}

		if (numberOfTeams > participants.length) {
			validationErrors.push(t('validationErrors.maxTeams'))
		}

		if (preferredTeamSize) {
			const teamSizeNum = parseInt(preferredTeamSize)
			if (isNaN(teamSizeNum) || teamSizeNum < 1) {
				validationErrors.push(t('validationErrors.teamSizeInvalid'))
			} else if (teamSizeNum * numberOfTeams > participants.length * 2) {
				validationErrors.push(t('validationErrors.teamSizeTooLarge'))
			}
		}

		return validationErrors
	}

	// Generate teams
	const generateTeams = () => {
		const validationErrors = validateInputs()
		setErrors(validationErrors)

		if (validationErrors.length > 0) {
			toast.error(validationErrors[0])
			return
		}

		// If preferred team size is specified, calculate number of teams
		let teamsToCreate = numberOfTeams
		if (preferredTeamSize) {
			const teamSizeNum = parseInt(preferredTeamSize)
			if (!isNaN(teamSizeNum) && teamSizeNum > 0) {
				teamsToCreate = Math.ceil(participants.length / teamSizeNum)
			}
		}

		const generatedTeams = distributeIntoTeams(participants, teamsToCreate)
		setTeams(generatedTeams)
		toast.success(`Generated ${generatedTeams.length} teams!`)
	}

	// Reset all inputs
	const resetAll = () => {
		setParticipantsInput('')
		setNumberOfTeams(2)
		setPreferredTeamSize('')
		setTeams([])
		setErrors([])
		toast.success('All fields reset')
	}

	// Copy teams to clipboard
	const copyTeamsToClipboard = () => {
		if (teams.length === 0) return

		const teamsText = teams
			.map(
				team =>
					`${team.name}:\n${team.members.map(member => `- ${member}`).join('\n')}`
			)
			.join('\n\n')

		navigator.clipboard.writeText(teamsText)
		toast.success(t('teamsExported'))
	}

	// Export teams as text file
	const exportTeams = () => {
		if (teams.length === 0) return

		const teamsText = teams
			.map(
				team =>
					`${team.name}:\n${team.members.map(member => `- ${member}`).join('\n')}`
			)
			.join('\n\n')

		const blob = new Blob([teamsText], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'teams.txt'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		toast.success('Teams exported as file')
	}

	return (
		<div className='container mx-auto p-4 max-w-6xl'>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Left Panel - Input */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Participants List */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Users className='w-4 h-4' />
								{t('participantsList')}
							</CardTitle>
							<CardDescription>{t('participantsDesc')}</CardDescription>
						</CardHeader>
						<CardContent>
							<Textarea
								placeholder={t('participantsPlaceholder')}
								value={participantsInput}
								onChange={e => setParticipantsInput(e.target.value)}
								className='min-h-[200px]'
							/>
							{participants.length > 0 && (
								<div className='mt-2 text-sm text-muted-foreground'>
									{t('totalParticipants')} {participants.length}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Team Settings */}
					<Card>
						<CardHeader>
							<CardTitle>{t('teamSettings')}</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='numberOfTeams'>{t('numberOfTeams')}</Label>
									<Input
										id='numberOfTeams'
										type='number'
										min='2'
										max='50'
										value={numberOfTeams}
										onChange={e =>
											setNumberOfTeams(parseInt(e.target.value) || 2)
										}
									/>
								</div>
								<div>
									<Label htmlFor='teamSize'>{t('teamSize')}</Label>
									<Input
										id='teamSize'
										type='number'
										min='1'
										placeholder='Auto'
										value={preferredTeamSize}
										onChange={e => setPreferredTeamSize(e.target.value)}
									/>
									<p className='text-xs text-muted-foreground mt-1'>
										{t('teamSizeDesc')}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Action Buttons */}
					<div className='flex flex-wrap gap-2'>
						<Button
							onClick={generateTeams}
							disabled={participants.length < 2}
							className='flex-1 min-w-[120px]'
						>
							<Shuffle className='w-4 h-4 mr-2' />
							{teams.length === 0 ? t('generateTeams') : t('regenerateTeams')}
						</Button>
						<Button
							variant='outline'
							onClick={resetAll}
							className='flex items-center gap-2'
						>
							<RotateCcw className='w-4 h-4' />
							{t('resetAll')}
						</Button>
					</div>

					{/* Validation Errors */}
					{errors.length > 0 && (
						<Card className='border-destructive'>
							<CardContent className='pt-6'>
								<div className='flex items-start gap-2'>
									<AlertCircle className='w-4 h-4 text-destructive mt-0.5' />
									<div>
										<p className='text-sm font-medium text-destructive mb-1'>
											Validation Errors:
										</p>
										<ul className='text-sm text-destructive space-y-1'>
											{errors.map((error, index) => (
												<li key={index}>• {error}</li>
											))}
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Right Panel - Results */}
				<div className='space-y-6'>
					{/* Generated Teams */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center justify-between'>
								<span>{t('results')}</span>
								{teams.length > 0 && (
									<div className='flex gap-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={copyTeamsToClipboard}
										>
											<Copy className='w-3 h-3' />
										</Button>
										<Button variant='outline' size='sm' onClick={exportTeams}>
											<Download className='w-3 h-3' />
										</Button>
									</div>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent>
							{teams.length === 0 ? (
								<div className='text-center py-8 text-muted-foreground'>
									<Users className='w-8 h-8 mx-auto mb-2 opacity-50' />
									<p>{t('noResults')}</p>
								</div>
							) : (
								<div className='space-y-4'>
									{teams.map(team => (
										<div key={team.id} className='space-y-2'>
											<div className='flex items-center justify-between'>
												<h3 className='font-semibold'>{team.name}</h3>
												<Badge variant='secondary'>
													{team.members.length}{' '}
													{team.members.length === 1
														? t('member')
														: t('members')}
												</Badge>
											</div>
											{team.members.length === 0 ? (
												<p className='text-sm text-muted-foreground italic'>
													{t('emptyTeam')}
												</p>
											) : (
												<div className='flex flex-wrap gap-1'>
													{team.members.map((member, index) => (
														<Badge
															key={index}
															variant='outline'
															className='text-xs'
														>
															{member}
														</Badge>
													))}
												</div>
											)}
											{team.id < teams.length && (
												<div className='border-t my-2' />
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Tips */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Info className='w-4 h-4' />
								{t('tips.title')}
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='text-sm space-y-2'>
								<p>• {t('tips.fairDistribution')}</p>
								<p>• {t('tips.remainders')}</p>
								<p>• {t('tips.regenerate')}</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
