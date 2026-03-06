import { PrettierLafConfiguration } from '@lazy-and-focused/prettier-config';

/** @type {import("prettier").Config} */
const config = {
  ...PrettierLafConfiguration,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
