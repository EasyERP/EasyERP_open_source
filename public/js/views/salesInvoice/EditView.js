define([
        'views/Invoice/EditView'
    ],
    function (ParrentView) {

        var EditView = ParrentView.extend({
            forSales: true
        });

        return EditView;
    });
