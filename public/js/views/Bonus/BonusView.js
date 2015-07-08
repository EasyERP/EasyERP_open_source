define([
    'text!templates/Bonus/BonusTemplate.html',
    'views/Bonus/CreateView',
    'models/BonusModel',
    "dataService",
    'common',
    "populate"

], function (bonusTemplate, createView, currentModel, dataService, common, populate) {
    var BonusView = Backbone.View.extend({

        initialize: function (options) {
            this.model = options.model;
            this.responseObj = {};
        },

        template: _.template(bonusTemplate),

        events: {
            'click #createBonus': 'addBonus',
            'click #removeBonus': 'removeBonus',
            'click .newSelectList': 'showSelect',
            'click .startDate': 'selectStartDate',
            'click .endDate': 'selectEndDate',
            'click .checkbox': 'checkBonus',
            'click #check_all': 'checkAllBonus'
        },

        checkBonus: function () {

        },

        checkAllBonus: function () {

        },

        showSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this, 12);
        },

        addBonus: function (e) {
            e.preventDefault();

            var model = new currentModel();

            new createView(model.toJSON());

            //if (!this.isNewRow()) {
            //    this.showSaveCancelBtns();
            //    this.editCollection.add(model);
            //
            //    new createView();
            //}
        },

        removeBonus: function (e) {
            e.preventDefault();
        },

        render: function () {
            var self = this;
            var bonus = this.model.get('bonus'); //ToDo

            this.$el.html(this.template({bonus: bonus}));

            this.$el.find('#removeBonus').hide();

            dataService.getData("/employee/getForDD", null, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee
                });

                self.responseObj['#employee'] = employees;
            });

            dataService.getData("/bonusType/list", null, function (bonus) {
                var bonusList = _.map(bonus, function (item) {
                    var newItem = {
                        id: item._id,
                        name: item.name
                    };

                    return newItem;
                });

                self.responseObj['#bonusType'] = bonusList;
            });

            return this;
        }
    });

    return BonusView;
});