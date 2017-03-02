var mongoose = require('mongoose');
// var OAuth = require('oauth');
var crypto = require('crypto');
var request = require('request');

var Module = function () {
    return function (url, accessToken, method, data,callback) {
        console.log('Export to Magento');

        request({
            url    : url,
            method : method,
            json   : true,
            headers: {
                'content-type': 'application/json',
                Authorization : accessToken
            },

            body: data
        }, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            if (result && result.body && result.body.message) {
                console.log(result.body.message);
            }

            if (result && result.body && result.body.entity_id) {
                console.log(result.body.entity_id + ' ID is created in Magento');
            }

            if (result && result.body && result.body.id) {
                console.log(result.body.id + ' ID is created in Magento');
            }

            if (callback && (typeof callback === 'function')) {
                callback();
            }
        }).on('error', function (err) {
            console.log(err);
            callback();
        });
    };
};

module.exports = Module;
