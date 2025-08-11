'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function TestRedirectPage() {
	const t = useTranslations('widgets.qrGenerator')
	const [userAgent, setUserAgent] = useState('')
	const [platform, setPlatform] = useState('')

	useEffect(() => {
		const ua = navigator.userAgent
		setUserAgent(ua)
		
		if (/iPhone|iPad|iPod/i.test(ua)) {
			setPlatform('iOS')
		} else if (/Android/i.test(ua)) {
			setPlatform('Android')
		} else {
			setPlatform('Desktop/Unknown')
		}
	}, [])

	const testLinks = [
		{
			name: 'Netflix (Universal)',
			url: '/api/app-redirect/ios:363590051,android:com.netflix.mediaclient'
		},
		{
			name: 'Instagram (Universal)',
			url: '/api/app-redirect/ios:389801252,android:com.instagram.android'
		},
		{
			name: 'Spotify (Universal)',
			url: '/api/app-redirect/ios:324684580,android:com.spotify.music'
		}
	]

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<Card>
				<CardHeader>
					<CardTitle>Test App Redirect</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="font-semibold mb-2">Your Device Info:</h3>
						<p className="text-sm text-muted-foreground">Platform: {platform}</p>
						<p className="text-sm text-muted-foreground break-all">User Agent: {userAgent}</p>
					</div>

					<div>
						<h3 className="font-semibold mb-2">Test Links:</h3>
						<div className="space-y-2">
							{testLinks.map((link) => (
								<div key={link.name} className="flex items-center justify-between p-3 border rounded">
									<span>{link.name}</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => window.open(link.url, '_blank')}
									>
										Test Redirect
									</Button>
								</div>
							))}
						</div>
					</div>

					<div className="pt-4">
						<Link href="../qr-generator">
							<Button variant="outline">← Back to QR Generator</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}