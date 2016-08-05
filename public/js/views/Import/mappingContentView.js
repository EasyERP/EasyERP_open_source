define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/FieldsTemplate.html',
    'views/Import/previewContentView',
    'constants/importMapping',
    'constants',
    'dataService',
    'common'
], function (Backbone, $, _, ContentTemplate, PreviewView, importMapping, CONSTANTS, dataService, common) {
    'use strict';

    var mappingContentView = Backbone.View.extend({
        el                    : '#content-holder',
        contentTemplate       : _.template(ContentTemplate),

        events: {
            'click #clickToReset': 'resetForm',
            'click .stageBtn': 'goToPreview',
            'click .tabItem' : 'changeTab'
        },

        initialize: function () {
            var url = '/importFile/imported';
            var self = this;

            $(document).mousemove(function(e){
                self.X = e.pageX; // положения по оси X
                self.Y = e.pageY; // положения по оси Y
                //console.log("X: " + self.X + " Y: " + self.Y); // вывод результата в консоль
            });

            this.logFile = {};


            dataService.getData(url,{},function(data) {
                self.data = data;
                self.render(self.data);
            });
            //this.render();
        },

        resetForm: function() {
            this.render(this.data);
        },

        changeTab: function() {

        },

        goToPreview: function () {
            var $thisEl = this.$el;
            var url = '/importFile/imported';
            var $dbContentBlock = $thisEl.find('#dbContentBlock');
            var fieldsObject = {};
            var $content = $dbContentBlock.find('.content');

            for (var i = 0; i < $content.length; i++) {
                var firstColumnVal = $($content[i]).find('.firstColumn').data('name');
                var secondColumnVal = $($content[i]).find('.secondColumn').data('name');
                if (secondColumnVal) {
                    fieldsObject[firstColumnVal] = secondColumnVal;
                }
            }

            dataService.postData(url, fieldsObject, function(err, data) {
                if (err) {
                    return alert(err.responseText)
                }
                alert('post is successfull');
            });
        },

        findKeyByValue: function(obj, value) {
            var result;

            _.each(obj, function(item, key) {
                if (item === value) {
                    result = key;
                }
            });


            return result
        },

        draggableDBFields: function() {
            var self = this;
            var fieldsBlock;

            $('.dbFieldItem').droppable({
                accept   : '.dbFieldItemDrag, .fieldItem',
                tolerance: 'pointer',
               /* activate : function(event, ui) {
                    var $draggable = ui.draggable;

                    //$draggable.addClass('draggableActive');
                    console.log(self.X, self.Y);
                    $draggable.css({'position':'fixed','top': self.Y, 'left': self.X});
                },*/

                drop     : function (event, ui) {
                    var $droppable = $(this).closest('div');
                    var $draggable = ui.draggable;
                    var draggableName = $draggable.data('name');
                    var droppableName = $droppable.data('name');
                    var draggableParentName = $draggable.data('parent');
                    var droppableParentName = $droppable.data('parent');



                    if (($draggable.attr('class').indexOf('dbFieldItem') === -1) && (_.values(self.logFile).indexOf(droppableName)) !== -1) {

                        if (droppableParentName === 'customers' || droppableParentName === 'employees') {
                            delete self.logFile[self.findKeyByValue(self.logFile, droppableName)];
                            self.$el.find('.tabItem[data-tab=' + droppableParentName + ']')
                                .find('ul')
                                .append('<li><div class="fieldItem" data-parent="' + droppableParentName + '" style="cursor: pointer"  data-name="' + droppableName + '">' + droppableName +'</div></li>')
                                .find('div[data-name="' + droppableName +'"]')
                                .draggable({
                                    revert: true
                                });

                        }
                    }


                    self.logFile[droppableName] = draggableName;

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
                        $droppable.text(draggableParentName);
                        $droppable.data('parent', draggableParentName);
                        $draggable.text(droppableParentName);
                        $draggable.data('parent', droppableParentName);
                        $droppable.text(draggableName);
                        $droppable.data('name', draggableName);
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
                        }
                        $droppable.text(draggableName);
                        $droppable.data('name', draggableName);
                        $droppable.data('parent', draggableParentName);
                        $draggable.remove();
                    }
                },

                over: function () {
                    /*var $droppableEl = $(this);
                    var $groupList = self.$el;

                    $groupList.find('.selected').removeClass('selected');
                    $droppableEl.addClass('selected');*/
                },

                out: function (event, ui) {
                    var $draggable = ui.draggable;

                    $draggable.draggable({
                        revert: true
                    });
                    /*$(this).removeClass('selected');*/
                }
            });
        },

        render: function (data) {
            var $thisEl = this.$el;
            var self = this;

            $thisEl.find('#contentBlock').html(this.contentTemplate({
                content: data.result,
                fields: importMapping
            }));

            this.draggableDBFields();

            $thisEl.find('.dbFieldItemDrag').draggable({
                revert: true
            });

            $thisEl.find('.fieldItem').draggable({
                revert: true,
                helper: 'clone',
                start: function(){
                    $(this).hide();
                },
                stop: function(){
                    $(this).show()
                }
                /*start: function(event, ui) {
                    var $draggable = $(this);

                    $draggable.addClass('draggableActive');
                },
                drag: function(event, ui) {
                    var $draggable = $(this);
                    //var $draggable = ui.draggable;

                    //$draggable.addClass('draggableActive');
                    //console.log(self.X, self.Y);
                    ui.position.left = self.X;
                    ui.position.top = self.Y;

                    //$draggable.offset({top: self.Y, left: self.X})
                    //$draggable.css({'position':'fixed','top': self.Y, 'left': self.X});
                },

                stop: function(event, ui) {
                    var $draggable = $(this);

                    $draggable.removeClass('draggableActive');
                }*/
            });
        }
    });

    return mappingContentView;
});