import flowbitePlugin from 'flowbite/plugin'
import daisyuiPlugin from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',
	theme: {
		extend: {
			colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B'
        }
			}
		},
		fontFamily: {
			'body': [
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'system-ui',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji'
			],
			'sans': [
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'system-ui',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji'
			]
		}
	},
	plugins: [
		daisyuiPlugin,
		flowbitePlugin,
	],
  daisyui: {
    themes: [
      {
        // saasstartertheme: {
        //   "primary": "#ad0263",
        //   "primary-content": "#fefbf6",
        //   "neutral-content": "#fefbf6",
        //   "secondary": "#ff80b0",
        //   "accent": "#fa00c8",
        //   "neutral": "#fefbf6",
        //   "base-content": "#f7f7f7",
        //   "base-surface": "#262626",
        //   "base-100": "#1a1a1a",
        // },
      }
    ],
  },
}

