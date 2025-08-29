import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev, // PWA só em produção
})(
  /** @type {import('next').NextConfig} */ {
    reactStrictMode: true,
  }
);
