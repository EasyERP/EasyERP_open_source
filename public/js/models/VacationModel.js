/**
 * Created by soundstorm on 30.06.15.
 */
define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';

    var VacationModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot    : function () {
            return CONSTANTS.URLS.VACATION;
        }
    });

    return VacationModel;
});