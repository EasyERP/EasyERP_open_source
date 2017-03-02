define([
    'Backbone',
    'Underscore',
    'text!templates/orgSettings/ProfileTemplate.html',
    'text!templates/orgSettings/emailSettings.html',
    'models/orgSettings',
    'views/selectView/selectView',
    'dataService',
    'populate',
    'common',
    'moment'
], function (Backbone, _, orgTemplate, emailSettingsTemplate, Model, SelectView, dataService, populate, common, moment) {
    'use strict';

    var ContentView = Backbone.View.extend({
        contentType: 'organizationSettings',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#content-holder',
        initialize : function (options) {
            var self = this;

            this.startTime = options.startTime;
            this.model = new Model();
            this.responseObj = {};

            dataService.getData('/organizationSettings', {}, function (data) {
                if (data && !data.error && data.data) {
                    data.data.startDate = moment(data.data.startDate).format('DD MMM, YYYY');
                    self.model.set(data.data);
                }

                self.render();

                setTimeout(function () {
                    common.canvasDraw({model: self.model.toJSON()}, self);
                }, 100);
            });
        },

        events: {
            'click .current-selected:not(.jobs)'               : 'showNewSelect',
            'click #saveBtn'                                   : 'saveItem',
            'mouseenter .avatar'                               : 'showEdit',
            'mouseleave .avatar'                               : 'hideEdit',
            click                                              : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click #changeEmail'                               : 'changeEmail'
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

        changeEmail: function (e) {
            var self = this;

            e.preventDefault();

            var tempDom = _.template(emailSettingsTemplate, {model: this.model.toJSON()});

            $(tempDom).dialog({
                dialogClass: 'edit-settings-dialog',
                width      : '400',
                title      : 'Edit Email Settings',
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn',
                        click: function () {
                            self.saveEmailSettings(self);
                        }

                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });
        },

        hideDialog: function () {
            $('.edit-settings-dialog').remove();
        },

        saveEmailSettings: function (self) {
            var defaultEmail = $('.edit-settings-dialog').find('input:checked').attr('id') === 'defaultEmailEnable';

            this.model.save({
                defaultEmail: defaultEmail
            }, {
                wait    : true,
                validate: true,
                success : function (res, model) {
                    self.trigger('updateOrgSettings');
                    self.hideDialog();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });

        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var name = thisEl.find('#name').val();
            var contactName = thisEl.find('#contactName').val();
            var currency = thisEl.find('#currency').attr('data-id');
            var industry = thisEl.find('#industry').attr('data-id');
            var contact = thisEl.find('#contact').attr('data-id');
            var zip = thisEl.find('#address_fax').val();
            var fax = thisEl.find('#address_zip').val();
            var website = thisEl.find('#website').val();
            var state = thisEl.find('#address_state').val();
            var city = thisEl.find('#address_city').val();
            var street = thisEl.find('#address_street').val();
            var startDate = thisEl.find('#startDate').val();
            var phone = thisEl.find('#phone').val();
            var country = thisEl.find('#country').attr('data-id');

            var data = {
                currency   : currency || null,
                industry   : industry,
                address    : {
                    zip    : zip,
                    fax    : fax,
                    state  : state,
                    city   : city,
                    street : street,
                    country: country
                },
                website    : website,
                startDate  : startDate,
                contact    : contact || null,
                phone      : phone,
                name       : name,
                imageSrc   : self.imageSrc,
                contactName: contactName
            };

            this.model.save(data, {
                wait    : true,
                validate: true,
                success : function (res, model) {
                    self.trigger('updateOrgSettings');
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
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

        hideNewSelect: function () {
            $('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            var $parent = $target.closest('.current-selected');
            var id = $target.attr('id');
            var contact;
            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            this.hideNewSelect();
            if ($parent.attr('id') === 'contact') {
                this.$el.find('#email').text($target.attr('data-level'));
            }
        },

        render: function () {
            var model = this.model.toJSON();
            var self = this;

            this.$el.html(this.template({model: model}));

            populate.get('#currency', '/currency/getForDd', {}, 'name', this, true);
            populate.get('#contact', '/users/forDd', {}, 'login', this);
            populate.get('#industry', '/industry', {}, 'name', this);
            dataService.getData('/countries/getForDD', {}, function (countries) {
                self.responseObj['#country'] = countries.data;
            });
            this.renderStartDateSetting();
            return this;
        },

        renderStartDateSetting: function () {

            if (!this.model.get('startDate')) {
                this.$el.find('#startDate').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    minDate    : null,
                    yearRange  : '1970:+20'
                });
            } else {
                this.$el.find('#startDate').datepicker('disable', true);
            }
        }

    });

    return ContentView;
});
