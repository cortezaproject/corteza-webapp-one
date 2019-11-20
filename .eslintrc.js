module.exports = {
  root: false,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard',
  ],
  rules: {
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/no-v-html': 'off',
    // @todo remove this asap - add enough tests first
    'vue/name-property-casing': 'off',
    'vue/prop-name-casing': 'off',

    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'always-multiline'],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
