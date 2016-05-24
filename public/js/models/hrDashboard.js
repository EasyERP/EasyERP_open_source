/**
 * Created by soundstorm on 30.06.15.
 */
define([
    'Backbone',
    'collections/Dashboard/hiredFired'
], function (Backbone, ChildCollection) {
    'use strict';

    var Model = Backbone.Model.extend({
        idAttribute: "_id",

        parse: function (model) {
            if (model.data) {
                model.data = new ChildCollection(model.data);
            }

            return model;
        }
    });

    return Model;
});