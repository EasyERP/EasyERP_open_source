define([
    'Backbone',
    'collections/parent',
    'models/PersonsModel',
    'dataService',
    'constants'
], function (Backbone, Parent, PersonModel, dataService, CONSTANTS) {
    'use strict';

    var PersonsCollection = Parent.extend({
        model      : PersonModel,
        url        : CONSTANTS.URLS.PERSONS,
        pageSize   : CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,
        contentType: 'Persons',

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
                    that.page++;
                    that.trigger('showmoreAlphabet', models);
                },
                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Some Error.'
                    });
                }
            });
        },

        getAlphabet: function (callback) {
            dataService.getData('/persons/getPersonAlphabet', {
                mid        : 39,
                contentType: this.contentType
            }, function (response) {
                if (callback) {
                    callback(response.data);
                }
            });
        }
    });

    return PersonsCollection;
});
