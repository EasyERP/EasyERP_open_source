define([
    'views/Quotations/form/FormView',
    'constants'
], function (ParentView, CONSTANTS) {

    var FormView = ParentView.extend({
        forSales   : true,
        contentType: CONSTANTS.SALESQUOTATIONS
    });

    return FormView;
});
