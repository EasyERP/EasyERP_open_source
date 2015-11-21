define(function () {
    var getData = function (url, data, callback, context) {
        $.get(url, data, function (response) {
            if (context) {
                callback(response, context);
            } else {
                callback(response);
            }
        }).fail(function (err) {
            callback({error: err});
        });
    };
    var postData = function (url, data, callback) {
        $.ajax({
            url: url,
            data: data,
            type: 'POST',
            success: function (response) {
                callback(null, response)
            },
            error: function (jxhr) {
                callback(jxhr)
            }
        });
    };
    return {
        getData: getData,
        postData: postData
    }
});
