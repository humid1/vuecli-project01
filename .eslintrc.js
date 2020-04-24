module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential'
    // '@vue/standard' // eslint语法校验插件
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
