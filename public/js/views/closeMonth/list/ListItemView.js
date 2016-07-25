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
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(listTemplate, {
                collection : this.collection,
                //startNumber: this.startNumber,
                moment     : moment
            }));
        }
    });

    return ListItemView;
});
