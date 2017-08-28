define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/defaults/DefaultsTemplate.html',
    'models/orgSettings',
    'dataService',
    'populate'
], function (Backbone, $, _, Parent, orgTemplate, Model, dataService, populate) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'organizationSettings',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#defaultsTab',
        responseObj: {},

        initialize: function (options) {
            this.startTime = options.startTime;
            this.model = new Model();

            this.model.set(options.data.data);

            this.model.on('change', this.saveToDb, this);

            this.render();
        },

        saveToDb: function () {
            this.model.save(this.model.changed, {
                patch: true,
                error: function (err) {
                    App.render({
                        type   : 'error',
                        message: err.statusText
                    });
                }
            });
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var closestA = $target.parent('ul').closest('.current-selected');

            closestA.text($target.text()).attr('data-id', $target.attr('id'));

            if (closestA.attr('id') === 'salesTax') {
                this.model.set('salesTax', $target.attr('id'));
            } else if (closestA.attr('id') === 'purchaseTax') {
                this.model.set('purchaseTax', $target.attr('id'));
            } else if (closestA.attr('id') === 'payableTax') {
                this.model.set('payableTax', $target.attr('id'));
            } else if (closestA.attr('id') === 'carriedTax') {
                this.model.set('carriedTax', $target.attr('id'));
            } else if (closestA.attr('id') === 'shipping') {
                this.model.set('shipping', $target.attr('id'));
            } else if (closestA.attr('id') === 'discount') {
                this.model.set('discount', $target.attr('id'));
            } else if (closestA.attr('id') === 'bankAccount') {
                this.model.set('bankAccount', $target.attr('id'));
            } else if (closestA.attr('id') === 'paymentTerm') {
                this.model.set('paymentTerms', $target.attr('id'));
            } else if (closestA.attr('id') === 'workInProgress') {
                this.model.set('workInProgress', $target.attr('id'));
            }

        },

        render: function () {
            var self = this;
            var model = this.model.toJSON();

            this.$el.html(this.template({model: model}));

            dataService.getData('/chartOfAccount/getForDd', {}, function (resp) {
                var data = resp.data || [];

                self.responseObj['#salesTax'] = data;
                self.responseObj['#purchaseTax'] = data;
                self.responseObj['#payableTax'] = data;
                self.responseObj['#carriedTax'] = data;
                self.responseObj['#shipping'] = data;
                self.responseObj['#discount'] = data;
                self.responseObj['#workInProgress'] = data;
            });

            dataService.getData('/paymentMethod', {}, function (resp) {
                var data = resp.data || [];

                self.responseObj['#bankAccount'] = data;
            });

            dataService.getData('/paymentTerm', {}, function (resp) {
                var data = resp.data || [];

                self.responseObj['#paymentTerm'] = data;
            });

            return this;
        }
    });

    return ContentView;
});

