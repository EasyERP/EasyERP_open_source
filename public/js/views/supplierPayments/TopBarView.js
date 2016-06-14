define([
    'Underscore',
    'text!templates/supplierPayments/TopBarTemplate.html',
    'views/topBarViewBase',
    'custom',
    'common',
    'constants'
], function (_, ContentTopBarTemplate, BaseView, Custom, Common, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.SUPPLIERPAYMENTS,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
