define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Quotations/form/FormTemplate.html',
    'text!templates/Quotations/temps/documentTemp.html',
    'views/dialogViewBase',
    'views/Assignees/AssigneesView',
    'views/Products/InvoiceOrder/ProductItems',
    'views/NoteEditor/NoteView',
    'views/Editor/AttachView',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers/keyValidator',
    'helpers'
], function (Backbone,
             $,
             _,
             EditTemplate,
             DocumentTemplate,
             BaseView,
             AssigneesView,
             ProductItemView,
             NoteEditor,
             AttachView,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             keyValidator,
             helpers) {
    'use strict';

    var FormView = BaseView.extend({
        contentType: CONSTANTS.QUOTATIONS,
        imageSrc   : '',
        template   : _.template(EditTemplate),
        templateDoc: _.template(DocumentTemplate),
        forSales   : false,

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

            this.currentModel.urlRoot = '/quotations';
            this.responseObj = {};

        },

        events: {
            'click .confirmOrder'   : 'confirmOrder',
            'click .createProforma' : 'createProforma',
            'click .cancelQuotation': 'cancelQuotation',
            'click #attachment_file': 'clickInput',
            'click .setDraft'       : 'setDraft',
            'click .saveBtn'        : 'saveQuotation'
        },

        confirmOrder: function (e) {
            var self = this;
            var wId;
            var mid;
            var status;
            var id = self.currentModel.get('_id');

            e.preventDefault();

            if (this.forSales) {
                wId = 'Sales Order';
                mid = 63;
                status = 'New';
            } else {
                wId = 'Purchase Order';
                mid = 57;
                status = 'In Progress'; // todo workflow for purchase
            }

            populate.fetchWorkflow({
                wId    : wId,
                status : status,
                visible: true
                // targetSource: 'order'
            }, function (workflow) {
                var products;

                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                products = self.currentModel.get('products');

                if (products && products.length) {
                    self.currentModel.save({
                        isOrder : true,
                        type    : 'Not Invoiced',
                        workflow: workflow._id
                    }, {
                        headers: {
                            mid: mid
                        },
                        patch  : true,
                        success: function () {
                            var redirectUrl = self.forSales ? 'easyErp/salesOrders' : 'easyErp/Orders';

                            if (self.redirect) {

                                if (self.eventChannel) {
                                    self.eventChannel.trigger('orderUpdate', null, self.currentModel.get('_id'), true);
                                }

                                if (self.collection) {
                                    self.collection.remove(self.currentModel.get('_id'));

                                }

                            } else {
                                Backbone.history.navigate(redirectUrl, {trigger: true});
                            }
                        }
                    });

                }
            });
        },

        clickInput: function () {
            $('.input-file .inputAttach').click();
        },

        createProforma: function (e) {
            var self = this;
            var url = '/proforma';
            var quotationId = this.currentModel.id;
            var journal = this.forSales ? CONSTANTS.PROFORMA_JOURNAL : null;
            var data = {
                forSales   : this.forSales,
                quotationId: quotationId,
                currency   : this.currentModel.toJSON().currency,
                journal    : journal
            };
            var redirectUrl = self.forSales ? 'easyErp/salesProforma/list' : 'easyErp/Proforma/list';

            if (e) {
                e.preventDefault();
            }
            App.startPreload();

            dataService.postData(url, data, function (err, response) {
                var tr;

                App.stopPreload();

                if (err) {
                    App.render({
                        type   : 'error',
                        message: 'Can\'t create proforma'
                    });
                } else {
                    if (App.projectInfo) {
                        App.projectInfo.currentTab = 'proforma';
                    }

                    if (self.eventChannel) {
                        $('.edit-dialog').remove();
                        self.eventChannel.trigger('newProforma', response._id);
                    } else {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }

                    tr = $('[data-id=' + quotationId + ']');
                    tr.find('.checkbox').addClass('notRemovable');
                    tr.find('.workflow').find('a').text('Proformed');
                }
            });

        },

        cancelQuotation: function (e) {
            var self = this;

            e.preventDefault();

            populate.fetchWorkflow({
                wId         : 'Purchase Order',
                source      : 'purchase',
                targetSource: 'quotation',
                status      : 'Cancelled',
                order       : 1
            }, function (workflow) {
                var redirectUrl = window.location.hash;

                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                self.currentModel.save({
                    workflow: workflow._id
                }, {
                    headers: {
                        mid: 57
                    },
                    patch  : true,
                    success: function () {
                        $('.edit-dialog').remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
        },

        setDraft: function (e) {
            var self = this;

            e.preventDefault();

            populate.fetchWorkflow({
                wId: 'Sales Order'
            }, function (workflow) {
                var redirectUrl = window.location.hash;

                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                self.currentModel.save({
                    workflow: workflow._id
                }, {
                    headers: {
                        mid: 57
                    },
                    patch  : true,
                    success: function () {
                        $('.edit-dialog').remove();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
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
            var template;
            var timeLine;

            $thisEl.html(formString);

            template = this.templateDoc({
                model            : model,
                currencySplitter : helpers.currencySplitter
            });

            timeLine = new NoteEditor({
                model : this.currentModel
            });

            $thisEl.find('#templateDiv').html(template);

            $thisEl.find('#historyDiv').html(
                timeLine.render().el
            );
            $thisEl.find('#attachments').append(
                new AttachView({
                    model      : this.currentModel,
                    contentType: 'quotations',
                    forDoc     : true
                }).render().el
            );

            this.delegateEvents(this.events);

            App.stopPreload();

            return this;
        }
    });

    return FormView;
});
