/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                phone: {
                    bg: '#000000',
                    accent: '#007AFF',
                    surface: '#1C1C1E',
                    secondary: '#2C2C2E',
                    text: '#FFFFFF',
                    'text-dim': '#8E8E93',
                    success: '#32D74B',
                    error: '#FF453A',
                    warning: '#FF9F0A',
                },
                ios: {
                    blue: '#007AFF',
                    green: '#34C759',
                    red: '#FF3B30',
                    orange: '#FF9500',
                    yellow: '#FFCC00',
                    gray: '#8E8E93',
                    secondary: '#2C2C2E',
                    'gray-2': '#AEAEB2',
                    'gray-3': '#C7C7CC',
                    'gray-4': '#D1D1D6',
                    'gray-5': '#E5E5EA',
                    'gray-6': '#F2F2F7',
                }
            },
            borderRadius: {
                'phone-outer': '55px',
                'phone-inner': '45px',
                'ios': '12px',
                'ios-lg': '22px',
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"SF Pro Display"',
                    '"SF Pro Text"',
                    '"Helvetica Neue"',
                    'Inter',
                    'sans-serif',
                ],
            },
            backdropBlur: {
                'ios': '20px',
                'ios-thick': '40px',
            },
            backgroundImage: {
                'ios-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
            },
            animation: {
                'ios-bounce': 'ios-bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'fade-in': 'fade-in 0.3s ease-out',
                'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            keyframes: {
                'ios-bounce': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(0.95)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            boxShadow: {
                'ios-card': '0 4px 24px rgba(0, 0, 0, 0.25)',
                'ios-soft': '0 2px 12px rgba(0, 0, 0, 0.15)',
            }
        },
    },
    plugins: [],
};
