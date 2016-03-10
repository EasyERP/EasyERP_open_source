/**
 * Created by lilya on 16/11/15.
 */
define([
    'models/PayRollAddModel'
],
    function (PayRollAddModel) {
        var PayRollCollection = Backbone.Collection.extend({
            model: PayRollAddModel
        });

        return PayRollCollection;
    });