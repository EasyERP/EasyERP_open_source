define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Orders/form/ContentTemplate.html',
    'text!templates/Orders/form/ListItemTemplate.html',
    'models/QuotationModel',
    'views/Orders/form/FormView',
    'views/Orders/list/ListItemView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, QuotationModel, FormView, ListItemView, common, CONSTANTS) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/Orders/list/',
        contentType    : CONSTANTS.ORDERS, // needs in view.prototype.changeLocationHash
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

        renderList: function (orders) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                orders: orders
            }));
        }


    });

    return QuotationsListView;
});
