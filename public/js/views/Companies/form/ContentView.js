define([
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Companies/form/ContentTemplate.html',
    'text!templates/Companies/form/ListItemTemplate.html',
    'models/CompaniesModel',
    'views/Companies/form/FormView',
    'views/Companies/CreateView',
    'views/Companies/list/ListItemView'
], function ($, _, TFormBaseView, ContentTemplate, ListItemTemplate, CompaniesModel, FormView, CreateView, ListItemView) {
    'use strict';

    var CompaniesListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        formUrl        : '#easyErp/Companies/form/',
        contentType    : 'Companies', // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        ContentModel   : CompaniesModel,
        FormView       : FormView,
        listUrl        : 'easyErp/Companies/list/',

        renderList: function (companies) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                companies: companies
            }));
        }

    });

    return CompaniesListView;
});
