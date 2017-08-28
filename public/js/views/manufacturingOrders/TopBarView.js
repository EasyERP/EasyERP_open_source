define(['Backbone',
    'Underscore',
    'jQuery',
    'views/topBarViewBase',
    'text!templates/manufacturingOrders/TopBarTemplate.html',
    'constants'
], function (Backbone, _, $, Parent, TopBarTemplate, CONSTANTS) {


    'use strict';

    var TopBarView = Parent.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.MANUFACTURINGORDERS,
        template   : _.template(TopBarTemplate)
    });

    return TopBarView;
});