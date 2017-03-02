define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/NoteEditor/EditorTemplate.html',
    'text!templates/NoteEditor/AddNote.html',
    'text!templates/NoteEditor/timelineTemplate.html',
    'moment'
], function (Backbone, $, _, NoteTemplate, AddNote, timelineTemplate, moment) {
    'use strict';

    var NoteView = Backbone.View.extend({

        template        : _.template(NoteTemplate),
        timeLineTemplate: _.template(timelineTemplate),

        initialize: function (options) {
            this.contentType = options.contentType;
            this.needNotes = options.hasOwnProperty('needNotes') ? options.needNotes : true;
            this.responseObj = {};
        },

        events: {
            'click .saveNote'             : 'saveNote',
            'click .cancelNote'           : 'cancelNote',
            'click #addNote'              : 'createNote',
            'click .noteWrapper .showmore': 'showMore',
            'click .noteWrapper .hideList': 'hideList',
            'click .editDelNote'          : 'editDelNote',
            'click .contentHolder'        : 'showButtons'
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

        showMore: function (e) {
            var $target = $(e.target).closest('.noteWrapper');
            $target.addClass('open');
        },

        hideList: function (e) {
            var $target = $(e.target).closest('.noteWrapper');
            $target.removeClass('open');
        },

        editDelNote: function (e) {
            var $target = $(e.target);

            var type = $target.attr('data-type');
            var idInt = $target.closest('.noteContainer').attr('id');
            var currentModel = this.model;
            var notes = currentModel.get('notes');
            var $showMore = this.$el.find('.showMoreBtns');
            var newNotes;
            var model;

            newNotes = _.filter(notes, function (note) {
                if (note._id !== idInt && !note.history && !note.pay) {
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
                            if ($('#' + idInt).length) {
                                $('#' + idInt).remove();
                            } else {
                                $target.closest('.noteContainer').remove();
                            }
                            if (currentModel.get('notes').length > 3) {
                                $showMore.removeClass('hidden');
                            } else {
                                $showMore.addClass('hidden');
                            }
                        }
                    });
            }

        },

        cancelNote: function (e) {
            this.$el.find('#addNote').removeClass('hidden');
            this.$el.find('#addNoteDiv').empty();
        },

        createNote: function (e) {
            this.$el.find('#addNoteDiv').html(_.template(AddNote));
            $(e.target).closest('button').addClass('hidden');
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

        editNote: function (currentNote) {
            var holder = this.$el.find('#' + currentNote._id);
            holder.find('.contentHolder').hide();
            holder.append(_.template(editNote, {note: currentNote}));
        },

        saveNote: function (e) {
            //console.log('save Note');
            var self = this;
            var $target = $(e.target);
            var $noteArea = $target.parents('.noteContainer').find('.noteText');
            /* var $noteTitleArea = $target.parents('.addNote').find('#noteTitleArea');*/
            var $thisEl = this.$el;
            var val;
            var formModel;
            var notes;
            var noteObj;

            if ($noteArea.val().replace(/ /g, '')) {
                $noteArea.attr('placeholder', 'Add a Note...Max 500 symbols.').parents('.addNote').removeClass('active');
                $thisEl.find('.title-wrapper').hide();
                $thisEl.find('.addTitle').hide();
            } else {
                $noteArea.focus();
            }

            e.preventDefault();
            val = $.trim($noteArea.val()).replace(/</g, '&#60;').replace(/>/g, '&#62;');
            /*  title = $.trim($noteTitleArea.val()).replace(/</g, '&#60;').replace(/>/g, '&#62;');*/

            if (!val) {
                return App.render({
                    type   : 'error',
                    message: 'Note can not be empty'
                });
            }

            if (val.replace(/ /g, '')) {
                formModel = this.model;
                notes = formModel.get('notes');
                notes = notes.filter(function (elem) {
                    return !elem.history && !elem.pay;
                });
                noteObj = {};
                {
                    noteObj.note = val;
                    noteObj.date = new Date();
                    notes.push(noteObj);
                    formModel.save({notes: notes}, {
                        headers : {
                            mid: 39
                        },
                        patch   : true,
                        validate: false,
                        wait    : true,
                        success : function () {
                            self.renderTimeline();
                            self.cancelNote();

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
            var modelObj = this.model.toJSON();
            var notes = this.model.get('notes');
            var $showMore = this.$el.find('.showMoreBtns');

            if (notes.length > 3) {
                $showMore.removeClass('hidden');
            } else {
                $showMore.addClass('hidden');
            }

            this.$el.find('#timeline').html(_.template(timelineTemplate, {notes: notes}));
        },

        render: function () {
            var modelObj = this.model.toJSON();
            var date = moment().format('DD MMM, YYYY');
            var assignedTo = modelObj.salesPerson;
            var $thisEl = this.$el;
            var relatedEmployeeId = App.currentUser.relatedEmployee ? App.currentUser.relatedEmployee._id : null;

            modelObj.needNotes = this.needNotes;

            $thisEl.html(this.template({length: modelObj.notes.length}));

            this.renderTimeline();
            return this;
        }
    });

    return NoteView;
});
