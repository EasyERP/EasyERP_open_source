/**
 * Created by Roman on 27.05.2015.
 */
var Connector = require('./connector/');

module.exports = function(options) {
    'use strict';

    return new Connector(options);
};