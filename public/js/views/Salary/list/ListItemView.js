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
        toCurrency: function(value) {
            var currency;
            currency = parseFloat(value)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return currency;
        },
        render: function() {
            var self = this;
            var result = this.collection.toJSON();
            /*result.forEach(function(element){
                element.calc.salary = self.toCurrency(element.calc.salary);
                element.calc.onCash = self.toCurrency(element.calc.onCash);
                element.calc.onCard = self.toCurrency(element.calc.onCard);
                element.paid.onCash = self.toCurrency(element.paid.onCash);
                element.paid.onCard = self.toCurrency(element.paid.onCard);
                element.diff.onCash = self.toCurrency(element.diff.onCash);
                element.diff.onCard = self.toCurrency(element.diff.onCard);
            });*/

            this.$el.append(_.template(listTemplate, { salaryCollection: result }));
        }
    });

    return SalaryListItemView;
});
