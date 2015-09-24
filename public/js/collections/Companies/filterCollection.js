define([
        'models/CompaniesModel',
        'common',
        "dataService"
    ],
    function (CompanyModel, common, dataService) {
        var CompaniesCollection = Backbone.Collection.extend({
            model       : CompanyModel,
            url         : "/Companies/",
            page        : null,
            namberToShow: null,
            viewType    : null,
            contentType : null,

            initialize      : function (options) {
                var that = this;
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.startTime = new Date();
                this.namberToShow = options.count;
                this.page = options.page || 1;
                if (options && options.viewType) {
                    this.url += options.viewType;
                }
                this.fetch({
                    data   : options,
                    reset  : true,
                    success: function () {
                        that.page++;
                    },
                    error  : function (models, xhr) {
                        if (xhr.status == 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            },
            filterByWorkflow: function (id) {
                return this.filter(function (data) {
                    return data.get("workflow")._id == id;
                });
            },
            showMore        : function (options) {
                var that = this;
                var filterObject = {};

                if (options) {
                    var count = options.count;

                    filterObject['viewType'] = options.viewType ? options.viewType : this.viewType;
                    filterObject['contentType'] = options.contentType ? options.contentType : this.contentType;
                    filterObject['filter'] = options.filter ? options.filter : {};

                    if (count) {
                        if (count !== 'all') {
                            filterObject['page'] = options.page ? options.page : this.page;
                            filterObject['count'] = count;
                        }
                    } else {
                        filterObject['page'] = options.page ? options.page : this.page;
                        filterObject['count'] = this.namberToShow;
                    }

                }

                this.fetch({
                    data   : filterObject,
                    waite  : true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmore', models);
                    },
                    error  : function (models, xhr) {
                        if (xhr.status == 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                        alert('Some error');
                    }
                });
            },
            showMoreAlphabet: function (options) {
                var that = this;
                var filterObject = options || {};
                that.page = 1;
                filterObject['page'] = (options && options.page) ? options.page : this.page;
                filterObject['count'] = (options && options.count) ? options.count : this.namberToShow;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType : this.viewType;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;
                filterObject['filter'] = (options) ? options.filter : {};
                this.fetch({
                    data   : filterObject,
                    waite  : true,
                    success: function (models) {
                        that.page += 1;
                        that.trigger('showmoreAlphabet', models);
                    },
                    error  : this.fetchError
                });
            },

            getAlphabet: function (callback) {
                dataService.getData("/getCompaniesAlphabet", {
                    mid        : 39,
                    contentType: this.contentType
                }, function (response) {
                    if (callback) {
                        callback(response.data);
                    }
                });
            },

            parse: true,
            parse: function (response) {
                return response.data;
            }
        });
        return CompaniesCollection;
    });
