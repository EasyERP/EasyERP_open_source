define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/salesInvoices/EmailTemplate.html',
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
            var url = 'projects/emails/';
            var projectId;

            this.model = options.model.toJSON();
            this.attachments = this.model.attachments;

            projectId = App.projectInfo && App.projectInfo.projectId ? App.projectInfo.projectId : this.model.project ? this.model.project._id : null;

            url = url + projectId;

            if (projectId) {
                dataService.getData(url, null, function (response) {
                    var emails = {};
                    var res = response[0];

                    emails.Cc = (res.projectmanager || '') + ', ' + (res.salesmanager || '');
                    emails.To = (res.customerCompany || '') + ', ' + res.customerPersons.join(', ');

                    if (emails.Cc === ', ') {
                        emails.Cc = '';
                    }

                    self.render(emails);
                });
            } else {
                url = 'invoices/emails/' + this.model._id;
                dataService.getData(url, null, function (response) {
                    var emails = {};
                    var res = response[0];

                    emails.Cc = (res.salesmanager || '');
                    emails.To = res.customerPersons;

                    self.render(emails);
                });
            }

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
            var url = 'projects/sendInvoice/';
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
                autoOpen   : true,
                dialogClass: 'email-dialog',
                title      : 'Email invoice',
                width      : '500',
                buttons    : [
                    {
                        id   : 'send-email-dialog',
                        class: 'btn blue',
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
