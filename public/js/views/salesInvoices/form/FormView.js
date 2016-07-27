define([
    'views/Invoices/form/FormView'
], function (ParentView) {

    var FormView = ParentView.extend({
        forSales: true
    });

    return FormView;
});
