define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/thumbnails/ThumbnailsItemTemplate.html',
    'views/thumbnailsViewBase',
    'views/Products/EditView',
    'views/Products/CreateView',
    'dataService',
    'models/ProductModel',
    'common',
    'constants'
], function (Backbone, $, _, thumbnailsItemTemplate, BaseView, EditView, CreateView, dataService, CurrentModel, common, CONSTANTS) {
    var ProductThumbnalView = BaseView.extend({
        template   : _.template(thumbnailsItemTemplate),
        contentType: 'Products',

        initialize: function (options) {
            this.EditView = EditView;
            this.categories = options.categories;
            this.eventChannel = options.eventChannel;
            this.topBar = options.topBar;
            this.formUrl = '#easyErp/' + this.contentType + '/tform/';

            this.filter = options.filter;

            if (this.filter) {
                delete this.filter.productId;
                delete this.filter.toExpand;
                delete this.filter.groupId;
            }

            BaseView.prototype.initialize.call(this, options);
        },

        events: {
            'click #showMore'        : 'showMore',
            'click .thumbnailElement': 'gotoForm'
        },

        asyncLoadImgs: function (collection) {
           /* var ids = _.map(collection.toJSON(), function (item) {
                return item._id;
            });
            common.getImages(ids, '/products/getProductsImages');*/
        },

        createItemProduct: function () {
            new CreateView({
                eventChannel: this.eventChannel,
                viewType    : 'thumbnails'
            });
        },

        render: function () {
            var $currentEl = this.$el;

            $currentEl
                .find('#thumbnailContent')
                .append(this.template({collection: this.collection.toJSON()}));

            return this;
        },

        importFromMagento: function () {
            var url = '/integration/categories';
            var self = this;

            dataService.getData(url, {}, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }

                self.render();
            });
        },

        exportToMagento: function () {
            var url = '/integration/categories';
            var data;
            var self = this;
            var ids = _.pluck(self.categories.toJSON(), '_id');

            data = {
                categories: ids
            };

            dataService.postData(url, data, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }
                alert(result.success);
            });
        },

        gotoForm: function (e) {
            var $target = $(e.target);
            var id = $target.closest('.product').attr('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            this.topBar.unbind();
            this.topBar.undelegateEvents();

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        magentoImport: function () {
            var url = '/integration/product';
            var self = this;

            dataService.getData(url, {}, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }

                self.render();
            });
        },

        magentoExport: function () {
            var url = '/integration/product';
            var data;
            var self = this;

            data = {
                products: self.collection.toJSON()
            };

            dataService.postData(url, data, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }
                alert(result.success);
            });
        },

        exportToCsv: function () {
            //todo change after routes refactoring
            window.location = '/Products/exportToCsv';
        },

        exportToXlsx: function () {
            //todo change after routes refactoring
            window.location = '/Products/exportToXlsx';
        }

    });

    return ProductThumbnalView;
});