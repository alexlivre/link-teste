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
          primary: {
            50: '#f0f9ff',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8'
          },
          success: {
            500: '#10b981',
            600: '#059669'
          },
          error: {
            500: '#ef4444',
            600: '#dc2626'
          }
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif']
        }
      }
    },
    plugins: []
  };
};

export default createTailwindConfig();
