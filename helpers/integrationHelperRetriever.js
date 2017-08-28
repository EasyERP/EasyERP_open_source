module.exports = function (models, event) {
    'use strict';
    var CONSTANTS = require('../constants/mainConstants');
    var magentoHelper = require('./magento')(models, event);
    var shopifyHelper = require('./shopify')(models, event);
    var etsyHelper = require('./etsy')(models, event);
    var wooHelper = require('./wooCommerce')(models, event);

    function getHelper(type) {
        var helper;

        if (type === CONSTANTS.INTEGRATION.MAGENTO) {
            helper = magentoHelper;
        } else if (type === CONSTANTS.INTEGRATION.ETSY) {
            helper = etsyHelper;
        } else if (type === CONSTANTS.INTEGRATION.WOO) {
            helper = wooHelper;
        } else {
            helper = shopifyHelper;
        }

        return helper;
    }

    function getVersion(type) {
        var version;

        if (type === CONSTANTS.INTEGRATION.MAGENTO) {
            version = CONSTANTS.INTEGRATION.V2;
        } else if (type === CONSTANTS.INTEGRATION.ETSY) {
            version = CONSTANTS.INTEGRATION.V2;
        } else {
            version = CONSTANTS.INTEGRATION.V1;
        }

        return version;
    }

    return {
        getHelper : getHelper,
        getVersion: getVersion
    };
};

