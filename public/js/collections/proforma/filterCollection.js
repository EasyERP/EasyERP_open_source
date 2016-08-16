define([
    'collections/Invoices/filterCollection'
], function (Invoice) {
    return Invoice.extend({
        url: '/Proforma/'
    });
});
