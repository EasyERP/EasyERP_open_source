define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'views/Products/publishProductView',
    'text!templates/Products/form/ContentTemplate.html',
    'text!templates/Products/form/ListItemTemplate.html',
    'models/ProductModel',
    'views/Products/form/FormView',
    'views/Products/CreateView',
    'views/Products/list/ListItemView',
    'views/Filter/filterView',
    'dataService',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, PublishProductView, ContentTemplate, ListItemTemplate, ProductModel, FormView, CreateView, ListItemView, FilterView, dataService, common, CONSTANTS) {
    'use strict';

    var ProductsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/Products/list/',
        contentType    : CONSTANTS.PRODUCTS, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        groupId        : null,
        ContentModel   : ProductModel,
        FormView       : FormView,

        configureChannel: function (action) {
            this.eventsChannel = App.eventsChannel || _.extend({}, Backbone.Events);

            this.listenTo(this.eventsChannel, 'closeDialog', this.closeDialog);
            this.listenTo(this.eventsChannel, 'filterPublishedOrUnpublished', this.filterPublishedOrUnpublished);

            this.$dialog = new PublishProductView({
                action       : action,
                eventsChannel: this.eventsChannel
            }).$el;
        },

        closeDialog: function () {
            this.$dialog.remove();
        },

        getChannelData: function (isPublishAction) {
            var $currentEl = this.$el;
            var $checked = $currentEl.find('#listContent input.checkbox:checked');
            var products = [];
            var data;
            var collection = this.collection;
            var channelType = this.channelType;
            var error;

            $.each($checked, function () {
                var $el = $(this);
                var val = $el.val();
                var variant = collection.get(val);

                if (variant.get('variants').length > 3 && channelType === 'shopify' && isPublishAction) {
                    error = true;

                    return;
                }

                products.push(val);
            });

            if (error) {
                return null;
            }

            data = {
                products: products,
                channel : this.channel
            };

            if (this.priceList) {
                data.priceList = this.priceList;
            }

            if (this.shippingTemplate) {
                data.shippingTemplate = this.shippingTemplate;
            }

            return data;
        },

        filterPublishedOrUnpublished: function (data) {
            var action = data.action;
            var channelType = data.channelType;
            var channelName = data.channelName;
            var filter = {
                channelLinks: {
                    key  : 'channelLinks.channel',
                    value: [data.channel],
                    type : action
                },

                groupId  : this.groupId,
                productId: this.productId,
                toExpand : true
            };

            App.publishProductState = action;
            App.filtersObject.filter = this.filter;

            this.collection.getFirstPage({
                filter  : filter,
                viewType: 'list'
            });

            $('#top-bar-publishBtn').hide();
            $('#top-bar-unpublishBtn').hide();
            $('#top-bar-unlinkBtn').hide();

            if (channelType && channelName) {
                $('#channelStatus span').text(channelName);
                $('#channelStatus div').addClass(channelType);
            }

            this.$dialog.remove();
            this.priceList = data.priceList;
            this.channel = data.channel || this.channel;
            this.channelType = channelType;
            this.shippingTemplate = data.shippingTemplate;
        },

        makeTheAction: function (url, status, sendRequest) {
            var self = this;
            var isPublishAction = status === 'published';
            var data = this.getChannelData(isPublishAction);
            var urlHash;

            if (!data) {
                return App.render({
                    message: 'You can\'t publish the variant with count of options greater than 3 to Shopify'
                });
            }

            sendRequest(url, data, function (err) {
                if (err) {
                    return self.errorNotification(err);
                }

                App.render({
                    type   : 'notify',
                    message: 'Successfully ' + status
                });

                $('#channelStatus span').text('');
                $('#channelStatus div').attr('class', 'channelImg');

                if (self.productId) {
                    urlHash = '#easyErp/Products/tform/' + self.productId + '/p=1/c=50';
                } else {
                    urlHash = '#easyErp/Products/list/p=1/c=50';
                }

                App.publishProductState = null;
                Backbone.history.fragment = '';
                Backbone.history.navigate(urlHash, {trigger: true});
            });
        },

        publish: function () {
            this.makeTheAction('/products/channelLinks', 'published', dataService.postData);
        },

        unpublish: function () {
            this.makeTheAction('/products/channelLinks', 'unpublished', dataService.patchData);
        },

        renderList: function (products) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');
            var _id = window.location.hash.split('/')[3];
            var currentProduct = _.find(products, function (el) {
                return _id === el._id;
            });

            this.groupId = currentProduct && currentProduct.groupId;
            this.productId = _id;

            $('#top-bar-back').hide();

            $listHolder.append(this.listTemplate({
                products: products
            }));
        }
    });

    return ProductsListView;
});
