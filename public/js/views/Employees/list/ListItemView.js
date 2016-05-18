define([
        'text!templates/Employees/list/ListTemplate.html'
    ],

    function (EmployeesListTemplate) {
        var EmployeesListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.page = options.page ? parseInt(options.page, 10) : 1;
                this.startNumber = (this.page - 1) * options.itemsNumber; //Counting the start index of list items
            },
            render    : function () {
                this.$el.append(_.template(EmployeesListTemplate, {
                    employeesCollection: this.collection.toJSON(),
                    startNumber        : this.startNumber
                }));
            }
        });

        return EmployeesListItemView;
    });
