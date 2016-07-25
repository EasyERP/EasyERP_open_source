define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Persons/form/FormTemplate.html',
    'text!templates/Opportunities/aboutTemplate.html',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/Companies/formPropertyView',
    'views/Opportunities/formProperty/formPropertyView',
    'common',
    'constants',
    'dataService',
    'views/selectView/selectView'
], function (Backbone,
             $,
             _,
             personFormTemplate,
             aboutTemplate,
             NoteView,
             AttachView,
             CompanyFormProperty,
             OpportunityFormProperty,
             common,
             CONSTANTS,
             dataService,
             SelectView) {
    'use strict';

    var personTasksView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            var self = this;
            var formModel;
            var $thisEl = this.$el;

            App.currentPerson = options.model.get('id');

            this.io = App.socket;
            this.mId = CONSTANTS.MID[this.contentType];
            this.formModel = options.model;
            //this.formModel.on('change', this.render, this);
            this.formModel.urlRoot = '/Persons';
        },

        events: {
            click                                              : 'hideNewSelect',
            'click #tabList a'                                 : 'switchTab',
            'keyup .editable'                                  : 'setChangeValueToModel',
            'click #cancelBtn'                                 : 'cancelChanges',
            'click #saveBtn'                                   : 'saveChanges',
            'click .tabListItem'                               : 'changeWorkflow',
            'click .current-selected:not(.jobs)'               : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },


        saveClick: function (e) {
            var parent = $(e.target).parent().parent();
            var objIndex = parent[0].id.split('_'); // replace change to split;
            var currentModel = this.model;
            var newModel = {};
            var oldvalue = {};
            var $thisEl = this.$el;
            var self = this;
            var param;
            var valid;
            var i;

            e.preventDefault();

            if (objIndex.length > 1) {
                for (i in this.formModel.toJSON()[objIndex[0]]) {
                    oldvalue[i] = this.formModel.toJSON()[objIndex[0]][i];
                }

                param = currentModel.get(objIndex[0]) || {};
                param[objIndex[1]] = $('#editInput').val();
                newModel[objIndex[0]] = param;
            } else {
                oldvalue = this.formModel.toJSON()[objIndex[0]];
                newModel[objIndex[0]] = $('#editInput').val();
            }

            //console.log(newModel);

            valid = this.formModel.save(newModel, {
                headers: {
                    mid: this.mId
                },

                patch  : true,
                success: function (model) {
                    App.render({
                        type   : 'notify',
                        message: "Saving is successfully"
                    });
                    $thisEl.find('.quickEdit #editInput').remove();
                    $thisEl.find('.quickEdit #cancelSpan').remove();
                    $thisEl.find('.quickEdit #saveSpan').remove();

                    if (self.prevQuickEdit) {
                        if ($thisEl.find('#' + self.prevQuickEdit.id).hasClass('quickEdit')) {
                            if ($thisEl.find('#' + self.prevQuickEdit.id).hasClass('with-checkbox')) {
                                $thisEl.find('#' + self.prevQuickEdit.id + ' input').prop('disabled', true).prop('checked', ($thisEl.find('#' + self.prevQuickEdit.id + ' input').prop('checked') ? 'checked' : ''));
                                $thisEl.find('.quickEdit').removeClass('quickEdit');
                            } else if (self.prevQuickEdit.id === 'email') {
                                $thisEl.find('#' + self.prevQuickEdit.id).append('<a href="mailto:' + self.text + '">' + self.text + '</a>');
                                $thisEl.find('.quickEdit').removeClass('quickEdit');
                            } else {
                                $thisEl.find('.quickEdit').text(self.text || '').removeClass('quickEdit');
                            }
                        }
                    }

                    //self.io.emit('editPerson');
                    //Backbone.history.fragment = '';
                    //Backbone.history.navigate('#easyErp/Persons/form/' + model.id, {trigger: true});
                },

                error: function (model, response) {
                    if (response) {
                        App.render({
                            type   : 'error',
                            message: response.error
                        });
                    }
                }
            });

            if (!valid) {
                newModel[objIndex[0]] = oldvalue;
                this.formModel.set(newModel);
            }
        },

        toggle: function () {
            this.$('#details').animate({
                height: 'toggle'
            }, 250, function () {

            });
        },

        render: function () {
            var formModel = this.formModel.toJSON();
            var $thisEl = this.$el;

            $thisEl.html(_.template(personFormTemplate, formModel));
            this.renderMiniOpp();
            $thisEl.find('.formLeftColumn').append(
                new NoteView({
                    model      : this.formModel,
                    contentType: 'Persons'
                }).render().el
            );

            $(window).on('resize', function () {
                $('#editInput').width($('#editInput').parent().width() - 55);

            });
            return this;
        },

    });

    return personTasksView;
});
