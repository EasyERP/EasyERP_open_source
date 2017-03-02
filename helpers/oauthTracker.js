var historyMapper = require('../constants/historyMapper');
var OAuth = require('oauth');
var CONSTANTS = require('../constants/mainConstants.js');

module.exports = function () {
    'use strict';

    var oauth = new OAuth.OAuth(
        'https://openapi.etsy.com/v2/oauth/request_token?scope=email_r%20listings_r%20listings_w%20listings_d%20transactions_r%20transactions_w%20treasury_r%20billing_r',
        'https://openapi.etsy.com/v2/oauth/access_token',
        CONSTANTS.INTEGRATION.ETSY_API_KEY,
        CONSTANTS.INTEGRATION.ETSY_SHARED_SECRET,
        '1.0A',
        CONSTANTS.INTEGRATION.REMOTE_ADDRESS,
        'HMAC-SHA1',
        null
    );

    return new function () {

        this._oauth = function () {
            return oauth;
        };

        this.get = function (query, options, callback) {
            var uri = query.uri;
            var url;
            var inShop = query.shop;

            if (inShop) {
                url = options.baseUrl + '/shops/' + options.username + uri;
            } else {
                url = options.baseUrl + uri;
            }

            oauth.get(url, options.token, options.secret, function (err, response) {
                if (err) {
                    return callback(err);
                }

                if (response) {
                    response = JSON.parse(response);
                }

                callback(null, response);
            });
        };

        this.post = function (query, body, options, callback) {
            var uri = query.uri;
            var url;
            var inShop = query.shop;

            if (inShop) {
                url = options.baseUrl + '/shops/' + options.username + uri;
            } else {
                url = options.baseUrl + uri;
            }

            oauth.post(url, options.token, options.secret, body, function (err, response) {
                if (err) {
                    return callback(err);
                }

                if (response) {
                    response = JSON.parse(response);
                }

                callback(null, response);
            });
        };

        this.put = function (query, body, options, callback) {
            var uri = query.uri;
            var url = options.baseUrl + uri;

            oauth.put(url, options.token, options.secret, body, function (err, response) {
                if (err) {
                    return callback(err);
                }

                if (response) {
                    response = JSON.parse(response);
                }

                callback(null, response);
            });
        };

        this.delete = function (query, options, callback) {
            var id = query.id;
            var uri = options.uri;
            var url = options.baseUrl + uri + id;

            console.log(url, options.token, options.secret);

            oauth.delete(url, options.token, options.secret, function (err, response) {
                console.log(err, response);

                if (err) {
                    return callback(err);
                }

                if (response) {
                    response = JSON.parse(response);
                }

                callback(null, response);
            });
        };

    };
};
