import { getAllPublishedPosts } from '@/lib/db/blog'
import type { BlogPost } from '@/lib/types/database'

export default async function TestDB() {
	let posts: BlogPost[] = []
	let error: string | null = null
	const envInfo = {
		DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
		POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
		NODE_ENV: process.env.NODE_ENV
	}

	try {
		posts = await getAllPublishedPosts('en')
	} catch (err: any) {
		error = err.message
	}

	return (
		<div className='p-8'>
			<h1 className='text-2xl font-heading font-bold mb-4'>
				Database Test Page
			</h1>

			<div className='mb-6'>
				<h2 className='text-xl font-heading font-semibold mb-2'>
					Environment Variables:
				</h2>
				<pre className='bg-gray-100 p-4 rounded'>
					{JSON.stringify(envInfo, null, 2)}
				</pre>
			</div>

			<div className='mb-6'>
				<h2 className='text-xl font-heading font-semibold mb-2'>
					Database Connection:
				</h2>
				{error ? (
					<div className='bg-red-100 text-red-700 p-4 rounded'>
						Error: {error}
					</div>
				) : (
					<div className='bg-green-100 text-green-700 p-4 rounded'>
						Connected! Found {posts.length} posts
					</div>
				)}
			</div>

			{posts.length > 0 && (
				<div>
					<h2 className='text-xl font-heading font-semibold mb-2'>Posts:</h2>
					<ul className='space-y-2'>
						{posts.map(post => (
							<li key={post.id} className='bg-gray-100 p-3 rounded'>
								<strong>{post.title}</strong>
								<br />
								<span className='text-sm text-gray-600'>Slug: {post.slug}</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
