define([
    'Backbone',
    'models/PayrollStructureTypesModel'
], function (Backbone, Model) {
    var InvoiceCollection = Backbone.Collection.extend({
        model       : Model,
        url         : '/payrollStructureTypes/',
        page        : null,
        namberToShow: null,
        viewType    : null,
        contentType : null,

        initialize: function (options) {
            var that = this;

            this.startTime = new Date();
            this.namberToShow = options.count;
            this.viewType = options.viewType;
            this.contentType = options.contentType;
            this.page = options.page || 1;

            this.filter = options.filter;

            this.fetch({
                data   : options,
                reset  : true,
                success: function (newCollection) {
                    that.page++;
                },
                error  : function (models, xhr) {
                    if (xhr.status === 401) {
                        Backbone.history.navigate('#login', {trigger: true});
                    }
                    if (xhr.status === 403) {
                        App.render({
                            type   : 'error',
                            message: 'No access'
                        });
                    }
                }
            });
        }
    });
    return InvoiceCollection;
});

