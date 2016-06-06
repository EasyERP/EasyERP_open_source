define([
    'Backbone',
    'Underscore',
    'text!templates/closeMonth/list/ListTemplate.html',
    'moment'
], function (Backbone, _, listTemplate, moment) {
    var ListItemView = Backbone.View.extend({
        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (options.page - 1) * options.itemsNumber;
            if (!this.startNumber) {
                this.startNumber = 0;
            }
        },

        render: function () {
            this.$el.append(_.template(listTemplate, {
                collection : this.collection,
                startNumber: this.startNumber,
                moment     : moment
            }));
        }
    });

    return ListItemView;
});
