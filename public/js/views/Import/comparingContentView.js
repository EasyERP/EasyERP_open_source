define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ComparingTemplate.html',
    'constants/importMapping',
    'constants',
    'dataService',
    'common'
], function (Backbone, $, _, ComparingTemplate, importMapping, CONSTANTS, dataService, common) {
    'use strict';

    var comparingContentView = Backbone.View.extend({
        el             : '#contentBlock',
        contentTemplate: _.template(ComparingTemplate),

        events: {
            'click #stepByStepButton' : 'stepByStep'
        },

        initialize: function (options) {
            var url = 'importFile/merge';
            var self = this;

            this.timeStamp = options.timeStamp;
            this.imported = options.imported;
            this.skipped = options.skipped;
            this.step = 0;


            dataService.getData(url, {timeStamp: self.timeStamp}, function (data) {
                self.data = data;
                self.stepKeys = Object.keys(self.data.result);
                self.render(self.data);
            });

        },

        stepByStep: function (e) {
            var $thisEl = this.$el;
            var data = {
                keys: {},
                result: {}
            };
            var stepKey = this.stepKeys[this.step];

            data.keys = this.data.keys;
            data.result[stepKey] = this.data.result[stepKey];
            this.step++;

            $thisEl.html(this.contentTemplate({
                data: data
            }));
        },

        render: function (data) {
            var $thisEl = this.$el;
            var self = this;

            data.keys = data.keys.reverse();

            $thisEl.html(this.contentTemplate({
                data: data
            }));
        }
    });

    return comparingContentView;
});