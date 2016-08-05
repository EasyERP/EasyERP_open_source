define([
    'Backbone',
    'Underscore',
    'text!templates/DealTasks/kanban/KanbanItemTemplate.html',
    'moment'
], function (Backbone, _, KanbanItemTemplate, moment) {
    var TasksItemView = Backbone.View.extend({
        className: 'item',
        id       : function () {
            return this.model.get('_id');
        },

        template: _.template(KanbanItemTemplate),

        render: function () {
            var holder = this.$el;
            
            holder.html(this.template({model: this.model.toJSON(), moment : moment}));
            holder.attr('data-id', this.model.get('_id'));
            
            return this;
        }
    });

    return TasksItemView;
});
