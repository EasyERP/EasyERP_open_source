define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/settingsEmployee/TopBarTemplate.html',
    'constants'
], function (Backbone, $, _, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = Backbone.View.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.SETTINGSEMPLOYEE,
        template   : _.template(ContentTopBarTemplate),

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
