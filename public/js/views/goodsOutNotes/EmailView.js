define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/goodsOutNotes/EmailTemplate.html',
    'common',
    'populate',
    'dataService'
], function (Backbone,
             $,
             _,
             CreateTemplate,
             common,
             populate,
             dataService) {
    var EmailView = Backbone.View.extend({
        el      : '#emailHolder',
        template: _.template(CreateTemplate),

        initialize: function (options) {
            var self = this;
            var url = 'goodsOutNotes/emails/';

            this.model = options.model.toJSON();
            this.attachment = options.attachment;
            this.render();
        },

        events: {
            keypress: 'keypressHandler',
            click   : 'hideNewSelect'
        },

        hideDialog: function () {
            $('.email-dialog').remove();
        },

        send: function () {
            var self = this;
            var data = {};
            var url = 'goodsOutNotes/sendEmail/';
            var Cc = self.$el.find('#Cc').val();
            var To = self.$el.find('#To').val();
            var description = self.$el.find('#description').val();

            App.startPreload();

            data.To = To;
            data.Cc = Cc;
            data.description = description;
            data.name = self.model.name;
            data.id = self.model._id;
            data.attachment = self.attachment;

            dataService.postData(url, data, function (response) {
                self.hideDialog();
                App.stopPreload();
                if (response && response.error) {
                    App.render({
                        type   : 'error',
                        message: 'Email send failed'
                    });
                } else {
                    App.render({
                        type   : 'notify',
                        message: 'Email was sent'
                    });
                }
            });
        },

        render: function (emails) {
            var self = this;
            var htmBody = this.template({
                model     : self.model,
                attachment: self.attachment
            });

            this.$el = $(htmBody).dialog({
                autoOpen   : true,
                dialogClass: 'email-dialog',
                title      : 'Email Goods Note',
                width      : '500',
                buttons    : [
                    {
                        id   : 'send-email-dialog',
                        class: 'btn',
                        text : 'Send',
                        click: function () {
                            self.send();
                        }
                    },
                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EmailView;
});
