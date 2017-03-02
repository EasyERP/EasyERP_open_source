define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/settingsOverview/Accounting/rates/RatesList.html',
    'text!templates/settingsOverview/Accounting/rates/tableTemplate.html',
    'views/settingsOverview/Accounting/rates/EditView',
    'views/settingsOverview/Accounting/rates/LoadRatesView',
    'views/settingsOverview/Accounting/rates/CreateView',
    'views/Filter/dateFilter',
    'moment'
], function (Backbone, _, $, RatesList, tableTemplate, EditView, LoadView, CreateView, DateFilterView, moment) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template     : _.template(RatesList),
        tableTemplate: _.template(tableTemplate),
        el           : '#ratesTab',
        initialize   : function (options) {
            var startDate = moment(new Date()).startOf('month');
            var endDate = moment();

            this.startDate = startDate;
            this.endDate = endDate;

            this.startTime = options.startTime;
            this.collection = options.collection;

            this.collection.bind('reset add change remove', this.rerender, this);
        },

        events: {
            'click .goToEdit'   : 'goToEditDialog',
            'click .goToRemove' : 'deleteItem',
            'click #loadRates'  : 'load',
            'click #createRates': 'create',
            'click .toggleList' : 'toggleList'
        },

        load: function () {
            return new LoadView({collection: this.collection, parent: this});
        },

        create: function () {
            return new CreateView({collection: this.collection});
        },

        changeDateRange: function (dateArray) {
            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            this.collection.getFirstPage({
                filter: this.filter
            });
        },

        deleteItem: function (e) {
            var self = this;
            var $tr = $(e.target).closest('tr');
            var id = $tr.attr('data-id');
            var model = this.collection.get(id);
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            if (answer === true && model) {

                model.destroy({
                    success: function (model) {
                        self.$el.find('tr[data-id="' + model.id + '"]').remove();
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            }
        },

        toggleList: function (e) {
            e.preventDefault();
            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);

            e.preventDefault();

            if (model) {
                return new EditView({model: model, collection: this.collection});
            }
        },

        rerender: function () {
            this.$el.find('#rates').html(this.tableTemplate({collection: this.collection.toJSON()}));
        },

        render: function () {
            var self = this;
            this.$el.html(this.template({}));

            this.$el.find('#rates').html(this.tableTemplate({collection: this.collection.toJSON()}));

            this.dateFilterView = new DateFilterView({
                contentType: 'customDashboardCharts',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.changeDateRange(self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [this.startDate, this.endDate]);
        }

    });
    return ContentView;
});

