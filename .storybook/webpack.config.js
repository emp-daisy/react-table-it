const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });
  // config.resolve.modules.push(path.resolve(__dirname, "../fixtures"));
  config.resolve.modules.push(path.resolve(__dirname, "../fixtures"));
	config.resolve.extensions.push('.ts', '.tsx');
  return config;
};