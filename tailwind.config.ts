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
                    'dark': '#1a0a0e',      // Deep wine-black background
                    'darker': '#0d0507',    // Even darker wine background
                    'card': '#2d1418',      // Wine card background
                    'red': {
                        DEFAULT: '#8B0000',   // Deep red (dark red)
                        'light': '#A52A2A',   // Brown-red (burgundy)
                        'bright': '#B22222',  // Firebrick red
                    },
                    'burgundy': {
                        DEFAULT: '#800020',   // True burgundy
                        'light': '#9F1D35',   // Light burgundy
                        'lighter': '#C84557', // Even lighter burgundy
                    },
                    'maroon': {
                        DEFAULT: '#722F37',   // Wine maroon
                        'dark': '#5C1A1B',    // Dark maroon
                    },
                },
            },
            backgroundImage: {
                'wine-gradient': 'linear-gradient(135deg, #800020 0%, #8B0000 100%)',
                'wine-gradient-vertical': 'linear-gradient(180deg, #800020 0%, #8B0000 100%)',
                'wine-dark-gradient': 'linear-gradient(135deg, #1a0a0e 0%, #2d1418 100%)',
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
