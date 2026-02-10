import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Doctor Romance inspired romantic color palette
                'romantic': {
                    'dark': '#1a1625',      // Deep purple-black background
                    'darker': '#0f0c1f',    // Even darker background
                    'card': '#2d2438',      // Card background
                    'pink': {
                        DEFAULT: '#ff6b9d',   // Primary pink
                        'light': '#ff9fb8',   // Light pink
                        'bright': '#ff85a6',  // Bright pink
                    },
                    'purple': {
                        DEFAULT: '#8b5cf6',   // Primary purple
                        'light': '#a78bfa',   // Light purple
                        'lighter': '#c4b5fd', // Even lighter purple
                    },
                },
            },
            backgroundImage: {
                'romantic-gradient': 'linear-gradient(135deg, #ff6b9d 0%, #8b5cf6 100%)',
                'romantic-gradient-vertical': 'linear-gradient(180deg, #ff6b9d 0%, #8b5cf6 100%)',
                'romantic-dark-gradient': 'linear-gradient(135deg, #1a1625 0%, #2d2438 100%)',
            },
            animation: {
                'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '10%': { transform: 'scale(1.08)' },
                    '20%': { transform: 'scale(0.98)' },
                    '30%': { transform: 'scale(1.05)' },
                    '50%': { transform: 'scale(1.12)' },
                    '70%': { transform: 'scale(0.95)' },
                    '80%': { transform: 'scale(1.05)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
