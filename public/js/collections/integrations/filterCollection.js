define(['Backbone',
    'models/integrationChannel'
], function (Backbone, Model) {
    var Collection = Backbone.Collection.extend({
        model: Model,
        url  : '/channels',

        initialize: function (options) {
            options = options || {};
            var type = options.type;

            if (type) {
                this.url += '/' + type;
            }

            this.fetch({
                reset: true,

                error: function (models, xhr) {
                    App.render({
                        message: xhr.statusText
                    });
                }
            });
        },

        parse: function (response) {
            this.stats = response && response.stats;

            return response.result;
        }
    });

    return Collection;
});