define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/monthHours/topBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {

    var topBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.MONTHHOURS,
        contentHeader: 'Cost Center',
        viewType     : null,
        template     : _.template(ContentTopBarTemplate)
    });

    return topBarView;
});
