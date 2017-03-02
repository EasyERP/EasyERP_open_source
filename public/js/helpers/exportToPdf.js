define(['dataService'], function (dataService) {
    "use strict";

    function takeFile(data) {

        dataService.postData('/exportToPdf', data, function (err, data) {
            if (err) {
                return App.render({
                    type   : 'error',
                    message: err.message
                });
            }
            window.location.assign('/exportToPdf?name=' + data.name);
        });
    }

    function takeToInput(data, cb) {

        dataService.postData('/exportToPdf', data, function (err, data) {
            if (err) {
                return App.render({
                    type   : 'error',
                    message: err.message
                });
            }
            cb(data);
        });

    }

    return {
        takeFile   : takeFile,
        takeToInput: takeToInput
    }

});