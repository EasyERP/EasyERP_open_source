define([
    'views/Orders/form/FormView',
    'constants'
], function (ParentView, CONSTANTS) {

    var FormView = ParentView.extend({
        forSales   : true,
        contentType: CONSTANTS.SALESORDERS,
        service    : true
    });

    return FormView;
});
