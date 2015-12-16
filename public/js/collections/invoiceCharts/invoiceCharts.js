define([],
    function () {
        var Model = Backbone.Model.extend({
            idAttribute: '_id'
        });
        var Colection = Backbone.Collection.extend({
            model: Model,

            url: 'revenue/synthetic',

            initialize: function (options) {
                this.fetch({
                    data : options,
                    reset: true
                });
            }

        });

        return Colection;
    });