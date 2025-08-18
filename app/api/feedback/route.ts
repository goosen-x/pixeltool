import { NextRequest, NextResponse } from 'next/server'

interface FeedbackRequest {
	type: 'bug' | 'feature' | 'general'
	title: string
	description: string
	email?: string
	widget?: string
	userAgent?: string
	url?: string
}

export async function POST(request: NextRequest) {
	try {
		const body: FeedbackRequest = await request.json()

		// Basic validation
		if (!body.title || !body.description || !body.type) {
			return NextResponse.json(
				{ error: 'Missing required fields: title, description, type' },
				{ status: 400 }
			)
		}

		// Add metadata
		const feedbackData = {
			...body,
			timestamp: new Date().toISOString(),
			userAgent: request.headers.get('user-agent'),
			ip:
				request.headers.get('x-forwarded-for') ||
				request.headers.get('x-real-ip'),
			url: request.headers.get('referer')
		}

		// Here you can integrate with your preferred service:

		// 1. Send to email service (like Resend, SendGrid, etc.)
		// await sendEmail({
		//   to: 'feedback@yoursite.com',
		//   subject: `[${body.type.toUpperCase()}] ${body.title}`,
		//   html: generateFeedbackEmail(feedbackData)
		// })

		// 2. Create GitHub issue
		// await createGitHubIssue(feedbackData)

		// 3. Send to Discord/Slack webhook
		// await sendToDiscord(feedbackData)

		// 4. Save to database
		// await saveFeedbackToDatabase(feedbackData)

		// 5. Send to analytics/logging service
		// await sendToAnalytics(feedbackData)

		// For now, just log it
		console.log('Feedback received:', feedbackData)

		return NextResponse.json(
			{
				message: 'Feedback submitted successfully',
				id: Date.now().toString() // In production, use proper ID generation
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error processing feedback:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// Helper functions (examples)

function generateFeedbackEmail(data: any) {
	return `
    <h2>New ${data.type} feedback</h2>
    <p><strong>Title:</strong> ${data.title}</p>
    <p><strong>Description:</strong></p>
    <p>${data.description.replace(/\n/g, '<br>')}</p>
    ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ''}
    ${data.widget ? `<p><strong>Widget:</strong> ${data.widget}</p>` : ''}
    <p><strong>URL:</strong> ${data.url}</p>
    <p><strong>User Agent:</strong> ${data.userAgent}</p>
    <p><strong>Timestamp:</strong> ${data.timestamp}</p>
  `
}

async function createGitHubIssue(data: any) {
	// Example GitHub API integration
	const labels = {
		bug: ['bug'],
		feature: ['enhancement'],
		general: ['question']
	}

	const issue = {
		title: data.title,
		body: `
**Type:** ${data.type}

**Description:**
${data.description}

**Additional Info:**
- Email: ${data.email || 'Not provided'}
- Widget: ${data.widget || 'Not specified'}
- URL: ${data.url}
- User Agent: ${data.userAgent}
- Timestamp: ${data.timestamp}
    `,
		labels: labels[data.type as keyof typeof labels]
	}

	// Uncomment to enable GitHub integration
	// const response = await fetch(`https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/issues`, {
	//   method: 'POST',
	//   headers: {
	//     'Authorization': `token ${process.env.GITHUB_TOKEN}`,
	//     'Content-Type': 'application/json'
	//   },
	//   body: JSON.stringify(issue)
	// })

	// return response.json()
}

async function sendToDiscord(data: any) {
	// Example Discord webhook integration
	const webhook = {
		embeds: [
			{
				title: `New ${data.type} feedback`,
				description: data.title,
				fields: [
					{
						name: 'Description',
						value: data.description.slice(0, 1024),
						inline: false
					},
					{ name: 'Email', value: data.email || 'Not provided', inline: true },
					{
						name: 'Widget',
						value: data.widget || 'Not specified',
						inline: true
					}
				],
				color:
					data.type === 'bug'
						? 0xff0000
						: data.type === 'feature'
							? 0x00ff00
							: 0x0099ff,
				timestamp: data.timestamp
			}
		]
	}

	// Uncomment to enable Discord integration
	// const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
	//   method: 'POST',
	//   headers: { 'Content-Type': 'application/json' },
	//   body: JSON.stringify(webhook)
	// })
}
