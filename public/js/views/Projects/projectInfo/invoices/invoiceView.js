/**
 * Created by liliya on 17.09.15.
 */

define([
    'views/salesInvoice/list/ListView',
    'text!templates/Projects/projectInfo/invoiceTemplate.html',
    'views/salesInvoice/EditView',
    'views/salesInvoice/list/ListItemView',
    'collections/salesInvoice/filterCollection',
    'models/InvoiceModel',
    'common',
    'helpers',
    "dataService"

], function (ListView, invoiceTemplate, editView, listItemView, invoiceCollection, invoiceModel, common, helpers, dataService) {
    var invoiceView = ListView.extend({

        el               : '#invoices',
        listItemView     : listItemView,
        contentCollection: invoiceCollection,
        changedModels    : {},

        initialize: function (options) {
            this.remove();
            this.collection = options.model;
            this.filter = options.filter ? options.filter : {};
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

            $('.newSelectList').show();

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
            var listTableCheckedInput;
            var table = this.$el.find('#listTable');
            listTableCheckedInput = table.find("input:not('#check_all_invoice'):checked");

            this.collectionLength = this.collection.length;
            $.each(listTableCheckedInput, function (index, checkbox) {
                model = that.collection.get(checkbox.value);
                orderId = model.get("sourceDocument");
                orderId = orderId && orderId._id ? orderId._id : orderId;
                model.destroy({
                    wait   : true,
                    success: function (model) {
                        var id = model.get('_id');
                        var tr = $("[data-id=" + orderId + "]");

                        table.find('[data-id="' + id + '"]').remove();

                        tr.find('.type').text("Not Invoiced");

                        tr.find('.workflow').html('<a href="javascript:;" class="stageSelect">Draft</a>');

                        tr.removeClass('notEditable');

                        $("#removeInvoice").hide();
                    },
                    error  : function (model, res) {
                        if (res.status === 403 && index === 0) {
                            alert("You do not have permission to perform this action");
                        }
                    }
                });
            });
        },

        goToEditDialog: function (e) {
            e.preventDefault();

            var id = $(e.target).closest('tr').data("id");
            var model = new invoiceModel({validate: false});

            model.urlRoot = '/Invoice/form';
            model.fetch({
                data   : {
                    id       : id,
                    currentDb: App.currentDb
                },
                success: function (model) {
                    // var isWtrack = App.weTrack;

                    new editView({model: model, redirect: true, collection: this.collection});
                },
                error  : function () {
                    alert('Please refresh browser');
                }
            });
        },

        renderContent: function () {
            var currentEl = this.$el;
            var tBody = currentEl.find("#listTable");
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

            target$ = $(e.target);
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
            if (this.collection.length > 0) {
                var el = this.$el;
                var checkLength = el.find("input.checkbox:checked").length;
                var checkAll$ = el.find('#check_all_invoice');
                var removeBtnEl = $('#removeInvoice');

                if (checkLength > 0) {
                    checkAll$.prop('checked', false);
                    removeBtnEl.show();

                    if (checkLength == this.collection.length) {

                        checkAll$.prop('checked', true);
                    }
                }
                else {
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
            var currentEl = this.$el;
            var template = _.template(invoiceTemplate);
            var self = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;

            currentEl.html('');

            if (options && options.activeTab) {
                self.hideDialog();

                tabs = $(".chart-tabs");
                target = tabs.find('#invoiceTab');

                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                n = target.parents(".chart-tabs").find("li").index(target.parent());
                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find(".dialog-tabs-item").eq(n).addClass("active");
            }

            currentEl.append(template({
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
                self.$el.find(':checkbox').prop('checked', this.checked);
                if (self.$el.find("input.checkbox:checked").length > 0) {
                    self.$el.find("#removeInvoice").show();
                } else {
                    self.$el.find("#removeInvoice").hide();
                }
            });

            return this;
        }
    });

    return invoiceView;
});