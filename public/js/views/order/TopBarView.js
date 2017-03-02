define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/order/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.ORDERS,
        template   : _.template(ContentTopBarTemplate),
        events     : {
            'click #magentoExport' : 'magentoOrdersExport',
            'click #magentoImport' : 'magentoOrdersImport'
        },
        magentoOrdersExport: function (event) {
            event.preventDefault();
            this.trigger('exportToMagento');
        },

        magentoOrdersImport: function (event) {
            event.preventDefault();
            this.trigger('importFromMagento');
        }
    });

    return TopBarView;
});
