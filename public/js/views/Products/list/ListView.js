define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Products/list/ListHeader.html',
    'views/Products/CreateView',
    'views/Products/list/ListItemView',
    'views/Products/EditView',
    'views/Products/publishProductView',
    'models/ProductModel',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'collections/Products/filterCollection',
    'views/guideTours/guideNotificationView',
    'dataService',
    'common',
    'constants',
    'helpers'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, EditView, PublishProductView, ProductModel, aphabeticTemplate, contentCollection, GuideNotify, dataService, common, CONSTANTS, helpers) {
    var ProductsListView = ListViewBase.extend({
        CreateView       : CreateView,
        EditView         : EditView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        page             : null, // if reload page, and in url is valid page
        contentType      : 'Products', // needs in view.prototype.changeLocationHash
        exportToXlsxUrl  : '/Products/exportToXlsx',
        exportToCsvUrl   : '/Products/exportToCsv',
        hasPagination    : true,

        initialize: function (options) {
            this.eventsChannel = App.eventsChannel || _.extend({}, Backbone.Events);

            this.listenTo(this.eventsChannel, 'closeDialog', this.closeDialog);
            this.listenTo(this.eventsChannel, 'filterPublishedOrUnpublished', this.filterPublishedOrUnpublished);

            this.mId = CONSTANTS.MID[this.contentType];
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.formUrl = '#easyErp/' + this.contentType + '/tform/';
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;

            this.productId = this.filter && this.filter.productId ? this.filter.productId : null;
            this.toExpand = this.filter && this.filter.toExpand ? this.filter.toExpand : null;
            this.channel = this.filter && this.filter.channelLinks && this.filter.channelLinks.value.length && this.filter.channelLinks.value[0] ? this.filter.channelLinks.value[0] : null;

            if (this.filter) {
                delete this.filter.productId;
                delete this.filter.toExpand;
                delete this.filter.groupId;
            }

            ListViewBase.prototype.initialize.call(this, options);

            this.contentCollection = contentCollection;

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },

        events: {
            'click .list td:not(.notForm)': 'goToForm',
            'click .letter:not(.empty)'   : 'alpabeticalRender'
        },

        goBack: function () {
            var self = this;
            var url;

            $('#channelStatus span').text('');
            $('#channelStatus div').attr('class', 'channelImg');

            App.publishProductState = null;

            if (self.productId) {
                url = '#easyErp/Products/tform/' + self.productId + '/p=1/c=50';
            } else {
                url = '#easyErp/Products/list/p=1/c=50';
            }

            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        closeDialog: function () {
            this.$dialog.remove();
        },

        filterPublishedOrUnpublished: function (data) {
            var action = data.action;
            var channelType = data.channelType;
            var channelName = data.channelName;

            App.publishProductState = action;

            this.toExpand = true;

            this.filter = this.filter || {};

            this.filter.channelLinks = {
                key  : 'channelLinks.channel',
                value: [data.channel],
                type : action
            };

            this.filter.toExpand = true;

            App.filtersObject.filter = this.filter;

            this.collection.getFirstPage({
                filter  : this.filter,
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

        getChannelData: function (isPublishAction) {
            var $currentEl = this.$el;
            var $checked = $currentEl.find('input.checkbox:checked');
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

        unlink: function () {
            this.makeTheAction('/products//channelLinks/unlink', 'unlinked', dataService.patchData);
        },

        configureChannel: function (action) {
            this.$dialog = new PublishProductView({
                action       : action,
                eventsChannel: this.eventsChannel
            }).$el;
        },

        showMoreContent: function (newModels) {
            var $holder = this.$el;
            var itemView;
            var pagenation;

            this.hideDeleteBtnAndUnSelectCheckAll();

            if (App.publishProductState) {
                $('#top-bar-back').show();
                $('#top-bar-publishBtn').hide();
                $('#top-bar-unpublishBtn').hide();
                $('#top-bar-unlinkBtn').hide();
                $('#top-bar-exportToCsvBtn').hide();
                $('#top-bar-exportToXlsxBtn').hide();
                $('#top-bar-createBtn').hide();
                $('#template-switcher').hide();
            }

            if (this.toExpand) {
                this.$el.html(_.template(listTemplate)({
                    toExpand: this.toExpand
                }));
            }

            $holder.find('#listTable').empty();

            itemView = new this.ListItemView({
                collection : newModels,
                page       : this.collection.currentPage,
                itemsNumber: this.collection.pageSize,
                toExpand   : this.toExpand
            });

            $holder.append(itemView.render());

            itemView.undelegateEvents();

            pagenation = $holder.find('.pagination');

            if (newModels.length !== 0) {
                pagenation.show();
            } else {
                pagenation.hide();
            }

            if (typeof (this.recalcTotal) === 'function') {
                this.recalcTotal();
            }

            $holder.find('#timeRecivingDataFromServer').remove();
            $holder.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        showPublish: function () {
            $('#top-bar-publishBtn').show();
            $('#top-bar-unpublishBtn').show();
        },

        hidePublish: function () {
            $('#top-bar-publishBtn').hide();
            $('#top-bar-unpublishBtn').hide();
        },

        render: function () {
            var $currentEl;

            $currentEl = this.$el;

            $('#top-bar-back').hide();

            if (this.toExpand) {
                $('#top-bar-back').show();
                $('#top-bar-publishBtn').hide();
                $('#top-bar-unpublishBtn').hide();
                $('#top-bar-unlinkBtn').hide();
                $('#top-bar-exportToCsvBtn').hide();
                $('#top-bar-exportToXlsxBtn').hide();
                $('#top-bar-createBtn').hide();
                $('#template-switcher').hide();
            }

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate)({
                toExpand: this.toExpand
            }));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow,
                toExpand   : this.toExpand
            }).render());
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        importFromMagento: function () {
            var url = '/integration/product';
            var self = this;

            dataService.getData(url, {}, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }

                self.render();
            });
        },

        exportToMagento: function () {
            var url = '/integration/product';
            var data = {};
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#listTable');
            var products = [];
            var $checkedInputs;
            var $el;

            $checkedInputs = $table.find('input:checked');

            $.each($checkedInputs, function () {
                $el = $(this);

                products.push($el.val());
            });

            data = {
                products: products
            };

            dataService.postData(url, data, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }
                alert(result.success);
            });
        }
    });

    return ProductsListView;
});
