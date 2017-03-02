define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Orders/form/ContentTemplate.html',
    'text!templates/Orders/form/ListItemTemplate.html',
    'models/QuotationModel',
    'views/Quotations/CreateView',
    'views/Orders/form/FormView',
    'constants',
    'helpers'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, QuotationModel, CreateView, FormView, CONSTANTS, helpers) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        listUrl        : 'easyErp/Orders/list/',
        contentType    : CONSTANTS.ORDERS, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
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

            model.urlRoot = '/orders/' + modelId;

            model.fetch({
                success: function (model) {

                    if (self.formView) {
                        self.formView.undelegateEvents();
                    }

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
