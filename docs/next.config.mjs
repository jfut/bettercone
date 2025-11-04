import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  
  // Optimize memory usage
  experimental: {
    // Reduce worker threads to use less memory
    workerThreads: false,
    cpus: 1,
  },
  
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default withMDX(config);
