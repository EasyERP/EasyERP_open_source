"use strict";
define([
        'Backbone',
        'models/journalEntry',
        'custom',
        'moment'
    ],
    function (Backbone, JournalEntryModel, custom, moment) {
        var JournalEntryCollection = Backbone.Collection.extend({
            model: JournalEntryModel,
            url  : "/journal/journalEntry/",

            showMore: function (options) {
                var that = this;
                var filterObject = options || {};

                this.startTime = new Date();

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
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: "Some Error."
                        });
                    }
                });
            },

            initialize: function (options) {
                var that = this;
                this.namberToShow = options.count;
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.count = options.count;
                this.page = options.page || 1;
                this.filter = options.filter || custom.retriveFromCash('journalEntry.filter');
                var startDate = moment(new Date());
                var endDate = moment(new Date());

                startDate.month(startDate.month() - 1);
                startDate.date(1);
                endDate.month(startDate.month());
                endDate.endOf('month');

                var dateRange = custom.retriveFromCash('journalEntryDateRange') || {};
                this.startDate = dateRange.startDate;
                this.endDate = dateRange.endDate;

                this.startDate = dateRange.startDate || new Date(startDate);
                this.endDate = dateRange.endDate || new Date(endDate);

                options.startDate = this.startDate;
                options.endDate = this.endDate;
                options.filter = this.filter;

                custom.cacheToApp('journalEntryDateRange', {
                    startDate: this.startDate,
                    endDate  : this.endDate
                });

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
                        if (xhr.status === 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            }
        });
        return JournalEntryCollection;
    });