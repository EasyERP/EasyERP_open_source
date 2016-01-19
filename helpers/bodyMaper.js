var _ = require('lodash');

module.exports = function bodyMap(body) {
    'use strict';

    body = _.mapValues(body, function (val) {
        if (val === '') {
            return null;
        }
        return val;
    });

    return body;
};