define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Opportunities/form/ContentTemplate.html',
    'text!templates/Opportunities/form/ListItemTemplate.html',
    'models/OpportunitiesModel',
    'views/Opportunities/form/FormView',
    'views/Opportunities/CreateView',
    'views/Opportunities/list/ListItemView',
    'helpers'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, OpportunitiesModel, FormView, CreateView, ListItemView, helpers) {
    'use strict';

    var OpportunitiesListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/Opportunities/list/',
        contentType    : 'Opportunities', // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : OpportunitiesModel,
        FormView       : FormView,

        renderList: function (opportunities) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                opportunities   : opportunities,
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
            }));
        }
    });

    return OpportunitiesListView;
});
