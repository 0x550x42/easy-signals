/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				gold: {
					50: '#fefdf3',
					100: '#fffbeb',
					200: '#fef3c7',
					300: '#fde68a',
					400: '#fcd34d',
					500: '#fbbf24',
					600: '#f59e0b',
					700: '#d97706',
					800: '#b45309',
					900: '#78350f'
				},
				slate: {
					950: '#0f172a'
				}
			},
			fontFamily: {
				sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
				display: ['Space Grotesk', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
}
