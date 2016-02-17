define([
        'Backbone',
        'text!templates/journalEntry/TopBarTemplate.html',
        'custom',
        'common',
        'constants',
        'dataService'
    ],
    function (Backbone, ContentTopBarTemplate, Custom, Common, CONSTANTS, dataService) {
        'use strict';
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.JOURNALENTRY,
            template   : _.template(ContentTopBarTemplate),

            events: {
                "click #reconcileBtn": "reconcile"
            },

            reconcile: function (e) {
                if ($(e.target).hasClass('greenBtn')) {
                    return false;
                }

                var date = this.$el.find('#reconcileDate').text();

                dataService.postData('journal/reconcile', {date: date}, function (result) {
                    var location = window.location.hash;
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(location, {trigger: true});
                });
            },

            initialize: function (options) {
                if (options.collection) {
                    this.collection = options.collection;
                }

                this.render();
            },

            render: function () {
                var viewType = Custom.getCurrentVT();

                $('title').text(this.contentType);

                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

                return this;
            }
        });

        return TopBarView;
    });
