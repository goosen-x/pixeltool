'use client'

import { useState, useEffect, useCallback } from 'react'

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
import { cn } from '@/lib/utils'
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
			name: `${i + 1}`,
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
	const locale = 'ru' // useLocale()
	const defaultParticipants =
		'Alice Johnson\nBob Smith\nCarol Williams\nDavid Brown\nEve Davis\nFrank Miller\nGrace Wilson'
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
	const validateInputs = useCallback((): string[] => {
		const validationErrors: string[] = []

		if (participants.length < 2) {
			validationErrors.push('Минимум 2 участника')
		}

		if (numberOfTeams < 2) {
			validationErrors.push('Минимум 2 команды')
		}

		if (numberOfTeams > participants.length) {
			validationErrors.push('Максимум 10 команд')
		}

		if (preferredTeamSize) {
			const teamSizeNum = parseInt(preferredTeamSize)
			if (isNaN(teamSizeNum) || teamSizeNum < 1) {
				validationErrors.push('Размер команды должен быть больше 0')
			} else if (teamSizeNum * numberOfTeams > participants.length * 2) {
				validationErrors.push(
					'Размер команды слишком большой для количества участников'
				)
			}
		}

		return validationErrors
	}, [participants.length, numberOfTeams, preferredTeamSize])

	// Generate teams
	const generateTeams = useCallback(() => {
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
		toast.success(
			locale === 'ru'
				? `Создано ${generatedTeams.length} команд!`
				: `Generated ${generatedTeams.length} teams!`
		)
	}, [participants, numberOfTeams, preferredTeamSize, locale, validateInputs])

	// Reset all inputs
	const resetAll = useCallback(() => {
		setParticipantsInput('')
		setNumberOfTeams(2)
		setPreferredTeamSize('')
		setTeams([])
		setErrors([])
		toast.success(locale === 'ru' ? 'Все поля сброшены' : 'All fields reset')
	}, [locale])

	// Copy teams to clipboard
	const copyTeamsToClipboard = useCallback(() => {
		if (teams.length === 0) return

		const teamsText = teams
			.map(
				team =>
					`${locale === 'ru' ? 'Команда' : 'Team'} ${team.name}:\n${team.members.map(member => `- ${member}`).join('\n')}`
			)
			.join('\n\n')

		navigator.clipboard.writeText(teamsText)
		toast.success(
			locale === 'ru'
				? 'Команды скопированы в буфер обмена'
				: 'Teams copied to clipboard'
		)
	}, [teams, locale])

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

	// Keyboard shortcuts
	return (
		<div className='w-full space-y-4'>
			{/* Main Card */}
			<Card className='p-4 sm:p-6'>
				<div className='grid lg:grid-cols-2 gap-6'>
					{/* Left Column - Input */}
					<div>
						{/* Header with participant count */}
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-2'>
								<Users className='w-5 h-5 text-muted-foreground' />
								<h2 className='text-lg font-semibold'>Список участников</h2>
								{participants.length > 0 && (
									<Badge variant='secondary' className='ml-2'>
										{participants.length}
									</Badge>
								)}
							</div>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setParticipantsInput(defaultParticipants)}
								className={cn(
									'text-xs transition-opacity',
									participantsInput === defaultParticipants
										? 'opacity-0 pointer-events-none'
										: 'opacity-100'
								)}
							>
								<RotateCcw className='w-3 h-3 mr-1' />
								Заполнить пример
							</Button>
						</div>

						{/* Participants Input */}
						<Textarea
							placeholder='Введите имена участников (по одному на строку)'
							value={participantsInput}
							onChange={e => setParticipantsInput(e.target.value)}
							className='min-h-[200px] resize-none'
						/>
					</div>

					{/* Right Column - Settings */}
					<div className='flex flex-col justify-between'>
						<div className='space-y-4'>
							<h3 className='font-semibold text-base'>Настройки команд</h3>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label
										htmlFor='numberOfTeams'
										className='text-sm font-medium'
									>
										Количество команд
									</Label>
									<Input
										id='numberOfTeams'
										type='number'
										min='2'
										max='50'
										value={numberOfTeams}
										onChange={e =>
											setNumberOfTeams(parseInt(e.target.value) || 2)
										}
										className='w-full'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='teamSize' className='text-sm font-medium'>
										Размер команды
									</Label>
									<Input
										id='teamSize'
										type='number'
										min='1'
										placeholder='Auto'
										value={preferredTeamSize}
										onChange={e => setPreferredTeamSize(e.target.value)}
										className='w-full'
									/>
									<p className='text-xs text-muted-foreground'>
										Оставьте пустым для автоматического распределения
									</p>
								</div>
							</div>
						</div>
						<Button
							onClick={generateTeams}
							disabled={participants.length < 2}
							className='w-full mt-6'
							size='lg'
						>
							<Shuffle className='w-4 h-4 mr-2' />
							{teams.length === 0
								? 'Сгенерировать команды'
								: 'Перегенерировать'}
						</Button>
					</div>
				</div>
			</Card>

			{/* Validation Errors */}
			{errors.length > 0 && (
				<div className='flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg'>
					<AlertCircle className='w-4 h-4 mt-0.5' />
					<div className='text-sm'>
						{errors.map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				</div>
			)}

			{/* Results Section */}
			{teams.length > 0 && (
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h3 className='text-lg font-semibold'>Результаты</h3>
						<div className='flex gap-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={copyTeamsToClipboard}
								title='Копировать в буфер обмена'
							>
								<Copy className='w-4 h-4' />
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={exportTeams}
								title='Экспортировать команды'
							>
								<Download className='w-4 h-4' />
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={resetAll}
								title='Сбросить всё'
							>
								<RotateCcw className='w-4 h-4' />
							</Button>
						</div>
					</div>

					{/* Team Cards Grid */}
					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
						{teams.map((team, teamIndex) => {
							const colors = [
								'bg-blue-500/10 border-blue-500/20',
								'bg-green-500/10 border-green-500/20',
								'bg-purple-500/10 border-purple-500/20',
								'bg-orange-500/10 border-orange-500/20',
								'bg-pink-500/10 border-pink-500/20',
								'bg-yellow-500/10 border-yellow-500/20'
							]
							const colorClass = colors[teamIndex % colors.length]

							return (
								<Card key={team.id} className={cn('p-4 border-2', colorClass)}>
									<div className='flex items-center justify-between mb-3'>
										<h4 className='font-semibold'>Команда {team.name}</h4>
										<Badge variant='secondary' className='text-xs'>
											{team.members.length}
										</Badge>
									</div>
									{team.members.length === 0 ? (
										<p className='text-sm text-muted-foreground italic'>
											Пустая команда
										</p>
									) : (
										<div className='space-y-1'>
											{team.members.map((member, index) => (
												<div
													key={index}
													className='text-sm py-1 px-2 bg-background/50 rounded flex items-center gap-2'
												>
													<div className='w-1.5 h-1.5 rounded-full bg-current opacity-50' />
													{member}
												</div>
											))}
										</div>
									)}
								</Card>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}
