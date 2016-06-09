define(['dataService'], function (dataService) {
    var forEmployeeByWeek = function (year, week, employee, callback, context) {
        dataService.getData('/vacation/', {
            year    : year,
            week    : week,
            employee: employee,
            viewType: 'list'
        }, function (vacations) {
            callback(vacations, context);
        });
    };

    return {
        forEmployeeByWeek: forEmployeeByWeek
    };
});
