define([
    'text!templates/Salary/list/ListTemplate.html'
],

function (listTemplate) {
    var SalaryListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = (options.page - 1 ) * options.itemsNumber;
        },
        render: function() {
            this.$el.append(_.template(listTemplate, { salaryCollection: this.collection.toJSON()}));
        }
    });

    return SalaryListItemView;
});
