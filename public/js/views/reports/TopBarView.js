define([
    'Backbone',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/reports/TopBarTemplate.html',
    'constants',
    'common',
    'custom'
], function (Backbone, _, BaseView, ContentTopBarTemplate, CONSTANTS, Common, Custom) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.REPORTS,
        contentHeader: 'Reports',
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
            var viewType = Custom.getCurrentVT();
            var title = this.contentHeader || this.contentType;

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

            Common.displayControlBtnsByActionType(this.actionType, viewType);

            return this;
        }
    });

    return TopBarView;
});
