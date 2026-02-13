/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                bg: 'var(--bg)',
                surface: {
                    DEFAULT: 'var(--surface)',
                    el: 'var(--surface-el)',
                },
                txt: {
                    DEFAULT: 'var(--text)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                },
                primary: {
                    DEFAULT: 'var(--primary)',
                    hover: 'var(--primary-hover)',
                    text: 'var(--primary-text)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    hover: 'var(--accent-hover)',
                },
                secondary: 'var(--secondary)',
                brd: {
                    DEFAULT: 'var(--border)',
                    light: 'var(--border-light)',
                },
                link: 'var(--link)',
                'input-bg': 'var(--input-bg)',
                'input-brd': 'var(--input-border)',
                focus: 'var(--focus)',
                ok: 'var(--success)',
                warn: 'var(--warning)',
                err: 'var(--error)',
                info: 'var(--info)',
            },
            fontFamily: {
                quran: ['"Amiri"', 'serif'],
                sans: ['"Noto Kufi Arabic"', '"IBM Plex Sans Arabic"', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'glow-primary': '0 0 30px 8px var(--glow-primary)',
                'glow-accent': '0 0 30px 8px var(--glow-accent)',
            },
        },
    },
    plugins: [],
};
