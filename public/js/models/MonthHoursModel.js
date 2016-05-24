/**
 * Created by Liliya on 22.06.2015.
 */
define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';

    var MonthHoursModel = Backbone.Model.extend({
        idAttribute: "_id",

        urlRoot: function () {
            return CONSTANTS.URLS.MONTHHOURS;
        }
    });
    return MonthHoursModel;

});