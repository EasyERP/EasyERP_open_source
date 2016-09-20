define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/FieldsTemplate.html',
    'constants/importMapping',
    'constants/mappingFields',
    'constants',
    'dataService',
    'common'
], function (Backbone, $, _, ContentTemplate, importMapping, mappingFields, CONSTANTS, dataService, common) {
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

            this.type = App.currentUser.imports.type || '';
            this.timeStamp = options.timeStamp;
            this.fileName = options.fileName;

            this.logFile = {};

            /*if (App.currentUser.imports && App.currentUser.imports.map) {
             self.data = {};
             self.data[App.currentUser.imports.map.type] = App.currentUser.imports.map.result;
             self.render(self.data);
             } else {*/
            dataService.getData(url, {timeStamp: this.timeStamp, type: this.type}, function (data) {
                if (data.error) {
                    alert(data.error.responseText);
                    $('#cancelBtn').click();
                } else {
                    self.data = data.mappedObj;
                    self.unmappedData = data.unmappedObj;
                    self.required = data.requiredFields;
                    self.render(self.data);
                }
            });
            //}

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
            //$field.data('parent', '');
            $field.addClass('empty');
            $field.closest('.contentBlockRow').addClass('emptyRow');
            $field.removeClass('dbFieldItemDrag');
            $field.closest('.secondBox').removeClass('required');
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
            var firstColumnVal;
            var secondColumnVal;
            var required = self.required.slice();
            var index;

            fieldsObject.type = parentTable;
            fieldsObject.result = {};

            for (var i = 0; i < $content.length; i++) {
                firstColumnVal = $($content[i]).find('.firstColumn').data('name');
                secondColumnVal = $($content[i]).find('.secondColumn').data('name');

                index = required.indexOf(secondColumnVal);

                if (secondColumnVal && !Array.isArray(secondColumnVal)) {
                    fieldsObject.result[firstColumnVal] = secondColumnVal;
                }

                if (index >= 0) {
                    required.splice(index, 1);
                }
            }

            if (required.length > 0) {
                alert('please check required fields');
                fieldsObject = {};
            }

            return fieldsObject;
        },

        findKeyByValue: function (obj, value) {
            var result = 0;

            _.each(obj, function (item, key) {
                if (item === value) {
                    result = key;
                }
            });

            return result;
        },

        revertToTables: function (isItClass, isDropable, droppableName, droppableParentName) {
            var self = this;
            var required = '';
            var span = '';

            if (self.required.indexOf(droppableName) >= 0) {
                required = 'required';
                span = '<span class="requiredIcon icon-warning2"></span>';
            }

            if ((isItClass) && (isDropable)) {
                delete self.logFile[self.findKeyByValue(self.logFile, droppableName)];

                self.$el.find('.fieldsItems[data-tab=' + droppableParentName + ']')
                    .find('ul')
                    .append('<li class="' + required + '"><div class="fieldItem" data-parent="' + droppableParentName + '" style="cursor: pointer"  data-name="' + droppableName + '">' + mappingFields[droppableParentName][droppableName] + span + '</div></li>')
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
                    $droppable.text(mappingFields[draggableParentName][draggableName]);
                    $droppable.data('name', draggableName);

                    //$draggable.removeClass('borderField');


                    //<% if (required.indexOf(item) >= 0) { %> required <% } %>

                    if ($draggable.attr('class').indexOf('dbFieldItemDrag') !== -1) {

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


                        if ($droppable.closest('.secondBox').attr('class').indexOf('required') < 0) {
                            $draggable.closest('.secondBox').removeClass('required');
                            if (self.required.indexOf(draggableName) !== -1) {
                                $droppable.closest('.secondBox').addClass('required');
                            }
                        }




                        $draggable.text(mappingFields[droppableParentName][droppableName]);
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
                            $droppable.siblings('.cleanButon').show();
                        }

                        if (self.required.indexOf(draggableName) !== -1) {
                            $droppable.closest('.secondBox').addClass('required');
                        }

                        if ($draggable.closest('li').attr('class').indexOf('required') < 0) {
                            $droppable.closest('.secondBox').removeClass('required');
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

                    $draggable.attr('z-index', 0);
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


            $thisEl.html(this.contentTemplate({
                content      : data,
                fields       : self.unmappedData,
                mappingFields: mappingFields,
                required     : self.required
            }));

            this.draggableDBFields();

            $thisEl.find('.dbFieldItemDrag').draggable({
                revert: true
            });

            $thisEl.find('.fieldItem').draggable({
                revert: true,
                helper: 'clone',

                start: function () {
                    $(this).hide();
                },

                stop: function () {
                    $(this).show();
                }
            });

            $thisEl.find('.empty').siblings('.cleanButton').hide();
            $thisEl.find('.empty').closest('.contentBlockRow').addClass('emptyRow');
            this.changeTab(null, $thisEl.find('.tabItem[data-tab="' + this.type + '"]'));
        }
    });

    return mappingContentView;
});