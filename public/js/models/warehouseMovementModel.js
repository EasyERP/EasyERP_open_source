define([
    'Backbone'
], function (Backbone) {
    'use strict';

    var Model = Backbone.Model.extend({
        idAttribute: '_id'
    });

    return Model;
});

