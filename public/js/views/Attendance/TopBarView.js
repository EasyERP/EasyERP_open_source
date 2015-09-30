/**
 * Created by liliya on 9/10/15.
 */
define([
        'text!templates/Attendance/TopBarTemplate.html',
        'constants'
    ],
    function (ContentTopBarTemplate, CONSTANTS) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: CONSTANTS.ATTENDANCE,
            template: _.template(ContentTopBarTemplate),

            initialize: function () {
                this.render();
            },

            render: function () {
                this.$el.html(this.template({contentType: this.contentType}));
                return this;
            }

        });

        return TopBarView;
    });
