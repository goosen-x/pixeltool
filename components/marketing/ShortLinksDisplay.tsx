'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { 
	Copy,
	Share2,
	QrCode,
	Link,
	CheckCircle
} from 'lucide-react'
import { getAllShortLinks } from '@/lib/constants/social-links'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export function ShortLinksDisplay() {
	const [isOpen, setIsOpen] = useState(false)
	const [copiedLink, setCopiedLink] = useState<string | null>(null)
	const links = getAllShortLinks()
	
	const copyToClipboard = (text: string, id: string) => {
		navigator.clipboard.writeText(text)
		setCopiedLink(id)
		toast.success('Ссылка скопирована!')
		setTimeout(() => setCopiedLink(null), 2000)
	}
	
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<Link className="h-4 w-4" />
					Короткие ссылки
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Короткие ссылки для социальных сетей</DialogTitle>
					<DialogDescription>
						Используйте эти ссылки для публикации в социальных сетях
					</DialogDescription>
				</DialogHeader>
				
				<div className="grid gap-3 py-4">
					{links.map((link, index) => (
						<motion.div
							key={link.social.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.03 }}
							className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
						>
							<div className="flex items-center gap-3">
								<span className="text-2xl">{link.social.icon}</span>
								<div>
									<p className="font-medium">{link.social.name}</p>
									<code className="text-sm text-muted-foreground">
										{link.shortLink}
									</code>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="hidden sm:inline-flex">
									/{link.social.shortCode}
								</Badge>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => copyToClipboard(link.shortLink, link.social.id)}
								>
									{copiedLink === link.social.id ? (
										<CheckCircle className="h-4 w-4 text-green-500" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</motion.div>
					))}
				</div>
				
				<div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
					<p className="font-medium flex items-center gap-2">
						<QrCode className="h-4 w-4" />
						Совет по использованию:
					</p>
					<ul className="space-y-1 text-muted-foreground ml-6">
						<li>• Добавляйте ссылки в био профиля</li>
						<li>• Используйте в Stories и постах</li>
						<li>• Создавайте QR-коды для офлайн материалов</li>
						<li>• Отслеживайте источники трафика в аналитике</li>
					</ul>
				</div>
			</DialogContent>
		</Dialog>
	)
}

// Mini version for footer
export function ShortLinksFooter() {
	const mainLinks = ['tk', 'ig', 'tw', 'yt', 'tg'].map(code => {
		const social = getAllShortLinks().find(l => l.social.shortCode === code)
		return social
	}).filter(Boolean)
	
	return (
		<div className="flex flex-wrap items-center gap-4">
			<span className="text-sm text-muted-foreground">Найдите нас:</span>
			<div className="flex items-center gap-3">
				{mainLinks.map(link => link && (
					<a
						key={link.social.id}
						href={link.shortLink}
						target="_blank"
						rel="noopener noreferrer"
						className="text-lg hover:scale-110 transition-transform"
						title={link.social.name}
					>
						{link.social.icon}
					</a>
				))}
			</div>
		</div>
	)
}