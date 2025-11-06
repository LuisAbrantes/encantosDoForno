/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                // Fonte para corpo de texto (legibilidade)
                sans: [
                    'Inter',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif'
                ],

                // Fontes cursivas customizadas
                pacifico: ['Pacifico', 'cursive'], // Títulos principais e logo
                dancing: ['Dancing Script', 'cursive'], // Subtítulos e destaques
                vibes: ['Great Vibes', 'cursive'], // Chamadas de ação e menus
                allura: ['Allura', 'cursive'] // Seções elegantes
            },
            letterSpacing: {
                cursive: '0.02em',
                'cursive-wide': '0.03em'
            },
            lineHeight: {
                cursive: '1.4',
                'cursive-relaxed': '1.6'
            }
        }
    },
    plugins: []
};
