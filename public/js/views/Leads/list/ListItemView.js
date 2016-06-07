define([
    'Backbone',
    'Underscore',
    'text!templates/Leads/list/ListTemplate.html'
], function (Backbone, _, ListTemplate) {
    'use strict';

    var LeadsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize;
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                leadsCollection: this.collection.toJSON(),
                startNumber    : this.startNumber
            }));
        }
    });

    return LeadsListItemView;
});
