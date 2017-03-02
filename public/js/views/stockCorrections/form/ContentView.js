define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/stockCorrections/form/ContentTemplate.html',
    'text!templates/stockCorrections/form/ListItemTemplate.html',
    'models/stockCorrectionModel',
    'text!templates/stockCorrections/form/FormTemplate.html',
    'views/stockCorrections/CreateView',
    'views/stockCorrections/list/ListItemView',
    'views/Filter/filterView',
    'helpers',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, StockModel, formTemplate, CreateView, ListItemView, FilterView, helpers, common, CONSTANTS) {
    'use strict';

    var StockCorrectionsView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/stockCorrections/list/',
        contentType    : CONSTANTS.STOCKCORRECTIONS,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : StockModel,
        forSales       : true,

        renderList     : function (collection) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                collection        : collection
            }));
        },

        renderFormView: function (modelId, cb) {
            var $thisEl = this.$el;
            var self = this;
            var model;
            var data;

            model = new this.ContentModel({
                _id      : modelId
            });

            model.fetch({
                success: function (model) {

                    if (self.formView) {
                        self.formView.undelegateEvents();
                    }

                    self.$el.find('#formContent').html(_.template(formTemplate, {model : model.toJSON()}));

                    self.selectedId = model.id;
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

    return StockCorrectionsView;
});