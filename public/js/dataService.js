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

    var patchData = function (url, data, contentType, callback) {
        sendData(url, data, 'PATCH', contentType, callback);
    };

    var deleteData = function (url, data, contentType, callback) {
        sendData(url, data, 'DELETE', contentType, callback);
    };


    var sendData = function (url, data, method, contentType, callback) {
        method = method.toUpperCase() || 'POST';
        contentType = contentType ? contentType : false;

        $.ajax({
            url        : url,
            contentType: contentType,
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
