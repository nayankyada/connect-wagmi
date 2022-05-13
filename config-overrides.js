// https://github.com/solana-labs/wallet-adapter/issues/265#issuecomment-1025285873
module.exports = function override(webpackConfig) {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });
  return webpackConfig;
};