define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesQuotations/list/ListHeader.html',
    'text!templates/stages.html',
    'views/salesQuotations/CreateView',
    'views/Quotations/list/ListView',
    'views/salesQuotations/list/ListItemView',
    'views/salesQuotations/EditView',
    'models/QuotationModel',
    'collections/salesQuotations/filterCollection',
    'dataService',
    'constants',
    'helpers'
], function ($,
             _,
             listViewBase,
             listTemplate,
             stagesTemplate,
             CreateView,
             ListView,
             ListItemView,
             EditView,
             CurrentModel,
             contentCollection,
             dataService,
             CONSTANTS,
             helpers) {
    'use strict';

    var QuotationListView = ListView.extend({
        CreateView       : CreateView,
        EditView         : EditView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.SALESQUOTATIONS,
        hasPagination    : true,
        forSales         : true
    });

    return QuotationListView;
});
