import typography from '@tailwindcss/typography';
import containerQuries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            typography: {
                DEFAULT: {
                    css: {
                        pre: false,
                        code: false,
                        'pre code': false,
                        'code::before': false,
                        'code::after': false
                    }
                }
            },
            padding: {
                'safe-bottom': 'env(safe-area-inset-bottom)'
            }
        }
    },
    plugins: [typography, containerQuries]
};