define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/priceLists/form/ContentTemplate.html',
    'text!templates/priceLists/form/ListItemTemplate.html',
    'models/PriceListsModel',
    'views/priceLists/form/FormView',
    'views/priceLists/CreateView',
    'views/priceLists/list/ListItemView',
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
        listUrl        : 'easyErp/priceLists/list/',
        contentType    : CONSTANTS.PRICELISTS,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : ProductTypesModel,
        FormView       : FormView,

        renderList: function(priceLists){
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                priceLists: priceLists
            }));
        }
    });

    return ProductOptionsView;
});