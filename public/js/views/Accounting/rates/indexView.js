define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Accounting/rates/RatesList.html',
    'views/Accounting/rates/EditView',
    'dataService'
], function (Backbone, _, $, PaymentMethodList, EditView, dataService) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template  : _.template(PaymentMethodList),
        el        : '#rates-holder',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;

            this.render();
        },

        events: {
            'click .goToEdit'  : 'goToEditDialog',
            'click .goToRemove': 'deleteItem',
            'click #loadRates' : 'load',
            'click .toggleList': 'toggleList'
        },

        load: function () {
            var startDate = new Date('1 Aug, 2014');
            var endDate = new Date();
            dataService.postData('/rates', {startDate: startDate, endDate: endDate}, function (err, result) {

            });
        },

        deleteItem: function (e) {
            var self = this;
            var $tr = $(e.target).closest('tr');
            var id = $tr.attr('data-id');
            var model = this.collection.get(id);
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            if (answer === true && model) {

                model.destroy({
                    success: function (model) {
                        self.$el.find('tr[data-id="' + model.id + '"]').remove();
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            }
        },

        toggleList: function (e) {
            e.preventDefault();
            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);

            e.preventDefault();

            if (model) {
                return new EditView({model: model});
            }
        },

        render: function () {
            this.$el.html(this.template({collection: this.collection.toJSON()}));
        }

    });
    return ContentView;
});

