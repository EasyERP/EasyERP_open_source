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
            this.skippedArray = App.currentUser.imports.skipped;
            this.imported = App.currentUser.imports.importedCount;
            //this.mergingArray = [];

            dataService.getData(url, {timeStamp: self.timeStamp}, function (data) {
                //data.keys = data.keys.reverse();
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
            var dataId =

            $parent.find('.item').removeClass('active');
            $target.addClass('active');
            $parent.toggleClass('open');


        },

        changeTableCombobox: function (e) {
            var $combobox = $(e.target);

            $combobox.toggleClass('open');
        },

        skipping: function (data) {
            this.step++;

            this.mergingArray = [];

            this.render(data);
        },

        stepByStep: function (e) {
            var $thisEl = this.$el;
            var self = this;
            var data = {
                keys  : {},
                result: {}
            };
            var stepKey = this.stepKeys[this.step];
            var result;
            var url = '';
            var $actions = this.$el.find('tr[data-id]');

            this.isExist = null;

            data.keys = this.data.keys;
            data.result[stepKey] = this.data.result[stepKey];

            result = _.where(data.result[stepKey], {isExist: true});

            if (result.length) {
                this.isExist = result[0]._id;
            }

            if (this.step) {
                _.each($actions, function (item, key) {
                    if ($(item).data('id').trim()) {
                        self.mergingArray.push({
                            id: $(item).data('id').trim(),
                            action: $(item).find('.active').data('action'),
                            existId: self.isExist
                        });
                    }
                });

                dataService.postData(url, {data: this.mergingArray, headerId: this.headerId} ,function(err, result) {
                    //self.imported += result.imported;
                    //self.skippedArray.concat(result.skippedArray);

                    self.skipping(data);
                });
            } else {
                this.skipping(data);
            }
        },

        finishStep: function () {

        },

        render: function (data) {
            var $thisEl = this.$el;
            var self = this;

            $thisEl.html(this.contentTemplate({
                data: data,
                step: this.step
            }));
        }
    });

    return comparingContentView;
});