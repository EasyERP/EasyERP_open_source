define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Persons/form/FormTemplate.html',
    'text!templates/Persons/aboutTemplate.html',
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
             EditorView,
             AttachView,
             CompanyFormProperty,
             OpportunityFormProperty,
             common,
             CONSTANTS,
             dataService,
             SelectView) {
    'use strict';

    var personTasksView = Backbone.View.extend({
        el         : '#content-holder',
        responseObj: {},
        initialize : function (options) {

            App.currentPerson = options.model.get('id');

            this.mId = CONSTANTS.MID[this.contentType];
            this.formModel = options.model;
            this.formModel.urlRoot = '/Persons';
            _.bindAll(this, 'saveModel');

            this.modelChanged = {};
        },

        showEdit: function () {
            this.$el.find('.upload').animate({
                height : '20px',
                display: 'block'
            }, 250);

        },

        hideEdit: function () {
            this.$el.find('.upload').animate({
                height : '0px',
                display: 'block'
            }, 250);

        },

        events: {
            click                                              : 'hideNewSelect',
            'mouseenter .avatar'                               : 'showEdit',
            'mouseleave .avatar'                               : 'hideEdit',
            'click #tabList a'                                 : 'switchTab',
            'keyup .editable'                                  : 'setChangeValueToModel',
            'click #cancelBtn'                                 : 'cancelChanges',
            'click #saveBtn'                                   : 'saveChanges',
            'click .current-selected:not(.jobs)'               : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        hideNewSelect: function () {
            this.$el.find('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        setChangeValueToModel: function (e) {
            var $target = $(e.target);
            var property = $target.attr('data-id').replace('_', '.');
            var value = $target.val();

            $target.closest('.propertyFormList').addClass('active');

            if (property === 'social.LI') {
                value = value.replace('linkedin', '[]');
            }

            this.modelChanged[property] = value;
            this.showButtons();
        },

        showButtons: function () {
            this.$el.find('#formBtnBlock').addClass('showButtons');
        },

        hideButtons: function () {
            this.$el.find('#formBtnBlock').removeClass('showButtons');
        },

        saveChanges: function (e) {
            e.preventDefault();
            this.saveModel(this.modelChanged);
        },

        cancelChanges: function (e) {
            e.preventDefault();
            this.modelChanged = {};
            this.renderAbout(true);
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
            var holder = $target.parents('.inputBox').find('.current-selected');
            var type = $target.closest('a').attr('data-id').replace('_', '.');
            var text = $target.text();
            var id = $target.attr('id');

            holder.text($target.text());

            this.modelChanged[type] = id;
            // this.$el.find('#assignedToDd').text(text).attr('data-id', id);
            this.showButtons();
        },

        saveModel: function (changedAttrs, type) {
            var $thisEl = this.$el;
            var self = this;
            var changedAttributesForEvent = ['name.first', 'name.last', 'email', 'phones.phone', 'address.country'];
            var changedListAttr = _.intersection(Object.keys(changedAttrs), changedAttributesForEvent);
            var sendEvent = !!(changedListAttr.length);

            this.formModel.save(changedAttrs, {
                wait   : true,
                patch  : true,
                success: function () {
                    if (type === 'formProperty') {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    } else {
                        // self.editorView.renderTimeline();
                        self.renderAbout();
                        self.modelChanged = {};
                        self.hideButtons();

                        if (sendEvent) {
                            if (changedAttrs.hasOwnProperty('name.first') || changedAttrs.hasOwnProperty('name.last')) {
                                changedAttrs.fullName = $thisEl.find('[data-id="name_first"]').val().trim() + ' ' + $thisEl.find('[data-id="name_last"]').val().trim();
                            }

                            self.trigger('itemChanged', changedAttrs);
                        }
                    }
                },
                error  : function (model, response) {
                    if (response) {
                        App.render({
                            type   : 'error',
                            message: response.error
                        });
                    }
                }
            });
        },

        deleteItems: function () {
            var mid = 39;

            this.formModel.destroy({
                headers: {
                    mid: mid
                },
                success: function () {
                    Backbone.history.navigate('#easyErp/Opportunities/kanban', {trigger: true});
                }
            });

        },

        renderAbout: function (cancel) {
            var self = this;
            var $thisEl = this.$el;

            if (cancel) {
                $thisEl.find('.aboutHolder').html(_.template(aboutTemplate, this.formModel.toJSON()));
            }
            common.canvasDraw({model: this.formModel.toJSON()}, this);
            $thisEl.find('#dateBirth').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null,
                onSelect   : function (dateText) {
                    self.modelChanged.dateBirth = new Date(dateText);
                    self.showButtons();
                }

            });
        },

        render: function () {
            var formModel = this.formModel.toJSON();
            var self = this;
            var $thisEl = this.$el;

            $thisEl.html(_.template(personFormTemplate, formModel));

            this.formProperty = new CompanyFormProperty({
                data    : formModel.company,
                saveDeal: self.saveModel
            });

            dataService.getData('/countries/getForDD', {}, function (countries) {
                self.responseObj['#country'] = countries.data;
            });

            $thisEl.find('#companyHolder').html(
                this.formProperty.render().el
            );

            $thisEl.find('#opportunitiesHolder').html(
                new OpportunityFormProperty({
                    parentModel: this.formModel,
                    attribute  : 'contact',
                    saveModel  : self.saveModel
                }).render().el
            );

            this.editorView = new EditorView({
                model      : this.formModel,
                contentType: 'Persons'
            });

            $thisEl.find('.notes').append(
                this.editorView.render().el
            );
            common.canvasDraw({model: this.formModel.toJSON()}, this);

            $thisEl.find('#dateBirth').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null,
                onSelect   : function (dateText) {
                    self.modelChanged.dateBirth = new Date(dateText);
                    self.showButtons();
                }

            });

            $thisEl.find('.attachments').append(
                new AttachView({
                    model      : this.formModel,
                    contentType: 'Persons'
                }).render().el
            );

            return this;
        }

    });

    return personTasksView;
});
