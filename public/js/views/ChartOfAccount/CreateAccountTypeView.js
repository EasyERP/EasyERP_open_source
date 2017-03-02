define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/ChartOfAccount/createAccountType.html',
    'dataService'
], function (Backbone, $, _, generateTemplate, dataService) {
    'use strict';

    var CreateView = Backbone.View.extend({
        template   : _.template(generateTemplate),
        responseObj: {},

        events: {
            keydown: 'keyDownHandler'
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                case 13:
                    this.save(e);
                    break;
                default:
                    break;
            }
        },

        initialize: function (options) {
            _.bindAll(this, 'save');

            this.responseObj = options.responseObj;

            this.render();
        },

        stopDefaultEvents: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        hideDialog: function () {
            $('.createAccountType').remove();
        },

        save: function (e) {
            var self = this;
            var name = $('#name').val();
            var data = {};

            data.name = name;

            this.stopDefaultEvents(e);

            if (name) {
                dataService.postData('/accountsCategories/getAll', data, function (err, response) {
                    self.hideDialog();

                    self.responseObj['#accountsCategory'].push({name: response.success.name, _id: response.success._id});
                });
            } else {
                App.render({
                    type   : 'error',
                    message: 'Please, enter Account Name!'
                });
            }
        },

        render: function () {
            var self = this;
            var dialog = this.template();

            this.$el = $(dialog).dialog({
                dialogClass: 'createAccountType',
                width      : 300,
                title      : 'Create Sprint',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn',
                        id   : 'generateBtn',
                        click: self.save
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        id   : 'cancelBtn',

                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            return this;
        }
    });

    return CreateView;
});
