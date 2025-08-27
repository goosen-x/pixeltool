'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
	Copy, 
	ExternalLink, 
	Search,
	QrCode,
	Share2,
	CheckCircle
} from 'lucide-react'
import { getAllShortLinks, SOCIAL_LINKS } from '@/lib/constants/social-links'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function SocialLinksPage() {
	const [searchTerm, setSearchTerm] = useState('')
	const [copiedLink, setCopiedLink] = useState<string | null>(null)
	const allLinks = getAllShortLinks()
	
	const filteredLinks = allLinks.filter(link => 
		link.social.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		link.social.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
	)
	
	const copyToClipboard = (text: string, linkId: string) => {
		navigator.clipboard.writeText(text)
		setCopiedLink(linkId)
		toast.success('Ссылка скопирована!')
		setTimeout(() => setCopiedLink(null), 2000)
	}
	
	const generateQRCodeUrl = (url: string) => {
		const encoded = encodeURIComponent(url)
		return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`
	}
	
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
			<div className="max-w-6xl mx-auto px-4 space-y-8">
				{/* Header */}
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						Короткие ссылки для социальных сетей
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Используйте эти короткие ссылки для отслеживания трафика из разных источников
					</p>
				</div>
				
				{/* Search */}
				<div className="max-w-md mx-auto">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							type="text"
							placeholder="Поиск по названию или коду..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>
				
				{/* Links Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredLinks.map((link, index) => (
						<motion.div
							key={link.social.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
						>
							<Card className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
								{/* Background gradient */}
								<div 
									className="absolute inset-0 opacity-5"
									style={{ backgroundColor: link.social.color }}
								/>
								
								<CardHeader className="relative">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<span className="text-3xl">{link.social.icon}</span>
											<div>
												<CardTitle className="text-lg">{link.social.name}</CardTitle>
												<Badge variant="secondary" className="mt-1">
													/{link.social.shortCode}
												</Badge>
											</div>
										</div>
									</div>
								</CardHeader>
								
								<CardContent className="relative space-y-4">
									{/* Short Link */}
									<div className="space-y-2">
										<label className="text-sm font-medium text-muted-foreground">
											Короткая ссылка:
										</label>
										<div className="flex items-center gap-2">
											<code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
												{link.shortLink}
											</code>
											<Button
												size="icon"
												variant="ghost"
												onClick={() => copyToClipboard(link.shortLink, `short-${link.social.id}`)}
											>
												{copiedLink === `short-${link.social.id}` ? (
													<CheckCircle className="h-4 w-4 text-green-500" />
												) : (
													<Copy className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>
									
									{/* Full Link */}
									<div className="space-y-2">
										<label className="text-sm font-medium text-muted-foreground">
											Полная ссылка с UTM:
										</label>
										<div className="flex items-center gap-2">
											<code className="flex-1 p-2 bg-muted rounded text-xs font-mono overflow-hidden text-ellipsis">
												{link.fullLink}
											</code>
											<Button
												size="icon"
												variant="ghost"
												onClick={() => copyToClipboard(link.fullLink, `full-${link.social.id}`)}
											>
												{copiedLink === `full-${link.social.id}` ? (
													<CheckCircle className="h-4 w-4 text-green-500" />
												) : (
													<Copy className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>
									
									{/* Actions */}
									<div className="flex gap-2 pt-2">
										<Button
											size="sm"
											variant="outline"
											className="flex-1"
											onClick={() => window.open(link.shortLink, '_blank')}
										>
											<ExternalLink className="h-4 w-4 mr-2" />
											Открыть
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												const qrUrl = generateQRCodeUrl(link.shortLink)
												window.open(qrUrl, '_blank')
											}}
										>
											<QrCode className="h-4 w-4 mr-2" />
											QR
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												if (navigator.share) {
													navigator.share({
														title: `${link.social.name} - PixelTool`,
														text: `Посетите PixelTool через ${link.social.name}`,
														url: link.shortLink
													})
												} else {
													copyToClipboard(link.shortLink, `share-${link.social.id}`)
												}
											}}
										>
											<Share2 className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
				
				{/* Instructions */}
				<Card className="max-w-2xl mx-auto">
					<CardHeader>
						<CardTitle>Как использовать короткие ссылки</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<h3 className="font-semibold flex items-center gap-2">
								<span className="text-primary">1.</span>
								Выберите социальную сеть
							</h3>
							<p className="text-sm text-muted-foreground ml-6">
								Найдите нужную социальную сеть в списке выше
							</p>
						</div>
						
						<div className="space-y-2">
							<h3 className="font-semibold flex items-center gap-2">
								<span className="text-primary">2.</span>
								Скопируйте короткую ссылку
							</h3>
							<p className="text-sm text-muted-foreground ml-6">
								Используйте формат <code className="bg-muted px-1 rounded">pixeltool.pro/s/tk</code> для постов
							</p>
						</div>
						
						<div className="space-y-2">
							<h3 className="font-semibold flex items-center gap-2">
								<span className="text-primary">3.</span>
								Отслеживайте результаты
							</h3>
							<p className="text-sm text-muted-foreground ml-6">
								UTM-метки автоматически добавятся для аналитики
							</p>
						</div>
						
						<div className="bg-muted/50 p-4 rounded-lg">
							<p className="text-sm">
								<span className="font-semibold">Совет:</span> Используйте QR-коды для офлайн материалов или Stories в социальных сетях
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}