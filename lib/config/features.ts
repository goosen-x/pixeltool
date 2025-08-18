// Feature flags for the application
export const features = {
	// Database features
	database: {
		enabled: process.env.NEXT_PUBLIC_DISABLE_DATABASE !== 'true',
		timeout: 5000 // milliseconds
	},

	// Blog features
	blog: {
		enabled: process.env.NEXT_PUBLIC_DISABLE_BLOG !== 'true',
		postsPerPage: 6
	}
}
