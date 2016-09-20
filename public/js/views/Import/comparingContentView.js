define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ComparingTemplate.html',
    'text!templates/Import/FinishTemplate.html',
    'constants/importMapping',
    'constants/mappingFields',
    'constants',
    'dataService',
    'common'
], function (Backbone, $, _, ComparingTemplate, FinishTemplate, importMapping, mappingFields, CONSTANTS, dataService, common) {
    'use strict';

    var comparingContentView = Backbone.View.extend({
        el             : '#contentBlock',
        contentTemplate: _.template(ComparingTemplate),
        finishTemplate : _.template(FinishTemplate),

        events: {
            'click #stepByStepButton'               : 'stepByStep',
            'click #skipAllButton, #importAllButton': 'actionAll',
            'click .changeTableCombobox'            : 'changeTableCombobox',
            'click .item'                           : 'checkItem',
            'click #finishBtn'                      : 'finishImport'
        },

        initialize: function (options) {
            var url = 'importFile/merge';
            var self = this;

            this.timeStamp = options.timeStamp;
            this.updateHistory = options.updateHistory;
            this.step = -1;
            this.skippedArray = App.currentUser.imports.skipped;
            this.imported = App.currentUser.imports.importedCount;
            this.mergedCount = 0;
            this.mergingArray = [];
            this.isItExist = null;
            this.moreExist = null;

            dataService.getData(url, {timeStamp: self.timeStamp}, function (data) {
                self.data = data;
                self.data.keys.reverse();
                self.stepKeys = Object.keys(self.data.result);
                self.stepKeysForAll = Object.keys(self.data.result);
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

        actionAll: function (e) {
            var $target = $(e.target);
            var action = $target.data('action');
            var self = this;
            //var mergingArray = [];
            var mergingArray = this.mergingArray;
            var url = 'importFile/merge';
            var linkToFile;
            var linkName;

            _.each(this.stepKeysForAll, function (stepKey) {
                _.each(self.data.result[stepKey], function (item, key) {
                    if (!item.isExist) {
                        mergingArray.push({
                            id     : item.importId,
                            action : action,
                            existId: self.existId
                        });
                    }
                });
            });

            dataService.postData(url, {
                data    : mergingArray,
                headerId: this.headerId
            }, function (err, result) {
                self.imported = result.imported;
                self.skipped = result.skipped;
                self.mergedCount += result.merged;
                linkToFile = result.reportFilePath;
                linkName = result.reportFileName;

                self.finishStep(linkToFile, linkName);
            });
        },

        stepByStep: function () {
            var self = this;
            var data = {
                keys  : {},
                result: {}
            };
            var url = 'importFile/merge';
            var $actions = this.$el.find('tr[data-id]');
            var stepKey;
            //var stepKey = (!this.step) ? this.stepKeys[this.step] : this.stepKeys[this.step - 1];
            //var stepKey = this.stepKeys[this.step];
            var linkToFile;
            var linkName;
            var result;

            this.existId = null;

            stepKey = this.stepKeys[this.step + 1];
            data.type = this.data.type;
            data.keys = this.data.keys;
            data.result[stepKey] = this.data.result[stepKey];

            result = _.where(this.data.result[this.stepKeys[this.step]], {isExist: true});

            if (result.length) {
                this.existId = result[0]._id;
            }

            result = _.where(this.data.result[stepKey], {isExist: true});

            if (result.length) {
                this.isItExist = true;
            }
            if (result.length > 1) {
                this.moreExist = true;
            }

            if (this.step >= 0) {
                if (self.moreExist !== null) {
                    self.existId = $('input:checked').data('exist') || self.existId;
                    //self.moreExist = null;
                }
                _.each($actions, function (item, key) {
                    if ($(item).data('id').trim()) {
                        self.mergingArray.push({
                            id     : $(item).data('id').trim(),
                            action : $(item).find('.active').data('action'),
                            existId: self.existId
                        });
                    }
                });

                delete self.stepKeysForAll[this.step];

                if (this.step === this.stepKeys.length - 1) {
                    dataService.postData(url, {
                        data    : this.mergingArray,
                        headerId: this.headerId
                    }, function (err, result) {
                        self.imported = result.imported;
                        self.skipped = result.skipped;
                        self.mergedCount += result.merged;
                        linkToFile = result.reportFilePath;
                        linkName = result.reportFileName;

                        self.finishStep(linkToFile, linkName);
                    });
                }
            }

            this.step++;

            if (this.step <= this.stepKeys.length) {
                this.render(data);
            }

        },

        finishImport: function (e) {
            var linkToFile;
            var linkName;
            var self = this;
            var url = 'importFile/merge';
            var imported = 0;
            var skipped = 0;
            var mergedCount = 0;

            e.preventDefault();

            dataService.postData(url, {
                data    : this.mergingArray,
                headerId: this.headerId
            }, function (err, result) {

                if (result) {
                    imported = result.imported;
                    skipped = result.skipped;
                    mergedCount = result.merged;
                }

                self.imported = imported;
                self.skipped = skipped;
                self.mergedCount = mergedCount;
                linkToFile = result.reportFilePath;
                linkName = result.reportFileName;

                self.finishStep(linkToFile, linkName);
            });
        },

        finishStep: function (linkToFile, linkName) {
            var $thisEl = this.$el;

            this.updateHistory();

            $('.stageBtnNext').remove();
            //$('.stageBtnNext').prop('disabled', true);

            $thisEl.html(this.finishTemplate({
                data: {
                    imported    : this.imported,
                    skippedArray: this.skipped,
                    mergedCount : this.mergedCount,
                    linkToFile  : linkToFile,
                    linkName    : linkName
                }
            }));

            App.currentUser.imports = {};
        },

        render: function (data) {
            var $thisEl = this.$el;
            var self = this;

            $thisEl.html(this.contentTemplate({
                data         : data,
                step         : this.step,
                isItExist    : this.isItExist,
                moreExist    : this.moreExist,
                mappingFields: mappingFields
            }));

            if (this.step >= 0) {
                $('#stepByStepButton').text('Step (' + (this.step + 1) + '/' + this.stepKeys.length + ')');
            }

            if (this.step === this.stepKeys.length - 1) {
                $('#stepByStepButton').text('Finish Import');
            }

            self.moreExist = null;
            self.isItExist = null;
        }
    });

    return comparingContentView;
});
