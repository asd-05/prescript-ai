/** @type {import('tailwindcss').Config} */
const colors = {
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',
  card: 'var(--color-card)',
  'card-foreground': 'var(--color-card-foreground)',
  popover: 'var(--color-popover)',
  'popover-foreground': 'var(--color-popover-foreground)',
  primary: 'var(--color-primary)',
  'primary-foreground': 'var(--color-primary-foreground)',
  secondary: 'var(--color-secondary)',
  'secondary-foreground': 'var(--color-secondary-foreground)',
  muted: 'var(--color-muted)',
  'muted-foreground': 'var(--color-muted-foreground)',
  accent: 'var(--color-accent)',
  'accent-foreground': 'var(--color-accent-foreground)',
  destructive: 'var(--color-destructive)',
  'destructive-foreground': 'var(--color-destructive-foreground)',
  border: 'var(--color-border)',
  input: 'var(--color-input)',
  ring: 'var(--color-ring)',
  sidebar: 'var(--color-sidebar)',
  'sidebar-foreground': 'var(--color-sidebar-foreground)',
  'sidebar-primary': 'var(--color-sidebar-primary)',
  'sidebar-primary-foreground': 'var(--color-sidebar-primary-foreground)',
  'sidebar-accent': 'var(--color-sidebar-accent)',
  'sidebar-accent-foreground': 'var(--color-sidebar-accent-foreground)',
  'sidebar-border': 'var(--color-sidebar-border)',
  'sidebar-ring': 'var(--color-sidebar-ring)',
  'chart-1': 'var(--color-chart-1)',
  'chart-2': 'var(--color-chart-2)',
  'chart-3': 'var(--color-chart-3)',
  'chart-4': 'var(--color-chart-4)',
  'chart-5': 'var(--color-chart-5)',
};

module.exports = {
  darkMode: 'class', // important for theme toggle
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: 'calc(1rem - 4px)',
        sm: 'calc(1rem - 8px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
