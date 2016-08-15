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
        finishTemplate : _.template(FinishTemplate),

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
            this.mergedCount = 0;

            dataService.getData(url, {timeStamp: self.timeStamp}, function (data) {
                self.data = data;
                self.stepKeys = Object.keys(self.data.result);
                self.headerId = data.headerId;
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
            var url = 'importFile/merge';
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
                    self.imported += result.imported;
                    self.skippedArray.concat(result.skippedArray);
                    self.mergedCount += result.mergedCount;

                    self.skipping(data);
                });
            } else {
                this.skipping(data);
            }
        },

        finishStep: function () {
            var $thisEl = this.$el;
            var self = this;

            $thisEl.html(this.finishTemplate({
                data: data,
                step: this.step
            }));
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