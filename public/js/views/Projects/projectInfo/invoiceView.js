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
    'helpers'

], function (ListView, invoiceTemplate, editView, listItemView, invoiceCollection, invoiceModel, common, helpers) {
    var invoiceView = ListView.extend({

        el: '#invoices',
        listItemView            : listItemView,
        contentCollection: invoiceCollection,

        initialize: function (options) {
            this.collection = options.model;
            this.filter = options.filter ? options.filter : {};

            this.render();
        },

        template: _.template(invoiceTemplate),

        events: {
            "click .checkbox": "checked",
            "click  .list td:not(.notForm)": "goToEditDialog",
            "click #removeInvoice": "deleteItems"
        },

        deleteItems: function (e) {
            e.preventDefault();

            var that = this;
            var model;
            var listTableCheckedInput;
            var table = this.$el.find('#listTable');
            listTableCheckedInput = table.find("input:not('#check_all_invoice'):checked");

            this.collectionLength = this.collection.length;
            $.each(listTableCheckedInput, function (index, checkbox) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    wait   : true,
                    success: function (model) {
                        var id = model.get('_id');

                        table.find('[data-id="' + id + '"]').remove();

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

                    new editView({model: model, redirect: true, collection : this.collection});
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
                var checkAll$=el.find('#check_all_invoice');
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

            if (options && options.activeTab){
                self.hideDialog();

                tabs = $(".chart-tabs");
                target =  tabs.find('#invoiceTab');

                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                n = target.parents(".chart-tabs").find("li").index(target.parent());
                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find(".dialog-tabs-item").eq(n).addClass("active");
            }

            currentEl.append(template({
                collection: this.collection.toJSON(),
                startNumber: 0,
                utcDateToLocaleDate: common.utcDateToLocaleDate,
                currencySplitter: helpers.currencySplitter
            }));

            this.$el.find("#removeInvoice").hide();

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