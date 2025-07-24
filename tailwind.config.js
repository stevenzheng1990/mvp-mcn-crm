module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 原有的颜色保留
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // 添加莫兰迪色系
        morandi: {
          sage: '#689b80',      // 淡雅绿
          dust: '#d1a688',      // 尘土色
          cloud: '#9ba8cc',     // 云朵蓝
          sand: '#c4a582',      // 沙色
          mist: '#a8a5a0',      // 迷雾灰
          rose: '#d19090',      // 玫瑰粉
          stone: '#6b6b6b',     // 石头灰
          cream: '#f2efea',     // 奶油色
          ash: '#747474',       // 灰烬色
          pearl: '#ebe8e3',     // 珍珠白
        }
      },
      backgroundImage: {
        'morandi-gradient': 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      },
      fontFamily: {
        sans: ['Outfit', 'OPPO Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      boxShadow: {
        'apple': '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        'morandi': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'morandi-lg': '0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'morandi-spin': 'morandi-spin 1.5s linear infinite',
        'morandi-pulse': 'morandi-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'morandi-fade-in': 'morandi-fade-in 0.6s ease-out',
      },
      keyframes: {
        'morandi-spin': {
          to: { transform: 'rotate(360deg)' }
        },
        'morandi-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        'morandi-fade-in': {
          from: { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}