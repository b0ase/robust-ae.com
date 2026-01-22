
import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                'b0ase-dark': '#0a0a0a',
                'b0ase-blue': '#0070f3',
                'b0ase-card': '#111111',
                'b0ase-card-border': '#333333',
            },
        },
    },
    plugins: [],
} satisfies Config;
