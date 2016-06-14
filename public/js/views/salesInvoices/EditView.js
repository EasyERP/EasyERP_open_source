define([
    'views/Invoices/EditView'
], function (ParentView) {

    var EditView = ParentView.extend({
        forSales: true
    });
    
    return EditView;
});
