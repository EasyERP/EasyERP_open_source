define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/stockReturns/form/ContentTemplate.html',
    'text!templates/stockReturns/form/ListItemTemplate.html',
    'views/stockReturns/form/FormView',
    'models/stockReturnsModel',
    'text!templates/stockReturns/form/FormTemplate.html',
    'views/stockReturns/list/ListItemView',
    'views/Filter/filterView',
    'helpers',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, FormView, StockReturnsModel, formTemplate, ListItemView, FilterView, helpers, common, CONSTANTS) {
    'use strict';

    var StockCorrectionsView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/stockReturns/list/',
        contentType    : CONSTANTS.STOCKRETURNS,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : StockReturnsModel,
        FormView       : FormView,

        renderList     : function (collection) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                collection: collection
            }));
        }

        /*renderFormView: function (modelId, cb) {
         var self = this;
         var model;

         model = new this.ContentModel();

         model.fetch({
         data: {
         id: modelId
         }
         },{
         success: function (model) {

         if (self.formView) {
         self.formView.undelegateEvents();
         }

         self.currentModel = model;
         self.formView = new self.FormView({
         model: model,
         el   : '#formContent'
         });
         self.formView.render();

         self.selectItem(modelId);

         self.listenTo(self.formView, 'itemChanged', self.changeList);
         self.selectedId = model.id || model.get('model')._id; //TODO change

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
         }*/
    });

    return StockCorrectionsView;
});