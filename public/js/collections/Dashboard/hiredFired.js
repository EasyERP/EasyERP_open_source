define([
        'Backbone',
        'models/hiredFired'
    ],
    function (Backbone, Model) {
        'use strict';

        var Colection = Backbone.Collection.extend({
            model: Model
        });

        return Colection;
    });