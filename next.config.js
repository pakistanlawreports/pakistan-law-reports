/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/search-all',
        destination: '/',
        permanent: true,
      },
      {
        source: '/resources',
        destination: '/legal-texts',
        permanent: true,
      },
      {
        source: '/trending',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news-digest',
        destination: '/',
        permanent: true,
      },
      {
        source: '/find-cases',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
