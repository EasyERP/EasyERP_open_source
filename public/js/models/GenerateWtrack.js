define([
    'Backbone',
    'Validation'
], function (Backbone, Validation) {
    'use strict';
    var wTrackModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            startDate : new Date(),
            endDate   : '',
            hours     : '',
            project   : {
                projectName   : '',
                workflow      : {},
                customer      : {},
                projectmanager: {}
            },
            employee  : {},
            department: {},
            1         : 8,
            2         : 8,
            3         : 8,
            4         : 8,
            5         : 8,
            6         : 0,
            7         : 0,
            revenue   : 120
        },
        validate: function (attrs) {
            var errors = [];

            Validation.checkNumberField(errors, true, attrs.weekDefault['1'], "First day value");
            Validation.checkNumberField(errors, true, attrs.weekDefault['2'], "Second day value");
            Validation.checkNumberField(errors, true, attrs.weekDefault['3'], "Third day value");
            Validation.checkNumberField(errors, true, attrs.weekDefault['4'], "Fourth day value");
            Validation.checkNumberField(errors, true, attrs.weekDefault['5'], "Fifth day value");
            Validation.checkNumberField(errors, true, attrs.weekDefault['6'], "Sixth day value");
            Validation.checkNumberField(errors, true, attrs.weekDefault['7'], "Seventh day value");
            Validation.checkMoneyField(errors, false, attrs.revenue, "Revenue");

            if (errors.length > 0) {
                return errors;
            }
        }
    });

    return wTrackModel;
});