/**
 * Created by Roman on 17.04.2015.
 */
var request = require('request');

module.exports = {
    track: function (body, req, callback) {

        request({
            url: process.env.TRACKER_HOST + '/events',
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json"
            },
            body: body
        }, callback)
            .on('error', function (err) {
                console.error(err)
            });
    }
};