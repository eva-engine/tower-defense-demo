const { override, adjustStyleLoaders } = require('customize-cra');

module.exports = {
  webpack: override(
    adjustStyleLoaders(({ use: [ , css] }) => {
      css.options.url = false;
    })
  )
}