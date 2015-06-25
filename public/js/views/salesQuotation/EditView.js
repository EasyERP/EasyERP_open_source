define([
        'views/Quotation/EditView'
    ],
    function (ParrentEditView) {

        var EditView = ParrentEditView.extend({
            forSales: true
        });

        return EditView;
    });
