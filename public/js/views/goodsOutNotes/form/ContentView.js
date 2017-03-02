define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/goodsOutNotes/form/ContentTemplate.html',
    'text!templates/goodsOutNotes/form/ListItemTemplate.html',
    'views/goodsOutNotes/form/FormView',
    'models/goodsOutNotesModel',
    'text!templates/goodsOutNotes/form/FormTemplate.html',
    'views/goodsOutNotes/list/ListItemView',
    'views/Filter/filterView',
    'helpers',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, FormView, GoodsOutModel, formTemplate, ListItemView, FilterView, helpers, common, CONSTANTS) {
    'use strict';

    var StockCorrectionsView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/goodsOutNotes/list/',
        contentType    : CONSTANTS.GOODSOUTNOTES,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : GoodsOutModel,
        FormView       : FormView,

        renderList     : function (collection) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                collection        : collection
            }));
        },

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