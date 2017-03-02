define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/productSettings/form/ContentTemplate.html',
    'text!templates/productSettings/form/ListItemTemplate.html',
    'models/OptionsModel',
    'views/productSettings/form/FormView',
    'views/productSettings/CreateView',
    'views/productSettings/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, OptionsModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS) {
    'use strict';

    var ProductOptionsView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/productSettings/list/',
        contentType    : CONSTANTS.PRODUCTS_SETTINGS,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : OptionsModel,
        FormView       : FormView,

        renderList: function(options){
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                options: options
            }));
        }
    });

    return ProductOptionsView;
});