define([
    'views/Invoices/form/FormView',
    'constants'
], function (ParentView, CONSTANTS) {

    var FormView = ParentView.extend({
        forSales   : true,
        contentType: CONSTANTS.SALESINVOICES
    });

    return FormView;
});
