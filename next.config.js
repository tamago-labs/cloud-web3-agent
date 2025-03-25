/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        APTOS_TEST_KEY: process.env.APTOS_TEST_KEY,
        FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        CRONOS_ZKEVM_API_KEY: process.env.CRONOS_ZKEVM_API_KEY,
        EVM_TEST_KEY: process.env.EVM_TEST_KEY
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig
