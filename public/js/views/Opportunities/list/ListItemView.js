define([
    'Backbone',
    'Underscore',
    'text!templates/Opportunities/list/ListTemplate.html',
    'helpers'
], function (Backbone, _, OpportunitiesListTemplate, helpers) {
    var OpportunitiesListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.page = options.page ? parseInt(options.page, 10) : 1;
            this.startNumber = (this.page - 1) * options.itemsNumber;
        },

        render: function () {
            this.$el.append(_.template(OpportunitiesListTemplate, {
                opportunitiesCollection: this.collection.toJSON(),
                startNumber            : this.startNumber,
                currencySplitter       : helpers.currencySplitter
            }));
        }
    });

    return OpportunitiesListItemView;
});
