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
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            'click .choseType': 'showSelect',
            'click .choseEmployee': 'showSelect',
            //'click .startDate': 'selectStartDate',
            //'click .endDate': 'selectEndDate',
            'click .checkbox': 'checkBonus',
            'click #check_all': 'checkAllBonus',
            'click .startDate': 'showCheckbox',
            'click .endDate': 'showCheckbox'
        },

        showCheckbox: function(e) {
            var target = $(e.target);
            var input = target.find('input[type=checkbox]');

        },

        checkBonus: function () {

        },

        checkAllBonus: function () {

        },

        showSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this, 12);
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },

        showNewSelect: function (e, prev, next) {
            e.stopPropagation();
            populate.showSelect(e, prev, next, this);

            return false;
        },

        chooseOption: function (e) {
            e.preventDefault();
            var target = $(e.target);
            var closestTD = target.closest("td");
            var targetElement = closestTD.length ? closestTD : target.closest("th").find('a');
            var tr = target.closest("tr");
            var id = target.attr("id");
            var attr = targetElement.attr("id") || targetElement.data("content");
            var elementType = '#' + attr;
            var element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });
            var employee;
            var bonus;
            var model = new currentModel();

            if (elementType === '#employee') {
                tr.find('[data-content="employee"]').text(element.name);

                employee = _.clone(model.get('employee'));

                employee._id = element._id;
                employee.name = target.text();
            }

            if (elementType === '#bonus') {
                tr.find('[data-content="bonus"]').text(element.name);

                bonus = _.clone(model.get('bonus'));

                bonus._id = element._id;
                bonus.name = target.text();
            }

            this.hideNewSelect();

            return false;
        },

        hideNewSelect: function () {
            $(".newSelectList").remove();
        },

        addBonus: function (e) {
            e.preventDefault();

            new createView(this.model.toJSON());
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
                self.responseObj['#bonus'] = bonus;
            });

            return this;
        }
    });

    return BonusView;
});