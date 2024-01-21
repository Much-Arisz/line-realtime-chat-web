/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.API_URL,
        NEXT_PUBLIC_LINE_BOT_URL: process.env.LINE_BOT_URL
    },
};

module.exports = nextConfig