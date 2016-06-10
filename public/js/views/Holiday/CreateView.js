define([
    'Backbone',
    'Underscore',
    'text!templates/Holiday/CreateTemplate.html',
    'common'
], function (Backbone, _, CreateTemplate, common) {
    'use strict';

    var CreateView = Backbone.View.extend({
        el      : '#listTable',
        template: _.template(CreateTemplate),

        initialize: function (model) {
            var date = new Date();

            model = model || {};

            model.set('date', common.utcDateToLocaleDate(date));

            this.render(model);
        },

        events: {},

        render: function (options) {
            this.$el.prepend(this.template({date: options.get('date'), cid: options.cid}));

            return this;
        }

    });

    return CreateView;
});
