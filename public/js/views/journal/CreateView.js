define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/journal/CreateTemplate.html',
    'models/JournalModel',
    'populate'
], function (Backbone, $, _, ParentView, CreateTemplate, JournalModel, populate) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'journal',
        template   : _.template(CreateTemplate),
        responseObj: {},

        initialize: function (options) {
            this.model = new JournalModel();

            this.notRedirect = options.notRedirect;
            this.render();
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 13:
                    this.saveItem();
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var text = $target.text();
            var $ul = $target.parent('ul');
            var $element = $ul.closest('a.current-selected');

            $element.attr('data-id', id);
            $element.text(text);

            $ul.remove();

            return false;
        },

        saveItem: function () {
            var self = this;
            var mid = 85;
            var thisEl = this.$el;
            var data = {};

            data.name = thisEl.find('#nameInput').val();
            data.transaction = $.trim(thisEl.find('#typeDd').attr('data-id'));
            data.debitAccount = thisEl.find('#debitDd').attr('data-id');
            data.creditAccount = thisEl.find('#creditDd').attr('data-id');

            if (!data.name.length) {
                return App.render({
                    type   : 'error',
                    message: "Journal Name field can't be empty."
                });
            }

            this.model.save(data, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function (model) {
                    if (!self.notRedirect) {
                        return self.redirectAfterSave(self, model);
                    }

                    self.hideDialog();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        redirectAfterSave: function (content) {
            var redirectUrl = 'easyErp/journal';

            content.hideDialog();
            Backbone.history.navigate(redirectUrl, {trigger: true});
        },

        hideSaveCancelBtns: function () {
            var $topBar = $('#top-bar');
            var createBtnEl = $topBar.find('#top-bar-createBtn');
            var saveBtnEl = $topBar.find('#top-bar-saveBtn');
            var cancelBtnEl = $topBar.find('#top-bar-deleteBtn');

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();
            createBtnEl.show();

            return false;
        },

        render: function () {
            var self = this;
            var formString = this.template();

            this.hideSaveCancelBtns();

            this.$el = $(formString).dialog({
                autoOpen   : true,
                width      : '500px',
                dialogClass: 'create-dialog',
                title      : 'Create Journal',
                buttons    : [
                    {
                        id   : 'createBtn',
                        class: 'btn blue',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    }, {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }]

            });

            populate.get('#debitDd', '/chartOfAccount/getForDd', {}, 'name', this, true, true);
            populate.get('#creditDd', '/chartOfAccount/getForDd', {}, 'name', this, true, true);

            this.responseObj['#typeDd'] = [{
                _id : 'invoice',
                name: 'Invoice'
            }, {
                _id : 'payment',
                name: 'Payment'
            }, {
                _id : 'accrual',
                name: 'Accrual'
            }, {
                _id : 'writeoff',
                name: 'WriteOff'
            }];

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
