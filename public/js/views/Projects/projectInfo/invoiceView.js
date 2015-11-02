/**
 * Created by liliya on 17.09.15.
 */

define([
    'views/salesInvoice/list/ListView',
    'text!templates/Projects/projectInfo/invoiceTemplate.html',
    'views/salesInvoice/EditView',
    'models/InvoiceModel',
    'common',
    'helpers'

], function (ListView, invoiceTemplate, editView, invoiceModel, common, helpers) {
    var invoiceView = ListView.extend({

        el: '#invoices',

        initialize: function (options) {
            this.collection = options.model;

            this.render();
        },

        template: _.template(invoiceTemplate),

        events: {
            "click .checkbox": "checked",
            "click  .list td:not(.notForm)": "goToEditDialog"
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

        checked: function (e) {
            if (this.models.length > 0) {
                var checkLength = $("input.checkbox:checked").length;

                if ($("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                    $('#check_all').prop('checked', false);

                    if (checkLength == this.models.length) {
                        $('#check_all').prop('checked', true);
                    }
                } else {
                    $("#top-bar-deleteBtn").hide();
                    $('#check_all').prop('checked', false);
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

            return this;
        }
    });

    return invoiceView;
});