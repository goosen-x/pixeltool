export function ThemeScript() {
	return (
		<script
			async
			dangerouslySetInnerHTML={{
				__html: `
					(function() {
						function getSystemTheme() {
							return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
						}
						
						function getStoredTheme() {
							try {
								return localStorage.getItem('theme')
							} catch (e) {
								return null
							}
						}
						
						const storedTheme = getStoredTheme()
						const theme = storedTheme || getSystemTheme()
						
						document.documentElement.classList.remove('light', 'dark')
						document.documentElement.classList.add(theme)
					})()
				`
			}}
		/>
	)
}
