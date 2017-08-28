define([
    'Backbone',
    'collections/parent',
    'models/billOfMaterials',
    'dataService',
    'constants'
], function (Backbone, Parent, BillOfMaterialsModel, dataService, CONSTANTS) {
    'use strict';

    var BillOfMaterialsCollection = Parent.extend({
        model   : BillOfMaterialsModel,
        url     : CONSTANTS.URLS.BILLOFMATERIALS,
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

        initialize: function (options) {
            var regex = /^sales/;
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();
            this.mid = options.contentType && options.contentType === 'billOfMaterials' ? 58 : 65;

            this.filter = options.filter;

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });

    return BillOfMaterialsCollection;
});
