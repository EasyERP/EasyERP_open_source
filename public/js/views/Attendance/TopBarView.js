/**
 * Created by liliya on 9/10/15.
 */
define([
        'Underscore',
        'views/topBarViewBase',
        'text!templates/Attendance/TopBarTemplate.html',
        'constants',
        'custom'
    ],
    function (_, BaseView, ContentTopBarTemplate, CONSTANTS, Custom) {
        'use strict';

        var TopBarView = BaseView.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.ATTENDANCE,
            template   : _.template(ContentTopBarTemplate),

            initialize: function (options) {
                this.actionType = options.actionType;
                if (this.actionType !== "Content") {
                    Custom.setCurrentVT("form");
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
