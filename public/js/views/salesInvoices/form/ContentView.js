define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/salesInvoices/form/ContentTemplate.html',
    'text!templates/salesInvoices/form/ListItemTemplate.html',
    'models/InvoiceModel',
    'views/salesInvoices/form/FormView',
    'views/Invoices/CreateView',
    'views/Invoices/form/EditView',
    'views/Filter/filterView',
    'common',
    'constants',
    'helpers'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, InvoiceModel, FormView, CreateView, EditView, FilterView, common, CONSTANTS, helpers) {
    'use strict';

    var InvoicesListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        EditView       : EditView,
        listUrl        : 'tinyERP/salesInvoices/list/',
        contentType    : CONSTANTS.SALESINVOICES, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,

        selectedId     : null,
        ContentModel   : InvoiceModel,
        FormView       : FormView,
        forSales       : true,
        renderList     : function (invoices) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                invoices        : invoices,
                currencyClass   : helpers.currencyClass,
                currencySplitter: helpers.currencySplitter
            }));
        },

        renderFormView: function (modelId, cb) {
            var $thisEl = this.$el;
            var self = this;
            var model;
            var data;

            model = new this.ContentModel();

            data = {
                viewType: 'form',
                id      : modelId,
                forSales: this.forSales
            };

            model.fetch({
                data   : data,
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

    return InvoicesListView;
});
