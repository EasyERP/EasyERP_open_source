define([
    'Backbone',
    'Underscore',
    'text!templates/CustomersSuppliers/salesPurchases.html',
    'text!templates/CustomersSuppliers/tFormTemplate.html',
    'populate',
    'constants'
], function (Backbone, _, listTemplate, tFormTemplate, populate, CONSTANTS) {
    'use strict';

    var salesPurchases = Backbone.View.extend({

        template     : _.template(listTemplate),
        templateTForm: _.template(tFormTemplate),

        initialize: function (options) {
            if (options) {
                this.tForm = options.tForm;
                this.parrent = options.parrent;
                this.model = options.parrent ? options.parrent.model : null;
                this.editState = options.editState;
            }
        },

        render: function () {
            var isForCreate = !this.editState;
            var model = this.model ? this.model.toJSON() : null;

            if (this.tForm) {
                this.$el.append(this.templateTForm({model: model}));
            } else {
                this.$el.append(this.template({model: model}));
            }

            populate.get('#departmentDd', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, 'name', this.parrent, isForCreate, true);
            populate.get2name('#employeesDd', CONSTANTS.URLS.EMPLOYEES_GETFORDD, {}, this.parrent, isForCreate, true);
            populate.get('#language', CONSTANTS.URLS.EMPLOYEES_LANGUAGES, {}, 'name', this.parrent, isForCreate, false);
            populate.get2name('#implementedBy', CONSTANTS.URLS.CUSTOMERS, {}, this.parrent, isForCreate, true);

            return this;
        }
    });

    return salesPurchases;
});

