define([
    'Backbone',
    'collections/parent',
    'models/CompaniesModel',
    'dataService',
    'constants'
], function (Backbone, Parent, CompanyModel, dataService, CONSTANTS) {
    'use strict';

    var CompaniesCollection = Parent.extend({
        model      : CompanyModel,
        url        : CONSTANTS.URLS.COMPANIES,
        pageSize   : CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,
        contentType: 'Companies',

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
        },

        filterByWorkflow: function (id) {
            return this.filter(function (data) {
                return data.get('workflow')._id === id;
            });
        },

        showMoreAlphabet: function (options) {
            var that = this;
            var filterObject = options || {};

            that.page = 1;
            filterObject.page = (options && options.page) ? options.page : this.page;
            filterObject.count = (options && options.count) ? options.count : this.namberToShow;
            filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
            filterObject.contentType = (options && options.contentType) ? options.contentType : this.contentType;
            filterObject.filter = options ? options.filter : {};
            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmoreAlphabet', models);
                },
                error: this.fetchError
            });
        },

        getAlphabet: function (callback) {
            dataService.getData('/customers/getCompaniesAlphabet', {
                mid        : 39,
                contentType: this.contentType
            }, function (response) {
                if (callback) {
                    callback(response.data);
                }
            });
        }
    });

    return CompaniesCollection;
});
