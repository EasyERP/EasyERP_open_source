// Filename: communication.js
define([
    'jQuery'
], function ($) {
    var checkLogin = function (callback) {
        var url = '/account/authenticated';
        $.ajax({
            url    : url,
            type   : 'GET',
            cache  : false,
            success: function () {
                return callback(true);
            },
            
            error: function (data) {
                return callback(false);
            }
        });
    };

    return {
        checkLogin: checkLogin
    };
});
