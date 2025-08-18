declare module '*.css' {
	const content: { [className: string]: string }
	export default content
}

declare module 'prismjs/themes/prism-tomorrow.css' {
	const content: any
	export default content
}

declare module 'prismjs/components/prism-javascript'
declare module 'prismjs/components/prism-typescript'
declare module 'prismjs/components/prism-jsx'
declare module 'prismjs/components/prism-tsx'
declare module 'prismjs/components/prism-css'
declare module 'prismjs/components/prism-json'
declare module 'prismjs/components/prism-bash'

declare module 'lucide-react'
declare module '@tabler/icons-react'
