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
                // Doctor Romance inspired RED WINE color palette
                'wine': {
                    'dark': '#20050a',      // Deep maroon background (from image)
                    'darker': '#150305',    // Darker shade for contrast
                    'card': '#2d080f',      // Slightly lighter maroon for cards
                    'gold': {
                        DEFAULT: '#FFD700',   // Gold accent (from image text)
                        'dim': '#C5A000',     // Dim gold
                    },
                    'red': {
                        DEFAULT: '#8B0000',   // Deep red
                        'light': '#A52A2A',   // Brown-red
                    },
                    'burgundy': {
                        DEFAULT: '#800020',   // True burgundy
                        'light': '#9F1D35',   // Light burgundy
                    },
                },
            },
            backgroundImage: {
                'wine-gradient': 'linear-gradient(135deg, #800020 0%, #20050a 100%)', // Burgundy to Dark based on image
                'wine-gradient-vertical': 'linear-gradient(180deg, #800020 0%, #20050a 100%)',
                'wine-dark-gradient': 'linear-gradient(135deg, #20050a 0%, #2d080f 100%)', // Dark to Card
                'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #C5A000 100%)', // Gold gradient for buttons
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
