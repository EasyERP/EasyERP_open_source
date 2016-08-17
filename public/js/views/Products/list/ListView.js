define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Products/list/ListHeader.html',
    'views/Products/CreateView',
    'views/Products/list/ListItemView',
    'views/Products/EditView',
    'models/ProductModel',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'collections/Products/filterCollection',
    'common',
    'constants'
], function ($, _, ListViewBase, listTemplate, CreateView, ListItemView, EditView, ProductModel, aphabeticTemplate, contentCollection, common, CONSTANTS) {
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
            this.mId = CONSTANTS.MID[this.contentType];
            this.startTime = options.startTime;
            this.collection = options.collection;
            //_.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();
            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;

            this.deleteCounter = 0;
            this.page = options.collection.currentPage;

            ListViewBase.prototype.initialize.call(this, options);

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
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());
        },

        goToEditDialog: function (e) {
            var self = this;
            var id = $(e.target).closest('tr').data('id');
            var model = new ProductModel({validate: false});

            e.preventDefault();
            model.urlRoot = '/Products/';
            model.fetch({
                data: {
                    id      : id,
                    viewType: 'form'
                },

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
