/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "domcarlitobbq.com.br",
          },
        ],
        destination: "/digital/domcarlito",
        permanent: true,
      },
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "www.domcarlitobbq.com.br",
          },
        ],
        destination: "/digital/domcarlito",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
