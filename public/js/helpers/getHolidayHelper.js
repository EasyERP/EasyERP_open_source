define(['dataService'], function (dataService) {
    var byWeek = function (year, week, callback, context) {
        dataService.getData('/holiday/', {
            year    : year,
            week    : week,
            viewType: 'list'
        }, function (holidays) {
            callback(holidays, context);
        });
    };

    return {
        byWeek: byWeek
    };
});
