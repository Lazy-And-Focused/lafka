// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see  https:\\prettier.io\docs\configuration
 * @type { import("prettier").Config }
 */
const config = {
  arrowParens: "always",
  bracketSpacing: true,
  bracketSameLine: false,
  trailingComma: "all",
  singleQuote: true,
  semi: true,
  quoteProps: "as-needed",

  tabWidth: 2,
  useTabs: false,

  printWidth: 80,
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",

  experimentalTernaries: false,

  requirePragma: false,
  insertPragma: false,

  htmlWhitespaceSensitivity: "css",
  jsxSingleQuote: true,

  proseWrap: "always",

  overrides: [
    {
      files: ["*.md", ".mdx"],
      options: {
        printWidth: 70,
      },
    },
  ],
};

export const PrettierLafConfiguration = config;
export default config;
