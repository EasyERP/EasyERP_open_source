define([
    'jquery',
    'underscore',
    'Backbone',
    'text!templates/ConflictAndUnlinkedProducts/conflictAndUnlinkedTemplate.html',
    'views/ConflictAndUnlinkedProducts/resolveConflicts/ContentView',
    'views/ConflictAndUnlinkedProducts/integrationUnlinkedProducts/list/ListView',
    'views/ConflictAndUnlinkedProducts/resolveConflicts/TopBarView',
    'views/ConflictAndUnlinkedProducts/integrationUnlinkedProducts/TopBarView'
], function ($, _, Backbone, ConflictTemplate, ResolveConflictsView, UnlinkedProductsView, ResolveTopBar, UnlinkedTopBar) {
    'use strict';
    var ContentView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'ConflictAndUnlinked',
        template   : _.template(ConflictTemplate),

        initialize: function (options) {
            this.startTime = options.startTime;
            this.fliter = options.filter || {};
            this.fromIntegration = options.fromIntegration;

            this.render();
        },

        render: function () {
            var $thisEl = this.$el;

            $thisEl.html(this.template);
            $thisEl.find('#resolveConflicts').html(new ResolveConflictsView({
                startTime: this.startTime,
                filter   : this.fliter
            }));

            $thisEl.find('#unlinkedProducts').html(new UnlinkedProductsView({
                startTime      : this.startTime,
                filter         : this.fliter,
                fromIntegration: this.fromIntegration
            }));
        }
    });
    return ContentView;
});
