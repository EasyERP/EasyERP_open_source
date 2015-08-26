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
            var result = this.collection.toJSON();
            /*result.forEach(function(element){
                element.calc.salary = Number(element.calc.salary).toLocaleString('en');
                element.calc.onCash = Number(element.calc.onCash).toLocaleString('en');
                element.calc.onCard = Number(element.calc.onCard).toLocaleString('en');
                element.paid.onCash = Number(element.paid.onCash).toLocaleString('en');
                element.paid.onCard = Number(element.paid.onCard).toLocaleString('en');
                element.diff.onCash = Number(element.diff.onCash).toLocaleString('en');
                element.diff.onCard = Number(element.diff.onCard).toLocaleString('en');
            });*/

            this.$el.append(_.template(listTemplate, { salaryCollection: result }));
        }
    });

    return SalaryListItemView;
});
