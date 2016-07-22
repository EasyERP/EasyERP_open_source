define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/salesQuotations/form/ContentTemplate.html',
    'text!templates/salesQuotations/form/ListItemTemplate.html',
    'models/QuotationModel',
    'views/salesQuotations/form/FormView',
    'views/salesQuotations/CreateView',
    'views/salesQuotations/list/ListItemView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, QuotationModel, FormView, CreateView, ListItemView, common, CONSTANTS) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/salesQuotations/list/',
        contentType    : CONSTANTS.SALESQUOTATIONS, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : QuotationModel,
        FormView       : FormView,

        events: {
            'click .saveBtn': 'saveCurrentQuotation'
        },

        renderList: function (quotations) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                quotations: quotations
            }));
        },

        saveCurrentQuotation: function () {
            this.formView.saveItem();
        },

        renderFormView: function (e) {
            var $thisEl = this.$el;
            var $target;
            var modelId;
            var model;
            var self = this;
            var date = new Date();

            if (e.hasOwnProperty('target')) {
                $target = $(e.target);
                modelId = $target.closest('.compactView').data('id');

            } else {
                modelId = e;
            }

            model = new this.ContentModel();
            model.urlRoot = model.url() + modelId;

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

                    self.changeLocationHash(self.collection.currentPage, self.collection.pageSize, self.filter);

                    if (e.hasOwnProperty('target')) {
                        $thisEl.find('#timeRecivingDataFromServer').remove();
                        $thisEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - date) + ' ms</div>');
                    }
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Server error'
                    });
                }
            });
        },

    });

    return QuotationsListView;
});
