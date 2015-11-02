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



        render: function () {
            var currentEl = this.$el;
            var template = _.template(invoiceTemplate);

            currentEl.html('');

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