// tailwind.config.js
// Configuração Tailwind CSS seguindo Clean Code

/** @type {import('tailwindcss').Config} */

// Função pequena para configuração (< 20 linhas)
const createTailwindConfig = () => {
  return {
    content: [
      './index.html',
      './src/**/*.{vue,js,ts,jsx,tsx}',
      './src/components/**/*.{vue,js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {
        colors: {
          // Primários - Minimalismo Tecnológico
          primary: {
            50: '#f8f6f3',
            100: '#e8e4df',
            200: '#d4c8bc',
            300: '#b8a89a',
            400: '#9c8878',
            500: '#806856',
            600: '#6b5d54',
            700: '#5a4e44',
            800: '#4a3f36',
            900: '#2d5016'
          },
          // Forest - Toques Orgânicos
          forest: {
            50: '#f6faf8',
            100: '#e3f2e9',
            200: '#c8e5d3',
            300: '#a8d4b6',
            400: '#8fbf9f',
            500: '#7ba888',
            600: '#659173',
            700: '#527a61',
            800: '#426352',
            900: '#354e42'
          },
          // Gold - Golden Hour
          gold: {
            50: '#fdfbf7',
            100: '#f9f1e8',
            200: '#f3e4d0',
            300: '#ead4af',
            400: '#dfc289',
            500: '#d4a574',
            600: '#c8945f',
            700: '#b88047',
            800: '#a46c3a',
            900: '#8b5529'
          },
          // Cores Vibrantes
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87'
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a'
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843'
          },
          coral: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12'
          },
          emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b'
          },
          cyan: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63'
          },
          // Cores de Feedback mantidas
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d'
          },
          error: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c'
          },
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309'
          }
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace']
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }]
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem'
        },
        borderRadius: {
          '4xl': '2rem'
        },
        boxShadow: {
          'primary': '0 4px 14px 0 rgb(45 80 22 / 0.15)',
          'forest': '0 4px 14px 0 rgb(127 168 143 / 0.15)',
          'gold': '0 4px 14px 0 rgb(212 165 116 / 0.15)',
          'purple': '0 4px 20px -2px rgb(147 51 234 / 0.25)',
          'blue': '0 4px 20px -2px rgb(59 130 246 / 0.25)',
          'pink': '0 4px 20px -2px rgb(236 72 153 / 0.25)',
          'coral': '0 4px 20px -2px rgb(249 115 22 / 0.25)',
          'emerald': '0 4px 20px -2px rgb(16 185 129 / 0.25)',
          'cyan': '0 4px 20px -2px rgb(6 182 212 / 0.25)'
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-out',
          'slide-in': 'slideIn 0.2s ease-out',
          'scale-in': 'scaleIn 0.15s ease-out'
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(-8px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' }
          },
          slideIn: {
            '0%': { opacity: '0', transform: 'translateX(-16px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' }
          },
          scaleIn: {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' }
          }
        },
        transitionDuration: {
          '150': '150ms',
          '200': '200ms',
          '300': '300ms'
        },
        transitionTimingFunction: {
          'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    plugins: []
  }
}

export default createTailwindConfig()
