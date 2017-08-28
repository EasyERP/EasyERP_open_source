define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/billOfMaterials/form/ContentTemplate.html',
    'text!templates/billOfMaterials/form/ListItemTemplate.html',
    'models/billOfMaterials',
    'views/billOfMaterials/form/FormView',
    'views/billOfMaterials/create/CreateView',
    'views/billOfMaterials/list/ListItemView',
    'views/Filter/filterView',
    'dataService',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, ProductModel, FormView, CreateView, ListItemView, FilterView, dataService, common, CONSTANTS) {
    'use strict';

    var BillOfMaterialsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/billOfMaterials/list/',
        contentType    : CONSTANTS.BILLOFMATERIALS,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        groupId        : null,
        ContentModel   : ProductModel,
        FormView       : FormView,

        closeDialog: function () {
            this.$dialog.remove();
        },

        renderList: function (billOfMaterials) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');
            var _id = window.location.hash.split('/')[3];
            var currentProduct = _.find(billOfMaterials, function (el) {
                return _id === el._id;
            });

            this.groupId = currentProduct && currentProduct.groupId;
            this.productId = _id;

            $('#top-bar-back').hide();

            $listHolder.append(this.listTemplate({
                billOfMaterials: billOfMaterials
            }));
        }
    });

    return BillOfMaterialsListView;
});
