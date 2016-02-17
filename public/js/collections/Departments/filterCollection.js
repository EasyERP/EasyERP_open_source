define([
        'Backbone',
        'models/DepartmentsModel',
        'common',
        'constants'
    ],
    function (Backbone, DepartmentsModel, common, CONSTANTS) {
        'use strict';

        var departmentsCollection = Backbone.Collection.extend({
            model     : DepartmentsModel,
            url       : CONSTANTS.URLS.DEPARTMENTS,
            page      : 1,
            initialize: function (options) {
                this.startTime = new Date();
                var that = this;
                if (options && options.viewType) {
                    this.url += options.viewType;
                    delete options.viewType;
                }
                var filterObject = {};
                for (var i in options) {
                    filterObject[i] = options[i];
                }

                this.fetch({
                    data   : null,
                    reset  : true,
                    success: function () {
                        that.page += 1;
                    },
                    error  : this.fetchError
                });
            },

            showMore: function (options) {
                var that = this;

                var filterObject = {};
                if (options) {
                    for (var i in options) {
                        filterObject[i] = options[i];
                    }
                }
                filterObject['page'] = (filterObject.hasOwnProperty('page')) ? filterObject['page'] : this.page;
                filterObject['count'] = (filterObject.hasOwnProperty('count')) ? filterObject['count'] : 10;
                this.fetch({
                    data   : null,
                    waite  : true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: "Some Error."
                        });
                    }
                });
            },

            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (lead) {
                        lead.creationDate = common.utcDateToLocaleDate(lead.creationDate);
                        return lead;
                    });
                }
                return response.data;
            }
        });
        return departmentsCollection;
    });
