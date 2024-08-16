//eslint-disable-next-line
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    "eslint:recommended",
    "prettier",
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
  },

  env: {
    node: true,
  },
};
