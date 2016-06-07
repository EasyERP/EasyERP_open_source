define([
    'underscore',
    'text!templates/supplierPayments/TopBarTemplate.html',
    'views/topBarViewBase',
    'custom',
    'common',
    'constants'
], function (_, ContentTopBarTemplate, BaseView, Custom, Common, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.SUPPLIERPAYMENTS,
        template   : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            this.actionType = options.actionType;

            if (this.actionType !== 'Content') {
                Custom.setCurrentVT('form');
            }

            if (options.collection) {
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
            }

            this.render();
        }
    });

    return TopBarView;
});
