var Connector = require('./connector/');

module.exports = function(options) {
    'use strict';

    return new Connector(options);
};