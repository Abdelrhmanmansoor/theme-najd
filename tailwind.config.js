module.exports = {
  important: false,

  content: [
    'src/views/**/*.twig',
    'src/assets/js/**/*.js',
    'node_modules/@salla.sa/twilight-tailwind-theme/safe-list-css.txt',
  ],

  darkMode: 'class',

  theme: {
    container: {
      center:  true,
      padding: '16px',
      screens: { '2xl': '1280px' },
    },

    fontFamily: {
      sans:    ['var(--font-main)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      primary: 'var(--font-main)',
    },

    extend: {
      colors: {
        'dark':         '#1D1F1F',
        'darker':       '#0E0F0F',
        'danger':       '#AE0A0A',
        'primary-dark': 'var(--color-primary-dark)',
        /* Glass mode colors */
        'glass-bg':         'var(--glass-bg)',
        'glass-bg-hover':   'var(--glass-bg-hover)',
        'glass-border':     'var(--glass-border)',
      },

      borderRadius: {
        'large': '22px',
        'big':   '40px',
        'glass': '20px',
        DEFAULT: '.75rem',
      },

      boxShadow: {
        'default':  '5px 10px 30px #2B2D340D',
        'dropdown': '0 4px 8px rgba(161, 121, 121, 0.07)',
        'light':    '0px 4px 15px rgba(1, 1, 1, 0.06)',
        'glass':    '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'glass-lg': '0 12px 40px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      },

      backdropBlur: {
        'glass':    '20px',
        'glass-lg': '30px',
      },

      spacing: {
        '3.75': '15px',
        '7.5':  '30px',
        '58':   '232px',
        '62':   '248px',
        '100':  '28rem',
        '116':  '464px',
        '132':  '528px',
      },

      height: {
        'banner':      '200px',
        'lg-banner':   '428px',
        'full-banner': '600px',
      },

      fontSize: {
        'xxs':        '10px',
        'title-size': '42px',
      },

      transitionTimingFunction: {
        'elastic': 'cubic-bezier(0.55, 0, 0.1, 1)',
        'spring':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'glass-shimmer': {
          from: { backgroundPosition: '200% 0' },
          to:   { backgroundPosition: '-200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(30px, -20px) scale(1.03)' },
          '66%':      { transform: 'translate(-20px, 30px) scale(0.97)' },
        },
      },

      animation: {
        'fade-in-up':    'fade-in-up 0.5s ease both',
        'glass-shimmer': 'glass-shimmer 8s ease-in-out infinite',
        'float':         'float 20s ease-in-out infinite',
      },

      screens: {
        'xs': '480px',
      },
    },
  },

  corePlugins: { outline: false },

  plugins: [
    require('@salla.sa/twilight-tailwind-theme'),
    require('@tailwindcss/forms'),
  ],
};
