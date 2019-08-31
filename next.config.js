const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules');

module.exports = withPlugins(
  [
    [
      withTM,
      {
        transpileModules: ['three'],
      },
    ],
  ],
  {
    webpack(config) {
      config.module.rules.push({
        test: /\.gl(tf|b)$/,
        use: [`url-loader`],
      });
      return config;
    },
  }
);
