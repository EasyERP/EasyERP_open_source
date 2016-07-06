define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Product/list/ListHeader.html',
    'views/Products/CreateView',
    'views/Products/list/ListItemView',
    'views/Products/EditView',
    'models/ProductModel',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'collections/Products/filterCollection',
    'common',
    'dataService'
], function ($, _, ListViewBase, listTemplate, createView, listItemView, editView, productModel, aphabeticTemplate, contentCollection, common, dataService) {
    var ProductsListView = ListViewBase.extend({
        createView              : createView,
        listTemplate            : listTemplate,
        listItemView            : listItemView,
        contentCollection       : contentCollection,
        totalCollectionLengthUrl: '/product/totalCollectionLength',
        page                    : null, // if reload page, and in url is valid page
        contentType             : 'Products', // needs in view.prototype.changeLocationHash
        exportToXlsxUrl         : '/Product/exportToXlsx',
        exportToCsvUrl          : '/Product/exportToCsv',

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            _.bind(this.collection.showMore, this.collection);
            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.filter = options.filter ? options.filter : {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            this.render();

            this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            this.contentCollection = contentCollection;
        },

        events: {
            'click .list td:not(.notForm)': 'goToEditDialog',
            'click .letter:not(.empty)'   : 'alpabeticalRender'
        },

        render: function () {
            var $currentEl;

            $('.ui-dialog ').remove();
            
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new listItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            this.renderPagination($currentEl, this);
            this.renderAlphabeticalFilter(this);
            this.renderFilter();

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        },

        goToEditDialog: function (e) {
            var self = this;
            var id = $(e.target).closest('tr').data('id');
            var model = new productModel({validate: false});

            e.preventDefault();
            model.urlRoot = '/Product/';
            model.fetch({
                data   : {id: id},
                success: function (model) {
                    return new self.EditView({model: model});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        }
    });

    return ProductsListView;
});
