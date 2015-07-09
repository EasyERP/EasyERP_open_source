define([
    'text!templates/Bonus/BonusTemplate.html',
    'views/Bonus/CreateView',
    'models/BonusModel',
    "dataService",
    'common',
    "populate"

], function (bonusTemplate, createView, currentModel, dataService, common, populate) {
    var BonusView = Backbone.View.extend({

        el: '.bonus-container',

        initialize: function (options) {
            this.model = options.model;
            this.responseObj = {};
            this.selectedBonus = [];
            this.render();
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
            'click .bonus-checkbox': 'checkBonus',
            'click #check_all_bonus': 'checkAllBonus',
            'click .startDate': 'showDatepicker',
            'click .endDate': 'showDatepicker'
        },

        showDatepicker: function (e) {
            var target = $(e.target);
            var dateLabel = target.find('>div');
            var datePicker = target.find('input');

            dateLabel.hide();
            datePicker.show();
        },

        checkBonus: function (e) {
            var self = this;
            var element = e.target;
            var checked = element.checked;
            var bonusId = element.value;
            var countCheckbox = $('#bonusTable input.bonus-checkbox').length;
            var totalCount = $('#bonusTable input.bonus-checkbox:checked').length;

            if (checked) {
                self.selectedBonus.push(bonusId);
            } else if (this.selectedBonus.length > 1) {
                this.selectedBonus = _.without(this.selectedBonus, bonusId);
            }

            if (totalCount === 0) {
                self.selectedBonus = [];
                self.$el.find('#removeBonus').hide();
            } else {
                self.$el.find('#removeBonus').show();
            }

            if (totalCount > 0 && totalCount === countCheckbox) {
                $('#check_all_bonus').prop('checked', true);
            } else {
                $('#check_all_bonus').prop('checked', false);
            }
        },

        checkAllBonus: function (e) {
            var self = this;
            var element = e.target;
            var checked = element.checked;
            var bonusId;

            if (checked) {
                $('#bonusTable input.bonus-checkbox').each(function (key, input) {
                    $(input).prop('checked', true);
                    bonusId = input.value;
                    self.selectedBonus.push(bonusId);
                    self.$el.find('#removeBonus').show();
                });
            } else {
                $('#bonusTable input.bonus-checkbox').each(function (key, input) {
                    self.selectedBonus = [];
                    $(input).prop('checked', false);
                    self.$el.find('#removeBonus').hide();
                });
            }
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
                tr.find('[data-content="employee"]').attr('data-id', element._id);

                employee = _.clone(model.get('employee'));

                employee._id = element._id;
                employee.name = target.text();
            }

            if (elementType === '#bonus') {
                tr.find('[data-content="bonus"]').text(element.name);
                tr.find('[data-content="bonus"]').attr('data-id', element._id);

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

            var self = this;

            self.selectedBonus.forEach(function (bonus) {
                var element = $("#bonusTable").find("tr[data-id=" + bonus + "]");
                element.remove();
            });

            self.selectedBonus = [];
            self.$el.find('#removeBonus').hide();
        },

        setDatepicker: function (name) {
            var self = this;
            var selectedStart = '#' + name + 'StartDate';
            var selectedEnd = '#' + name + 'EndDate';
            var oldValueStart = $(selectedStart).parent('td').find('div').html().trim();
            var oldValueEnd = $(selectedEnd).parent('td').find('div').html().trim();

            $(selectedStart).datepicker({
                dateFormat: "d M, yy",
                changeMonth: true,
                changeYear: true,
                onSelect: function () {
                    var startDate = $(self.$el).find(selectedStart).datepicker('getDate');
                    var parrent = $(selectedStart).parent('td');
                    var value = $(self.$el).find(selectedStart).val();

                    startDate.setDate(startDate.getDate());
                    $(self.$el).find(selectedEnd).datepicker('option', 'minDate', startDate);
                    parrent.find('div').html(value);
                    parrent.find('div').show();
                    $(selectedStart).hide();
                }
            });

            $(selectedEnd).datepicker({
                dateFormat: "d M, yy",
                changeMonth: true,
                changeYear: true,
                onSelect: function () {
                    var endDate = $(self.$el).find(selectedEnd).datepicker('getDate');
                    var parrent = $(selectedEnd).parent('td');
                    var value = $(self.$el).find(selectedEnd).val();

                    endDate.setDate(endDate.getDate());
                    $(self.$el).find(selectedStart).datepicker('option', 'maxDate', endDate);
                    parrent.find('div').html(value);
                    parrent.find('div').show();
                    $(selectedEnd).hide();
                }
            });
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

            bonus.forEach(function (bonus) {
                self.setDatepicker(bonus._id);
            });

            return this;
        }
    });

    return BonusView;
});