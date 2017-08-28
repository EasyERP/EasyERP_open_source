define([
    'Underscore',
    'Backbone',
    'common',
    'moment',
    'constants'
], function (_, Backbone, common, moment, CONSTANTS) {
    'use strict';

    var QuotationModel = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            supplier: {
                _id : null,
                name: ''
            },

            project : null,
            workflow: {
                _id : null,
                name: ''
            },

            supplierReference: '',

            orderDate     : new Date(),
            expectedDate  : null,
            name          : 'PO',
            invoiceControl: null,
            invoiceRecived: false,
            paymentTerm   : null,
            fiscalPosition: null,
            destination   : null,
            incoterm      : null,
            products      : [],
            conflictTypes : []
        },

        urlRoot: function () {
            return CONSTANTS.URLS.ORDER;
        },

        parse: function (model) {
            var products = model.products;
            var total;
            var unTaxed;
            var taxes;
            var unitPrice;
            var subTotal;
            var cost;

            var decimalPlace = 2;

            if (model.currency && model.currency._id && model.currency._id.decPlace) {
                decimalPlace = model.currency._id.decPlace;
            }

            if (model.paymentInfo) {
                total = model.paymentInfo.total || 0;
                unTaxed = model.paymentInfo.unTaxed || 0;
                taxes = model.paymentInfo.taxes || 0;
                
                total = (total / 100).toFixed(decimalPlace);
                unTaxed = (unTaxed / 100).toFixed(decimalPlace);
                taxes = (taxes / 100).toFixed(decimalPlace);

                model.paymentInfo.unTaxed = unTaxed;
                model.paymentInfo.total = total;
                model.paymentInfo.taxes = taxes;

            }

            if (products) {
                products = _.map(products, function (product) {
                    var totalTaxesByRow = 0;
                    var newTaxes = [];

                    if (product.scheduledDate) {
                        product.scheduledDate = common.utcDateToLocaleDate(new Date(product.scheduledDate));
                    }

                    unitPrice = product.unitPrice || 0;
                    subTotal = product.subTotal || 0;
                    taxes = product.taxes || [];
                    cost = product.costPrice || 0;

                    unitPrice = (unitPrice / 100).toFixed(decimalPlace);
                    subTotal = (subTotal / 100).toFixed(decimalPlace);
                    cost = (cost / 100).toFixed(decimalPlace);

                    if (taxes.length === 1) {
                        taxes[0].tax = (taxes[0].tax / 100).toFixed(decimalPlace);
                        totalTaxesByRow = taxes[0].tax;
                    } else if (taxes.length > 1) {
                        taxes = taxes.map(function (currentTax) {
                            totalTaxesByRow += currentTax.tax / 100;

                            currentTax.tax = (currentTax.tax / 100).toFixed(decimalPlace);

                            return currentTax;
                        });
                    } else {
                        taxes = [];
                    }

                    product.unitPrice = unitPrice;
                    product.subTotal = subTotal;
                    product.taxes = taxes;
                    product.costPrice = cost;
                    product.totalTaxes = totalTaxesByRow || 0;

                    return product;
                });
            }

            if (model.goodsNotes) {
                _.map(model.goodsNotes, function (note, index) {
                    note.date = moment(new Date(note.date)).format('DD MMM, YYYY, H:mm:ss');

                    if (note.status) {
                        note.status.pickedOn = note.status.pickedOn ? moment(new Date(note.status.pickedOn)).format('DD MMM, YYYY') : '';
                        note.status.printedOn = note.status.pickedOn ? moment(new Date(note.status.pickedOn)).format('DD MMM, YYYY') : '';
                        note.status.packedOn = note.status.pickedOn ? moment(new Date(note.status.pickedOn)).format('DD MMM, YYYY') : '';
                        note.status.shippedOn = note.status.pickedOn ? moment(new Date(note.status.pickedOn)).format('DD MMM, YYYY') : '';

                    }
                   /* if (!note.name && note.history && (note.history.changedField === 'Creation Date')) {
                        model.notes.splice(index, 1);
                        model.notes.unshift(note);
                        return;
                    }*/
                    return note;
                });

            }

            if (model.notes) {
                _.map(model.notes, function (note, index) {
                    note.date = moment(new Date(note.date));

                    if (note.history && (['Expected Date', 'Order Date', 'Creation Date'].indexOf(note.history.changedField) !== -1)) {
                        note.history.changedValue = note.history.changedValue ? moment(new Date(note.history.changedValue)).format('DD MMM, YYYY') : '';
                        note.history.newValue = note.history.newValue ? moment(new Date(note.history.newValue)).format('DD MMM, YYYY') : '';
                        note.history.prevValue = note.history.prevValue ? moment(new Date(note.history.prevValue)).format('DD MMM, YYYY') : '';
                    }
                    /*if (!note.name && note.history && (note.history.changedField === 'Creation Date')) {
                        model.notes.splice(index, 1);
                        model.notes.unshift(note);
                        return;
                    }*/
                    return note;
                });

            }

            if (model.attachments) {
                _.map(model.attachments, function (attachment) {
                    attachment.uploadDate = moment(new Date(attachment.uploadDate)).format('DD MMM, YYYY, H:mm:ss');
                    return attachment;
                });
            }

            if (model.expectedDate) {
                model.expectedDate = common.utcDateToLocaleDate(new Date(model.expectedDate));
            }
            if (model.orderDate) {
                model.orderDate = common.utcDateToLocaleDate(new Date(model.orderDate));
            }

            return model;
        }

    });

    return QuotationModel;

});
