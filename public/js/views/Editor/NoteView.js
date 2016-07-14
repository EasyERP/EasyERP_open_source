define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Editor/EditorTemplate.html',
    'text!templates/Editor/timelineTemplate.html',
    'text!templates/Editor/editNote.html',
    'models/DealTasksModel',
    'views/DealTasks/EditView',
    'views/Editor/AttachView',
    'views/selectView/selectView',
    'moment',
    'populate',
    'constants'
], function (Backbone, $, _, NoteTemplate, timelineTemplate, editNote, TaskModel,EditView, AttachView, SelectView, moment, populate, CONSTANTS) {
    var NoteView = Backbone.View.extend({

        template: _.template(NoteTemplate),
        
        initialize: function (options) {
            this.contentType = options.contentType;
            this.needNotes = options.hasOwnProperty('needNotes') ? options.needNotes : true;
            this.responseObj = {};
        },

        events: {
            'click #noteArea'     : 'expandNote',
            'click #cancelNote'   : 'cancelNote',
            'click #addNote'      : 'saveNote',
            'click .noteContainer': 'showButtons',
            'click #addTask, .saveTask' : 'saveTask',

            'click .addTitle'     : 'showTitle',
            'click .editDelNote'  : 'editDelNote',
            'click .fa-paperclip' : 'clickInput',
            'click .chart-tabs'   : 'changeTab',
            'click .current-selected:not(.jobs)'                         : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)'          : 'chooseOption'
        },

        showButtons : function (e){
            var $target = $(e.target).closest('.noteContainer');
            $target.toggleClass('showButtons');
            $target.prevAll().each(function(){
                $(this).removeClass('showButtons');
            });
            $target.nextAll().each(function(){
                $(this).removeClass('showButtons');
            });

        },

        saveTask: function () {
            var self = this;
            var assignedTo = this.$el.find('#assignedToDd').data('id');
            var $description = this.$el.find('#taskArea');
            var description = $.trim($description.val());
            var dueDate = $.trim(this.$el.find('#taskDueDate').val());
            var saveObject = {
                assignedTo : assignedTo || '',
                description: description,
                dueDate   : dueDate,
                workflow  : CONSTANTS.NOT_STARTED_WORKFLOW
            };


            switch(this.contentType) {
                case 'Persons':
                    saveObject.contact = this.model.id;
                    saveObject.contactDate =new Date();
                    break;
                case 'Companies':
                    saveObject.company = this.model.id;
                    saveObject.companyDate = new Date();
                    break;
                case 'opportunities':
                    saveObject.deal = this.model.id;
                    saveObject.dealDate = new Date();
                    break;
            }

            var model = new TaskModel();

            if (!description){
                return App.render({
                    type   : 'error',
                    message: 'Please add Description'
                });
            }

            model.save(saveObject, {
                    wait   : true,
                    success: function (model, res) {
                        var formLeftColumn = self.$el.find('.formLeftColumn');
                        var noteWrapper = formLeftColumn.find('.noteWrapper');

                        noteWrapper.empty();
                        self.model.fetch({success : function(){
                            formLeftColumn.append(self.render());
                        }});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }

                });
        },

        saveNewNote : function (optionsObj){
            var formModel = this.model;
            var self = this;
            var notes = formModel.get('notes');
            notes = notes.filter(function(elem){
                return !elem.task;
            });
            notes.push(optionsObj);
            formModel.save({notes: notes}, {
                headers: {
                    mid: 39
                },
                patch  : true,
                wait   : true,
                success: function (models, data) {
                    var formLeftColumn = self.$el.find('.formLeftColumn');
                    var noteWrapper = formLeftColumn.find('.noteWrapper');

                    noteWrapper.empty();
                    formLeftColumn.append(self.render());
                },

                error: function (models, xhr) {
                    self.errorNotification(xhr);

                }
            });
        },

        clickInput: function () {
            $('.input-file .inputAttach').click();
        },
        showNewSelect: function (e) {
            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        editNote : function (currentNote){
            var holder = this.$el.find('#'+ currentNote._id);
            holder.find('.contentHolder').hide();
            holder.append(_.template(editNote, currentNote));
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.closest('a');
            var type = holder.closest('a').attr('data-id');
            var id = $target.attr('id');
            holder.text($target.text()).attr('data-id', id);
        },

        editDelNote: function (e) {
            var id = e.target.id;
            var k = id.indexOf('_');
            var $thisEl = this.$el;
            var self = this;
            var type = id.substr(0, k);
            var idInt = id.substr(k + 1);
            var currentModel = this.model;
            var notes = currentModel.get('notes');
            var newNotes;
            var currentNote = _.filter(notes, function (note) {
                if (note._id === idInt) {
                    return note;
                }
            })[0];
            var model;
            if (currentNote.task){
                model = new TaskModel(currentNote.task);
            }

            switch (type) {
                case 'edit':

                    if (model){
                        new EditView({model : model});
                    } else {
                        this.editNote(currentNote);
                    }

                    break;
                case 'del':

                    if (model && confirm('You really want to remove task? ')){
                        model.destroy({success : function (){
                            $('#' + idInt).remove();
                        }});


                    } else {
                        newNotes = _.filter(notes, function (note) {
                            if (note._id !== idInt && !note.task) {
                                return note;
                            }
                        });

                        if (confirm('You really want to remove note? ')) {
                            currentModel.save({notes: newNotes},
                                {
                                    headers: {
                                        mid: 39
                                    },
                                    patch  : true,
                                    success: function () {
                                        $('#' + idInt).remove();
                                    }
                                });
                        }
                    }


                    break;
            }
        },

        changeTab: function (e) {
            var target = $(e.target);
            var $aEllement = target.closest('a');
            var n;
            var dialogHolder;

            target.closest('.chart-tabs').find('a.active').removeClass('active');
            $aEllement.addClass('active');
            n = target.parents('.chart-tabs').find('li').index($aEllement.parent());
            dialogHolder = $('.dialog-tabs-items');
            dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
            dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
        },

        expandNote: function (e) {
            if (!$(e.target).parents('.addNote').hasClass('active')) {
                $(e.target).attr('placeholder', '').parents('.addNote').addClass('active');
                this.$el.find('.addTitle').show();
            }
        },

        cancelNote: function (e) {
            $(e.target).parents('.addNote').find('#noteArea').attr('placeholder', 'Add a Note...').parents('.addNote').removeClass('active');
            $(e.target).parents('.addNote').find('#noteArea').val('');
            this.$el.find('#getNoteKey').val('');// remove id from hidden field if note editing is cancel
            this.$el.find('.title-wrapper').hide();
            this.$el.find('.addTitle').hide();
            this.$el.find('#noteArea').val('');
            this.$el.find('#noteTitleArea').val('');
            this.$el.find('#getNoteKey').attr('value', '');
        },

        saveNote: function (e) {
            var self = this;
            var $target = $(e.target);
            var $noteArea = $target.parents('.addNote').find('#noteArea');
            var $noteTitleArea = $target.parents('.addNote').find('#noteTitleArea');
            var targetId = $target.parents('.noteContainer').id();
            var $thisEl = this.$el;
            var val;
            var title;
            var formModel;
            var notes;
            var arrKeyStr;
            var noteObj;
            var editNotes;

            if ($noteArea.val().replace(/ /g, '') || $noteTitleArea.val().replace(/ /g, '')) {
                $noteArea.attr('placeholder', 'Add a Note...').parents('.addNote').removeClass('active');
                $thisEl.find('.title-wrapper').hide();
                $thisEl.find('.addTitle').hide();
            } else {
                $noteArea.focus();
            }

            e.preventDefault();
            val = $.trim($noteArea.val()).replace(/</g, '&#60;').replace(/>/g, '&#62;');
            title = $.trim($noteTitleArea.val()).replace(/</g, '&#60;').replace(/>/g, '&#62;');

            if (!val && !title) { // textarrea notes not be empty
               return App.render({
                    type   : 'error',
                    message: 'Note can not be empty'
                });
            }
            if (val.replace(/ /g, '') || title.replace(/ /g, '')) {
                formModel = this.model;
                notes = formModel.get('notes');
                notes = notes.filter(function (elem) {
                    return !elem.task;
                });

                noteObj = {
                    note : '',
                    title: ''
                };
                if (targetId) {
                    editNotes = _.map(notes, function (note) {
                        if (note._id === targetId) {
                            note.note = val;
                            note.title = title;
                        }
                        return note;
                    });
                    formModel.save({notes: editNotes},
                        {
                            headers: {
                                mid: 39
                            },
                            patch  : true,
                            success: function () {
                                $thisEl.find('#noteBody').val($('#' + targetId).html('.noteText').html(val));
                                $thisEl.find('#noteBody').val($('#' + targetId).find('.noteTitle').html(title));
                                $thisEl.find('#getNoteKey').attr('value', '');
                            }
                        });
                } else {
                    noteObj.note = val;
                    noteObj.title = title;
                    self.saveNewNote(noteObj);
                }
            } else {
                return false;
            }

        },

        showTitle: function (e) {
            $(e.target).hide().parents('.addNote').find('.title-wrapper').show().find('input').focus();
        },

        render: function () {
            var modelObj = this.model.toJSON();
            var date = moment().format("DD MMM, YYYY");
            var notes = this.model.get('notes');

            modelObj.needNotes = this.needNotes;
            var assignedTo = modelObj.salesPerson;

            this.$el.html(this.template({date : date, assignedTo : assignedTo}));

            this.$el.find('#taskDueDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });

            this.$el.find('#timeline').html(_.template(timelineTemplate, {notes : notes}));
            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, false);

            return this;
        }
    });

    return NoteView;
});
