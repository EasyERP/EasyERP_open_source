define([
    'Backbone'
], function (Backbone) {
    function showForDocs(e) {
        var url = '#easyErp/journalEntry/list/filter=';
        var filter = {};
        var name = this.currentModel.get('name');
        var payments = this.currentModel.get('payments') || [];
        var order = this.currentModel.get('sourceDocument');
        var goodsOutNotes = this.currentModel.get('goodsNotes') || [];
        var startDate = this.currentModel.get('orderDate') ? new Date(this.currentModel.get('orderDate')) : new Date(this.currentModel.get('invoiceDate'));
        var prepayments = this.currentModel.get('prepayment') || {};
        var stockReturns = this.currentModel.get('stockReturns') || {};
        var invoice = this.currentModel.get('invoice');
        var endDate = new Date();
        var valuesArray = [];

        e.stopPropagation();
        e.preventDefault();

        if (order && order.orderDate) {
            startDate = new Date(order.orderDate);
        }

        filter.name = {
            key  : 'sourceDocument.name',
            value: [],
            type : 'string'
        };

        payments.forEach(function (el) {
            valuesArray.push(el.name);
        });

        if (invoice) {
            valuesArray.push(invoice.name);
        }

        goodsOutNotes.forEach(function (el) {
            valuesArray.push(el.name);

            if (new Date(el.status.shippedOn) > startDate) {
                startDate = new Date(el.status.shippedOn);
            }
            if (new Date(el.status.shippedOn) > endDate) {
                startDate = new Date(el.status.shippedOn);
            }
        });

        if (prepayments.names) {
            valuesArray = valuesArray.concat(prepayments.names);
        }

        if (stockReturns.names) {
            valuesArray = valuesArray.concat(stockReturns.names);
        }

        if (stockReturns.journalEntrySources) {
            valuesArray = valuesArray.concat(stockReturns.journalEntrySources);
        }

        if (order) {
            valuesArray.push(order.name);
        }

        valuesArray.push(name);

        filter.name.value = valuesArray;

        if (!startDate) {
            startDate = new Date();
        }

        filter.date = {
            key  : 'date',
            value: [startDate, endDate]
        };

        url += encodeURIComponent(JSON.stringify(filter));

        Backbone.history.navigate(url, {trigger: true});
    }

    return {
        showForDocs: showForDocs
    };

});
