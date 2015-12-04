define([
        'text!templates/journal/list/ListTemplate.html',
        'helpers',
        'async'
    ],

    function (listTemplate, helpers, async) {
        "use strict";

        var ListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;//Counting the start index of list items
            },

            render: function () {
                this.$el.append(_.template(listTemplate, {
                    currencySplitter: helpers.currencySplitter,
                    collection      : this.collection.toJSON(),
                    startNumber     : this.startNumber
                }));
            }
        });

        return ListItemView;
    });
