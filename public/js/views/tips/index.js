define([
    'Backbone',
    'jQuery',
    'Underscore',
    'constants/tipsInfo'
], function (Backbone, $, _, TIPSINFO) {

    var TipView = Backbone.View.extend({
        className: 'newTip',

        initialize: function (options) {
            var contentTips;
            var message;

            this.id = options.id;
            this.contentType = options.contentType;

            contentTips = TIPSINFO[this.contentType];
            message = contentTips ? contentTips[this.id] : null;

            if (message) {
                this.render(message);
            }
        },

        events: {},

        render: function (opts) {

            this.$el.html(opts);

            return this;
        }
    });

    return TipView;
});
