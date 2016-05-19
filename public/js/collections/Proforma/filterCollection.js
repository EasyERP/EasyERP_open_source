define([
    'collections/Invoice/filterCollection'
], function (Invoice) {
    return Invoice.extend({
        url: '/Proforma/'
    });
});
