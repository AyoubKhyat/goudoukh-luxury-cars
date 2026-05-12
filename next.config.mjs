/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3'],
};

export default nextConfig;
