define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'views/ChartOfAccount/CreateAccountTypeView',
    'text!templates/ChartOfAccount/CreateTemplate.html',
    'models/chartOfAccount',
    'helpers/keyCodeHelper',
    'populate',
    'dataService'
], function (Backbone, $, _, ParentView, CreateAccountTypeView, CreateTemplate, ChartModel, keyCodes, populate, dataService) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        template   : _.template(CreateTemplate),
        contentType: 'ChartOfAccount',
        responseObj: {},

        events: {
            'keydown #code'     : 'validateNumbers',
            'change #subAccount': 'subAccount'
        },

        initialize: function () {
            this.model = new ChartModel();
            this.render();
        },

        subAccount: function () {
            var self = this;
            var type = this.$el.find('#accountsCategory').attr('data-id');

            dataService.getData('ChartOfAccount/getForDd', {type: type}, function (response) {
                self.$el.find('.subAccount').toggleClass('hidden');

                self.responseObj['#chartsDd'] = response.data;
            });
        },

        validateNumbers: function (e) {
            var $target = $(e.target);
            var code = e.keyCode;
            var inputValue = $target.val();

            if (!keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code)) {
                $target.val(parseFloat(inputValue) || '');
                return false;
            }
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                case 13:
                    this.saveItem();
                    break;
                default:
                    break;
            }
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var text = $target.text();
            var $ul = $target.closest('ul');
            var $element = $ul.closest('._newSelectListWrap').find('a');

            if (id === 'createAccountType') {
                return new CreateAccountTypeView({responseObj: this.responseObj});
            }

            $element.attr('data-id', id);
            $element.text(text);

            this.$el.find('#subCheck').removeClass('hidden');

            $ul.remove();

            return false;
        },

        saveItem: function () {
            var self = this;
            var mid = 85;
            var thisEl = this.$el;
            var data = {};

            data.account = $.trim(thisEl.find('#nameInput').val());
            data.category = thisEl.find('#accountsCategory').attr('data-id');
            data.subAccount = thisEl.find('#chartsDd').attr('data-id') || null;
            data.code = $.trim(thisEl.find('#code').val());
            data.budgeted = thisEl.find('#budgeted').prop('checked');

            if (!data.account.length) {
                return App.render({
                    type   : 'error',
                    message: "Account Name field can't be empty."
                });
            }

            if (!data.code.length) {
                return App.render({
                    type   : 'error',
                    message: "Account Code field can't be empty."
                });
            }

            if (!data.category) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose Account Category first.'
                });
            }

            this.model.save(data, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function (model) {
                    self.redirectAfterSave(self, model);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        redirectAfterSave: function (content) {
            var redirectUrl = 'easyErp/ChartOfAccount';

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
                width      : '500',
                dialogClass: 'create-dialog',
                title      : 'Create Chart of Account',
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

            populate.get('#accountsCategory', '/accountsCategories/getAll', {}, 'name', this, true, true);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
