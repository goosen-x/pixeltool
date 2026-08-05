'use client'

import { useState, useEffect, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Shuffle, Copy, Check, RotateCcw, Download } from 'lucide-react'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
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
	const [participantsInput, setParticipantsInput] = useState('')
	const [numberOfTeams, setNumberOfTeams] = useState(2)
	const [preferredTeamSize, setPreferredTeamSize] = useState('')
	const [teams, setTeams] = useState<Team[]>([])
	const [participants, setParticipants] = useState<string[]>([])
	const [errors, setErrors] = useState<string[]>([])
	const [copied, setCopied] = useState(false)

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

		// Ошибка показывается строкой в полосе под вводом, а не тостом: тост
		// исчезает раньше, чем человек успевает поправить число команд.
		if (validationErrors.length > 0) {
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
	}, [participants, numberOfTeams, preferredTeamSize, validateInputs])

	// Reset all inputs
	const resetAll = useCallback(() => {
		setParticipantsInput('')
		setNumberOfTeams(2)
		setPreferredTeamSize('')
		setTeams([])
		setErrors([])
	}, [])

	// Copy teams to clipboard
	const copyTeamsToClipboard = useCallback(() => {
		if (teams.length === 0) return

		const teamsText = teams
			.map(
				team =>
					`Команда ${team.name}:\n${team.members.map(member => `- ${member}`).join('\n')}`
			)
			.join('\n\n')

		navigator.clipboard.writeText(teamsText)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}, [teams])

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
	}

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько команд собирать и что сделать с
				    результатом. Раньше поля жили в левой колонке под подписями, а
				    кнопки — тремя штуками во всю ширину под ними. */}
				<div className={toolBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						команд
						<input
							type='number'
							min={2}
							max={10}
							value={numberOfTeams}
							onChange={event => setNumberOfTeams(Number(event.target.value))}
							aria-label='Количество команд'
							className='w-16 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<label
						className='flex items-center gap-2 text-sm text-muted-foreground'
						title='Если указать, число команд посчитается само'
					>
						или по
						<input
							type='number'
							min={1}
							value={preferredTeamSize}
							onChange={event => setPreferredTeamSize(event.target.value)}
							placeholder='—'
							aria-label='Размер команды'
							className='w-16 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
						человек
					</label>

					<span className='text-sm text-muted-foreground'>
						{participants.length} участников
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyTeamsToClipboard}
							disabled={teams.length === 0}
							title='Скопировать составы'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={exportTeams}
							disabled={teams.length === 0}
							title='Скачать файлом'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={resetAll}
							title='Очистить'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<Textarea
					value={participantsInput}
					onChange={event => setParticipantsInput(event.target.value)}
					placeholder={'Аня\nБорис\nВера\nГлеб'}
					spellCheck={false}
					aria-label='Участники, по одному на строку'
					className='min-h-[10rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm'
				/>

				<div className={toolFooterBar}>
					{errors.length > 0 ? (
						<span className='text-sm text-destructive'>{errors[0]}</span>
					) : (
						<span className='text-sm text-muted-foreground'>
							Один участник на строку
						</span>
					)}

					<Button
						onClick={generateTeams}
						disabled={participants.length === 0}
						className='cursor-pointer gap-2 sm:ml-auto'
					>
						<Shuffle className='h-4 w-4' />
						Разбить на команды
					</Button>
				</div>

				{teams.length > 0 && (
					<div className='grid gap-px border-t bg-border sm:grid-cols-2 lg:grid-cols-3'>
						{teams.map(team => (
							<div key={team.id} className='bg-background px-5 py-4 sm:px-6'>
								<p className='flex items-baseline justify-between gap-2 text-sm font-medium'>
									{team.name}
									<span className='font-mono text-xs text-muted-foreground'>
										{team.members.length}
									</span>
								</p>
								<ul className='mt-2 space-y-1'>
									{team.members.map((member, index) => (
										<li key={index} className='text-sm text-muted-foreground'>
											{member}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				)}
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					Участники перемешиваются перед делением, поэтому порядок в списке ни
					на что не влияет: вписывать их можно как удобно — хоть по алфавиту,
					хоть как пришли.
				</p>
				<p>
					Если участников не делится поровну, лишние распределяются по одному —
					разница между самой большой и самой маленькой командой не превысит
					одного человека.
				</p>
			</div>
		</>
	)
}
