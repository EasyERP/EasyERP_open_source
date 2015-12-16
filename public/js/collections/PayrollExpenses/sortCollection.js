/**
 * Created by lilya on 19/11/15.
 */
define([
        'models/PayRollModel'
    ],
    function (PayRollModel) {
        var PayRollCollection = Backbone.Collection.extend({
            model: PayRollModel,
            url  : "/payroll/",

            initialize: function (options) {
                this.startTime = new Date();
                this.sort = options ? options.sort : {"employee.name": 1};

                this.fetch({
                    data   : options,
                    reset  : true,
                    success: function () {
                    },
                    error  : function (models, xhr) {
                        if (xhr.status == 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            }
        });

        return PayRollCollection;
    });