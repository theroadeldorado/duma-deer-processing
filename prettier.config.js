// https://prettier.io/docs/en/options.html

module.exports = {
  printWidth: 150,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: "es5",
  useTabs: false,
  arrowParens: "always",
  bracketSpacing: true,
  semi: true,
  jsxBracketSameLine: false,
  jsxSingleQuote: true,
  plugins: [require("prettier-plugin-tailwindcss")],
};
