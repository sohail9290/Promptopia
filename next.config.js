/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // ✅ Temporary: Disable Strict Mode to avoid extra re-renders
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ["mongoose"],
        reactRefresh: false, // ✅ Temporary: Disable Fast Refresh if needed
    },
    images: {
        domains: ["lh3.googleusercontent.com"], // ✅ Ensure Google profile images load properly
    },
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true, // ✅ Allows top-level await in Webpack
        };
        return config;
    },
};

module.exports = nextConfig; // ✅ Correctly exporting only once
