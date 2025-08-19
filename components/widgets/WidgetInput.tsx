'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Upload, X } from 'lucide-react'
import { ReactNode } from 'react'

export interface WidgetInputProps {
	label: string
	description?: string
	className?: string
	children?: React.ReactNode
}

export function WidgetInput({
	label,
	description,
	className,
	children
}: WidgetInputProps) {
	return (
		<div className={cn('space-y-2', className)}>
			<Label className='text-sm font-medium'>{label}</Label>
			{description && (
				<p className='text-xs text-muted-foreground'>{description}</p>
			)}
			{children}
		</div>
	)
}

export interface InputField {
	name: string
	label: string
	type:
		| 'text'
		| 'number'
		| 'textarea'
		| 'select'
		| 'slider'
		| 'switch'
		| 'radio'
		| 'file'
	value?: any
	placeholder?: string
	description?: string
	required?: boolean
	disabled?: boolean
	min?: number
	max?: number
	step?: number
	options?: Array<{ label: string; value: string }>
	accept?: string // for file input
	multiple?: boolean // for file input
	rows?: number // for textarea
	icon?: ReactNode
}

export interface WidgetFormProps {
	fields: InputField[]
	onSubmit?: (data: Record<string, any>) => void
	onChange?: (name: string, value: any) => void
	submitLabel?: string
	resetLabel?: string
	showReset?: boolean
	loading?: boolean
	className?: string
	layout?: 'vertical' | 'horizontal' | 'grid'
}

