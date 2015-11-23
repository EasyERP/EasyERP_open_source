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
        sendData(url, data, 'POST', callback);
    };

    var putData = function (url, data, callback) {
        sendData(url, data, 'PUT', callback);
    };

    var patchData = function (url, data, callback) {
        sendData(url, data, 'PATCH', callback);
    };

    var deleteData = function (url, data, callback) {
        sendData(url, data, 'DELETE', callback);
    };


    var sendData = function (url, data, method, callback) {
        method = method.toUpperCase() || 'POST';
        $.ajax({
            url        : url,
            contentType: 'application/json',
            data       : data,
            type       : method,
            success    : function (response) {
                callback(null, response)
            },
            error      : function (jxhr) {
                callback(jxhr)
            }
        });
    };
    return {
        getData   : getData,
        postData  : postData,
        putData   : putData,
        patchData : patchData,
        deleteData: deleteData
    }
});
