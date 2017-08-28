var WooCommerce = require('woocommerce-api');

WooCommerce.prototype._normalizeQueryString = function (url) {
    return url;
};

module.exports = WooCommerce;
