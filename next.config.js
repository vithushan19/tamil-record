/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,

  images: {
    // Only keep domains you still actually fetch from.
    // cdn.sanity.io is gone; res.cloudinary.com only if you use it elsewhere.
    domains: ['res.cloudinary.com'],

    // Needed only if you render the SVG story covers with <Image>.
    // Remove this block if you switch the covers to plain <img>.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};