/**
 * Created by liliy on 28.12.2015.
 */
define([
        "text!templates/selectView/selectTemplate.html"
    ],
    function (selectTemplate) {
        var selectView = Backbone.View.extend({
            el      : "#content-holder",
            template: _.template(selectTemplate),

            initialize: function (options) {

            },

            render: function () {

                return this;
            }

        });

        return selectView;
    });