/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // https://github.com/ant-design/ant-design/issues/46053
  transpilePackages: [ "antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table" ],
  // The policy used to live at /privacy.txt, which is linked from older pages and emails.
  async redirects() {
    return [
      {
        source: '/privacy.txt',
        destination: '/privacy',
        permanent: true,
      },
    ]
  },
}

const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withPlugins([
  [withBundleAnalyzer]
])

module.exports = nextConfig