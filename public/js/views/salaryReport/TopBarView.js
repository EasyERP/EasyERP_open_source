/**
 * Created by liliy on 20.01.2016.
 */
"use strict";
define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/salaryReport/TopBarTemplate.html',
        'custom',
        'constants'
    ],
    function (Backbone, $, _, ContentTopBarTemplate, Custom, CONSTANTS) {
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.SALARYREPORT,
            template   : _.template(ContentTopBarTemplate),

            initialize: function (options) {
                if (options.collection) {
                    this.collection = options.collection;
                }
                this.render();
            },

            render: function () {
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

                return this;
            }
        });

        return TopBarView;
    });
