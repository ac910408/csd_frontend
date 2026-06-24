/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Identidad
        clan: 'var(--color-clan)',
        comunidad: 'var(--color-comunidad)',
        grupo: 'var(--color-grupo)',
        manada: 'var(--color-manada)',
        mundial: 'var(--color-mundial)',
        nacional: 'var(--color-nacional)',
        scouters: 'var(--color-scouters)',
        tropa: 'var(--color-tropa)',

        // Semánticos
        primary: 'var(--color-primary)',
        'primary-contrast': 'var(--color-primary-contrast)',
        secondary: 'var(--color-secondary)',
        'secondary-contrast': 'var(--color-secondary-contrast)',
        accent: 'var(--color-accent)',
        'accent-contrast': 'var(--color-accent-contrast)',
        info: 'var(--color-info)',
        'info-contrast': 'var(--color-info-contrast)',
        success: 'var(--color-success)',
        'success-contrast': 'var(--color-success-contrast)',
        warning: 'var(--color-warning)',
        'warning-contrast': 'var(--color-warning-contrast)',
        error: 'var(--color-error)',
        'error-contrast': 'var(--color-error-contrast)',
        neutral: 'var(--color-neutral)',
        'neutral-contrast': 'var(--color-neutral-contrast)',

        'base-contrast': 'var(--color-base-content)',
        'base-100': 'var(--color-base-100)',
        'base-200': 'var(--color-base-200)',
        'base-300': 'var(--color-base-300)',
      },
    },
  },
  plugins: [],
}
