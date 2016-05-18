define(['dataService'], function (dataService) {
    var byWeek = function (year, week, callback, context) {
        dataService.getData("/holiday/list", {
            "year"       : year,
            "week"       : week
        }, function (holidays) {
            callback(holidays, context);
        });
    };

    return {
        byWeek: byWeek
    };
});