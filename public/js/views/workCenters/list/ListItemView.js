define([
    'Backbone',
    'Underscore',
    'text!templates/workCenters/list/ListTemplate.html'
], function (Backbone, _, WorkCentersListTemplate) {
    'use strict';

    var WorkCentersListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            this.$el.append(_.template(WorkCentersListTemplate, {
                workCentersCollection: this.collection.toJSON()
            }));
        }
    });

    return WorkCentersListItemView;
});
