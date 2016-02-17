define([
        'Backbone',
        'models/PayRollModel',
        'constants'
    ],
    function (Backbone, PayRollModel, CONSTANTS) {
        'use strict';

        var PayRollCollection = Backbone.Collection.extend({
            model: PayRollModel,
            url  : CONSTANTS.URLS.PAYROLL,

            showMore: function (options) {
                var that = this;

                this.fetch({
                    data   : options,
                    waite  : true,
                    success: function (models) {
                        that.trigger('showmore', models);
                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: 'Some error during fetching data'
                        });
                    }
                });
            },

            initialize: function (options) {
                this.startTime = new Date();
                this.viewType = options.viewType;
                this.contentType = options.contentType;

                if (options && options.viewType) {
                    this.url += options.viewType;
                }

                this.fetch({
                    data   : options,
                    reset  : true,
                    success: function () {
                    },
                    error  : function (models, xhr) {
                        if (xhr.status === 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            }
        });
        return PayRollCollection;
    });