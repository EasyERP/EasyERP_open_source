define([
    'Backbone',
    'Underscore',
    'text!templates/Opportunities/kanban/KanbanItemTemplate.html',
    'moment',
    'helpers'
], function (Backbone, _, KanbanItemTemplate, moment, helpers) {
    'use strict';

    var OpportunitiesItemView = Backbone.View.extend({
        className: 'item',
        template : _.template(KanbanItemTemplate),
        id       : function () {
            return this.model.get('_id');
        },

        initialize: function (options) {
            this.date = moment(new Date());

            this.render(options);
        },

        render: function () {

            this.$el.html(this.template(
                {
                    model           : this.model.toJSON(),
                    currencySplitter: helpers.currencySplitter
                }));

            if ((this.model.toJSON().workflow.status !== 'Done') && (this.model.toJSON().workflow.status !== 'Cancelled')) {
                if (this.model.toJSON().nextAction.date && moment(new Date(this.model.toJSON().nextAction.date)).isBefore(this.date)) {
                    this.$el.addClass('errorContent');
                }
            }

            return this;
        }
    });

    return OpportunitiesItemView;
});
