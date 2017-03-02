'use strict';

var request = require('request');
var _ = require('lodash');

function optCallbackValidator(options, callback) {
    var optType = typeof options;

    if (optType !== 'object') {
        if (optType === 'function') {
            callback = options;
            options = Object.create(null);
        } else {
            options = Object.create(null);
            callback = function () {
            }
        }
    }

    return {
        options : options,
        callback: callback
    };
}

function sendData(url, method, data, options, callback) {
    var _headers = {
        'content-type': 'application/json'
    };
    var headers;
    var auth;

    data = data || Object.create(null);
    options = options || {};
    method = method || 'GET';
    headers = options.headers;
    auth = options.auth;

    if (headers) {
        _headers = _.assign(_headers, headers);
    }

    if (typeof callback !== 'function') {
        callback = function () {
        };
    }

    request({
        url    : url,
        method : method,
        json   : true,
        auth   : auth,
        headers: _headers,
        body   : data
    }, callback);
}

function getData(url, options, callback) {
    var opts = optCallbackValidator(options, callback);

    sendData(url, 'GET', null, opts.options, opts.callback);
}

function putData(url, data, options, callback) {
    var opts = optCallbackValidator(options, callback);

    sendData(url, 'PUT', data, opts.options, opts.callback);
}

function postData(url, data, options, callback) {
    var opts = optCallbackValidator(options, callback);

    sendData(url, 'POST', data, opts.options, opts.callback);
}

function removeData(url, data, options, callback) {
    var opts = optCallbackValidator(options, callback);

    sendData(url, 'DELETE', data, opts.options, opts.callback);
}

exports.track = function (body, req, callback) {
    var url = process.env.TRACKER_HOST + '/events';

    postData(url, body, callback);
};

exports.getData = getData;
exports.postData = postData;
exports.putData = putData;
exports.removeData = removeData;



