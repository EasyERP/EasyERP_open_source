define([
        'text!templates/Departments/list/ListTemplate.html'
    ],
    function (ListTemplate) {
        var DepartmentsListItemView = Backbone.View.extend({
            el: '#listTable',
            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = options.startNumber;
            },
            render: function () {
                this.$el.append(_.template(ListTemplate, {
                    departmentsCollection: this.collection.toJSON(),
                    startNumber          : this.startNumber
                }));
            },
        });
        return DepartmentsListItemView;
    });
