/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0f172a", // Deep Navy
                secondary: "#1e293b", // Slate
                accent: "#3b82f6", // Electric Blue
                neon: "#a855f7", // Purple Neon
                glass: "rgba(255, 255, 255, 0.05)",
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'neon-gradient': 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }
        },
    },
    plugins: [],
}
