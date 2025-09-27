'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
	Users,
	BookOpen,
	Plus,
	Trash2,
	RefreshCw,
	AlertCircle,
	CheckCircle,
	Copy,
	Play,
	User
} from 'lucide-react'

interface Program {
	id: number
	title: string
	description?: string
}

interface Teacher {
	id: number
	name: string
	email?: string
	programs: Program[]
}

export default function TeacherProgramsAdminPage() {
	const [apiUrl, setApiUrl] = useState('http://localhost:1337')
	const [teacherId, setTeacherId] = useState(1)
	const [programs, setPrograms] = useState<Program[]>([])
	const [teachers, setTeachers] = useState<Teacher[]>([])
	const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
	const [loading, setLoading] = useState(false)
	const [logs, setLogs] = useState<string[]>([])

	// Добавить лог
	const addLog = (message: string) => {
		const timestamp = new Date().toLocaleTimeString()
		setLogs(prev => [...prev, `[${timestamp}] ${message}`])
	}

	// Очистить логи
	const clearLogs = () => {
		setLogs([])
	}

	// Получить все программы (с поддержкой pagination)
	const fetchPrograms = async () => {
		try {
			addLog('🔄 Получение списка программ...')

			// Попробуем сначала обычный запрос
			const response = await fetch(`${apiUrl}/products`)

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			let programs = await response.json()

			// Если получили ровно 100 записей, возможно есть еще (pagination)
			if (programs.length === 100) {
				addLog(
					`📄 Получено ${programs.length} программ, проверяем пагинацию...`
				)

				// Попробуем получить больше с параметрами pagination
				try {
					const paginatedResponse = await fetch(
						`${apiUrl}/products?_limit=1000`
					)
					if (paginatedResponse.ok) {
						const allPrograms = await paginatedResponse.json()
						if (allPrograms.length > programs.length) {
							programs = allPrograms
							addLog(`📄 Через пагинацию получено ${programs.length} программ`)
						}
					}
				} catch (paginationError) {
					addLog(
						`⚠️ Пагинация не поддерживается, используем ${programs.length} программ`
					)
				}
			}

			setPrograms(programs)
			addLog(`✅ Найдено программ: ${programs.length}`)

			return programs
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Unknown error'
			addLog(`❌ Ошибка загрузки программ: ${errorMsg}`)
			toast.error('Ошибка загрузки программ')
			return []
		}
	}

	// Получить всех преподавателей (с поддержкой pagination)
	const fetchTeachers = async () => {
		try {
			addLog('🔄 Получение списка преподавателей...')

			// Попробуем сначала обычный запрос
			const response = await fetch(`${apiUrl}/teachers`)

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			let teachers = await response.json()

			// Если получили ровно 100 записей, возможно есть еще (pagination)
			if (teachers.length === 100) {
				addLog(
					`📄 Получено ${teachers.length} преподавателей, проверяем пагинацию...`
				)

				// Попробуем получить больше с параметрами pagination
				try {
					const paginatedResponse = await fetch(
						`${apiUrl}/teachers?_limit=1000`
					)
					if (paginatedResponse.ok) {
						const allTeachers = await paginatedResponse.json()
						if (allTeachers.length > teachers.length) {
							teachers = allTeachers
							addLog(
								`📄 Через пагинацию получено ${teachers.length} преподавателей`
							)
						}
					}
				} catch (paginationError) {
					addLog(
						`⚠️ Пагинация не поддерживается, используем ${teachers.length} преподавателей`
					)
				}
			}

			setTeachers(teachers)
			addLog(`✅ Найдено преподавателей: ${teachers.length}`)

			return teachers
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Unknown error'
			addLog(`❌ Ошибка загрузки преподавателей: ${errorMsg}`)
			toast.error('Ошибка загрузки преподавателей')
			return []
		}
	}

	// Получить конкретного преподавателя
	const fetchTeacher = async (id: number) => {
		try {
			addLog(`🔄 Получение данных преподавателя ${id}...`)

			// Сначала попробуем найти в уже загруженном списке
			const teacherFromList = teachers.find(t => t.id === id)
			if (teacherFromList) {
				setSelectedTeacher(teacherFromList)
				addLog(
					`✅ Преподаватель найден в списке: ${teacherFromList.name} (программ: ${teacherFromList.programs?.length || 0})`
				)
				return teacherFromList
			}

			// Если не найден в списке, попробуем API запрос
			const response = await fetch(`${apiUrl}/teachers/${id}`)

			if (!response.ok) {
				// Если API не поддерживает запрос по ID, попробуем обновить список и найти там
				addLog(
					`⚠️ Не удалось получить преподавателя по API (${response.status}), ищем в обновленном списке...`
				)
				const updatedTeachers = await fetchTeachers()
				const teacher = updatedTeachers.find((t: Teacher) => t.id === id)

				if (teacher) {
					setSelectedTeacher(teacher)
					addLog(
						`✅ Преподаватель найден в обновленном списке: ${teacher.name} (программ: ${teacher.programs?.length || 0})`
					)
					return teacher
				} else {
					throw new Error(`Преподаватель с ID ${id} не найден`)
				}
			}

			const teacher = await response.json()
			setSelectedTeacher(teacher)
			addLog(
				`✅ Преподаватель загружен: ${teacher.name} (программ: ${teacher.programs?.length || 0})`
			)

			return teacher
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Unknown error'
			addLog(`❌ Ошибка загрузки преподавателя: ${errorMsg}`)
			toast.error('Ошибка загрузки преподавателя')
			return null
		}
	}

	// Добавить преподавателя ко всем программам
	const addTeacherToAllPrograms = async () => {
		if (!teacherId) {
			toast.error('Укажите ID преподавателя')
			return
		}

		setLoading(true)

		try {
			// 1. Получить все программы
			const programs = await fetchPrograms()
			if (programs.length === 0) {
				addLog('⚠️ Нет программ для добавления')
				return
			}

			const programIds = programs.map((program: Program) => program.id)

			// 2. Обновить преподавателя
			addLog(`🔄 Обновление преподавателя ${teacherId}...`)
			const updateResponse = await fetch(`${apiUrl}/teachers/${teacherId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					programs: programIds
				})
			})

			const result = await updateResponse.json()

			if (updateResponse.ok) {
				addLog(
					`✅ Успешно! Преподаватель привязан к ${result.programs?.length || programIds.length} программам`
				)
				toast.success('Преподаватель успешно добавлен ко всем программам!')

				// Обновить списки и данные преподавателя
				await fetchTeachers() // Обновить список преподавателей
				await fetchTeacher(teacherId) // Обновить данные конкретного преподавателя
			} else {
				throw new Error(JSON.stringify(result))
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Unknown error'
			addLog(`❌ Ошибка обновления: ${errorMsg}`)
			toast.error('Ошибка при обновлении преподавателя')
		} finally {
			setLoading(false)
		}
	}

	// Удалить все программы у преподавателя
	const removeAllPrograms = async () => {
		if (!teacherId) {
			toast.error('Укажите ID преподавателя')
			return
		}

		setLoading(true)

		try {
			addLog(`🔄 Удаление всех программ у преподавателя ${teacherId}...`)
			const updateResponse = await fetch(`${apiUrl}/teachers/${teacherId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					programs: []
				})
			})

			const result = await updateResponse.json()

			if (updateResponse.ok) {
				addLog('✅ Все программы удалены!')
				toast.success('Все программы удалены у преподавателя')

				// Обновить списки и данные преподавателя
				await fetchTeachers() // Обновить список преподавателей
				await fetchTeacher(teacherId) // Обновить данные конкретного преподавателя
			} else {
				throw new Error(JSON.stringify(result))
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Unknown error'
			addLog(`❌ Ошибка удаления: ${errorMsg}`)
			toast.error('Ошибка при удалении программ')
		} finally {
			setLoading(false)
		}
	}

	// Обновить все данные вручную
	const refreshAllData = async () => {
		setLoading(true)
		addLog('🔄 Обновление всех данных...')

		try {
			await Promise.all([fetchPrograms(), fetchTeachers()])

			// Обновить данные текущего преподавателя если выбран
			if (teacherId) {
				await fetchTeacher(teacherId)
			}

			addLog('✅ Все данные обновлены!')
			toast.success('Данные обновлены')
		} catch (error) {
			addLog('❌ Ошибка при обновлении данных')
			toast.error('Ошибка обновления')
		} finally {
			setLoading(false)
		}
	}

	// Копировать скрипт в буфер обмена
	const copyScript = () => {
		const script = `
// Без токена авторизации
const teacherId = ${teacherId}; // ID преподавателя
const apiUrl = '${apiUrl}';

async function addTeacherToAllPrograms() {
  try {
    // 1. Получить все программы
    console.log('Получение списка программ...');
    const programsResponse = await fetch(\`\${apiUrl}/products\`);
    const programs = await programsResponse.json();

    console.log(\`Найдено программ: \${programs.length}\`);
    const programIds = programs.map(program => program.id);

    // 2. Обновить преподавателя
    console.log(\`Обновление преподавателя \${teacherId}...\`);
    const updateResponse = await fetch(\`\${apiUrl}/teachers/\${teacherId}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        programs: programIds
      })
    });

    const result = await updateResponse.json();

    if (updateResponse.ok) {
      console.log('✅ Успешно!');
      console.log(\`Преподаватель привязан к \${result.programs.length} программам\`);
      window.location.reload();
    } else {
      console.error('❌ Ошибка:', result);
    }

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

addTeacherToAllPrograms();
`.trim()

		navigator.clipboard.writeText(script)
		toast.success('Скрипт скопирован в буфер обмена!')
	}

	// Загрузить данные при изменении настроек
	useEffect(() => {
		if (teacherId) {
			fetchTeacher(teacherId)
		}
	}, [teacherId, apiUrl])

	// Начальная загрузка
	useEffect(() => {
		fetchPrograms()
		fetchTeachers()
	}, [apiUrl])

	return (
		<div className='min-h-screen bg-background p-6'>
			<div className='max-w-6xl mx-auto space-y-6'>
				{/* Header */}
				<div className='text-center space-y-2'>
					<h1 className='text-3xl font-bold flex items-center justify-center gap-2'>
						<Users className='w-8 h-8 text-blue-600' />
						Управление программами преподавателей
					</h1>
					<p className='text-muted-foreground'>
						Служебная страница для привязки программ к преподавателям
					</p>
				</div>

				<div className='grid lg:grid-cols-2 gap-6'>
					{/* Настройки */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<AlertCircle className='w-5 h-5 text-orange-500' />
								Настройки подключения
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='apiUrl'>API URL</Label>
								<Input
									id='apiUrl'
									value={apiUrl}
									onChange={e => setApiUrl(e.target.value)}
									placeholder='http://localhost:1337'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='teacherId'>ID преподавателя</Label>
								<Input
									id='teacherId'
									type='number'
									value={teacherId}
									onChange={e => setTeacherId(Number(e.target.value))}
									min='1'
								/>
							</div>

							<Separator />

							{/* Действия */}
							<div className='space-y-3'>
								<Button
									onClick={addTeacherToAllPrograms}
									disabled={loading}
									className='w-full bg-green-600 hover:bg-green-700'
								>
									{loading ? (
										<RefreshCw className='w-4 h-4 mr-2 animate-spin' />
									) : (
										<Plus className='w-4 h-4 mr-2' />
									)}
									Добавить ко всем программам
								</Button>

								<Button
									onClick={removeAllPrograms}
									disabled={loading}
									variant='destructive'
									className='w-full'
								>
									<Trash2 className='w-4 h-4 mr-2' />
									Удалить все программы
								</Button>

								<Button
									onClick={refreshAllData}
									disabled={loading}
									variant='outline'
									className='w-full'
								>
									{loading ? (
										<RefreshCw className='w-4 h-4 mr-2 animate-spin' />
									) : (
										<RefreshCw className='w-4 h-4 mr-2' />
									)}
									Обновить данные
								</Button>

								<Button
									onClick={copyScript}
									variant='outline'
									className='w-full'
								>
									<Copy className='w-4 h-4 mr-2' />
									Копировать скрипт
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Информация о преподавателе */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<User className='w-5 h-5 text-blue-500' />
								Информация о преподавателе
							</CardTitle>
						</CardHeader>
						<CardContent>
							{selectedTeacher ? (
								<div className='space-y-4'>
									<div>
										<div className='flex items-center gap-2 mb-2'>
											<CheckCircle className='w-4 h-4 text-green-600' />
											<span className='font-semibold'>
												{selectedTeacher.name}
											</span>
										</div>
										{selectedTeacher.email && (
											<p className='text-sm text-muted-foreground'>
												{selectedTeacher.email}
											</p>
										)}
									</div>

									<div>
										<h4 className='font-semibold mb-2 flex items-center gap-2'>
											<BookOpen className='w-4 h-4' />
											Привязанные программы (
											{selectedTeacher.programs?.length || 0})
										</h4>
										<div className='flex flex-wrap gap-2'>
											{selectedTeacher.programs?.length ? (
												selectedTeacher.programs.map(program => (
													<Badge key={program.id} variant='secondary'>
														{program.title}
													</Badge>
												))
											) : (
												<p className='text-sm text-muted-foreground'>
													Нет привязанных программ
												</p>
											)}
										</div>
									</div>
								</div>
							) : (
								<div className='text-center py-8 text-muted-foreground'>
									<User className='w-12 h-12 mx-auto mb-2 opacity-50' />
									<p>Выберите преподавателя для просмотра информации</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Статистика */}
				<div className='grid md:grid-cols-3 gap-4'>
					<Card>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm text-muted-foreground'>
										Всего программ
									</p>
									<p className='text-2xl font-bold'>{programs.length}</p>
								</div>
								<BookOpen className='w-8 h-8 text-blue-500 opacity-50' />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm text-muted-foreground'>
										Всего преподавателей
									</p>
									<p className='text-2xl font-bold'>{teachers.length}</p>
								</div>
								<Users className='w-8 h-8 text-green-500 opacity-50' />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm text-muted-foreground'>
										У преподавателя программ
									</p>
									<p className='text-2xl font-bold'>
										{selectedTeacher?.programs?.length || 0}
									</p>
								</div>
								<CheckCircle className='w-8 h-8 text-orange-500 opacity-50' />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Логи */}
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='flex items-center gap-2'>
								<Play className='w-5 h-5 text-purple-500' />
								Логи операций
							</CardTitle>
							<Button onClick={clearLogs} variant='outline' size='sm'>
								<Trash2 className='w-4 h-4 mr-1' />
								Очистить
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<Textarea
							value={logs.join('\n')}
							readOnly
							className='min-h-[200px] font-mono text-sm bg-muted/30'
							placeholder='Логи операций будут отображаться здесь...'
						/>
					</CardContent>
				</Card>

				{/* Список преподавателей */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Users className='w-5 h-5 text-blue-500' />
							Все преподаватели
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2 max-h-60 overflow-y-auto'>
							{teachers.map(teacher => (
								<div
									key={teacher.id}
									className={`p-3 border rounded-lg cursor-pointer transition-colors ${
										teacher.id === teacherId
											? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
											: 'border-border hover:bg-muted/50'
									}`}
									onClick={() => setTeacherId(teacher.id)}
								>
									<div className='flex items-center justify-between'>
										<div>
											<p className='font-semibold'>{teacher.name}</p>
											{teacher.email && (
												<p className='text-sm text-muted-foreground'>
													{teacher.email}
												</p>
											)}
										</div>
										<Badge
											variant={teacher.id === teacherId ? 'default' : 'outline'}
										>
											ID: {teacher.id} • Программ:{' '}
											{teacher.programs?.length || 0}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
