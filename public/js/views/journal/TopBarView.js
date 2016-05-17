define([
        'Underscore',
        'views/topBarViewBase',
        'text!templates/journal/TopBarTemplate.html',
        'custom',
        'constants'
    ],
    function (_, BaseView, ContentTopBarTemplate, Custom, CONSTANTS) {
        'use strict';

        var TopBarView = BaseView.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.JOURNAL,
            template   : _.template(ContentTopBarTemplate),

            initialize: function (options) {
                if (options.collection) {
                    this.collection = options.collection;
                }
                this.render();
            }
        });

        return TopBarView;
    });
