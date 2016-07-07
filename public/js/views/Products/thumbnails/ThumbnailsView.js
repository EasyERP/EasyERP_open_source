define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Product/thumbnails/ThumbnailsItemTemplate.html',
    'views/thumbnailsViewBase',
    'views/Products/EditView',
    'views/Products/CreateView',
    'dataService',
    'models/ProductModel',
    'common',
    'constants'
], function (Backbone, $, _, thumbnailsItemTemplate, BaseView, EditView, CreateView, dataService, CurrentModel, common, CONSTANTS) {
    var ProductThumbnalView = BaseView.extend({
        //el         : '#content-holder',
        template   : _.template(thumbnailsItemTemplate),
        contentType: 'Products',
        //hasAlphabet: true,


        initialize: function (options) {
            //$(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;
            this.eventChannel = options.eventChannel;

            //_.bind(this.collection.showMoreAlphabet, this.collection);

            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.filter = options.filter;

            this.asyncLoadImgs(this.collection);

            BaseView.prototype.initialize.call(this, options);
        },

        events: {
            'click #showMore'           : 'showMore',
            'click .thumbnailwithavatar': 'gotoEditForm',
            'click .addProduct'         : 'createItem'
        },

        asyncLoadImgs: function (collection) {
            var ids = _.map(collection.toJSON(), function (item) {
                return item._id;
            });
            common.getImages(ids, '/products/getProductsImages');
        },

        createItem: function () {
            new CreateView({
                eventChannel: this.eventChannel
            });
        },

        render: function () {
            var $currentEl = this.$el;
            $currentEl
                .find('#thumbnailContent')
                .append(this.template({collection: this.collection.toJSON()}));

            return this;
        },

        gotoEditForm: function (e) {
            var className;
            var id;
            var model;
            var self = this;
            var target = $(e.target);

            this.$el.delegate('a', 'click', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });

            className = target.parent().attr('class');

            if ((className !== 'dropDown') || (className !== 'inner')) {
                id = target.closest('.thumbnailwithavatar').attr('id');
                model = new CurrentModel({validate: false});

                model.urlRoot = CONSTANTS.URLS.PRODUCT;

                model.fetch({
                    data   : {id: id, viewType: 'form'},
                    success: function (response) {
                        return new self.EditView({model: response});
                    },

                    error: function () {
                        App.render({
                            type   : 'error',
                            message: 'Please refresh browser'
                        });
                    }
                });
            }
        },

        exportToCsv: function () {
            //todo change after routes refactoring
            window.location = '/Product/exportToCsv';
        },

        exportToXlsx: function () {
            //todo change after routes refactoring
            window.location = '/Product/exportToXlsx';
        }

    });

    return ProductThumbnalView;
});