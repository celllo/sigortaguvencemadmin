/** @type {import('next').NextConfig} */

const path = require('path')
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  optimizeFonts: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
}


// const nextConfig = {
//   reactStrictMode: false,

//   swcMinify: true,
//   basePath: process.env.NODE_ENV == "production" ? "/adimadmin" : "",
//   publicRuntimeConfig:{
//     contextPath: process.env.NODE_ENV == "production" ? "/adimadmin" : "",
//   }
// }

module.exports = nextConfig
