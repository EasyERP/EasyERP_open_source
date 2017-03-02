define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/purchaseOrders/form/ContentTemplate.html',
    'text!templates/purchaseOrders/form/ListItemTemplate.html',
    'models/orderModel',
    'views/purchaseOrders/CreateView',
    'views/purchaseOrders/form/FormView',
    'views/purchaseOrders/form/EditView',
    'constants',
    'helpers'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, QuotationModel, CreateView, FormView, EditView, CONSTANTS, helpers) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        EditView       : EditView,
        listUrl        : 'easyErp/purchaseOrders/list/',
        contentType    : CONSTANTS.PURCHASEORDERS, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        forSales       : false,
        selectedId     : null,
        ContentModel   : QuotationModel,
        FormView       : FormView,

        renderList: function (orders) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                orders          : orders,
                currencyClass   : helpers.currencyClass,
                currencySplitter: helpers.currencySplitter
            }));
        },

        renderFormView: function (modelId, cb) {
            var $thisEl = this.$el;
            var self = this;
            var model;

            model = new this.ContentModel();

            model.urlRoot = '/order/' + modelId;

            model.fetch({
                success: function (model) {

                    if (self.formView) {
                        self.formView.undelegateEvents();
                    }

                    self.currentModel = model;

                    self.formView = new self.FormView({model: model, el: '#formContent'});
                    self.formView.render();

                    $thisEl.find('#listContent .selected').removeClass('selected');
                    $thisEl.find('tr[data-id="' + modelId + '"]').addClass('selected');

                    self.selectedId = model.id;

                    if (cb && typeof cb === 'function') {
                        cb();
                    }
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Server error'
                    });
                }
            });
        }
    });

    return QuotationsListView;
});