export function WidgetForm({
	fields,
	onSubmit,
	onChange,
	submitLabel = 'Calculate',
	resetLabel = 'Reset',
	showReset = true,
	loading = false,
	className,
	layout = 'vertical'
}: WidgetFormProps) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (onSubmit) {
			const formData = new FormData(e.target as HTMLFormElement)
			const data: Record<string, any> = {}
			fields.forEach(field => {
				if (field.type === 'switch') {
					data[field.name] = formData.get(field.name) === 'on'
				} else if (field.type === 'number' || field.type === 'slider') {
					data[field.name] = Number(formData.get(field.name))
				} else {
					data[field.name] = formData.get(field.name)
				}
			})
			onSubmit(data)
		}
	}

	const layoutClasses = {
		vertical: 'space-y-4',
		horizontal: 'flex flex-wrap gap-4',
		grid: 'grid md:grid-cols-2 gap-4'
	}

	const renderField = (field: InputField) => {
		const commonProps = {
			name: field.name,
			disabled: field.disabled || loading,
			required: field.required
		}

		switch (field.type) {
			case 'text':
			case 'number':
				return (
					<div className='space-y-2'>
						<Label htmlFor={field.name} className='flex items-center gap-2'>
							{field.icon}
							{field.label}
							{field.required && <span className='text-destructive'>*</span>}
						</Label>
						<Input
							{...commonProps}
							id={field.name}
							type={field.type}
							placeholder={field.placeholder}
							defaultValue={field.value}
							min={field.min}
							max={field.max}
							step={field.step}
							onChange={e => onChange?.(field.name, e.target.value)}
						/>
						{field.description && (
							<p className='text-xs text-muted-foreground'>
								{field.description}
							</p>
						)}
					</div>
				)

			case 'textarea':
				return (
					<div className='space-y-2'>
						<Label htmlFor={field.name} className='flex items-center gap-2'>
							{field.icon}
							{field.label}
							{field.required && <span className='text-destructive'>*</span>}
						</Label>
						<Textarea
							{...commonProps}
							id={field.name}
							placeholder={field.placeholder}
							defaultValue={field.value}
							rows={field.rows || 4}
							onChange={e => onChange?.(field.name, e.target.value)}
						/>
						{field.description && (
							<p className='text-xs text-muted-foreground'>
								{field.description}
							</p>
						)}
					</div>
				)

			case 'select':
				return (
					<div className='space-y-2'>
						<Label htmlFor={field.name} className='flex items-center gap-2'>
							{field.icon}
							{field.label}
							{field.required && <span className='text-destructive'>*</span>}
						</Label>
						<Select
							name={field.name}
							defaultValue={field.value}
							disabled={field.disabled || loading}
							onValueChange={value => onChange?.(field.name, value)}
						>
							<SelectTrigger id={field.name}>
								<SelectValue
									placeholder={field.placeholder || 'Select an option'}
								/>
							</SelectTrigger>
							<SelectContent>
								{field.options?.map(option => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{field.description && (
							<p className='text-xs text-muted-foreground'>
								{field.description}
							</p>
						)}
					</div>
				)

			case 'slider':
				return (
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<Label htmlFor={field.name} className='flex items-center gap-2'>
								{field.icon}
								{field.label}
								{field.required && <span className='text-destructive'>*</span>}
							</Label>
							<span className='text-sm font-medium'>
								{field.value || field.min || 0}
							</span>
						</div>
						<Slider
							{...commonProps}
							id={field.name}
							defaultValue={[field.value || field.min || 0]}
							min={field.min || 0}
							max={field.max || 100}
							step={field.step || 1}
							onValueChange={([value]) => onChange?.(field.name, value)}
						/>
						{field.description && (
							<p className='text-xs text-muted-foreground'>
								{field.description}
							</p>
						)}
					</div>
				)

			case 'switch':
				return (
					<div className='flex items-center justify-between space-x-2'>
						<Label
							htmlFor={field.name}
							className='flex items-center gap-2 cursor-pointer'
						>
							{field.icon}
							{field.label}
							{field.description && (
								<span className='text-xs text-muted-foreground'>
									({field.description})
								</span>
							)}
						</Label>
						<Switch
							{...commonProps}
							id={field.name}
							defaultChecked={field.value}
							onCheckedChange={checked => onChange?.(field.name, checked)}
						/>
					</div>
				)

			case 'radio':
				return (
					<div className='space-y-2'>
						<Label className='flex items-center gap-2'>
							{field.icon}
							{field.label}
							{field.required && <span className='text-destructive'>*</span>}
						</Label>
						<RadioGroup
							name={field.name}
							defaultValue={field.value}
							disabled={field.disabled || loading}
							onValueChange={value => onChange?.(field.name, value)}
						>
							{field.options?.map(option => (
								<div key={option.value} className='flex items-center space-x-2'>
									<RadioGroupItem
										value={option.value}
										id={`${field.name}-${option.value}`}
									/>
									<Label
										htmlFor={`${field.name}-${option.value}`}
										className='cursor-pointer'
									>
										{option.label}
									</Label>
								</div>
							))}
						</RadioGroup>
						{field.description && (
							<p className='text-xs text-muted-foreground'>
								{field.description}
							</p>
						)}
					</div>
				)

			case 'file':
				return (
					<div className='space-y-2'>
						<Label htmlFor={field.name} className='flex items-center gap-2'>
							{field.icon}
							{field.label}
							{field.required && <span className='text-destructive'>*</span>}
						</Label>
						<div className='flex items-center gap-2'>
							<Input
								{...commonProps}
								id={field.name}
								type='file'
								accept={field.accept}
								multiple={field.multiple}
								className='file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
								onChange={e => onChange?.(field.name, e.target.files)}
							/>
						</div>
						{field.description && (
							<p className='text-xs text-muted-foreground'>
								{field.description}
							</p>
						)}
					</div>
				)

			default:
				return null
		}
	}

	return (
		<Card className={cn('p-6', className)}>
			<form onSubmit={handleSubmit}>
				<div className={layoutClasses[layout]}>
					{fields.map(field => (
						<div key={field.name}>{renderField(field)}</div>
					))}
				</div>

				<div className='flex gap-2 mt-6'>
					<Button type='submit' disabled={loading} className='flex-1'>
						{loading ? 'Processing...' : submitLabel}
					</Button>
					{showReset && (
						<Button type='reset' variant='outline' disabled={loading}>
							{resetLabel}
						</Button>
					)}
				</div>
			</form>
		</Card>
	)
}
