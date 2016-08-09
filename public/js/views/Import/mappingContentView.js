define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/FieldsTemplate.html',
    'constants/importMapping',
    'constants',
    'dataService',
    'common'
], function (Backbone, $, _, ContentTemplate, importMapping, CONSTANTS, dataService, common) {
    'use strict';

    var mappingContentView = Backbone.View.extend({
        el             : '#contentBlock',
        contentTemplate: _.template(ContentTemplate),

        events: {
            'click #clickToReset'   : 'resetForm',
            'click ._importListTabs': 'changeTab',
            'click .cleanButton'    : 'clean'
        },

        initialize: function (options) {
            var url = '/importFile/imported';
            var self = this;

            this.timeStamp = options.timeStamp;
            this.fileName = options.fileName;

            this.logFile = {};

            dataService.getData(url, {timeStamp: this.timeStamp}, function (data) {
                self.data = data.mappedObj;
                self.unmappedData = data.unmappedObj;
                self.render(self.data);
            });
        },

        resetForm: function () {
            this.render(this.data);
        },

        clean: function (e) {
            var $field = $(e.target).closest('div').find('.secondColumn');
            var $cleanButton = $(e.target).closest('div').find('.cleanButton');

            this.revertToTables(true, true, $field.data('name'), $field.data('parent'));

            $field.text('');
            $field.data('name', '');
            $field.data('parent', '');
            $field.addClass('empty');
            $field.closest('.contentBlockRow').addClass('emptyRow');
            $field.removeClass('dbFieldItemDrag');
            $cleanButton.hide();
        },

        changeTab: function (e, $tab) {
            var $thisEl = this.$el;
            if (e) {
                $tab = $(e.target);
            }
            $thisEl.find('.tabItem').removeClass('active');
            $thisEl.find('.fieldsItems').removeClass('active');
            $thisEl.find('.fieldsItems[data-tab=' + $tab.data('tab') + ']').addClass('active');
            $tab.addClass('active');
        },

        getDataWithFields: function () {
            var $thisEl = this.$el;
            var self = this;
            var $dbContentBlock = $thisEl.find('#dbContentBlock');
            var fieldsObject = {};
            var $content = $dbContentBlock.find('.content');
            var parentTable = $thisEl.find('.tabItem').data('tab');

            fieldsObject.type = parentTable;
            fieldsObject.result = {};

            for (var i = 0; i < $content.length; i++) {
                var firstColumnVal = $($content[i]).find('.firstColumn').data('name');
                var secondColumnVal = $($content[i]).find('.secondColumn').data('name');

                if (secondColumnVal) {
                    fieldsObject.result[firstColumnVal] = secondColumnVal;
                }
            }

            return fieldsObject;
        },

        findKeyByValue: function (obj, value) {
            var result;

            _.each(obj, function (item, key) {
                if (item === value) {
                    result = key;
                }
            });

            return result;
        },

        revertToTables: function (isItClass, isDropable, droppableName, droppableParentName) {
            var self = this;
            console.log('revert');

            if ((isItClass) && (isDropable)) {
                if (droppableParentName === 'Customers' || droppableParentName === 'Employees') {
                    delete self.logFile[self.findKeyByValue(self.logFile, droppableName)];

                    self.$el.find('.fieldsItems[data-tab=' + droppableParentName + ']')
                        .find('ul')
                        .append('<li><div class="fieldItem" data-parent="' + droppableParentName + '" style="cursor: pointer"  data-name="' + droppableName + '">' + droppableName + '</div></li>')
                        .find('div[data-name="' + droppableName + '"]')
                        .draggable({
                            revert: true,
                            helper: 'clone',
                            start : function () {
                                $(this).hide();
                            },
                            stop  : function () {
                                $(this).show();
                            }
                        });
                }
            }
        },

        draggableDBFields: function () {
            var self = this;

            $('.dbFieldItem').droppable({
                accept   : '.dbFieldItemDrag, .fieldItem',
                tolerance: 'pointer',

                activate: function (event, ui) {
                    var $draggable = ui.draggable;

                    $draggable.addClass('borderField');
                },

                drop: function (event, ui) {
                    var $droppable = $(this).closest('div');
                    var $draggable = ui.draggable;
                    var draggableName = $draggable.data('name');
                    var droppableName = $droppable.data('name');
                    var draggableParentName = $draggable.data('parent');
                    var droppableParentName = $droppable.data('parent');

                    //self.revertToTables(($draggable.attr('class').indexOf('dbFieldItem') === -1), ((_.values(self.logFile).indexOf(droppableName)) !== -1), droppableName, droppableParentName);
                    self.revertToTables(($draggable.attr('class').indexOf('dbFieldItem') === -1), (droppableName !== ''), droppableName, droppableParentName);

                    self.logFile[droppableName] = draggableName;
                    $droppable.removeClass('empty');
                    $droppable.closest('.contentBlockRow').removeClass('emptyRow');
                    $droppable.text(draggableName);
                    $droppable.data('name', draggableName);
                    //$draggable.removeClass('borderField');

                    if ($draggable.attr('class').indexOf('dbFieldItem') !== -1) {

                        if (!droppableName.length) {
                            $droppable.addClass('dbFieldItemDrag');

                            $draggable.draggable({
                                disabled: true
                            });

                            $droppable.draggable({
                                revert  : true,
                                disabled: false
                            });

                            $droppable.siblings('.cleanButton').show();

                            $draggable.siblings('.cleanButton').hide();
                            $draggable.closest('.contentBlockRow').addClass('emptyRow');
                            $draggable.addClass('empty');
                        }

                        $droppable.data('parent', draggableParentName);
                        $draggable.data('parent', droppableParentName);

                        $draggable.text(droppableName);
                        $draggable.data('name', droppableName);
                    } else {
                        $draggable.draggable({
                            revert: false
                        });
                        if (!droppableName.length) {
                            $draggable.draggable({
                                disabled: true
                            });
                            $droppable.addClass('dbFieldItemDrag');
                            $droppable.draggable({
                                revert  : true,
                                disabled: false
                            });
                            $droppable.siblings('.cleanButton').show();
                        }

                        $droppable.data('parent', draggableParentName);
                        $draggable.remove();
                    }
                },

                over: function (event, ui) {
                    var $droppable = $(this).closest('div');

                    $droppable.closest('.contentBlockRow').addClass('hoverRow');
                },

                deactivate: function (event, ui) {
                    var $droppable = $(this).closest('div');
                    var $draggable = ui.draggable;

                    $draggable.removeClass('borderField');
                    $droppable.closest('.contentBlockRow').removeClass('hoverRow');
                },

                out: function (event, ui) {
                    var $draggable = ui.draggable;
                    var $droppable = $(this).closest('div');

                    $draggable.draggable({
                        revert: true
                    });

                    $droppable.closest('.contentBlockRow').removeClass('hoverRow');
                }
            });
        },

        render: function (data) {
            var $thisEl = this.$el;
            var self = this;


            $thisEl.find('#contentBlock').html(this.contentTemplate({
                content: data,
                fields : self.unmappedData
            }));

            this.draggableDBFields();

            $thisEl.find('.dbFieldItemDrag').draggable({
                revert: true
            });

            $thisEl.find('.fieldItem').draggable({
                revert: true,
                helper: 'clone',
                start : function () {
                    $(this).hide();
                },
                stop  : function () {
                    $(this).show()
                }
            });

            $thisEl.find('.empty').siblings('.cleanButton').hide();
            $thisEl.find('.empty').closest('.contentBlockRow').addClass('emptyRow');
            this.changeTab(null, $thisEl.find('.tabItem[data-tab="Customers"]'));
        }
    });

    return mappingContentView;
});