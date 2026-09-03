'use client'

import { useState, useEffect, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check, RotateCcw, Download } from 'lucide-react'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { TeamRandomizerSeo } from './TeamRandomizerSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
interface Team {
	id: number
	name: string
	members: string[]
}

// Восемь имён — на них видно, как делит и на 2 команды, и на 3.
const EXAMPLE_PARTICIPANTS = 'Аня\nБорис\nВера\nГлеб\nДаша\nЕгор\nЖеня\nЗоя'

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

// Раньше оба поля — «команд» и «или по человек» — стояли рядом всегда
// видимыми, и было непонятно, что это два взаимоисключающих способа задать
// одно и то же: указано число участников в команде — оно и решает, второе
// поле молча игнорируется. Явный переключатель убирает эту неоднозначность.
type SplitMode = 'count' | 'size'

export default function TeamRandomizerPage() {
	const widget = getWidgetById('team-randomizer')!
	const [participantsInput, setParticipantsInput] = useState('')
	const [splitMode, setSplitMode] = useState<SplitMode>('count')
	const [numberOfTeams, setNumberOfTeams] = useState(2)
	const [teamSize, setTeamSize] = useState('3')
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

		if (splitMode === 'count') {
			if (numberOfTeams < 2) {
				validationErrors.push('Минимум 2 команды')
			} else if (numberOfTeams > participants.length) {
				validationErrors.push(
					`Команд не может быть больше, чем участников (${participants.length})`
				)
			}
		} else {
			const teamSizeNum = parseInt(teamSize)
			if (!teamSize || isNaN(teamSizeNum) || teamSizeNum < 1) {
				validationErrors.push('Укажите размер команды')
			} else if (teamSizeNum > participants.length) {
				validationErrors.push(
					`В команде не может быть больше человек, чем участников (${participants.length})`
				)
			}
		}

		return validationErrors
	}, [participants.length, splitMode, numberOfTeams, teamSize])

	// Generate teams
	const generateTeams = useCallback(() => {
		const validationErrors = validateInputs()
		setErrors(validationErrors)

		// Ошибка показывается строкой в полосе под вводом, а не тостом: тост
		// исчезает раньше, чем человек успевает поправить число команд.
		if (validationErrors.length > 0) {
			return
		}

		const teamsToCreate =
			splitMode === 'count'
				? numberOfTeams
				: Math.ceil(participants.length / parseInt(teamSize))

		const generatedTeams = distributeIntoTeams(participants, teamsToCreate)
		setTeams(generatedTeams)
	}, [participants, splitMode, numberOfTeams, teamSize, validateInputs])

	// Load example participants
	const loadExample = useCallback(() => {
		setParticipantsInput(EXAMPLE_PARTICIPANTS)
	}, [])

	// Reset all inputs
	const resetAll = useCallback(() => {
		setParticipantsInput('')
		setSplitMode('count')
		setNumberOfTeams(2)
		setTeamSize('3')
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
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько команд собирать и что сделать с
				    результатом. Раньше поля жили в левой колонке под подписями, а
				    кнопки — тремя штуками во всю ширину под ними. */}
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						<button
							type='button'
							onClick={() => setSplitMode('count')}
							aria-pressed={splitMode === 'count'}
							className={toolToggleOption(splitMode === 'count')}
						>
							Число команд
						</button>
						<button
							type='button'
							onClick={() => setSplitMode('size')}
							aria-pressed={splitMode === 'size'}
							className={toolToggleOption(splitMode === 'size')}
						>
							Людей в команде
						</button>
					</div>

					{splitMode === 'count' ? (
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
					) : (
						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							по
							<input
								type='number'
								min={1}
								value={teamSize}
								onChange={event => setTeamSize(event.target.value)}
								aria-label='Человек в команде'
								className='w-16 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
							человек
						</label>
					)}

					<span className='text-sm text-muted-foreground'>
						{participants.length} участников
					</span>

					<div className='flex w-full items-center justify-end gap-0.5 sm:w-auto sm:ml-auto'>
						<button
							type='button'
							onClick={loadExample}
							className={toolPill(false)}
						>
							Пример
						</button>
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
						className='cursor-pointer sm:ml-auto'
					>
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

			<ToolScreenshot slug='team-randomizer' />
			<TeamRandomizerSeo />
		</WidgetSEOWrapper>
	)
}
