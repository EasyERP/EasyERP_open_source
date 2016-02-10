/**
 * Created by Roman on 25.05.2015.
 */
define([
    'Backbone',
    'Underscore',
    'text!templates/CustomersSuppliers/salesPurchases.html',
    'populate',
    'constants'
], function (Backbone, _, listTemplate, populate, CONSTANTS) {
    'use strict';

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

            populate.get("#departmentDd", CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, "departmentName", this.parrent, isForCreate, true);
            populate.get2name("#employeesDd", CONSTANTS.URLS.EMPLOYEES_RELATEDUSER, {}, this.parrent, isForCreate, true);
            populate.get("#language", CONSTANTS.URLS.EMPLOYEES_LANGUAGES, {}, "name", this.parrent, isForCreate, false);
            populate.get2name("#implementedBy", CONSTANTS.URLS.CUSTOMERS, {}, this.parrent, isForCreate, true);

            return this;
        }
    });

    return salesPurchases;
});

