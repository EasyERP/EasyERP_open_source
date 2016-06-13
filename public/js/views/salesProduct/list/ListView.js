define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Product/list/ListHeader.html',
    'views/Product/CreateView',
    'views/salesProduct/list/ListItemView',
    'views/Product/EditView',
    'models/ProductModel',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'collections/salesProduct/filterCollection',
    'common',
    'dataService',
    'constants'
], function ($, _, ListViewBase, listTemplate, CreateView, listItemView, EditView, productModel, aphabeticTemplate, ContentCollection, common, dataService, CONSTANT) {
    var ProductsListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : listItemView,
        contentCollection: ContentCollection,
        page             : null, // if reload page, and in url is valid page
        contentType      : CONSTANT.SALESPRODUCT, // needs in view.prototype.changeLocationHash
        exportToXlsxUrl  : '/Product/exportToXlsx',
        exportToCsvUrl   : '/Product/exportToCsv',

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.ContentCollection = ContentCollection;

            this.render();
        },

        events: {
            'click .list td:not(.notForm)': 'goToEditDialog',
            'click .letter:not(.empty)'   : 'alpabeticalRender'
        },

        render: function () {
            var self;
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

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new productModel({validate: false});

            e.preventDefault();
            model.urlRoot = '/product/form';
            model.fetch({
                data   : {id: id},
                success: function (model) {
                    new EditView({model: model});
                },
                error  : function () {
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
