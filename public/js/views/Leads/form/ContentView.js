define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Leads/form/ContentTemplate.html',
    'text!templates/Leads/form/ListItemTemplate.html',
    'models/LeadsModel',
    'views/Leads/form/FormView',
    'views/Leads/CreateView',
    'views/Leads/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, LeadsModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS) {
    'use strict';

    var OpportunitiesListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/Leads/list/',
        contentType    : CONSTANTS.LEADS, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : LeadsModel,
        FormView       : FormView,

        renderList: function(leads){
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                leads: leads
            }));
        }
    });

    return OpportunitiesListView;
});