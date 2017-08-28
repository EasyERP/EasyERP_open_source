define([
    'Backbone',
    'Underscore',
    'views/topBarViewBase',
    'views/Filter/dateFilter',
    'text!templates/warehouseMovements/TopBarTemplate.html',
    'constants',
    'common',
    'custom'
], function (Backbone, _, BaseView, DateFilterView, ContentTopBarTemplate, CONSTANTS, Common, Custom) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.REPORTS,
        contentHeader: 'Warehouse Movements',
        template     : _.template(ContentTopBarTemplate),

        events: {
            'click #top-bar-back': 'goBack',
            'click #exportToPdf' : 'exportToPdf'
        },

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }

            this.specificReport = options.specificReport;

            this.render(options);
        },

        goBack: function () {
            Backbone.history.fragment = '';
            Backbone.history.navigate('easyErp/reports', {trigger: true});
        },

        exportToPdf: function (event) {
            event.preventDefault();

            this.trigger('exportToPdf');
        },

        render: function (options) {
            var self = this;
            var viewType = Custom.getCurrentVT();
            var title = this.contentHeader || this.contentType;
            var collection = this.collection;

            this.startDate = collection.startDate;
            this.endDate = collection.endDate;

            $('title').text(title.toUpperCase());

            if (!options || !options.hide) {
                this.$el.html(this.template({
                    viewType      : viewType,
                    contentType   : this.contentType,
                    headerType    : this.headerType,
                    contentHeader : this.contentHeader,
                    specificReport: this.specificReport
                }));
            } else {
                this.$el.html('');
            }

            this.dateFilterView = new DateFilterView({
                contentType: 'warehouseMovements',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [this.startDate, this.endDate]);

            Common.displayControlBtnsByActionType(this.actionType, viewType);

            return this;
        }
    });

    return TopBarView;
});
