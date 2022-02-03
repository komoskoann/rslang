const ESLintPlugin = require('eslint-webpack-plugin');
const esLintPlugin = [ new ESLintPlugin({ extensions: ['ts', 'js'] }) ];

module.exports = {
  mode: 'production',
  plugins: [...esLintPlugin],
};
