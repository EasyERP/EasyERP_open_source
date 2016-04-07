define(['dataService'], function (dataService) {
    var forEmployeeByWeek = function (year, week, employee, callback, context) {
        dataService.getData("/vacation/list", {
            "year"       : year,
            "week"       : week,
            "employee"   : employee
        }, function (vacations) {
            callback(vacations, context);
        });
    };

    return {
        forEmployeeByWeek: forEmployeeByWeek
    };
});