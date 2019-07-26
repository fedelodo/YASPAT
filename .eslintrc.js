module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-trailing-spaces' : 0,
    'no-multi-assign': 0,
    'indent' : 0,
    'no-nested-ternary' : 0,
    'no-undef' : 0,
    'no-confusing-arrow' : 0,
    'arrow-parens': 0,
    'allowShortCircuit': true,
    'allowTernary': true,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  settings:{
    'import/core-modules': ['electron']
  }
 
}
