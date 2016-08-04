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
        el: '#contentBlock',
        contentTemplate       : _.template(ContentTemplate),

        initialize: function () {
            var url = '/importFile/imported';
            var self = this;

            this.logFile = {};

            dataService.getData(url,{},function(data) {
                self.render(data);
            });
            //this.render();
        },

        goToPreview: function () {
            var $thisEl = this.$el;
            var $contentBlock = $thisEl.find('#contentBlock');

            $contentBlock.html();
        },

        draggableDBFields: function() {
            var self = this;

            $('.dbFieldItem').droppable({
                accept   : '.dbFieldItemDrag, .fieldItem',
                tolerance: 'pointer',
                drop     : function (event, ui) {
                    var $droppable = $(this).closest('div');
                    var $draggable = ui.draggable;
                    var draggableName = $draggable.data('name');
                    var droppableName = $droppable.data('name');


                    /*console.log('dropable ',$droppable);
                    console.log('dropableName ',droppableName);
                    console.log('dragable ',$draggable);
                    console.log('dragableName ',draggableName);*/

                    if (Object.keys(self.logFile).indexOf($droppable.data('name')) !== -1) {

                    }

                    self.logFile[droppableName] = draggableName;

                    //console.log(Object.keys(self.logFile));
                    //console.log($droppable.data('name'));

                    if ($draggable.attr('class').indexOf('dbFieldItem') !== -1) {
                        if (!droppableName.length) {
                            $droppable.addClass('dbFieldItemDrag');
                            $draggable.draggable({
                                disabled: true
                            });
                            $droppable.draggable({
                                revert: true,
                                disabled: false
                            });
                        }
                        $droppable.html(draggableName);
                        $droppable.data('name', draggableName);
                        $draggable.html(droppableName);
                        $draggable.data('name', droppableName);
                    } else {
                        if (!droppableName.length) {
                            $draggable.draggable({
                                disabled: true
                            });
                            $droppable.draggable({
                                revert: true,
                                disabled: false
                            });
                        }
                        $droppable.html(draggableName);
                        $droppable.data('name', draggableName);
                        $draggable.remove();
                    }
                },

                over: function () {
                    /*var $droppableEl = $(this);
                    var $groupList = self.$el;

                    $groupList.find('.selected').removeClass('selected');
                    $droppableEl.addClass('selected');*/
                },

                out: function () {
                    /*$(this).removeClass('selected');*/
                }
            });
        },

        render: function (data) {
            var $thisEl = this.$el;

            $thisEl.html(this.contentTemplate({
                content: data.result,
                fields: importMapping
            }));

            this.draggableDBFields();

            $thisEl.find('.dbFieldItemDrag').draggable({
                revert: true
            });

            $thisEl.find('.fieldItem').draggable({
                revert: true,
                revertDuration: 300
            });
        }
    });

    return mappingContentView;
});