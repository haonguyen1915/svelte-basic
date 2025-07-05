// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   safelist: ['text-accent-500'],
//   darkMode: ['class', '[data-theme="dark"]'], // allow both ways
//   content: ['./src/**/*.{html,js,svelte,ts}'],
//   theme: {
//     extend: {
      
//         colors: {
//         // Primary colors
//         primary: {
//           50: 'var(--primary-50)',
//           100: 'var(--primary-100)',
//           200: 'var(--primary-200)',
//           300: 'var(--primary-300)',
//           400: 'var(--primary-400)',
//           500: 'var(--primary-500)',
//           600: 'var(--primary-600)',
//           700: 'var(--primary-700)',
//           800: 'var(--primary-800)',
//           900: 'var(--primary-900)',
//           950: 'var(--primary-950)',
//           DEFAULT: 'var(--primary-500)',
//         },
//         // Secondary colors
//         secondary: {
//           50: 'var(--secondary-50)',
//           100: 'var(--secondary-100)',
//           200: 'var(--secondary-200)',
//           300: 'var(--secondary-300)',
//           400: 'var(--secondary-400)',
//           500: 'oklch(var(--secondary-500))',
//           600: 'var(--secondary-600)',
//           700: 'var(--secondary-700)',
//           800: 'var(--secondary-800)',
//           900: 'var(--secondary-900)',
//           DEFAULT: 'var(--secondary-500)',
//         },
//         // Accent colors
//         accent: {
//           50: 'var(--accent-50)',
//           100: 'var(--accent-100)',
//           200: 'var(--accent-200)',
//           300: 'var(--accent-300)',
//           400: 'var(--accent-400)',
//           500: 'var(--accent-500)',
//           600: 'var(--accent-600)',
//           700: 'var(--accent-700)',
//           800: 'var(--accent-800)',
//           900: 'var(--accent-900)',
//           DEFAULT: 'var(--accent-500)',
//         },
//         // Neutral colors
//         neutral: {
//           50: 'var(--neutral-50)',
//           100: 'var(--neutral-100)',
//           200: 'var(--neutral-200)',
//           300: 'var(--neutral-300)',
//           400: 'var(--neutral-400)',
//           500: 'var(--neutral-500)',
//           600: 'var(--neutral-600)',
//           700: 'var(--neutral-700)',
//           800: 'var(--neutral-800)',
//           900: 'var(--neutral-900)',
//           950: 'var(--neutral-950)',
//         },
//         // Success colors
//         success: {
//           50: 'var(--success-50)',
//           100: 'var(--success-100)',
//           200: 'var(--success-200)',
//           300: 'var(--success-300)',
//           400: 'var(--success-400)',
//           500: 'var(--success-500)',
//           600: 'var(--success-600)',
//           700: 'var(--success-700)',
//           800: 'var(--success-800)',
//           900: 'var(--success-900)',
//           DEFAULT: 'var(--success-500)',
//         },
//         // Warning colors
//         warning: {
//           50: 'var(--warning-50)',
//           100: 'var(--warning-100)',
//           200: 'var(--warning-200)',
//           300: 'var(--warning-300)',
//           400: 'var(--warning-400)',
//           500: 'var(--warning-500)',
//           600: 'var(--warning-600)',
//           700: 'var(--warning-700)',
//           800: 'var(--warning-800)',
//           900: 'var(--warning-900)',
//           DEFAULT: 'var(--warning-500)',
//         },
//         // Error colors
//         error: {
//           50: 'var(--error-50)',
//           100: 'var(--error-100)',
//           200: 'var(--error-200)',
//           300: 'var(--error-300)',
//           400: 'var(--error-400)',
//           500: 'var(--error-500)',
//           600: 'var(--error-600)',
//           700: 'var(--error-700)',
//           800: 'var(--error-800)',
//           900: 'var(--error-900)',
//           DEFAULT: 'var(--error-500)',
//         },
//         // Info colors
//         info: {
//           50: 'var(--info-50)',
//           100: 'var(--info-100)',
//           200: 'var(--info-200)',
//           300: 'var(--info-300)',
//           400: 'var(--info-400)',
//           500: 'var(--info-500)',
//           600: 'var(--info-600)',
//           700: 'var(--info-700)',
//           800: 'var(--info-800)',
//           900: 'var(--info-900)',
//           DEFAULT: 'var(--info-500)',
//         },
//         // Background colors
//         background: {
//           primary: 'var(--bg-primary)',
//           secondary: 'var(--bg-secondary)',
//           tertiary: 'var(--bg-tertiary)',
//           muted: 'var(--bg-muted)',
//           dark: 'var(--bg-dark)',
//           'dark-secondary': 'var(--bg-dark-secondary)',
//         },
//         // Text colors
//         text: {
//           primary: 'var(--text-primary)',
//           secondary: 'var(--text-secondary)',
//           muted: 'var(--text-muted)',
//           light: 'var(--text-light)',
//           white: 'var(--text-white)',
//           dark: 'var(--text-dark)',
//         },
//         // Border colors
//         border: {
//           light: 'var(--border-light)',
//           medium: 'var(--border-medium)',
//           dark: 'var(--border-dark)',
//           focus: 'var(--border-focus)',
//           DEFAULT: 'var(--border-light)',
//         },
//         // Brand colors
//         brand: {
//           primary: 'var(--brand-primary)',
//           secondary: 'var(--brand-secondary)',
//           accent: 'var(--brand-accent)',
//         },
//       },
//       // Custom background colors
//       backgroundColor: {
//         'primary': 'var(--bg-primary)',
//         'secondary': 'var(--bg-secondary)',
//         'tertiary': 'var(--bg-tertiary)',
//         'muted': 'var(--bg-muted)',
//         'dark': 'var(--bg-dark)',
//         'dark-secondary': 'var(--bg-dark-secondary)',
//       },
//       // Custom text colors
//       textColor: {
//         'primary': 'var(--text-primary)',
//         'secondary': 'var(--text-secondary)',
//         'muted': 'var(--text-muted)',
//         'light': 'var(--text-light)',
//         'white': 'var(--text-white)',
//         'dark': 'var(--text-dark)',
//       },
//       // Custom border colors
//       borderColor: {
//         'light': 'var(--border-light)',
//         'medium': 'var(--border-medium)',
//         'dark': 'var(--border-dark)',
//         'focus': 'var(--border-focus)',
//         DEFAULT: 'var(--border-light)',
//       },
//       // Custom box shadows
//       boxShadow: {
//         'sm': 'var(--shadow-sm)',
//         'md': 'var(--shadow-md)',
//         'lg': 'var(--shadow-lg)',
//         'xl': 'var(--shadow-xl)',
//       },
//       // Custom spacing (optional)
//       spacing: {
//         '18': '4.5rem',
//         '88': '22rem',
//       },
//       // Custom font sizes (optional)
//       fontSize: {
//         'xxs': '0.625rem',
//         'xs': '0.75rem',
//         'sm': '0.875rem',
//         'base': '1rem',
//         'lg': '1.125rem',
//         'xl': '1.25rem',
//         '2xl': '1.5rem',
//         '3xl': '1.875rem',
//         '4xl': '2.25rem',
//         '5xl': '3rem',
//         '6xl': '3.75rem',
//       },
//       // Custom border radius (optional)
//       borderRadius: {
//         'none': '0',
//         'sm': '0.125rem',
//         'DEFAULT': '0.25rem',
//         'md': '0.375rem',
//         'lg': '0.5rem',
//         'xl': '0.75rem',
//         '2xl': '1rem',
//         '3xl': '1.5rem',
//         'full': '9999px',
//       },
//       // Custom z-index (optional)
//       zIndex: {
//         '0': '0',
//         '10': '10',
//         '20': '20',
//         '30': '30',
//         '40': '40',
//         '50': '50',
//         'auto': 'auto',
//         'tooltip': '1000',
//         'modal': '1050',
//         'popover': '1060',
//         'dropdown': '1070',
//       },
//       // Custom animation (optional)
//       animation: {
//         'fade-in': 'fadeIn 0.3s ease-in-out',
//         'fade-out': 'fadeOut 0.3s ease-in-out',
//         'slide-up': 'slideUp 0.3s ease-out',
//         'slide-down': 'slideDown 0.3s ease-out',
//         'pulse-slow': 'pulse 3s infinite',
//         'spin-slow': 'spin 3s linear infinite',
//       },
//       // Custom keyframes (optional)
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         fadeOut: {
//           '0%': { opacity: '1' },
//           '100%': { opacity: '0' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(100%)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideDown: {
//           '0%': { transform: 'translateY(-100%)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//       },
//     },
//   },
//   plugins: [],
// }