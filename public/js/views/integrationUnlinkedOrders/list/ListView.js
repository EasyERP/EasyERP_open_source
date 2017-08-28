define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/integrationUnlinkedOrders/list/ListHeader.html',
    'views/integrationUnlinkedOrders/list/ListItemView',
    'constants'
], function (Backbone, $, _, listViewBase, listTemplate, ListItemView, CONSTANTS) {
    'use strict';
    var unlinkedListView = listViewBase.extend({
        el          : '#content-holder',
        viewType    : 'list',
        contentType : 'integrationUnlinkedOrders',
        ListItemView: ListItemView,
        filter      : {
            workflow: {
                key  : 'workflow._id',
                value: [CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID]
            }
        },

        events: {
            'click .goToUnlinkedProducts': 'goToUnlinkedProducts'
        },

        goToUnlinkedProducts: function (e) {
            var orderId = $(e.target).closest('tr').attr('data-id');
            var filter = {
                order: {
                    key  : 'fields.order',
                    value: [orderId]
                }
            };
            var href = '#easyErp/unlinkedProducts/filter=' + encodeURIComponent(JSON.stringify(filter));

            Backbone.history.fragment = '';
            Backbone.history.navigate(href, {trigger: true});
        },

        initialize: function (options) {
            this.collection = options.collection;
            this.render();
        },

        render: function () {
            var $currentEl = this.$el;

            $($currentEl).html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append((new ListItemView({collection: this.collection}).render()));
        }
    });

    return unlinkedListView;
});
