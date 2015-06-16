/**
 * Created by soundstorm on 15.06.15.
 */
define(['Validation','common'],function (Validation, common) {
    var SalaryModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function(){
            this.on('invalid', function(model, errors){
                if(errors.length > 0){
                    if(errors.length > 0){
                        var msg = errors.join('\n');
                        alert(msg);
                    }
                }
            });
        },
        /*validate: function(attrs){
            var errors = [];
            Validation.checkNameField(errors, true, attrs.name, "Product Name");
            Validation.checkPriceField(errors, false, attrs.info.salePrice, "Price");
            if(errors.length > 0)
                return errors;
        },*/
        defaults: {

            groups:  {
                group: null,
                users: null,
                owner: null
            },
            whoCanRW: "everyOne"
        },
        urlRoot: function () {
            return "/Salary";
        }
    });
    return SalaryModel;
});