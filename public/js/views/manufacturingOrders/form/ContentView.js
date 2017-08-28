define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/manufacturingOrders/form/ContentTemplate.html',
    'text!templates/manufacturingOrders/form/ListItemTemplate.html',
    'models/ManufacturingOrderModel',
    'views/manufacturingOrders/form/FormView',
    'views/manufacturingOrders/CreateView',
    'views/manufacturingOrders/list/ListItemView',
    'views/Filter/filterView',
    'dataService',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, ProductModel, FormView, CreateView, ListItemView, FilterView, dataService, common, CONSTANTS) {
    'use strict';

    var manufacturingOrdersListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/manufacturingOrders/list/',
        contentType    : CONSTANTS.MANUFACTURINGORDERS,
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

        renderList: function (manufacturingOrders) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');
            var _id = window.location.hash.split('/')[3];
            var currentProduct = _.find(manufacturingOrders, function (el) {
                return _id === el._id;
            });

            this.groupId = currentProduct && currentProduct.groupId;
            this.productId = _id;

            $('#top-bar-back').hide();

            $listHolder.append(this.listTemplate({
                collection: manufacturingOrders
            }));
        }
    });

    return manufacturingOrdersListView;
});
