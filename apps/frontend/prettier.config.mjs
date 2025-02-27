import { PrettierLafConfiguration } from 'prettier-laf-config';

/** @type {import("prettier").Config} */
const config = {
  ...PrettierLafConfiguration,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
