define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Products/form/PublishList/ListHeader.html',
    'views/Products/form/PublishList/ListItemView',
    'views/Products/publishProductView',
    'views/selectView/selectView',
    'collections/integrations/filterCollection',
    'dataService'
], function (Backbone,
             $,
             _,
             listViewBase,
             listTemplate,
             ListItemView,
             PublishProductView,
             SelectView,
             ChannelCollection,
             dataService) {
    'use strict';

    var ListView = listViewBase.extend({
        el          : '#publishTable',
        listTemplate: listTemplate,
        ListItemView: ListItemView,

        events: {
            'click .publish'  : 'publish',
            'click .unpublish': 'unpublishProduct'
        },

        initialize: function (options) {
            this.product = options.product;
            this.collection = new ChannelCollection({});
            this.eventsChannel = App.eventsChannel || _.extend({}, Backbone.Events);

            this.listenTo(this.eventsChannel, 'closeDialog', this.closeDialog);
            this.listenTo(this.eventsChannel, 'singlePublish', this.publishProduct);

            this.listenTo(this.collection, 'reset', this.render);
        },

        publish: function (e) {
            var $target = $(e.target);
            var channelId = $target.closest('tr').attr('id');
            var channelObj = this.collection.get(channelId).toJSON();

            if (channelObj.type === 'shopify' && this.product.variants[0] && this.product.variants[0].length > 3) {
                return App.render({
                    message: 'You can\'t publish the variant with count of options greater than 3 to Shopify'
                });
            }

            this.$dialog = new PublishProductView({
                action       : 'singlePublish',
                channel      : channelObj,
                eventsChannel: this.eventsChannel
            }).$el;
        },

        closeDialog: function () {
            this.$dialog && this.$dialog.remove();
        },

        publishProduct: function (options) {
            options.products = [this.product._id];

            this.makeTheAction(options, 'published', dataService.postData);
        },

        unpublishProduct: function (e) {
            var $target = $(e.target);
            var channel = $target.closest('tr').attr('id');
            var data = {
                products: [this.product._id],
                channel : channel
            };

            this.makeTheAction(data, 'unpublished', dataService.patchData);
        },

        makeTheAction: function (data, status, sendRequest) {
            var urlHash = window.location.hash;

            sendRequest('/products/channelLinks', data, function (err) {
                if (err) {
                    return this.errorNotification(err);
                }

                App.render({
                    type   : 'notify',
                    message: 'Successfully ' + status
                });

                Backbone.history.fragment = '';
                Backbone.history.navigate(urlHash, {trigger: true});
            });
        },

        render: function () {
            var $currentEl;
            var itemView;

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));

            itemView = new this.ListItemView({
                collection: this.collection,
                product   : this.product
            });

            // this.$dialog = itemView;

            $currentEl.append(itemView.render());
        }
    });

    return ListView;
});
