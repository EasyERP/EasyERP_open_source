define([
        'views/Order/EditView'
    ],
    function (ParrentView) {

        var EditView = ParrentView.extend({
            forSales: true
        });

        return EditView;
    });
