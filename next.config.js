const dns = require('dns');

// Configure public DNS servers at process startup for Atlas SRV resolution
try {
  dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (err) {
  // Ignore in environments where setting DNS is restricted
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'files.catbox.moe',
      },
    ],
  },
};

module.exports = nextConfig;
