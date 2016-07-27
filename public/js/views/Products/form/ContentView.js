define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Products/form/ContentTemplate.html',
    'text!templates/Products/form/ListItemTemplate.html',
    'models/ProductModel',
    'views/Products/form/FormView',
    'views/Products/CreateView',
    'views/Products/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, ProductModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS) {
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
        ContentModel   : ProductModel,
        FormView       : FormView,

        renderList: function(quotations){
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                quotations: quotations
            }));
        }
    });

    return ProductsListView;
});
