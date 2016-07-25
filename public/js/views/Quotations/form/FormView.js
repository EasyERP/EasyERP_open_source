define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Quotations/EditTemplate.html',
    'views/dialogViewBase',
    'views/Projects/projectInfo/proformas/proformaView',
    'views/Assignees/AssigneesView',
    'views/Products/InvoiceOrder/ProductItems',
    'views/Projects/projectInfo/orders/orderView',
    'collections/Quotations/filterCollection',
    'collections/Proforma/filterCollection',
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
             BaseView,
             ProformaView,
             AssigneesView,
             ProductItemView,
             OrdersView,
             QuotationCollection,
             ProformaCollection,
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

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
                this.eventChannel = options.eventChannel;
            }

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.currentModel.urlRoot = '/quotations';
            this.responseObj = {};
            this.forSales = options.forSales;

        },

        events: {
            'click .confirmOrder'   : 'confirmOrder',
            'click .createProforma' : 'createProforma',
            'click .cancelQuotation': 'cancelQuotation',
            'click .setDraft'       : 'setDraft',
            'click .editable'       : 'editItem',
            'click #saveSpan'       : 'saveClick',
            'click #cancelSpan'     : 'cancelClick'
            //'click #editSpan'       : 'editClick',
            //'click #cancelSpan'     : 'cancelClick',
            //'click #saveSpan'       : 'saveClick'
        },

        cancelClick: function (e) {
            e.preventDefault();

            $('.quickEdit #editInput').remove();
            $('.quickEdit #cancelSpan').remove();
            $('.quickEdit #saveSpan').remove();
            $('.quickEdit').text(this.text).removeClass('quickEdit');
            //Backbone.history.fragment = '';
            //Backbone.history.navigate('#easyErp/Companies/form/' + this.formModel.id, {trigger: true});
        },

        saveClick: function (e) {
            var parent = $(e.target).parent().parent();
            var objIndex = parent[0].id.split('_');
            var currentModel = this.formModel;
            var newModel = {};
            var oldvalue = {};
            var mid = this.mId;
            var self = this;
            var param;
            var valid;
            var i;

            this.text = $('#' + parent[0].id).find('#editInput').val();

            e.preventDefault();

            if (objIndex.length > 1) {
                for (i in this.formModel.toJSON()[objIndex[0]]) {
                    oldvalue[i] = this.formModel.toJSON()[objIndex[0]][i];
                }
                param = currentModel.get(objIndex[0]) || {};
                param[objIndex[1]] = $('#editInput').val().replace('http://', '');
                newModel[objIndex[0]] = param;
            } else {
                oldvalue = this.formModel.toJSON()[objIndex[0]];
                newModel[objIndex[0]] = $('#editInput').val().replace('http://', '');
            }

            valid = this.formModel.save(newModel, {
                headers: {
                    mid: mid
                },

                patch  : true,
                success: function (model) {
                    App.render({
                        type   : 'notify',
                        message: "Saving is successfully"
                    });

                    $('.quickEdit #editInput').remove();
                    $('.quickEdit #cancelSpan').remove();
                    $('.quickEdit #saveSpan').remove();
                    $('.quickEdit').text(self.text).removeClass('quickEdit');
                    //Backbone.history.fragment = '';
                    //Backbone.history.navigate('#easyErp/Companies/form/' + model.id, {trigger: true});
                },

                error: function (model, response) {
                    if (response) {
                        App.render({
                            type   : 'error',
                            message: response.error
                        });
                    }
                }
            });

            if (!valid) {
                newModel[objIndex[0]] = oldvalue;
                this.formModel.set(newModel);
            }
        },

        editItem: function (e) {
            var maxlength = $('#' + $(e.target).parent().parent()[0].id).find('.no-long').attr('data-maxlength') || 32;
            var parent;

            e.preventDefault();

            $('.quickEdit #editInput').remove();
            $('.quickEdit #cancelSpan').remove();
            $('.quickEdit #saveSpan').remove();
            //$('.quickEdit').text(this.text).removeClass('quickEdit');

            parent = $(e.target).parent().parent();
            $('#' + parent[0].id).addClass('quickEdit');
            $('#editSpan').remove();
            this.text = $('#' + parent[0].id).text();
            $('#' + parent[0].id).text('');
            $('#' + parent[0].id).append('<input id="editInput" maxlength="' + maxlength + '" type="text" class="left"/>');
            $('#editInput').val(this.text);
            $('#' + parent[0].id).append('<span id="saveSpan"><a href="#">c</a></span>');
            $('#' + parent[0].id).append('<span id="cancelSpan"><a href="#">x</a></span>');
            //$('#' + parent[0].id).find('#editInput').width($('#' + parent[0].id).find('#editInput').width() - 50);

            /* var $currEl = $('#' + e.target.id);
             var currentValue = $currEl.val();
             var currentModel = this.currentModel;
             var self = this;
             var newModel = {};
             var valid;
             var otherValue;
             var $parent = $('#' + e.target.id).parent().parent();

             console.log($currEl.parent());

             $parent.find('#saveItem').remove();
             $parent.find('#canselSaveItem').remove();

             $currEl.parent().append('<input style="position: fixed" type="button" id="saveItem">' + 'Save' + '</input>');
             $currEl.parent().append('<input type="button" id="canselSaveItem">' + 'Cancel' + '</input>');
            */ /*
            //console.log('currentEl => ', $currEl);
            //console.log('currentValue => ', currentValue);

            $currEl.focusout(function() {
                otherValue = $currEl.val();

                if (currentValue !== otherValue) {
                    console.log('value is changed');

                    newModel[e.target.id] = otherValue;

                    valid = currentModel.save(newModel, {
                        /!*headers: {
                            mid: this.mId
                        },*!/

                        patch  : true,
                        success: function (model) {
                            App.render({
                                type   : 'notify',
                                message: "Saving is successfully"
                            });
                        },

                        error: function (model, response) {
                            if (response) {
                                App.render({
                                    type   : 'error',
                                    message: response.error
                                });
                            }
                        }
                    });

                    if (!valid) {
                        //newModel[objIndex[0]] = oldvalue;
                        self.currentModel.set(newModel);
                    }
                }

                $(this).unbind('focusout');
            });*/
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var id = target.attr('id');
            var type = target.attr('data-level');

            var element = _.find(this.responseObj['#project'], function (el) {
                return el._id === id;
            });

            var currencyElement = $(e.target).parents('dd').find('.current-selected');
            var oldCurrency = currencyElement.attr('data-id');
            var newCurrency = $(e.target).attr('id');
            var oldCurrencyClass = helpers.currencyClass(oldCurrency);
            var newCurrencyClass = helpers.currencyClass(newCurrency);

            var array = this.$el.find('.' + oldCurrencyClass);

            array.removeClass(oldCurrencyClass).addClass(newCurrencyClass);

            currencyElement.text($(e.target).text()).attr('data-id', newCurrency);

            if (type !== $.trim(this.$el.find('#supplierDd').text()) && element && element.customer && element.customer.name) {
                this.$el.find('#supplierDd').text(element.customer.name && element.customer.name.first ? element.customer.name.first +
                ' ' + element.customer.name.last : element.customer.name);
                this.$el.find('#supplierDd').attr('data-id', element.customer._id);
            }

            this.hideNewSelect();
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

            this.saveItem(function (err) {
                if (!err) {
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
                        } else {
                            return App.render({
                                type   : 'error',
                                message: CONSTANTS.RESPONSES.CONFIRM_ORDER
                            });
                        }
                    });
                }
            });
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
            var redirectUrl = self.forSales ? 'easyErp/salesProforma/list' : 'easyErp/proforma/list';

            if (e) {
                e.preventDefault();
            }
            App.startPreload();

            this.saveItem(function (err, res) {
                var id = res.id;
                if (!err) {

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

        saveItem: function (proformaCb /* orderCb*/) {
            var self = this;
            var mid = this.forSales ? 62 : 55;
            var thisEl = this.$el;
            var selectedProducts = thisEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var quantity;
            var price;
            var supplier = thisEl.find('#supplierDd').attr('data-id');
            var project = thisEl.find('#projectDd').attr('data-id');
            var destination = $.trim(thisEl.find('#destination').data('id'));
            var deliverTo = $.trim(thisEl.find('#deliveryDd').data('id'));
            var incoterm = $.trim(thisEl.find('#incoterm').data('id'));
            var invoiceControl = $.trim(thisEl.find('#invoicingControl').data('id'));
            var paymentTerm = $.trim(thisEl.find('#paymentTerm').data('id'));
            var fiscalPosition = $.trim(thisEl.find('#fiscalPosition').data('id'));
            var supplierReference = thisEl.find('#supplierReference').val();
            var orderDate = thisEl.find('#orderDate').val();
            var expectedDate = thisEl.find('#expectedDate').val() || orderDate;
            var total = helpers.spaceReplacer($.trim(thisEl.find('#totalAmount').text()));
            var totalTaxes = helpers.spaceReplacer($.trim(thisEl.find('#taxes').text()));
            var unTaxed = helpers.spaceReplacer($.trim(thisEl.find('#totalUntaxes').text()));
            var taxes;
            var description;
            var subTotal;
            var jobs;
            var scheduledDate;
            var usersId = [];
            var groupsId = [];
            var data;

            var currency = {
                _id : thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim(thisEl.find('#currencyDd').text())
            };
            var wF = this.currentModel.get('workflow');

            var workflow = wF._id;

            var i;
            var whoCanRW;
            var owner = this.$el.find('#allUsersSelect').attr('data-id') || null;

            unTaxed = parseFloat(unTaxed) * 100;
            total = parseFloat(total) * 100;
            totalTaxes = parseFloat(totalTaxes) * 100;

            thisEl.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');

                    if (productId) {
                        quantity = targetEl.find('[data-name="quantity"] span').text();
                        price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val());
                        price = parseFloat(price) * 100;

                        if (isNaN(price) || price <= 0) {
                            App.stopPreload();
                            return App.render({
                                type   : 'error',
                                message: 'Please, enter Unit Price!'
                            });
                        }
                        scheduledDate = targetEl.find('[data-name="scheduledDate"]').text();
                        taxes = helpers.spaceReplacer(targetEl.find('.taxes').text());
                        taxes = parseFloat(taxes) * 100;
                        description = targetEl.find('[data-name="productDescr"] textarea').val() || targetEl.find('[data-name="productDescr"]').text();
                        jobs = targetEl.find('[data-name="jobs"]').attr('data-content');
                        subTotal = helpers.spaceReplacer(targetEl.find('.subtotal').text());
                        subTotal = parseFloat(subTotal) * 100;

                        if (!quantity) {
                            return App.render({
                                type   : 'error',
                                message: 'Quantity can\'t be empty'
                            });
                        }

                        if (!price) {
                            return App.render({
                                type   : 'error',
                                message: 'Unit price can\'t be empty'
                            });
                        }

                        if (jobs) {
                            products.push({
                                product      : productId,
                                unitPrice    : price,
                                quantity     : quantity,
                                scheduledDate: scheduledDate,
                                taxes        : taxes,
                                description  : $.trim(description),
                                subTotal     : subTotal,
                                jobs         : jobs
                            });
                        } else if (this.forSales) {
                            return App.render({
                                type   : 'notify',
                                message: "Jobs can't be empty."
                            });
                        } else {
                            products.push({
                                product      : productId,
                                unitPrice    : price,
                                quantity     : quantity,
                                scheduledDate: scheduledDate,
                                taxes        : taxes,
                                description  : description,
                                subTotal     : subTotal
                            });
                        }

                    }
                }
            }

            data = {
                currency         : currency,
                supplier         : supplier,
                supplierReference: supplierReference,
                deliverTo        : deliverTo,
                products         : products,
                project          : project,
                orderDate        : helpers.setTimeToDate(orderDate),
                expectedDate     : expectedDate,
                destination      : destination,
                incoterm         : incoterm,
                invoiceControl   : invoiceControl,
                paymentTerm      : paymentTerm,
                fiscalPosition   : fiscalPosition,
                paymentInfo      : {
                    total  : total,
                    unTaxed: unTaxed,
                    taxes  : totalTaxes
                },

                groups: {
                    owner: owner,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                workflow: workflow
            };

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (res) {
                        //if (url === '#easyErp/salesQuotations/list') {
                        //    self.hideDialog();
                        //    Backbone.history.fragment = '';
                        //    Backbone.history.navigate(url, {trigger: true});
                        //} else {
                        //    self.hideDialog();
                        //}

                        if (proformaCb && typeof proformaCb === 'function') {
                            return proformaCb(null, res);
                        }

                        if (self.eventChannel) {
                            self.eventChannel.trigger('quotationUpdated');
                        }

                        self.redirectAfter(self, res);
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);

                        if (proformaCb && typeof proformaCb === 'function') {
                            return proformaCb(xhr.text);
                        }
                    }
                });

            } else {
                App.render({
                    type   : 'error',
                    message: CONSTANTS.RESPONSES.CREATE_QUOTATION
                });
            }
        },

        redirectAfter: function (content) {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var model = this.currentModel.toJSON();
            var formString = this.template({
                model        : model,
                visible      : this.visible,
                hidePrAndCust: this.hidePrAndCust
            });
            var service = this.forSales;
            var productItemContainer;

            $thisEl.html(formString);

            this.renderAssignees(this.currentModel);

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);

            populate.get('#destination', '/destination', {}, 'name', this, false, true);
            populate.get('#incoterm', '/incoterm', {}, 'name', this, false, true);
            populate.get('#invoicingControl', '/invoicingControl', {}, 'name', this, false, true);
            populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, false, true);
            populate.get('#deliveryDd', '/deliverTo', {}, 'name', this, false, true);

            if (this.forSales) {
                populate.get('#supplierDd', CONSTANTS.URLS.CUSTOMERS, {}, 'fullName', this, false, false);

                populate.get('#projectDd', '/projects/getForDd', {}, 'name', this, false, false);

            } else {
                populate.get2name('#supplierDd', CONSTANTS.URLS.SUPPLIER, {}, this, false, true);
            }

            this.$el.find('#orderDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : '+0D'
            });

            this.delegateEvents(this.events);
            model = this.currentModel.toJSON();

            productItemContainer = this.$el.find('#productItemsHolder');

            productItemContainer.append(
                new ProductItemView({
                    editable  : true,
                    canBeSold : true,
                    service   : service,
                    quotations: true
                }).render({model: model}).el
            );

            dataService.getData(CONSTANTS.URLS.PROJECTS_GET_FOR_WTRACK, null, function (projects) {
                projects = _.map(projects.data, function (project) {
                    project.name = project.projectName;

                    return project;
                });

                self.responseObj['#project'] = projects;
            });

            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    $('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $('.groupsAndUser').append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" +
                            item.name + "</td><td class='text-right'></td></tr>");
                        $('#targetGroups').append("<li id='" + item._id + "'>" + item.name + "</li>");
                    });
                    model.groups.users.forEach(function (item) {
                        $('.groupsAndUser').append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" +
                            item.login + "</td><td class='text-right'></td></tr>");
                        $('#targetUsers').append("<li id='" + item._id + "'>" + item.login + "</li>");
                    });

                }
            }

            App.stopPreload();

            return this;
        }
    });

    return FormView;
});
