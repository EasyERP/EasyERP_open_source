define([
    'text!templates/Salary/subSalary/list/ListTemplate.html'
],

function (listTemplate) {
    var SalaryListItemView = Backbone.View.extend({
        initialize: function(options) {
            this.model = options.model;
        },
        render: function() {
            var result = this.model.toJSON();
            this.$el.append(_.template(listTemplate, { salaryModel: result }));
        }
    });

    return SalaryListItemView;
});
