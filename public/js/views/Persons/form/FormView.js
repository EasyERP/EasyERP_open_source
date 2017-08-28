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
    'views/CustomersSuppliers/salesPurchases',
    'common',
    'constants',
    'dataService',
    'views/selectView/selectView',
    'helpers/ga'
], function (Backbone,
             $,
             _,
             personFormTemplate,
             aboutTemplate,
             EditorView,
             AttachView,
             CompanyFormProperty,
             OpportunityFormProperty,
             SalesPurchasesView,
             common,
             CONSTANTS,
             dataService,
             SelectView,
             ga) {
    'use strict';

    var personTasksView = Backbone.View.extend({
        el         : '#content-holder',
        responseObj: {},
        initialize : function (options) {

            App.currentPerson = options.model.get('id');

            this.makeAsBilling = false;
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
            'change [type="checkbox"]'                         : 'setChangeValueToModel',
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

        makeSameAsBilling: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            /*var billingStreet = this.$el.find('#billingStreet');
             var billingCity = this.$el.find('#billingCity');
             var billingState = this.$el.find('#billingState');
             var billingZip = this.$el.find('#billingZip');
             var billingCountry = this.$el.find('#billingCountry');*/
            var shippingStreet = $thisEl.find('#shippingStreet');
            var shippingCity = $thisEl.find('#shippingCity');
            var shippingState = $thisEl.find('#shippingState');
            var shippingZip = $thisEl.find('#shippingZip');
            var shippingCountry = $thisEl.find('#shippingCountry');

            if ($target.is(':checked') === true) {
                shippingCity.prop('disabled', true);
                shippingStreet.prop('disabled', true);
                shippingState.prop('disabled', true);
                shippingZip.prop('disabled', true);
                shippingCountry.prop('disabled', true);

                this.makeAsBilling = true;
            } else {
                shippingCity.prop('disabled', false);
                shippingStreet.prop('disabled', false);
                shippingState.prop('disabled', false);
                shippingZip.prop('disabled', false);
                shippingCountry.prop('disabled', false);

                this.makeAsBilling = false;
            }
        },

        setChangeValueToModel: function (e) {
            var $target = $(e.target);
            var id = $target.attr('data-id');
            var property = id.replace('_', '.');
            var value = $target.val();
            var checked = $target.prop('checked');

            if (property === 'makeSameAsBilling') {
                return this.makeSameAsBilling(e);
            }

            $target.closest('.propertyFormList').addClass('active');

            if (property === 'social.LI') {
                value = value.replace('linkedin', '[]');
            }

            if (property === 'salesPurchases.isSupplier' || property === 'salesPurchases.isCustomer') {
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
            var $thisEl = this.$el;
            var self = this;
            var changedAttributesForEvent = ['name.first', 'name.last', 'email', 'phones.phone', 'address.country'];
            var keys = Object.keys(changedAttrs);
            var changedListAttr = _.intersection(keys, changedAttributesForEvent);
            var sendEvent = !!(changedListAttr.length);
            var newValue;
            var i;

            if (changedAttrs.social && !Object.keys(changedAttrs.social).length) {
                delete changedAttrs.social;
            }

            if (this.makeAsBilling) {
                for (i = 0; i < keys.length; i++) {
                    if (keys[i].indexOf('address') >= 0) {
                        newValue = keys[i].replace('address', 'shippingAddress');
                        changedAttrs[newValue] = changedAttrs[keys[i]];
                    }
                }
            }

            this.formModel.save(changedAttrs, {
                wait   : true,
                patch  : true,
                success: function () {
                    if ((type === 'formProperty') || (self.makeAsBilling)) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    } else {
                        // self.editorView.renderTimeline();
                        self.renderAbout();
                        self.modelChanged = {};
                        self.hideButtons();

                        if (changedAttrs.hasOwnProperty('skype')) {
                            $thisEl.find('.skype').attr('href', 'skype:' + changedAttrs.skype + '?call');
                        }

                        if (changedAttrs.hasOwnProperty('social.FB')) {
                            $thisEl.find('.facebook').attr('href', changedAttrs['social.FB']);
                        }

                        if (changedAttrs.hasOwnProperty('social.LI')) {
                            $thisEl.find('.linkedin').attr('href', changedAttrs['social.LI']);
                        }

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
            var salesPurchasesEl;

            $thisEl.html(_.template(personFormTemplate, formModel));

            this.formProperty = new CompanyFormProperty({
                data    : formModel.company,
                saveDeal: self.saveModel
            });

            dataService.getData('/countries/getForDD', {}, function (countries) {
                self.responseObj['#country'] = countries.data;
                self.responseObj['#shippingCountry'] = countries.data;
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

            salesPurchasesEl = $thisEl.find('#salesPurchases-container');

            salesPurchasesEl.append(
                new SalesPurchasesView({
                    parrent  : self,
                    tForm    : true,
                    editState: true
                }).render().el
            );

            $thisEl.find('#dateBirthEdit').datepicker({
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
