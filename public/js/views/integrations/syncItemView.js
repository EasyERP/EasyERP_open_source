define([
    'Backbone',
    'jQuery',
    'Underscore',
    'collections/syncLog/filterCollection',
    'text!templates/syncLogs/itemLogTemplate.html'
], function (Backbone,
             $,
             _,
             Collection,
             ItemTemplate) {
    'use strict';

    var Integrations = Backbone.View.extend({
        contentType: 'Sync Log',
        el         : '#content-holder',
        template   : _.template(ItemTemplate),

        events: {
            'click .toggleEl': 'toggleContainer'
        },

        initialize: function (options) {
            this.collection = new Collection({id: options.id});


            this.collection.on('reset', this.render, this);
        },

        toggleContainer: function (e) {
            var $target = $(e.currentTarget);
            e.stopPropagation();

            $target.closest('.toggleEl').find('.toggledContainer').first().toggleClass('hidden');

            var span = $target.find('.arrow').first();

            if (span.hasClass('icon-caret-right')) {
                span.removeClass('icon-caret-right');
                span.addClass('icon-caret-down');
            } else {
                span.removeClass('icon-caret-down');
                span.addClass('icon-caret-right');
            }
        },

        render: function () {
            var items = this.collection.toJSON();
            var model = items[0];
            var keys = {
                imports: _.keys(model.imports || {}),
                exports: _.keys(model.exports || {})
            };

            this.$el.html(this.template({
                contentType: this.contentType,
                items      : items,
                keys       : keys
            }));

            return this;
        }
    });

    return Integrations;
});
