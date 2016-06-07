define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/DividendPayments/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.DIVIDENDPAYMENTS,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
