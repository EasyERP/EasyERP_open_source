define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/salesInvoice/EmailTemplate.html',
    'common',
    'populate',
    'dataService',
    'helpers/keyValidator'], function (
    Backbone,
    $,
    _,
    CreateTemplate,
    common,
    populate,
    dataService,
    keyValidator
) {
    var EmailView = Backbone.View.extend({
        el      : '#emailHolder',
        template: _.template(CreateTemplate),

        initialize: function (options) {

            var self = this;
            var url = 'project/emails/';

            this.model = options.model.toJSON();
            this.attachments = this.model.attachments;

            url = url + App.projectInfo.projectId;

            dataService.getData(url, null, function (response) {
                var emails = {};
                var res = response[0];

                emails.Cc = (res.projectmanager || '') + ', ' + (res.salesmanager || '');
                emails.To = (res.customerCompany || '') + ', ' + res.customerPersons.join(', ');
                self.render(emails);
            });
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
            var url = 'project/sendInvoice/';
            var Cc = self.$el.find('#Cc').val();
            var To = self.$el.find('#To').val();

            App.startPreload();

            data.To = To;
            data.Cc = Cc;
            data.name = self.model.name;
            data.id = self.model._id;
            data.attachments = self.attachments.map(function (att) {
                return att.shortPas;
            });

            data.attachments = JSON.stringify(data.attachments);

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
                attachments: self.attachments,
                emails     : emails
            });

            this.$el = $(htmBody).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'email-dialog',
                title        : 'Email invoice',
                buttons      : [
                    {
                        id   : 'send-email-dialog',
                        text : 'Send',
                        click: function () {
                            self.send();
                        }
                    },
                    {
                        text : 'Cancel',
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
