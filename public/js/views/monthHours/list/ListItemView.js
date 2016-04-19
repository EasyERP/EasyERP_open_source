/**
 * Created by Liliya on 23.06.2015.
 */
define([
    'text!templates/monthHours/list/listTemplate.html',
    'helpers'
    ], function (listTemplate, helpers) {
    var monthHoursListItemView = Backbone.View.extend({
        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
            this.page = options.page ? parseInt(options.page, 10) : 1;
            this.startNumber = (this.page - 1) * options.itemsNumber;

            if (!this.startNumber) {
                this.startNumber = 0;
            }
        },

        render: function () {
            var collect = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {monthHoursCollection: collect, startNumber: this.startNumber, currencySplitter: helpers.currencySplitter}));
        }
    });

    return monthHoursListItemView;
});
