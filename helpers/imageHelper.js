var request = require('request');

module.exports = {
    upload: function (query, formData, doc, callback) {
        'use strict';

        var requestObject = {
            url     : doc.baseUrl + query.uri,
            encoding: 'binary',
            formData: formData
        };

        if (query.oauth) {
            requestObject.oauth = query.oauth;
        }

        if (query.headers) {
            requestObject.headers = query.headers;
        }

        request.post(requestObject, function (err, response) {
            if (err) {
                return callback(err);
            }
            callback(null, response);
        });
    },

    cutPrefixFromBase64: function (image) {
        var mimeType = 'png';


        if (image.indexOf('data:image/jpeg;base64') >= 0) {
            image = image.slice(23);
            mimeType = 'jpeg';
        }

        if (image.indexOf('data:image/png;base64') >= 0) {
            image = image.slice(22);
        }

        return {
            image   : image,
            mimeType: mimeType
        };
    },

    get: function (url, callback) {
        request.get({
            uri     : url,
            encoding: 'binary'
        }, function (err, response, body) {
            var data;

            if (err) {
                return callback(err);
            }

            data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body, 'binary').toString('base64');
            callback(null, data);
        });
    }
};
