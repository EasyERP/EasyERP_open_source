define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Editor/EditorTemplate.html',
    'text!templates/Editor/NoteTemplate.html',
    'text!templates/Editor/timelineTemplate.html',
    'text!templates/Editor/editNote.html',
    'models/DealTasksModel',
    'views/DealTasks/EditView',
    'views/selectView/selectView',
    'views/Category/TagView',
    'moment',
    'populate',
    'constants'
], function (Backbone, $, _, NoteTemplate, onlyNoteTemplate, timelineTemplate, editNote, TaskModel, EditView, SelectView, CategoryView, moment, populate, CONSTANTS) {
    'use strict';

    var NoteView = Backbone.View.extend({

        template        : _.template(NoteTemplate),
        onlyNoteTemplate: _.template(onlyNoteTemplate),
        timeLineTemplate: _.template(timelineTemplate),

        initialize: function (options) {
            this.contentType = options.contentType;
            this.needNotes = options.hasOwnProperty('needNotes') ? options.needNotes : true;

            this.onlyNote = options.onlyNote;
            this.isCreate = options.isCreate;
            this.responseObj = {};
            this.taskModel = new TaskModel();
            this.taskModel.on('change:category', this.renderCategory, this);
        },

        events: {
            'focus .counterEl'                                 : 'checkCount',
            'click #noteArea, #taskArea'                       : 'expandNote',
            'click .cancelNote, #cancelTask'                   : 'cancelNote',
            'click #addNote, .saveNote'                        : 'saveNote',
            'click .contentHolder'                             : 'showButtons',
            'click #addTask'                                   : 'saveTask',
            'click .icon-circle'                               : 'completeTask',
            'click .editDelNote'                               : 'editDelNote',
            'click .icon-attach'                               : 'clickInput',
            'click .chart-tabs li'                             : 'changeTab',
            'click .current-selected:not(.jobs)'               : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        checkCount: function (e) {
            var $elem = $(e.target);
            var $parent = $elem.closest('.counterWrap');
            e.stopPropagation();
            var $counterEl = $parent.find('#counterValue');

            this.calculateValue($elem, $counterEl);
        },

        calculateValue: function (elem, countEl) {
            var $elem = elem;
            var maxValue = parseInt($elem.attr('maxlength'));
            var $counterEl = countEl;

            $elem.on('keyup', function () {
                var numOfSymbols = maxValue - $elem.val().length;
                var resultVal = (numOfSymbols === maxValue) ? maxValue : numOfSymbols ? numOfSymbols : '0';

                $counterEl.text(resultVal);
            })
        },

        showButtons: function (e) {

            var target = $(e.target);
            var $target = target.closest('.contentHolder');
            var hasClass = $target.hasClass('showButtons');
            var $thisEl = this.$el;

            if (target.closest('.itemCircle').length) {
                return false;
            }

            if ($thisEl.find('.editedNote').length || $thisEl.find('.createHolder').hasClass('active')) {
                return false;
            }

            $thisEl.find('.contentHolder').removeClass('showButtons');
            if (!hasClass) {
                $target.addClass('showButtons');
            }
        },

        expandNote: function (e) {
            var $target = $(e.target);
            var createHolder = $target.parents('.createHolder');

            if (this.$el.find('.editedNote').length) {
                return false;
            }
            if (!createHolder.hasClass('active')) {
                createHolder.addClass('active');
            }
        },

        completeTask: function (e) {
            var $target = $(e.target);
            var self = this;
            var $thisEl = this.$el;
            var id = $target.closest('.noteContainer').attr('id');
            var model = new TaskModel({_id: id});
            model.fetch();
            model.on('sync', function (success) {

                model.save({
                    workflow     : CONSTANTS.DONE_WORKFLOW,
                    sequence     : -1,
                    workflowStart: model.get('workflow')._id,
                    sequenceStart: model.get('sequence')
                }, {
                    wait    : true,
                    patch   : true,
                    validate: false,
                    success : function () {
                        $target.switchClass('icon-circle', 'icon-check-circle');
                        model.unbind();

                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }

                });
            });

        },

        saveTask: function (dontCheck) {
            var self = this;
            var $thisEl = this.$el;
            var assignedTo = $thisEl.find('#assignedToDd').attr('data-id');
            var $description = $thisEl.find('#taskArea');
            var description = $.trim($description.val());
            var dueDate = $.trim($thisEl.find('#taskDueDate').val());
            var time = moment($.trim($thisEl.find('#timepickerOne').wickedpicker('time')).split(' '), 'hh:mm:ss A');

            if (dueDate) {
                dueDate = moment(dueDate).hours(time.get('hours')).minutes(time.get('minutes')).seconds(time.get('seconds')).toDate();
            }
            var saveObject = {
                assignedTo : assignedTo || '',
                description: description,
                dueDate    : dueDate,
                workflow   : CONSTANTS.NOT_STARTED_WORKFLOW,
                category   : this.taskModel.get('category') ? this.taskModel.get('category')._id : null
            };

            switch (this.contentType) {
                case 'Persons':
                    saveObject.contact = this.model.id;
                    saveObject.contactDate = new Date();
                    break;
                case 'Companies':
                    saveObject.company = this.model.id;
                    saveObject.companyDate = new Date();
                    break;
                case 'Opportunities':
                    saveObject.deal = this.model.id;
                    saveObject.dealDate = new Date();
                    break;
            }

            if (!description && !dontCheck) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Description'
                });
            } else if (!description) {
                return false;
            }

            this.taskModel.save(saveObject, {
                wait   : true,
                success: function () {
                    self.model.fetch({
                        success: function () {
                            self.taskModel = new TaskModel();
                            self.taskModel.on('change:category', self.renderCategory, self);
                            $thisEl.find('#taskArea').val('');
                            $thisEl.find('.createHolder').removeClass('active');
                            self.renderTimeline();
                            self.renderCategory();
                        }
                    });
                },

                error: function (model, xhr) {
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

        editNote: function (currentNote) {
            var holder = this.$el.find('#' + currentNote._id);
            holder.find('.contentHolder').hide();
            holder.append(_.template(editNote, {note: currentNote}));
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.closest('a');
            var id = $target.attr('id');
            holder.text($target.text()).attr('data-id', id);
        },

        editDelNote: function (e) {
            var $target = $(e.target);

            var type = $target.attr('data-type');
            var idInt = $target.closest('.noteContainer').attr('id');
            var currentModel = this.model;
            var notes = currentModel.get('notes');
            var newNotes;
            var model;

            var currentNote = _.filter(notes, function (note) {
                if (note._id === idInt) {
                    return note;
                }
            })[0];

            if (currentNote.task) {
                model = new TaskModel();
                model.set(model.parse(currentNote.task));
            }

            switch (type) {
                case 'edit':

                    if (model) {
                        new EditView({model: model});
                    } else {
                        this.editNote(currentNote);
                    }

                    break;
                case 'del':

                    if (model && confirm('You really want to remove task? ')) {
                        model.destroy({
                            success: function () {
                                $('#' + idInt).remove();
                            }
                        });

                    } else {
                        newNotes = _.filter(notes, function (note) {
                            if (note._id !== idInt && !note.task && !note.history) {
                                return note;
                            }
                        });

                        if (confirm('You really want to remove note? ')) {
                            currentModel.save({notes: newNotes},
                                {
                                    headers: {
                                        mid   : 39,
                                        remove: true
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
            dialogHolder = this.$el.find('.dialog-tabs-items');
            dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
            dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
        },

        cancelNote: function (e) {
            var $target = $(e.target);
            var $addNote = $target.closest('.addNote');
            var contentHolder = $target.closest('.noteContainer');
            if (contentHolder.length) {
                contentHolder.find('.contentHolder').show();
                contentHolder.find('.contentHolder').removeClass('showButtons');
                $addNote.remove();
            } else {
                $addNote.find('#noteArea').val('');
                $target.parents('.createHolder').removeClass('active');
                $target.parents('.addTask').find('#taskArea').val('');
            }
        },

        saveNote: function (e) {
            var self = this;
            var $target = e ? $(e.target) : $('#noteArea');
            var $noteArea = $target.parents('.addNote').find('#noteArea');
            var $noteContainer = $target.closest('.noteContainer');
            var targetId = $noteContainer.attr('id');
            var $thisEl = this.$el;
            var val;
            var title;
            var formModel;
            var notes;
            var editNotes;
            var noteObj;

            if ($noteArea.val().replace(/\s/g, '')) {
                $noteArea.attr('placeholder', 'Add a Note...Max 500 symbols.').parents('.addNote').removeClass('active');
                $thisEl.find('.title-wrapper').hide();
                $thisEl.find('.addTitle').hide();
            } else {
                $noteArea.focus();
            }

            if (e) {
                e.preventDefault();
            }

            val = $.trim($noteArea.val()).replace(/</g, '&#60;').replace(/>/g, '&#62;');

            if (!val && e) { // textarrea notes not be empty
                return App.render({
                    type   : 'error',
                    message: 'Note can not be empty'
                });
            } else if (!val) {
                return false;
            }

            if (val.replace(/\s/g, '')) {
                formModel = this.model;
                notes = formModel.get('notes');
                notes = notes.filter(function (elem) {
                    return !elem.task && !elem.history;
                });
                noteObj = {};
                if (targetId) {
                    editNotes = _.map(notes, function (note) {
                        if (note._id === targetId) {
                            note.note = val;
                        }
                        return note;
                    });

                    if (self.isCreate) {
                        return formModel.set('notes', editNotes)
                    }

                    formModel.save({notes: editNotes},
                        {
                            validate: false,
                            headers : {
                                mid : 39,
                                edit: true
                            },

                            patch  : true,
                            success: function () {
                                var $contentHolder = $noteContainer.find('.contentHolder');
                                $contentHolder.removeClass('showButtons');
                                /*  $contentHolder.find('.noteTitle').text(title);*/
                                $contentHolder.find('.noteText').text(val).removeClass('hidden');
                                $contentHolder.show();
                                $target.closest('.addNote').remove();
                            }
                        });
                } else {
                    noteObj.note = val;
                    noteObj.date = moment();
                    //noteObj.date = moment(noteObj.date).format('DD MMM, YYYY);
                    notes.push(noteObj);

                    if (self.isCreate) {

                        var formLeftColumn = self.$el.find('.formLeftColumn');
                        var noteWrapper = formLeftColumn.find('.noteWrapper');

                        formModel.set('notes', notes);

                        noteWrapper.empty();
                        formLeftColumn.append(self.render());

                        return false;
                    }
                    formModel.save({notes: notes}, {
                        headers : {
                            mid: 39
                        },
                        patch   : true,
                        validate: false,
                        wait    : true,
                        success : function () {
                            var formLeftColumn = self.$el.find('.formLeftColumn');
                            var noteWrapper = formLeftColumn.find('.noteWrapper');

                            noteWrapper.empty();
                            formLeftColumn.append(self.render());
                        },

                        error: function (models, xhr) {
                            self.errorNotification(xhr);

                        }
                    });
                }
            } else {
                return false;
            }

        },

        renderTimeline: function () {
            var notes = this.model.get('notes');

            this.$el.find('#timeline').html(_.template(timelineTemplate, {notes: notes}));
        },

        renderCategory: function () {
            var notDiv = this.$el.find('#categoryHolder');

            notDiv.html(
                new CategoryView({
                    model      : this.taskModel,
                    contentType: 'DealTasks'
                }).render().el
            );
            this.$el.find('#taskDueDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });
        },

        render: function () {
            var modelObj = this.model.toJSON();
            var date = moment().format('DD MMM, YYYY');
            var assignedTo = modelObj.salesPerson;
            var $thisEl = this.$el;
            var relatedEmployeeId = App.currentUser.relatedEmployee ? App.currentUser.relatedEmployee._id : null;

            modelObj.needNotes = this.needNotes;

            if (this.onlyNote) {
                $thisEl.html(this.onlyNoteTemplate({date: date, assignedTo: assignedTo}));

            } else {
                $thisEl.html(this.template({date: date, assignedTo: assignedTo}));
            }

            this.renderTimeline();

            this.renderCategory();
            this.$el.find('#timepickerOne').wickedpicker({
                showSeconds    : true, // Whether or not to show seconds,
                secondsInterval: 1, // Change interval for seconds, defaults to 1,
                minutesInterval: 1
            });

            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, false, false, relatedEmployeeId);

            return this;
        }
    });

    return NoteView;
});
