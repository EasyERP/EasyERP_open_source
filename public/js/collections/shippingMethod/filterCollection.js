define([
    'Backbone',
    'models/ShippingMethodModel',
    'collections/parent',
    'helpers/getDateHelper',
    'constants',
    'moment'
], function (Backbone, Model, Parent, DateHelper, CONSTANTS, moment) {
    var Collection = Parent.extend({
        model: Model,
        url  : CONSTANTS.URLS.SHIPPING_METHOD,

        initialize: function (options) {
            var page;

            function _errorHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            page = options.page;
            options.error = options.error || _errorHandler;

            this.contentType = options.contentType;

            this.startTime = new Date();

            if (options.url) {
                this.url = options.url;
            }

            options.reset = true;

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return Collection;
});

