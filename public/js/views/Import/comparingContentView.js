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
        },

        initialize: function (options) {
            var url = 'importFiles/merge';
            var self = this;

            this.timeStamp = options.timeStamp;

            dataService.getData(url, {timeStamp: self.timeStamp}, function (data) {
                //self.data = data.mappedObj;
                //self.unmappedData = data.unmappedObj;

                self.render(data);
            });

        },


        render: function (data) {
            var $thisEl = this.$el;
            var self = this;


            $thisEl.html(this.contentTemplate({
                data: data
            }));
        }
    });

    return comparingContentView;
});