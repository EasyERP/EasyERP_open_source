/**
 * Created by Roman on 14.05.2015.
 */
var _ = require('lodash');

module.exports = function bodyMap(body) {
    body = _.mapValues(body, function (val) {
        if (val === '') {
            return null;
        }
        return val;
    });

    return body;
};