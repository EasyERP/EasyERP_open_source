define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/stockReturns/CreateTemplate.html',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'populate',
    'constants',
    'moment'
], function (Backbone, $, _, Parent, CreateTemplate, keyValidator, helpers, dataService, populate, CONSTANTS, moment) {
    var CreateView = Parent.extend({
        el         : '#content-holder',
        contentType: 'Payment',
        template   : _.template(CreateTemplate),

        initialize: function (options) {
            this.model = options.model;
            this.purchase = options.purchase;
            this.parentView = options.parentView;
            this.cancel = options.cancel;
            this.responseObj = {};

            this.render();
        },

        events: {
            'keyup .returnQuantity': 'checkQuantity',
            'click .remove'        : 'removeRow'
        },

        checkQuantity: function (e) {
            var $target = $(e.target);
            var value = parseInt($target.val(), 10);
            var closestTr = $target.closest('tr');
            var maxValue = parseInt($.trim(closestTr.find('.shipped').text()), 10);

            if (value < 0) {
                value = 0;
                $target.val(value);
            }

            if (value > maxValue) {
                value = maxValue;
                $target.val(value);
            }
        },

        removeRow: function (e) {
            var $target = $(e.target);
            var allRows = this.$el.find('#tbodyProducts').find('tr').length;
            var closestTr = $target.closest('tr');

            if (allRows === 1) {
                return App.render({
                    type   : 'error',
                    message: 'You can\'t delete last item'
                });
            }

            closestTr.remove();
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        saveItem: function (e) {
            var self = this;
            var tableRows = this.$el.find('#tbodyProducts').find('tr');
            var length = tableRows.length;
            var date = new Date(this.$el.find('#date').val());
            var data = [];
            var body = {};
            var description = $.trim(this.$el.find('#description').val());

            if (!length) {
                return App.render({
                    type   : 'error',
                    message: 'Nothing to create'
                });
            }

            body.pullGoodsOutNotes = {};
            body.journalEntrySources = [];

          tableRows.each(function () {
                var goodsNote = $(this).find('.goodsNote').attr('data-id');
                var goodsNoteName = $.trim($(this).find('.goodsNote').text());
                var product = $(this).find('.product').attr('data-id');
                var qty = parseInt($(this).find('.returnQuantity').val(), 10) || parseInt($(this).find('.returnQuantity').text(), 10);
                var maxQty = parseInt($.trim($(this).find('.shipped').text()), 10);
                var warehouse = $(this).find('.warehouse').attr('data-id');
                var orderRowId = $(this).attr('data-id');

                if (qty === maxQty) {
                    body.pullGoodsOutNotes[goodsNote] = true;
                }

            body.journalEntrySources.push(goodsNoteName);

            if (self.purchase) {
                    data.push({
                        goodsInNote: goodsNote,
                        product    : product,
                        quantity   : qty,
                        warehouse  : warehouse,
                        orderRowId : orderRowId
                    });

                 } else {
                    data.push({
                        goodsOutNote: goodsNote,
                        product     : product,
                        quantity    : qty,
                        warehouse   : warehouse,
                        orderRowId  : orderRowId
                    });
                }
            });

            body.orderRows = data;
            body.releaseDate = helpers.setTimeToDate(date);
            body.description = description;
            body.order = this.model.toJSON()._id;

            dataService.postData('/goodsInNotes/return', body, function (err, resp) {
                var url = window.location.hash;

                if (!err) {
                    self.hideDialog();

                    if (self.parentView) {
                        return self.parentView.cancelOrder(e);
                    }

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
                } else {
                    return App.render({
                        type   : 'error',
                        message: err.error
                    });
                }
            });
        },

        render: function () {
            var self = this;
            var model = this.model.toJSON();
            var htmBody;

            htmBody = this.template({
                model           : model,
                currencyClass   : helpers.currencyClass,
                currencySplitter: helpers.currencySplitter,
                moment          : moment,
                purchase        : this.purchase,
                cancel          : this.cancel
            });

            this.$el = $(htmBody).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                width        : '1000px',
                dialogClass  : 'edit-dialog',
                title        : 'Create Refund',
                buttons      : [{
                    id   : 'create-payment-dialog',
                    class: 'btn blue',
                    text : 'Create',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]
            });

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : 0,
                onSelect   : function () {
                }
            }).datepicker('setDate', new Date())
                .datepicker('option', 'minDate', new Date(model.orderDate));

            this.delegateEvents(this.events);
            return this;
        }
    });

    return CreateView;
});
