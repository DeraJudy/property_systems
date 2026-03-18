/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
   domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com"
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
