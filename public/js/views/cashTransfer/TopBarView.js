define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/cashTransfer/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : 'cashTransfer',
        contentHeader: 'Cash Transfer',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
