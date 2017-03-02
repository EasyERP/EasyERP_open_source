define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/taxes/TaxEdit.html',
    'models/taxModel',
    'populate',
    'helpers/keyValidator'
], function (Backbone, $, _, Parent, template, Model, populate, keyValidator) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(template),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            this.model = options.model;
            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'keypress .forNum': 'keypressHandler',
            'change #default' : 'toggleMessage'
        },

        toggleMessage: function () {
            this.$el.find('.checkText').toggleClass('hidden');
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var fullName;
            var name = $.trim(thisEl.find('#name').val());
            var code = $.trim(thisEl.find('#code').val());
            var rate = $.trim(thisEl.find('#rate').val());
            var country = $.trim(thisEl.find('#country').attr('data-id'));
            var data;
            var parsedRate = parseFloat(rate);
            var isDefault = thisEl.find('#default').prop('checked');

            if (isNaN(parsedRate)) {
                return App.render({
                    type   : 'error',
                    message: 'Please enter correct Rate'
                });
            }

            fullName = code + ' ' + name + ' ' + rate + '%';

            data = {
                name     : name,
                code     : code,
                country  : country,
                fullName : fullName,
                isDefault: isDefault,
                rate     : parsedRate / 100
            };

            if (isDefault) {
                this.collection.forEach(function (el) {
                    el.set('isDefault', false);
                });
            }

            if (!code) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Code'
                });
            }

            this.model.save(data, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.set(model, {remove: false});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        chooseOption: function (e) {
            $(e.target).closest('.current-selected').text($(e.target).attr('id')).attr('data-id', $(e.target).attr('id'));

            this.hideNewSelect();
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.model.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '700px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            populate.get('#country', '/countries/getForDD', {}, 'name', this, false);

            return this;
        }
    });

    return EditView;
});

