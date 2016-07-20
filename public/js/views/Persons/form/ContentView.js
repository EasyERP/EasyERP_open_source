define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/Persons/form/ContentTemplate.html',
    'text!templates/Persons/form/ListItemTemplate.html',
    'models/PersonsModel',
    'views/Persons/form/FormView',
    'views/Persons/CreateView',
    'views/Persons/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, PersonsModel, FormView, CreateView, ListItemView) {
    'use strict';

    var PersonsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'easyErp/Persons/list/',
        contentType    : 'Persons', // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : PersonsModel,
        FormView       : FormView,

        renderList: function(persons){
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                persons: persons
            }));
        }
    });

    return PersonsListView;
});
