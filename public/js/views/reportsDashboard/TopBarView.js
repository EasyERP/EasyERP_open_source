define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/reportsDashboard/TopBarTemplate.html',
    'custom',
    'common'
], function ($, _, BaseView, TopBarTemplate, Custom, Common) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'Dashboard',
        actionType : null, // Content, Edit, Create
        template   : _.template(TopBarTemplate),

        getIdFromHash: function (hash) {
            var hashItems = hash.split('/');
            return hashItems[hashItems.length - 1];
        }

       /* initialize: function (options) {
            this.actionType = options.actionType;
            this.render();
        },

        render: function () {
            $('title').text(this.contentType);
            this.$el.html(this.template({contentType: this.contentType}));
            Common.displayControlBtnsByActionType(this.actionType);

            return this;
        }*/
    });

    return TopBarView;
});
