define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/priceLists/form/FormTemplate.html',
    'views/dialogViewBase',
    'constants',
    'populate'
], function (Backbone, _, $, FormTemplate, BaseView, CONSTANTS, populate) {
    'use strict';

    var FormView = BaseView.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.formModel = options.model;
            this.formModel.urlRoot = '/priceList/';
            this.responseObj = {};
            this.modelChanged = {};
            this.value = '';
        },

        events: {
            'click #savePriceList': 'savePriceList'
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            this.showSaveButton();
        },

        savePriceList: function () {
            var $thisEl = this.$el;
            var currency = this.$el.find('#currencyDd').data('id');
            var name = $thisEl.find('#name').val();
            var priceListCode = $thisEl.find('#priceListCode').val();
            var cost = $thisEl.find('#yes').prop('checked') || false;

            var data = {};

            data.name = name;
            data.currency = currency;
            data.priceListCode = priceListCode;
            data.cost = cost;

            this.formModel.set(data);
            this.formModel.save(this.formModel.changed, {
                patch  : true,
                wait   : true,
                success: function () {
                    App.render({
                        type   : 'notify',
                        message: 'Price list saved.'
                    });
                },

                error: function (model, response) {
                    App.render({
                        type   : 'error',
                        message: response.error
                    });
                }
            });
        },

        render: function () {
            var $thisEl = this.$el;
            var formModel = this.formModel.toJSON();

            $thisEl.html(_.template(FormTemplate, {
                model: formModel
            }));

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true, false, null, null, $thisEl);

        }
    });

    return FormView;
});
