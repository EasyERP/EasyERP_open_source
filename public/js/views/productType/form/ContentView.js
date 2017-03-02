define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/productType/form/ContentTemplate.html',
    'text!templates/productType/form/ListItemTemplate.html',
    'models/ProductTypeModel',
    'views/productType/form/FormView',
    'views/productType/CreateView',
    'views/productType/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, ProductTypesModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS) {
    'use strict';

    var ProductOptionsView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/productType/list/',
        contentType    : CONSTANTS.PRODUCTTYPE,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : ProductTypesModel,
        FormView       : FormView,

        renderList: function(productTypes){
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                productTypes: productTypes
            }));
        }
    });

    return ProductOptionsView;
});