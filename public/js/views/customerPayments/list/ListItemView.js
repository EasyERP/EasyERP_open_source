/**
 * Created by soundstorm on 21.05.15.
 */
define([
        'Backbone',
        'Underscore',
        'text!templates/customerPayments/list/ListTemplate.html',
        'text!templates/customerPayments/forWTrack/ListTemplate.html',
        'helpers'
    ],

    function (Backbone, _, PaymentListTemplate, ListTemplateForWTrack, helpers) {
        'use strict';

        var PaymentListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.page = options.page ? parseInt(options.page, 10) : 1;
                this.startNumber = (this.page - 1 ) * options.itemsNumber;  //Counting the start index of list items
            },
            render    : function (options) {
                var el = (options && options.thisEl) ? options.thisEl : this.$el;

                el.append(_.template(ListTemplateForWTrack, {
                    paymentCollection: this.collection.toJSON(),
                    startNumber      : this.startNumber,
                    currencySplitter : helpers.currencySplitter,
                    currencyClass    : helpers.currencyClass
                }));
            }
        });

        return PaymentListItemView;
    });
