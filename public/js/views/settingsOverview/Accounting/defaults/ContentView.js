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
            });

            return this;
        }
    });

    return ContentView;
});

