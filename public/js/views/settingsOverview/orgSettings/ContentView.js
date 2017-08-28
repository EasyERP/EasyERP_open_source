define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/orgSettings/orgSettingsTemplate.html',
    'models/orgSettings',
    'views/selectView/selectView',
    'dataService',
    'populate',
    'common',
    'moment'
], function (Backbone, $, _, Parent, orgTemplate, Model, SelectView, dataService, populate, common, moment) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'organizationSettings',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#content-holder',
        initialize : function (options) {
            var self = this;

            this.startTime = options.startTime;
            this.model = new Model();
            this.responseObj = {};

            $('#top-bar').hide();

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
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click .saveBtn'    : 'saveItem',
            'click #startDate'  : 'changeDate'
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
            var defaultEmail = thisEl.find('input:checked').attr('id') === 'defaultEmailEnable';

            var data = {
                currency: currency || null,
                industry: industry,
                address : {
                    zip    : zip,
                    fax    : fax,
                    state  : state,
                    city   : city,
                    street : street,
                    country: country
                },

                website     : website,
                startDate   : startDate,
                contact     : contact || null,
                phone       : phone,
                name        : name,
                imageSrc    : self.imageSrc,
                contactName : contactName,
                defaultEmail: defaultEmail
            };

            this.model.save(data, {
                wait    : true,
                validate: true,
                success : function () {
                    self.trigger('updateOrgSettings');
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var $parent = $target.closest('.current-selected');
            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            this.hideNewSelect();

            if ($parent.attr('id') === 'contact') {
                this.$el.find('#email').text($target.attr('data-level'));
            }
        },

        changeDate: function () {
            var model = this.model.toJSON();

            if (model.startDate) {
                App.render({
                    type   : 'error',
                    message: 'You can set start date only 1 time and this value cannot be changed'
                });
            }
        },

        render: function () {
            var model = this.model.toJSON();
            var self = this;
            var formString = this.template({model: model});

            this.$el.html(formString);

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
