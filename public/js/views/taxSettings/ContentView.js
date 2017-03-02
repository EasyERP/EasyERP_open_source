define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/taxSettings/IndexTemplate.html',
    'async',
    'dataService',
    'collections/taxSettings/filterCollection',
    'views/taxSettings/TaxListView'
], function (Backbone, $, _, DashboardTemplate, async, dataService, TaxCollection, TaxListView) {
    'use strict';

    var ContentView = Backbone.View.extend({
        contentType: 'taxSettings',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',
        initialize : function (options) {
            this.startTime = options.startTime;

            this.taxCollection = new TaxCollection();
            this.taxCollection.bind('reset', this.renderTax, this);

            this.render();
        },

        events: {
            'click .acountingList-js li': 'chooseDetailes'
        },

        renderTax: function () {
            this.$el.find('[data-id="tax"]').addClass('active');
            new TaxListView({
                collection: this.taxCollection
            }).render();
        },

        chooseDetailes: function (e) {
            var $target = $(e.target);
            var $thisEl = this.$el;

            var name;

            e.preventDefault();

            if (!$target.hasClass('_acountingListItem')) {
                $target = $target.closest('._acountingListItem');
            }

            $thisEl.find('.acountingList-js .active').removeClass('active');
            $target.addClass('active');

            name = $target.attr('data-id');

            $thisEl.find('.tabs').addClass('hidden');

            $thisEl.find('#' + name + '-holder').removeClass('hidden');

        },

        render: function () {
            this.$el.html(this.template({
                data: [{
                    _id : 'tax',
                    name: 'Taxes'
                }, {
                    _id : 'default',
                    name: 'Default Settings'
                }]
            }));

            return this;
        }

    });

    return ContentView;
});
