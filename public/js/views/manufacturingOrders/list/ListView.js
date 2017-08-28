define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/listViewBase',
    'views/manufacturingOrders/list/ListItemView',
    'views/manufacturingOrders/CreateView',
    'text!templates/manufacturingOrders/list/ListTemplate.html',
    'constants',
    'dataService'
], function (Backbone, _, $, Parent, ListItemView, CreateView, ListTemplate, CONSTANTS, dataService) {
    'use strict';

    var ListView = Parent.extend({
        el           : '#content-holder',
        contentType  : CONSTANTS.MANUFACTURINGORDERS,
        template     : _.template(ListTemplate),
        formUrl      : 'easyErp/manufacturingOrders/tform/',
        ListItemView : ListItemView,
        hasPagination: true,

        events: {
            'click .list tr': 'showItem'
        },

        initialize: function (options) {

            this.collection = options.collection;

            Parent.prototype.initialize.call(this, options);
        },

        createItem: function () {
            return new CreateView({});
        },

        deleteItems: function () {
            var self = this;
            var deleteItems = this.$el.find('.checkbox:checked');
            var data = {};
            var ids = [];

            deleteItems && _.each(deleteItems, function (item) {
                ids.push(item.value);
            });
            data.ids = ids;

            dataService.deleteData(this.contentType, data, function (err, resp) {
                if (err) {
                    return App.render({
                        type   : 'error',
                        message: 'Error on delete'
                    });
                }

                _.each(resp.ids, function (id) {
                    self.$el.find('tr[data-id=' + id + ']').remove();
                });
            });
        },

        render: function (options) {
            this.$el.html(this.template);

            this.$el.append(new ListItemView({collection: this.collection}));

            return this;
        }
    });

    return ListView;
});