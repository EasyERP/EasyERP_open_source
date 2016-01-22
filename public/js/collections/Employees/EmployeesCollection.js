define([
        'models/EmployeesModel'
    ],
    function (EmployeeModel) {
        var EmployeesCollection = Backbone.Collection.extend({
            model         : EmployeeModel,
            url           : function () {
                return "/employee";
            },
            initialize    : function () {
                var mid = 39;
                this.fetch({
                    data   : $.param({
                        mid: mid
                    }),
                    type   : 'GET',
                    reset  : true,
                    success: this.fetchSuccess
                });
            },
            filterByLetter: function (letter) {
                var filtered = this.filter(function (data) {
                    return data.get("name").last.toUpperCase().startsWith(letter);
                });
                return new EmployeesCollection(filtered);
            },

            parse: true,

            parse: function (response) {
                return response.data;
            },
        });
        return EmployeesCollection;
    });
