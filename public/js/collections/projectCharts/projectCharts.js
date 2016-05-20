define(['models/ProjectCharts'], function (Model) {
    var Colection = Backbone.Collection.extend({
        model: Model,


        parse: function(response) {
            return response;
        }

    });

    return Colection;
});
