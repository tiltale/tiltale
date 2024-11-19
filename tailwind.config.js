/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            animation: {
                fadeIn: "fadeIn .5s ease-in-out",
                fadeOut: "fadeOut .5s ease-in-out",
            },

            keyframes: {
                fadeIn: {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                fadeOut: {
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                },
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ['light']
    }
};
