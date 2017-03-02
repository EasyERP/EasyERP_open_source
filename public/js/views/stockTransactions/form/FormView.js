define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/stockTransactions/form/FormTemplate.html',
    'text!templates/stockTransactions/temps/documentTemp.html',
    'views/dialogViewBase',
    'views/Assignees/AssigneesView',
    'views/Products/InvoiceOrder/ProductItems',
    'views/stockTransactions/ReceiveView',
    'views/goodsOutNotes/PackNote',
    'views/NoteEditor/NoteView',
    'views/Editor/AttachView',
    'views/goodsOutNotes/EmailView',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers',
    'helpers/exportToPdf'
], function (Backbone,
             $,
             _,
             EditTemplate,
             DocumentTemplate,
             BaseView,
             AssigneesView,
             ProductItemView,
             ReceiveView,
             PackNote,
             NoteEditor,
             AttachView,
             EmailView,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             helpers,
             exportToPdf) {
    'use strict';

    var FormView = BaseView.extend({
        contentType: CONSTANTS.STOCKTRANSACTIONS,
        imageSrc   : '',
        template   : _.template(EditTemplate),
        templateDoc: _.template(DocumentTemplate),

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
                this.eventChannel = options.eventChannel;
            }

            _.bindAll(this, 'render', 'deleteItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.currentModel.on('sync', this.render, this);
            this.responseObj = {};

        },

        events: {
            'click #printPdf:not(.done)'  : 'printPdf',
            'click #packBtn:not(.done)'   : 'packNote',
            'click #receiveBtn:not(.done)': 'receiveInventory',
            'click .sendEmail'            : 'sendEmail',
            'click #attachment_file'      : 'clickInput',
            'click .setDraft'             : 'setDraft',
            'click .saveBtn'              : 'saveQuotation',
            'click .changeStatus'         : 'changeStatus'
        },

        printPdf: function (e) {
            e.preventDefault();
            window.print();
        },

        packNote: function (e) {
            e.preventDefault();

            new PackNote({model: this.currentModel});
        },

        sendEmail: function (e) {
            var self = this;
            var template = this.$el.find('#templateDiv').html();

            e.preventDefault();

            self.hideDialog();

            exportToPdf.takeToInput({file: template, name: this.model.get('name')}, function (data) {
                return new EmailView({
                    model     : self.currentModel,
                    attachment: data
                });
            });

        },

        receiveInventory: function (e) {
            var self = this;

            e.preventDefault();

            return new ReceiveView({parentModel: self.currentModel});
        },

        changeStatus: function (e) {
            var $target = $(e.target);
            var self = this;
            var status = $target.attr('data-id');
            var modelStatus = this.currentModel.get('status');
            var done = $target.hasClass('done');
            var saveObject = {};
            var allStatus = ['printed', 'packed'];

            saveObject['status.' + status] = true;

            e.preventDefault();

            if (done) {
                saveObject['status.' + status] = false;
            }

            if (status === 'shipped') {
                allStatus.forEach(function (el) {
                    if (!modelStatus[el]) {
                        saveObject['status.' + el] = true;
                    }
                })
            }

            this.currentModel.save(saveObject, {patch: true});
        },

        redirectAfter: function (content) {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        render: function () {
            var $thisEl = this.$el;
            var model = this.currentModel.toJSON();
            var formString = this.template({
                model        : model,
                visible      : this.visible,
                hidePrAndCust: this.hidePrAndCust

            });
            var template = this.templateDoc({
                model           : model,
                currencySplitter: helpers.currencySplitter
            });

            $thisEl.html(formString);

            $thisEl.find('.attachments').append(
                new AttachView({
                    model      : this.currentModel,
                    contentType: 'stockTransactions'
                }).render().el
            );

            $thisEl.find('#templateDiv').html(template);

            this.delegateEvents(this.events);

            App.stopPreload();

            return this;
        }
    });

    return FormView;
});
