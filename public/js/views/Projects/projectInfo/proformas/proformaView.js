/**
 * Created by liliya on 17.09.15.
 */

define([
    'views/Proforma/list/ListView',
    'text!templates/Projects/projectInfo/proformaTemplate.html',
    'views/Proforma/EditView',
    'views/Proforma/list/ListItemView',
    'collections/salesInvoice/filterCollection',
    'models/InvoiceModel',
    'common',
    'helpers',
    "dataService",
    "async"

], function (ListView, invoiceTemplate, editView, listItemView, invoiceCollection, invoiceModel, common, helpers, dataService, async) {
    var invoiceView = ListView.extend({

        el               : '#proforma',
        listItemView     : listItemView,
        contentCollection: invoiceCollection,
        changedModels    : {},

        initialize: function (options) {
            this.remove();
            this.collection = options.model;
            this.filter = options.filter ? options.filter : {};

            this.eventChannel = options.eventChannel || {};

            this.render(options);
        },

        template: _.template(invoiceTemplate),

        events: {
            "click .checkbox"                          : "checked",
            "click  .list td:not(.notForm, .validated)": "goToEditDialog",
            "click #removeInvoice"                     : "deleteItems",
            "click #saveInvoice"                       : "saveItems",
            "click .selectList"                        : "showSelects",
            "click .newSelectList li"                  : "chooseOption"
        },

        showSelects: function (e) {
            e.preventDefault();

            $(e.target).parent('td').append("<ul class='newSelectList'><li>Draft</li><li>Done</li></ul>");

            e.stopPropagation();
        },

        saveItems: function (e) {
            e.preventDefault();

            var model;
            var self = this;

            for (var id in this.changedModels) {
                model = this.collection.get(id);

                model.save({
                    'validated': self.changedModels[id].validated
                }, {
                    headers : {
                        mid: 55
                    },
                    patch   : true,
                    validate: false,
                    success : function () {
                        self.$el.find("#saveInvoice").hide();
                    }
                });
            }

            for (var id in this.changedModels) {
                delete this.changedModels[id];
            }
        },

        chooseOption: function (e) {
            //var self = this;
            //var target$ = $(e.target);
            //var targetElement = target$.parents("td");
            //var wId = target$.attr("id");
            //var status = _.find(this.stages, function (stage) {
            //    return wId === stage._id;
            //});
            //var name = target$.text();
            //var id = targetElement.attr("id");
            //var model = this.collection.get(id);
            //
            //model.save({
            //    'workflow._id'   : wId,
            //    'workflow.status': status.status,
            //    'workflow.name'  : name
            //}, {
            //    headers : {
            //        mid: 55
            //    },
            //    patch   : true,
            //    validate: false,
            //    success : function () {
            //        self.render();
            //    }
            //});

            var self = this;
            var target$ = $(e.target);
            var targetElement = target$.parents("td");
            var targetTr = target$.parents("tr");
            var id = targetTr.attr('data-id');

            if (!this.changedModels[id]) {
                this.changedModels[id] = {};
            }

            if (!this.changedModels[id].hasOwnProperty('validated')) {
                this.changedModels[id].validated = target$.text();
                this.changesCount++;
            }

            targetElement.find('.selectList').text(target$.text());

            this.hideNewSelect();

            this.$el.find("#saveInvoice").show();
            return false;
        },

        hideNewSelect: function (e) {
            $(".newSelectList").hide();
        },

        deleteItems: function (e) {
            e.preventDefault();

            var that = this;
            var model;
            var orderId;
            var id;
            var tr;
            var listTableCheckedInput;
            var table = this.$el.find('#listTable');
            listTableCheckedInput = table.find("input:not('#check_all_invoice'):checked");

            this.collectionLength = this.collection.length;
            async.each(listTableCheckedInput, function (checkbox, cb) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    wait   : true,
                    success: function (model) {
                        orderId = model.get("sourceDocument");
                        orderId = orderId && orderId._id ? orderId._id : orderId;
                        id = model.get('_id');
                        tr = $("[data-id=" + orderId + "]");

                        table.find('[data-id="' + id + '"]').remove();

                        tr.find('.workflow').html('<a href="javascript:;" class="">Not Invoiced</a>');

                        tr.removeClass('notEditable');
                        tr.find('.checkbox').removeClass('notRemovable');

                        $("#removeInvoice").hide();
                        $('#check_all_invoice').prop('checked', false);

                        that.collection.remove(checkbox.value);

                        cb();
                    },
                    error  : function (model, res) {
                        if (res.status === 403 && index === 0) {
                            App.render({
                                type: 'error',
                                message: "You do not have permission to perform this action"
                            });
                        }

                        cb();
                    }
                });

            }, function () {
                if (that.collection.length) {
                    that.recalcTotal();
                } else {
                    that.$el.find('#listTotal').hide();
                }
            });
        },

        recalcTotal: function () {
            var self = this;
            var collection = this.collection.toJSON();
            var balance = 0;
            var paid = 0;
            var total = 0;

            async.forEach(collection, function (model, cb) {
                balance += parseInt(model.paymentInfo.balance);
                paid += parseInt(model.paymentInfo.unTaxed);
                total += parseInt(model.paymentInfo.total);

                cb();
            }, function () {
                self.$el.find("#balance").text(helpers.currencySplitter(balance.toFixed(2)));
                self.$el.find("#paid").text(helpers.currencySplitter(paid.toFixed(2)));
                self.$el.find("#total").text(helpers.currencySplitter(total.toFixed(2)));
            });
        },

        showDialog: function (orderId) {
            var invoice = _.find(this.collection.toJSON(), function (el) {
                return (el.sourceDocument ? el.sourceDocument._id.toString() === orderId.toString() : null);
            });

            var model = new invoiceModel({validate: false});

            model.urlRoot = '/Invoice/form';
            model.fetch({
                data   : {
                    id       : invoice._id,
                    currentDb: App.currentDb
                },
                success: function (model) {
                    new editView({model: model, redirect: true, collection: this.collection, notCreate: true});
                },
                error  : function () {
                    App.render({
                        type: 'error',
                        message: 'Please refresh browser'
                    });
                }
            });

        },

        goToEditDialog: function (e) {
            var self = this;
            var id = $(e.target).closest('tr').data("id");
            var model = new invoiceModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/Invoice/form';
            model.fetch({
                data   : {
                    id       : id,
                    currentDb: App.currentDb
                },
                success: function (model) {
                    // var isWtrack = App.weTrack;

                    new editView({model: model,
                        redirect: true,
                        collection: this.collection,
                        notCreate: true,
                        eventChannel: self.eventChannel
                    });
                },
                error  : function () {
                    App.render({
                        type: 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        renderContent: function () {
            var $currentEl = this.$el;
            var tBody = $currentEl.find("#listTable");
            var itemView;
            var pagenation;

            tBody.empty();
            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);

            if (this.collection.length > 0) {
                itemView = new this.listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });
                tBody.append(itemView.render({thisEl: tBody}));
            }

            pagenation = this.$el.find('.pagination');
            if (this.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }
        },

        goSort: function (e) {
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            target$ = $(e.target).closest('th');
            currentParrentSortClass = target$.attr('class');
            sortClass = currentParrentSortClass.split(' ')[1];
            sortConst = 1;
            sortBy = target$.data('sort');
            sortObject = {};

            if (!sortClass) {
                target$.addClass('sortDn');
                sortClass = "sortDn";
            }
            switch (sortClass) {
                case "sortDn":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                }
                    break;
                case "sortUp":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                }
                    break;
            }
            sortObject[sortBy] = sortConst;

            this.fetchSortCollection(sortObject);
            this.getTotalLength(null, this.defaultItemsNumber, this.filter);
        },

        checked: function (e) {
            var $targetEl = $(e.target);
            var $el = this.$el;
            var checkLength;
            var checkAll$;
            var removeBtnEl;

            if ($targetEl.hasClass('notRemovable')) {
                $targetEl.prop('checked', false);

                return false;
            }

            if (this.collection.length > 0) {
                checkLength = $el.find("input.checkbox:checked:not(.notRemovable)").length;
                checkAll$ = $el.find('#check_all_invoice');
                removeBtnEl = $('#removeInvoice');

                if (checkLength > 0) {
                    checkAll$.prop('checked', false);
                    removeBtnEl.show();

                    if (checkLength == this.collection.length) {

                        checkAll$.prop('checked', true);
                    }
                } else {
                    removeBtnEl.hide();
                    checkAll$.prop('checked', false);
                }
            }
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".ui-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
            $(".crop-images-dialog").remove();
        },

        render: function (options) {
            var $currentEl = this.$el;
            var template = _.template(invoiceTemplate);
            var self = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;

            $currentEl.html('');

            if (options && options.activeTab) {
                self.hideDialog();

                tabs = $(".chart-tabs");
                target = tabs.find('#proformaTab');

                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                n = target.parents(".chart-tabs").find("li").index(target.parent());
                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find(".dialog-tabs-item").eq(n).addClass("active");

                App.projectInfo = App.projectInfo || {};
                App.projectInfo.currentTab = 'proforma';
            }

            $currentEl.append(template({
                collection         : this.collection.toJSON(),
                startNumber        : 0,
                utcDateToLocaleDate: common.utcDateToLocaleDate,
                currencySplitter   : helpers.currencySplitter
            }));

            dataService.getData("/workflow/fetch", {
                wId         : 'Sales Invoice',
                source      : 'purchase',
                targetSource: 'invoice'
            }, function (stages) {
                self.stages = stages;
            });

            this.$el.find("#removeInvoice").hide();
            this.$el.find("#saveInvoice").hide();

            $('#check_all_invoice').click(function () {

                self.$el.find(':checkbox:not(.notRemovable)').prop('checked', this.checked);

                if (self.$el.find("input.checkbox:checked").length > 0) {
                    self.$el.find("#removeInvoice").show();
                } else {
                    self.$el.find("#removeInvoice").hide();
                    $('#check_all_invoice').prop('checked', false);
                }
            });

            return this;
        }
    });

    return invoiceView;
});