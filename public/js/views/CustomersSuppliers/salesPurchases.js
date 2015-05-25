/**
 * Created by Roman on 25.05.2015.
 */
define([
        'text!templates/CustomersSuppliers/salesPurchases.html',
        'populate'
    ],

    function (listTemplate, populate) {
        var salesPurchases = Backbone.View.extend({

            template: _.template(listTemplate),

            initialize: function (options) {
                this.parrent = options ? options.parrent : null
            },

            render: function () {
                this.$el.append(this.template({}));

                populate.get("#departmentDd", "/DepartmentsForDd", {}, "departmentName", this.parrent, true, true);
                populate.get2name("#employeesDd", "/getForDdByRelatedUser", {}, this.parrent, true, true);
                populate.get("#language", "/Languages", {}, "name", this.parrent, true, false);
                //populate.get2name("#employeesDd", "/getSalesPerson", {}, this.parrent, true, true);
                populate.get2name("#implementedBy", "/Customer", {}, this.parrent, true, true);

                return this;
            }
        });

        return salesPurchases;
    });

