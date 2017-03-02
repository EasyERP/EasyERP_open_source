define([
    'Underscore',
    'views/topBarViewBase',
    'jQuery',
    'text!templates/Workflows/TopBarTemplate.html',
    'custom',
    'common'
], function (_, BaseView, $, ContentTopBarTemplate, Custom, Common) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'Workflows',
        actionType : null, // Content, Edit, Create
        template   : _.template(ContentTopBarTemplate),

        events: {
            'click a.changeContentView'    : 'changeContentViewType',
            'click ul.changeContentIndex a': 'changeItemIndex',
            'click #top-bar-discardBtn'    : 'discardEvent',
            'click #top-bar-editBtn'       : 'editEvent',
            'click #top-bar-createBtn'     : 'createEvent'
        },

        changeContentViewType: Custom.changeContentViewType,

        changeItemIndex: Custom.changeItemIndex,

        initialize: function (options) {
            this.actionType = options.actionType;
            this.render();
        },

        render: function () {
            var $thisEl = this.$el;

            $('title').text(this.contentType);
            $thisEl.html(this.template({contentType: this.contentType}));
            Common.displayControlBtnsByActionType(this.actionType);

            return this;
        }
    });

    return TopBarView;
});
