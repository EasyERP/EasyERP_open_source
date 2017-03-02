define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Notes/NoteTemplate.html',
    'views/Notes/AttachView'
], function (Backbone, $, _, NoteTemplate, AttachView) {
    var NoteView = Backbone.View.extend({

        template: _.template(NoteTemplate),

        initialize: function (options) {
            this.contentType = options.contentType;
            this.isCreate = options.isCreate;
            this.needNotes = options.hasOwnProperty('needNotes') ? options.needNotes : true;
        },

        events: {
            'click #noteArea'   : 'expandNote',
            'click #cancelNote' : 'cancelNote',
            'click #addNote'    : 'saveNote',
            'click .addTitle'   : 'showTitle',
            'click .editDelNote': 'editDelNote',
            'click .icon-attach': 'clickInput'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        editDelNote: function (e) {
            var id = e.target.id;
            var k = id.indexOf('_');
            var type = id.substr(0, k);
            var idInt = id.substr(k + 1);
            var currentModel = this.model;
            var notes = currentModel.get('notes');
            var newNotes;

            notes = notes.filter(function (elem) {
                return !elem.history && !elem.pay;
            });

            switch (type) {
                case 'edit':
                    this.$el.find('.addTitle').show();

                    // here and in all next global searching $ changed for correct finding elements
                    this.$el.find('#noteArea').attr('placeholder', '').parents('.addNote').addClass('active');
                    this.$el.find('#noteArea').val($('#' + idInt).find('.noteText').text());
                    this.$el.find('#noteTitleArea').val($('#' + idInt).find('.noteTitle').text());
                    this.$el.find('#getNoteKey').attr('value', idInt);

                    break;
                case 'del':

                    newNotes = _.filter(notes, function (note) {
                        if (note._id !== idInt) {
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
                    break;
                // skip default;
            }
        },

        expandNote: function (e) {
            if (!$(e.target).parents('.addNote').hasClass('active')) {
                $(e.target).attr('placeholder', '').parents('.addNote').addClass('active');
                this.$el.find('.addTitle').show();
            }
        },

        cancelNote: function (e) {
            $(e.target)
                .parents('.addNote')
                .find('#noteArea')
                .attr('placeholder', 'Add a Note...Max 500 symbols.')
                .parents('.addNote').removeClass('active');
            $(e.target)
                .parents('.addNote')
                .find('#noteArea')
                .val('');
            this.$el.find('#getNoteKey').val('');// remove id from hidden field if note editing is cancel
            this.$el.find('.title-wrapper').hide();
            this.$el.find('.addTitle').hide();
            this.$el.find('#noteArea').val('');
            this.$el.find('#noteTitleArea').val('');
            this.$el.find('#getNoteKey').attr('value', '');
        },

        saveNote: function (e) {
            var self = this;
            var val;
            var title;
            var formModel;
            var notes;
            var arrKeyStr;
            var noteObj;
            var editNotes;

            if ($(e.target).parents('.addNote').find('#noteArea').val().replace(/ /g, '') || $(e.target).parents('.addNote').find('#noteTitleArea').val().replace(/ /g, '')) {
                $(e.target).parents('.addNote').find('#noteArea').attr('placeholder', 'Add a Note...Max 500 symbols.').parents('.addNote').removeClass('active');
                this.$el.find('.title-wrapper').hide();
                this.$el.find('.addTitle').hide();
            } else {
                $(e.target).parents('.addNote').find('#noteArea').focus();
            }

            e.preventDefault();
            val = $.trim(this.$el.find('#noteArea').val()).replace(/</g, '&#60;').replace(/>/g, '&#62;'); // changed by Liliya when there is dialog and form
            title = $.trim(this.$el.find('#noteTitleArea').val()).replace(/</g, '&#60;').replace(/>/g, '&#62;');

            if (!val && !title) { // textarrea notes not be empty
                App.render({
                    type   : 'error',
                    message: 'Note can not be empty'
                });
            } else {
                if (val.replace(/ /g, '') || title.replace(/ /g, '')) {
                    formModel = this.model;
                    notes = formModel.get('notes');
                    notes = notes.filter(function (elem) {
                        return !elem.history && !elem.pay;
                    });

                    arrKeyStr = this.$el.find('#getNoteKey').attr('value');
                    noteObj = {
                        note : '',
                        title: ''
                    };
                    if (arrKeyStr) {
                        editNotes = _.map(notes, function (note) {
                            if (note._id === arrKeyStr) {
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
                                    var $formLeftColumn = self.$el.find('.formLeftColumn');
                                    var $noteWrapper = $formLeftColumn.find('.noteWrapper');
                                    self.$el.find('#noteBody').val($('#' + arrKeyStr).find('.noteText').html(val));
                                    self.$el.find('#noteBody').val($('#' + arrKeyStr).find('.noteTitle').html(title));
                                    self.$el.find('#getNoteKey').attr('value', '');
                                    $noteWrapper.empty();
                                    $formLeftColumn.append(self.render());
                                }
                            });
                    } else {
                        noteObj.note = val;
                        noteObj.date = new Date();
                        noteObj.title = title;
                        notes.push(noteObj);
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
                    }

                } else {
                    return false;
                }
            }
        },

        showTitle: function (e) {
            $(e.target).hide().parents('.addNote').find('.title-wrapper').show().find('input').focus();
        },

        render: function () {
            var notDiv;
            var modelObj = this.model.toJSON();

            if (!modelObj.notes) {
                modelObj.notes = 0;
            }

            modelObj.needNotes = this.needNotes;

            this.$el.html(this.template(modelObj));
            notDiv = this.$el.find('.attachments');

            notDiv.html(
                new AttachView({
                    model      : this.model,
                    contentType: this.contentType,
                    isCreate   : this.isCreate
                }).render().el
            );
            return this;

        }
    });

    return NoteView;
});
