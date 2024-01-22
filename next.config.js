/** @type {import('next').NextConfig} */

const env = process.env.NODE_ENV || "locals";
require("dotenv").config({ path: `.env.${env}` });
console.log(env);
console.log(process.env.API_URL);
const nextConfig = {

    env: {
        NEXT_PUBLIC_API_URL: process.env.API_URL,
        NEXT_PUBLIC_LINE_BOT_URL: process.env.LINE_BOT_URL
    },
};

module.exports = nextConfig