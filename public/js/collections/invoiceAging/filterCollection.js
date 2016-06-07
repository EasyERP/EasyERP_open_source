define([
    'Backbone',
    'collections/parent',
    'models/invoiceAging',
    'constants'
], function (Backbone, Parent, InvoiceAging, CONSTANTS) {
    'use strict';

    var Collection = Parent.extend({
        model   : InvoiceAging,
        url     : CONSTANTS.URLS.INVOICE_STATS,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,
        /* page        : null,
         namberToShow: null,
         viewType    : null,
         contentType : null,*/

        initialize: function (options) {
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

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }

        /* initialize: function (options) {
         var that = this;

         this.startTime = new Date();
         this.namberToShow = options.count;
         this.viewType = options.viewType;
         this.contentType = options.contentType;
         this.count = options.count;
         this.page = options.page || 1;

         this.fetch({
         data   : options,
         reset  : true,
         success: function () {
         that.page++;
         },
         error  : function (models, xhr) {
         if (xhr.status === 401) {
         Backbone.history.navigate('#login', {trigger: true});
         }
         }
         });
         },*/

        /* showMore: function (options) {
         var that = this;
         var filterObject = options || {};

         filterObject.page = (options && options.page) ? options.page : this.page;
         filterObject.count = (options && options.count) ? options.count : this.namberToShow;
         filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
         filterObject.contentType = (options && options.contentType) ? options.contentType : this.contentType;

         this.fetch({
         data   : filterObject,
         waite  : true,
         success: function (models) {
         that.page += 1;
         that.trigger('showmore', models);
         },
         error  : function (model, xhr) {
         App.render({
         type   : 'error',
         message: xhr ? xhr.text : 'Some error'
         });
         }
         });
         }*/
    });
    return Collection;
});
