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
                if (options) {
                    this.parrent = options.parrent;
                    this.model = options.parrent ? options.parrent.model : null;
                    this.editState = options.editState;
                }
            },

            render: function () {
                var isForCreate = !this.editState;
                var model = this.model ? this.model.toJSON() : null;

                this.$el.append(this.template({model: model}));

                populate.get("#departmentDd", "/departments/getForDD", {}, "departmentName", this.parrent, isForCreate, true);
                populate.get2name("#employeesDd", "/employees/getForDdByRelatedUser", {}, this.parrent, isForCreate, true);
                populate.get("#language", "/employees/languages", {}, "name", this.parrent, isForCreate, false);
                //populate.get2name("#employeesDd", "/employee/getPersonsForDd", {}, this.parrent, true, true);
                populate.get2name("#implementedBy", "/Customers", {}, this.parrent, isForCreate, true);

                return this;
            }
        });

        return salesPurchases;
    });

