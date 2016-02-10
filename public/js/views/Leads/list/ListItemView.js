define([
        'Backbone',
        'Underscore',
        'text!templates/Leads/list/ListTemplate.html'
    ],

    function (Backbone, _, ListTemplate) {
        'use strict';

        var LeadsListItemView = Backbone.View.extend({
            el        : '#listTable',
            stages    : null,
            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;//Counting the start index of list items
            },
            events    : {},

            pushStages: function (stages) {
                this.stages = stages;
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
