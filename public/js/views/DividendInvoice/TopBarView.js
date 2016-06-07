define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/DividendInvoice/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.DIVIDENDINVOICE,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
