define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/ExpensesInvoice/TopBarTemplate.html',
    'custom',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.EXPENSESINVOICE,
        contentHeader: 'Expenses',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
