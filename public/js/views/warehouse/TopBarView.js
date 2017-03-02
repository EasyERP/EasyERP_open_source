define([
    'Underscore',
    'jQuery',
    'views/topBarViewBase',
    'text!templates/warehouse/TopBarTemplate.html',
    'constants'
], function (_, $, BaseView, TopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.WAREHOUSE,
        contentHeader: 'Warehouse',
        actionType   : null, // Content, Edit, Create
        template     : _.template(TopBarTemplate),

        getIdFromHash: function (hash) {
            var hashItems = hash.split('/');
            return hashItems[hashItems.length - 1];
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            $('title').text(this.contentHeader);
            this.$el.html(this.template({contentType: this.contentType}));

            this.$el.find('#top-bar-saveBtn').hide();
            this.$el.find('#top-bar-deleteBtn').hide();

            return this;
        }
    });

    return TopBarView;
});
