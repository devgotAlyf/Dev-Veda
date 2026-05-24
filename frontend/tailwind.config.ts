import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: 'var(--color-navy)',
          700: 'var(--color-navy-700)',
          800: 'var(--color-navy-800)',
        },
        cream: {
          DEFAULT: 'var(--color-cream)',
          100: 'var(--color-cream-100)',
        },
        amber: {
          DEFAULT: 'var(--color-amber)',
          light: 'var(--color-amber-light)',
        },
        sage: 'var(--color-sage)',
        rose: 'var(--color-rose)',
        honey: 'var(--color-honey)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        paper: 'var(--shadow-paper)',
        lifted: 'var(--shadow-lifted)',
      },
      spacing: {
        page: 'var(--spacing-page)',
      }
    },
  },
  plugins: [],
};
export default config;
