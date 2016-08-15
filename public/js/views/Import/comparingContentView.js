define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ComparingTemplate.html',
    'text!templates/Import/FinishTemplate.html',
    'constants/importMapping',
    'constants',
    'dataService',
    'common'
], function (Backbone, $, _, ComparingTemplate, FinishTemplate, importMapping, CONSTANTS, dataService, common) {
    'use strict';

    var comparingContentView = Backbone.View.extend({
        el             : '#contentBlock',
        contentTemplate: _.template(ComparingTemplate),
        finishTemplate: _.template(FinishTemplate),


        events: {
            'click #stepByStepButton': 'stepByStep',
            'click .changeTableCombobox': 'changeTableCombobox',
            'click .item': 'checkItem'
        },

        initialize: function (options) {
            var url = 'importFile/merge';
            var self = this;

            this.timeStamp = options.timeStamp;
            this.step = 0;
            //this.mergingArray = [];

            dataService.getData(url, {timeStamp: self.timeStamp}, function (data) {
                self.data = data;

                /*_.each(self.data.result, function (parent, key) {
                    _.each(parent, function (item, key) {
                        if (item.importId) {
                            self.mergingArray.push({
                                id: item.importId,
                                action: 'skip',
                                existId: null
                            });
                        } else {
                            self.mergingArray.push({
                                id: item._id,
                                action: 'skip',
                                existId: null
                            });
                        }
                    });
                });*/


                self.stepKeys = Object.keys(self.data.result);
                self.render(self.data);
            });



        },

        checkItem: function (e) {
            var $target = $(e.target);
            var $parent = $target.closest('.changeTableCombobox');

            $parent.find('.item').removeClass('active');
            $target.addClass('active');
            $parent.toggleClass('open');
        },

        changeTableCombobox: function (e) {
            var $combobox = $(e.target);

            //this.$el.find('.changeTableCombobox').removeClass('open');
            $combobox.toggleClass('open');
        },



        stepByStep: function (e) {
            var $thisEl = this.$el;
            var data = {
                keys  : {},
                result: {}
            };
            var stepKey = this.stepKeys[this.step];

            data.keys = this.data.keys;
            data.result[stepKey] = this.data.result[stepKey];
            this.step++;

            this.render(data);
            /*$thisEl.html(this.contentTemplate({
                data: data
            }));*/
        },

        finishStep: function () {

        },

        render: function (data) {
            var $thisEl = this.$el;
            var self = this;

            data.keys = data.keys.reverse();

            $thisEl.html(this.contentTemplate({
                data: data,
                step: this.step
            }));
        }
    });

    return comparingContentView;
});