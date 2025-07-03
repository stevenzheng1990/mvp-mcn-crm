@type {import('next').NextConfig}
const nextConfig = {
  env: {
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  }
  reactStrictMode: true,
  swcMinify: true,
  // 确保CSS正确处理
  experimental: {
    optimizeCss: false,  
  }
}
module.exports = nextConfig

