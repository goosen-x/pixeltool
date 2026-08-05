'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toolBar, toolIconButton } from '@/lib/ui/tool-pill'
import { useSystemInfo } from '@/lib/hooks/widgets'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { SystemInfoSeo } from './SystemInfoSeo'

export default function SystemInfoPage() {
	const widget = getWidgetById('system-info')!

	const {
		mounted,
		systemInfo,
		deviceInfo,
		isRefreshing,
		copiedItem,
		copyToClipboard,
		refresh,
		getDeviceName
	} = useSystemInfo({
		translations: {
			copied: '__ITEM__ скопировано',
			copyError: 'Не удалось скопировать',
			refreshed: 'Данные обновлены'
		}
	})

	// Данные о браузере известны только на клиенте, поэтому до монтирования
	// показывать нечего. Пульсирующая заглушка тут врала бы: ничего не
	// «загружается», значения появляются в тот же кадр после гидратации.
	if (!mounted || !systemInfo || !deviceInfo) {
		return (
			<Card className='overflow-hidden p-0'>
				<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
					Читаем параметры браузера…
				</p>
			</Card>
		)
	}

	const yesNo = (value: boolean) => (value ? 'да' : 'нет')

	// Всё, что инструмент знает о посетителе, — одним списком по группам.
	// Раньше это лежало в пяти вкладках («Обзор», «Железо», «Дисплей»,
	// «Браузер», «Прочее»), и половина значений дублировалась между ними:
	// разрешение экрана встречалось на трёх вкладках из пяти.
	const groups: { title: string; rows: [string, string][] }[] = [
		{
			title: 'Устройство',
			rows: [
				['Тип', deviceInfo.type],
				...(deviceInfo.brand
					? ([['Производитель', deviceInfo.brand]] as [string, string][])
					: []),
				...(deviceInfo.model
					? ([['Модель', deviceInfo.model]] as [string, string][])
					: []),
				[
					'Операционная система',
					[deviceInfo.os, deviceInfo.osVersion].filter(Boolean).join(' ')
				],
				['Платформа', systemInfo.platform],
				['Архитектура', systemInfo.architecture]
			]
		},
		{
			title: 'Браузер',
			rows: [
				[
					'Браузер',
					[deviceInfo.browser, deviceInfo.browserVersion]
						.filter(Boolean)
						.join(' ')
				],
				['User-Agent', systemInfo.userAgent],
				['Язык', systemInfo.language],
				['Все языки', systemInfo.languages.join(', ')],
				['Часовой пояс', systemInfo.timezone]
			]
		},
		{
			title: 'Экран',
			rows: [
				['Разрешение', deviceInfo.actualResolution],
				['Логическое разрешение', deviceInfo.logicalResolution],
				[
					'Доступно под окно',
					`${systemInfo.availWidth} × ${systemInfo.availHeight}`
				],
				['Плотность пикселей', `${systemInfo.devicePixelRatio}×`],
				['Retina-экран', yesNo(deviceInfo.isRetina)],
				['Глубина цвета', `${systemInfo.colorDepth} бит`],
				['Ориентация', systemInfo.orientation],
				...(deviceInfo.screenSize
					? ([['Диагональ', deviceInfo.screenSize]] as [string, string][])
					: []),
				...(deviceInfo.ppi
					? ([['PPI', String(deviceInfo.ppi)]] as [string, string][])
					: [])
			]
		},
		{
			title: 'Ввод и сеть',
			rows: [
				['Сенсорный экран', yesNo(systemInfo.touchSupport)],
				['Точек касания', String(systemInfo.maxTouchPoints)],
				['Соединение', systemInfo.onlineStatus ? 'онлайн' : 'офлайн'],
				['Протокол', systemInfo.protocol],
				['Хост', systemInfo.hostname],
				...(systemInfo.port
					? ([['Порт', systemInfo.port]] as [string, string][])
					: [])
			]
		},
		{
			title: 'Хранилище и приватность',
			rows: [
				['Cookie', yesNo(systemInfo.cookieEnabled)],
				['localStorage', yesNo(systemInfo.localStorage)],
				['sessionStorage', yesNo(systemInfo.sessionStorage)],
				['IndexedDB', yesNo(systemInfo.indexedDB)],
				['Do Not Track', systemInfo.doNotTrack],
				['Автоматизация (webdriver)', yesNo(systemInfo.webdriver)]
			]
		}
	]

	/** Плоский отчёт: то же, что на экране, но одним куском для отправки. */
	const fullReport = groups
		.map(
			group =>
				`${group.title}\n${group.rows
					.map(([label, value]) => `  ${label}: ${value}`)
					.join('\n')}`
		)
		.join('\n\n')

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: короткий ответ на вопрос «что у меня за
				    устройство и браузер». Раньше то же самое занимало три карточки
				    с градиентами, тенями и иконками во всю ширину. */}
				<div className={toolBar}>
					<span className='text-sm'>
						{getDeviceName()}
						<span className='ml-2 text-muted-foreground'>
							{deviceInfo.browser} · {deviceInfo.os}
						</span>
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => copyToClipboard(fullReport, 'Отчёт')}
							title='Скопировать весь отчёт'
							className={toolIconButton}
						>
							{copiedItem === 'Отчёт' ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={refresh}
							disabled={isRefreshing}
							title='Обновить данные'
							className={toolIconButton}
						>
							<RotateCcw
								className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
							/>
						</Button>
					</div>
				</div>

				{groups.map(group => (
					<div key={group.title} className='border-t'>
						<p className='px-5 pt-4 text-sm font-medium sm:px-6'>
							{group.title}
						</p>
						<div className='grid pb-3 sm:grid-cols-2'>
							{group.rows.map(([label, value]) => (
								<button
									key={label}
									type='button'
									onClick={() => copyToClipboard(value, label)}
									title='Скопировать'
									className='group flex cursor-pointer items-baseline justify-between gap-3 px-5 py-1.5 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6'
								>
									<span className='shrink-0 text-sm text-muted-foreground'>
										{label}
									</span>
									<span className='flex min-w-0 items-baseline gap-2'>
										<span className='truncate font-mono text-sm'>{value}</span>
										{copiedItem === label ? (
											<Check className='h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400' />
										) : (
											<Copy className='h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
										)}
									</span>
								</button>
							))}
						</div>
					</div>
				))}
			</Card>

			<p className='mt-6 px-1 text-sm text-muted-foreground'>
				Всё, что показано выше, браузер сообщает о себе сам — любому сайту,
				который его об этом спросит. Данные считываются прямо в вашем браузере и
				никуда не отправляются.
			</p>

			<SystemInfoSeo />
		</WidgetSEOWrapper>
	)
}
