/**
 * Created by Liliya on 23.06.2015.
 */
define(['text!templates/monthHours/list/listTemplate.html'], function (listTemplate) {
    var monthHoursListItemView = Backbone.View.extend({
        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (options.page - 1 ) * options.itemsNumber;
            if (!this.startNumber) {
                this.startNumber = 0;
            }
        },

        render: function () {
            var collect = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {monthHoursCollection: collect, startNumber: this.startNumber}));
        }
    });

    return monthHoursListItemView;
});
