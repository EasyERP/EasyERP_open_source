define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Companies/form/FormTemplate.html',
    'text!templates/Companies/aboutTemplate.html',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/Persons/formPropertyArray/formPropertyView',
    'views/Opportunities/formProperty/formPropertyView',
    'views/CustomersSuppliers/salesPurchases',
    'common',
    'constants',
    'dataService',
    'views/selectView/selectView',
    'helpers/ga'
], function (Backbone,
             $,
             _,
             companyFormTemplate,
             aboutTemplate,
             EditorView,
             AttachView,
             PersonFormProperty,
             OpportunityFormProperty,
             SalesPurchasesView,
             common,
             CONSTANTS,
             dataService,
             SelectView,
             ga) {
    'use strict';

    var personTasksView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {

            App.currentPerson = options.model.get('id');

            this.io = App.socket;
            this.mId = CONSTANTS.MID[this.contentType];
            this.formModel = options.model;
            this.responseObj = {};
            this.formModel.urlRoot = '/Companies';
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
            'click .checkbox'                                  : 'setChangeValueToModel',
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
            var checked = $target.prop('checked');
            var newProperty;

            $target.closest('.propertyFormList').addClass('active');

            if (property === 'social.LI') {
                value = value.replace('linkedin', '[]');

                /*newProperty = property.slice(-2, property.length);

                 if (!this.modelChanged.social) {
                 this.modelChanged.social = {};
                 }

                 this.modelChanged.social[newProperty] = value;*/
            } else if (property === 'salesPurchases.isSupplier' || property === 'salesPurchases.isCustomer') {
                this.modelChanged[property] = checked;

            } else {
                this.modelChanged[property] = value;
            }

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

            ga && ga.trackingEditConfirm();
        },

        cancelChanges: function (e) {
            e.preventDefault();
            this.modelChanged = {};
            this.renderAbout(true);

            ga && ga.trackingEditCancel();
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

            holder.text(text);

            if (type === 'salesPurchases.language') {
                this.modelChanged[type] = $.trim(text);
            } else {
                this.modelChanged[type] = id;
            }
            this.showButtons();
        },

        saveModel: function (changedAttrs, type) {
            var self = this;
            var changedAttributesForEvent = ['name.first', 'email', 'phones.phone', 'address.country'];
            var changedListAttr = _.intersection(Object.keys(changedAttrs), changedAttributesForEvent);
            var sendEvent = !!(changedListAttr.length);

            this.formModel.save(changedAttrs, {
                wait : true,
                patch: true,

                success: function () {
                    if (type === 'formProperty') {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    } else {
                        self.editorView.renderTimeline();
                        self.renderAbout();
                        self.modelChanged = {};
                        self.hideButtons();

                        if (sendEvent) {
                            self.trigger('itemChanged', changedAttrs);
                        }
                    }
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
        },

        renderAbout: function (cancel) {
            var self = this;
            var $thisEl = this.$el;
            var salesPurchasesEl;

            if (cancel) {
                $thisEl.find('.aboutHolder').html(_.template(aboutTemplate, this.formModel.toJSON()));

                salesPurchasesEl = $thisEl.find('#salesPurchases-container');

                salesPurchasesEl.append(
                    new SalesPurchasesView({
                        parrent  : self,
                        tForm    : true,
                        editState: true
                    }).render().el
                );
            }

            common.canvasDraw({model: this.formModel.toJSON()}, this);
        },

        render: function () {
            var formModel = this.formModel.toJSON();
            var self = this;
            var $thisEl = this.$el;
            var salesPurchasesEl;

            $thisEl.html(_.template(companyFormTemplate, formModel));

            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPersonDd'] = employees;
            });

            dataService.getData('/countries/getForDD', {}, function (countries) {
                self.responseObj['#country'] = countries.data;
                self.responseObj['#shippingCountry'] = countries.data;
            });

            this.formProperty = new PersonFormProperty({
                parentModel: this.formModel,
                attribute  : 'company',
                saveDeal   : self.saveModel
            });

            $thisEl.find('#contactsHolder').html(
                this.formProperty.render().el
            );

            $thisEl.find('#opportunitiesHolder').html(
                new OpportunityFormProperty({
                    parentModel: this.formModel,
                    attribute  : 'company',
                    saveModel  : self.saveModel
                }).render().el
            );

            this.editorView = new EditorView({
                model      : this.formModel,
                contentType: 'Companies'
            });

            $thisEl.find('.notes').append(
                this.editorView.render().el
            );
            common.canvasDraw({model: this.formModel.toJSON()}, this);

            salesPurchasesEl = $thisEl.find('#salesPurchases-container');

            salesPurchasesEl.append(
                new SalesPurchasesView({
                    parrent  : self,
                    tForm    : true,
                    editState: true
                }).render().el
            );

            $thisEl.find('.attachments').append(
                new AttachView({
                    model      : this.formModel,
                    contentType: 'Companies'
                }).render().el
            );

            return this;
        }

    });

    return personTasksView;
});
