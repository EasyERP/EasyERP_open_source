define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/goodsOutNotes/form/FormTemplate.html',
    'text!templates/goodsOutNotes/temps/documentTemp.html',
    'views/dialogViewBase',
    'views/Assignees/AssigneesView',
    'views/Products/InvoiceOrder/ProductItems',
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
    'helpers/exportToPdf',
    'moment'
], function (Backbone,
             $,
             _,
             EditTemplate,
             DocumentTemplate,
             BaseView,
             AssigneesView,
             ProductItemView,
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
             exportToPdf,
             moment) {
    'use strict';

    var FormView = BaseView.extend({
        contentType: CONSTANTS.QUOTATIONS,
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

            this.currentModel.urlRoot = '/goodsOutNotes';

            this.currentModel.on('sync', this.render, this);
            this.responseObj = {};

        },

        events: {
            'click #printPdf:not(.done)': 'printPdf',
            'click #packBtn:not(.done)' : 'packNote',
            'click .sendEmail'          : 'sendEmail',
            'click #attachment_file'    : 'clickInput',
            'click .setDraft'           : 'setDraft',
            'click .saveBtn'            : 'saveQuotation',
            'click .changeStatus'       : 'changeStatus'
        },

        printPdf: function (e) {
            e.preventDefault();
            window.print();
        },

        packNote: function (e) {
            var date = this.$el.find('#date').text() || this.$el.find('#date').val();

            e.preventDefault();

            new PackNote({model: this.currentModel, date: date});
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

        changeStatus: function (e) {
            var $target = $(e.target);
            var self = this;
            var status = $target.attr('data-id');
            var modelStatus = this.currentModel.get('status');
            var modelJSON = this.currentModel.toJSON();
            var date = this.$el.find('#date').text() || this.$el.find('#date').val();
            var done = $target.hasClass('done');
            var saveObject = {};
            var allStatus = ['printed', 'picked', 'packed'];

            saveObject.date = helpers.setTimeToDate(date);

            saveObject['status.' + status] = true;

            e.preventDefault();

            if (done) {
                saveObject['status.' + status] = false;
            }

            if (status === 'shipped' && modelJSON.order) {

                if (modelJSON.order.shippingExpenses && modelJSON.order.shippingExpenses.amount && !modelJSON.shippingMethod) {
                    return App.render({
                        type   : 'error',
                        message: 'Shipping Method can\'t be empty. Please, first Pack items.'
                    });
                }
                allStatus.forEach(function (el) {
                    if (!modelStatus[el]) {
                        saveObject['status.' + el] = true;
                    }
                });

                this.$el.find('.list').find('[data-id="' + status + '"] a').addClass('done');
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
            var formString;
            var template;

            if (model.date) {
                model.date = moment(model.date).format('DD MMM, YYYY, H:mm');
            }

            formString = this.template({
                model        : model,
                visible      : this.visible,
                hidePrAndCust: this.hidePrAndCust
            });

            template = this.templateDoc({
                model           : model,
                currencySplitter: helpers.currencySplitter
            });

            $thisEl.html(formString);

            $thisEl.find('#templateDiv').html(template);

            if (!model.status.shipped) {
                this.$el.find('#date').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    minDate    : new Date(model.order ? model.order.orderDate : model.manufacturingOrder.deadlineStart),
                    maxDate    : new Date()
                }).datepicker('setDate', new Date(model.date));
            }

            this.delegateEvents(this.events);

            App.stopPreload();

            return this;
        }
    });

    return FormView;
});
