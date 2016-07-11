define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/cashTransfer/CreateTemplate.html',
    'models/cashTransferModel',
    'common',
    'populate',
    'views/dialogViewBase',
    'constants',
    'helpers'
], function (Backbone, $, _, CreateTemplate, Model, common, populate, ParentView, CONSTANTS, helpers) {
    'use strict';
    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'cashTransfer',
        template   : _.template(CreateTemplate),
        imageSrc   : '',

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new Model();
            this.responseObj = {};

            this.render();
        },

        saveItem: function () {
            var data = {};
            var self = this;

            this.model.save(data, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function (model) {

                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var formString = this.template();
            var self = this;

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                dialogClass  : 'edit-dialog',
                width        : 600,
                title        : 'Create Cash Transfer',
                buttons      : {
                    save: {
                        text : 'Create',
                        class: 'btn',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }
                }
            });

            populate.get('#departmentDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this);

            this.delegateEvents(this.events);
            return this;
        }
    });
    return CreateView;
});
