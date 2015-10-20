define([
    'text!templates/Payroll/subSalary/list/ListTemplate.html',
        'helpers'
],

function (listTemplate, helpers) {
    var SalaryListItemView = Backbone.View.extend({
        initialize: function(options) {
            this.model = options.model;
        },
        render: function() {
            var result = this.model.toJSON();
            this.$el.append(_.template(listTemplate, { salaryModel: result , currencySplitter: helpers.currencySplitter}));
        }
    });

    return SalaryListItemView;
});
