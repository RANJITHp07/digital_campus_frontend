/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  images: {
    domains: ["firebasestorage.googleapis.com","cdnjs.cloudflare.com",'www.canva.com','images.pexels.com','cdn.elearningindustry.com','i.pngimg.me'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    });

    return config;
  },
};
