define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Projects/projectInfo/salesManagersTemplate.html',
    'common'
], function (Backbone, $, _,     salesManagersTemplate, common) {
    var BonusView = Backbone.View.extend({

        initialize: function (options) {
            this.model = options.model;
            this.responseObj = {};
            this.selectedSalesManagers = [];
        },

        template: _.template(salesManagersTemplate),

        events: {
            'click #removeSalesManager'     : 'removeSalesManager',
            'click .salesManager-checkbox'  : 'checkSalesManager',
            'click #check_all_salesManagers': 'checkAllSalesManagers'
        },

        checkSalesManager: function (e) {
            var self = this;
            var element = e.target;
            var checked = element.checked;
            var salesManagerId = element.value;
            var countCheckbox = $('input.salesManager-checkbox').length;
            var totalCount = $('input.salesManager-checkbox:checked').length;

            if ($(element).hasClass('notRemovable')) {
                $(element).prop('checked', false);

                return false;
            }

            if (checked) {
                self.selectedSalesManagers.push(salesManagerId);
            } else if (this.selectedSalesManagers.length > 1) {
                self.selectedSalesManagers = _.without(self.selectedSalesManagers, salesManagerId);
            }

            if (totalCount === 0) {
                self.selectedSalesManagers = [];
                self.$el.find('#removeSalesManager').hide();
            } else {
                self.$el.find('#removeSalesManager').show();
            }

            if (totalCount > 0 && totalCount === countCheckbox) {
                $('#check_all_salesManagers').prop('checked', true);
            } else {
                $('#check_all_salesManagers').prop('checked', false);
            }
        },

        removeSalesManager: function (e) {
            e.preventDefault();

            var self = this;
            var element;

            self.selectedSalesManagers.forEach(function (salesManager) {
                element = self.$el.find("tr[data-id=" + salesManager + "]");
                element.remove();
            });

            self.selectedSalesManagers = [];
            self.$el.find('#removeSalesManager').hide();
            $('#check_all_salesManagers').prop('checked', false);
            this.rerenderNumbers();
            this.trigger('save');
        },

        rerenderNumbers: function () {
            var tableTr = $('#salesManagersTable').find('tr');

            tableTr.each(function (index) {
                $(this).find('.countNumber').text(index + 1);
            });

        },

        checkAllSalesManagers: function (e) {
            var self = this;
            var element = e.target;
            var checked = element.checked;
            var bonusId;

            if (checked) {
                $('input.salesManager-checkbox:not(.notRemovable)').each(function (key, input) {
                    $(input).prop('checked', true);
                    bonusId = input.value;
                    self.selectedSalesManagers.push(bonusId);
                    self.$el.find('#removeSalesManager').show();
                });
            } else {
                $('input.salesManager-checkbox').each(function (key, input) {
                    self.selectedSalesManagers = [];
                    $(input).prop('checked', false);
                    self.$el.find('#removeSalesManager').hide();
                });
            }
        },

        render: function () {
            var self = this;
            var salesManagers = this.model.get('salesManagers');

            self.$el.html(this.template({
                salesManagers      : salesManagers,
                utcDateToLocaleDate: common.utcDateToLocaleDate
            }));

            self.$el.find('#removeSalesManager').hide();

            return this;
        }
    });

    return BonusView;
});