define([
        'Backbone',
        'Underscore',
        'text!templates/Applications/list/ListTemplate.html'
    ],
    function (Backbone, _, ApplicationsListTemplate) {
        'use strict';
        var ApplicationsListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.page = options.page ? parseInt(options.page) : 1;
                this.startNumber = (this.page - 1 ) * options.itemsNumber;
            },

            render: function () {
                this.$el.append(_.template(ApplicationsListTemplate, {
                    applicationsCollection: this.collection.toJSON(),
                    startNumber           : this.startNumber
                }));
            }
        });
        return ApplicationsListItemView;
    });
