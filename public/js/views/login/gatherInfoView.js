define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/login/GatherInfoTemplate.html',
    'dataService',
    'custom'
], function (Backbone, _, $, GatherInfoTemplate, dataService, custom) {

    var GatherInfoView = Backbone.View.extend({
        el      : '#gatherView',
        template: _.template(GatherInfoTemplate),

        events: {
            'click #submit': 'onSubmit'
        },

        initialize: function (options) {

            this.render();
        },

        onSubmit: function (e) {
            var self = this;
            var $thisEl = this.$el;
            var mobilePhone = $thisEl.find('#phone').val() || '';
            var website = $thisEl.find('#website').val() || '';
            var company = $thisEl.find('#companyName').val() || '';
            var firstName = $thisEl.find('.firstName').val() || '';
            var lastName = $thisEl.find('.lastName').val() || '';
            var err = '';

            var data = {
                mobilePhone: '+' + mobilePhone,
                website    : website,
                company    : company,
                first      : firstName,
                last       : lastName
            };

            e.stopPropagation();
            e.preventDefault();

            if (!mobilePhone) {
                err += 'Phone number is required';
            }

            if (mobilePhone.length && (mobilePhone.length < 12 || isNaN(Number(mobilePhone)))) {
                return App.render({type: 'error', message: 'Please, enter valid Mobile Phone'});
            }

            if (err) {
                App.render({type: 'error', message: err});

                return;
            }

            dataService.patchData('/users/' + App.currentUser._id, data, function (err) {
                if (!err) {
                    self.$el.html('');
                    self.$el.addClass('hidden');
                    App.currentUser.mobilePhone = mobilePhone;
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('/easyErp/reportsDashboard', {trigger: true});
                    return false;
                }

                App.render({
                    type   : 'error',
                    message: err.responseJSON.error
                });
            });
        },

        render: function () {
            var $thisEl = this.$el;

            this.$el.removeClass('hidden');

            $thisEl.html(this.template({user: App.currentUser}));
        }
    });

    return GatherInfoView;
});
