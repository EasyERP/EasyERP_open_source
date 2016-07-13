define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Editor/EditorTemplate.html',
    'models/DealTasksModel',
    'views/Notes/AttachView',
    'views/selectView/selectView',
    'moment',
    'populate',
    'constants'
], function (Backbone, $, _, NoteTemplate,TaskModel, AttachView, SelectView, moment, populate, CONSTANTS) {
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
            'click #saveTask'      : 'saveTask',
            'click .addTitle'     : 'showTitle',
            'click .editDelNote'  : 'editDelNote',
            'click .fa-paperclip' : 'clickInput',
            'click .chart-tabs'   : 'changeTab',
            'click .current-selected:not(.jobs)'                         : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)'          : 'chooseOption'
        },

        saveTask: function () {
            var self = this;
            var deal = this.$el.find('#dealDd').data('id');
            var assignedTo = this.$el.find('#assignedToDd').data('id');
            var company = this.$el.find('#companyDd').data('id');
            var workflow = this.$el.find('#workflowsDd').data('id');
            var contact = this.$el.find('#contactDd').data('id');
            var description = $.trim(this.$el.find('#description').val());
            var dueDate = $.trim(this.$el.find('#dueDate').val());
            var contact;
            var company;
            var deal;
            var saveObject = {
                assignedTo : assignedTo || '',
                description: description,
                dueDate   : dueDate,
                workflow  : workflow
            };


            switch(this.contentType) {
                case 'Persons':
                    saveObject.contact = this.formModel._id;
                    break;
                case 'Companies':
                    saveObject.company = this.formModel._id;
                    break;
                case 'Deals':
                    saveObject.deal = this.formModel._id;
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
                    success: function (model) {
                        var currentModel = model.changed;
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }

                });
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
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
            var type = id.substr(0, k);
            var idInt = id.substr(k + 1);
            var currentModel = this.model;
            var notes = currentModel.get('notes');
            var newNotes;

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
                                    mid: 39
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
            var val;
            var title;
            var formModel;
            var notes;
            var arrKeyStr;
            var noteObj;
            var editNotes;

            if ($(e.target).parents('.addNote').find('#noteArea').val().replace(/ /g, '') || $(e.target).parents('.addNote').find('#noteTitleArea').val().replace(/ /g, '')) {
                $(e.target).parents('.addNote').find('#noteArea').attr('placeholder', 'Add a Note...').parents('.addNote').removeClass('active');
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
                                    self.$el.find('#noteBody').val($('#' + arrKeyStr).find('.noteText').html(val));
                                    self.$el.find('#noteBody').val($('#' + arrKeyStr).find('.noteTitle').html(title));
                                    self.$el.find('#getNoteKey').attr('value', '');
                                }
                            });
                    } else {
                        noteObj.note = val;
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
                    /*this.$el.find('#noteArea').val('');
                    this.$el.find('#noteTitleArea').val('');*/
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
            var date = moment().format("DD MMM, YYYY");

            modelObj.needNotes = this.needNotes;

            this.$el.html(this.template({date : date}));
            notDiv = this.$el.find('.attachments');

            notDiv.html(
                new AttachView({
                    model      : this.model,
                    contentType: this.contentType
                }).render().el
            );

            this.$el.find('#taskDueDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            });
            populate.get2name('#assignedToDd', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, false);

            return this;
        }
    });

    return NoteView;
});
