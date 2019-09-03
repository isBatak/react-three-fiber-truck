const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules');

module.exports = withPlugins([
  [
    withTM,
    {
      transpileModules: ['three'],
    },
  ],
]);
