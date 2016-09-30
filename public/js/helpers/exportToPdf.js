define(['dataService'], function(dataService){
    "use strict";

    return  function (data) {

        dataService.postData('/exportToPdf', data, function(err, data){
            if (err){
                return App.render({
                    type   : 'error',
                    message: err.message
                });
            }
            window.location.assign('/exportToPdf?name='+ data.name);
        });
    }
});