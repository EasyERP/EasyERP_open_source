define([
    'Underscore',
    'jQuery',
    'views/topBarViewBase',
    'text!templates/wTrack/TopBarTemplate.html',
    'custom',
    'common'
], function (_, $, BaseView, ContentTopBarTemplate, Custom, Common) {
    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : 'tCard', // todo change on COSTANT
        contentHeader: 'Time Card',
        template     : _.template(ContentTopBarTemplate),

        events: {
            'click #top-bar-copyBtn': 'copyRow'
        },

        copyRow: function () {
            this.trigger('copyRow');
        },

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }
            this.render();
        },

        render: function () {
            var viewType = Custom.getCurrentVT();
            $('title').text(this.contentHeader);

            this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

            Common.displayControlBtnsByActionType('Content', viewType);
            this.$el.find('#top-bar-generateBtn').hide();
            this.$el.find('#top-bar-copyBtn').hide();

            return this;
        }
    });

    return TopBarView;
});
