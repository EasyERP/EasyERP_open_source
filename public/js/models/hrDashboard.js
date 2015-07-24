/**
 * Created by soundstorm on 30.06.15.
 */
define(['collections/Dashboard/hiredFired'], function (childCollection) {
    var Model = Backbone.Model.extend({
        idAttribute: "_id",

        parse: function(model){
            if(model.data){
                model.data = new childCollection(model.data);
            }

            return model;
        }
    });

    return Model;
});