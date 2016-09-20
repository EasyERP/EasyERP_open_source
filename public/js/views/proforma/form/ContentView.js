define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Proforma/form/ContentTemplate.html',
    'text!templates/Proforma/form/ListItemTemplate.html',
    'models/InvoiceModel',
    'views/Proforma/form/FormView',
    //'views/proforma/CreateView',
    'views/Proforma/list/ListItemView',
    'views/Filter/filterView',
    'helpers',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, InvoiceModel, FormView, ListItemView, FilterView, helpers, common, CONSTANTS) {
    'use strict';

    var InvoicesListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        //CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/Proforma/list/',
        contentType    : CONSTANTS.PROFORMA, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : InvoiceModel,
        FormView       : FormView,
        forSales       : false,

        renderList: function (proforms) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            this.filter = {
                name : 'forSales',
                value: {
                    key  : 'forSales',
                    type : 'boolean',
                    value: [this.forSales]
                }
            };

            $listHolder.append(this.listTemplate({
                proforms        : proforms,
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
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

                    self.formView = new self.FormView({model: model, el: '#formContent', forSales: self.forSales});
                    self.formView.render();

                    $thisEl.find('#listContent .selected').removeClass('selected');
                    $thisEl.find('tr[data-id="' + modelId + '"]').addClass('selected');

                    self.selectedId = model.id;

                    if (cb && typeof cb === 'function') {
                        cb();
                    }
                },

                error: function () {
                   self.returnToList();
                    /* App.render({
                     type   : 'error',
                     message: 'Server error'
                     });*/
                }
            });
        }
    });

    return InvoicesListView;
});