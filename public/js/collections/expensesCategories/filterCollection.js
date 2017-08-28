define(['Backbone',
    'models/expensesCategory'
], function (Backbone, Model) {
    var Collection = Backbone.Collection.extend({
        model: Model,
        url  : '/expensesCategories/',

        initialize: function () {

            this.fetch({
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

    return Collection;
});