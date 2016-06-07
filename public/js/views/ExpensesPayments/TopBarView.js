define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/ExpensesPayments/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.EXPENSESPAYMENTS,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
