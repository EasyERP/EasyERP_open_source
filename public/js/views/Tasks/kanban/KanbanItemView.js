define([
        "text!templates/Tasks/kanban/KanbanItemTemplate.html"
],
    function (KanbanItemTemplate) {
        var TasksItemView = Backbone.View.extend({
            className: "item",
            id: function () {
                return this.model.get("_id");
            },

            template: _.template(KanbanItemTemplate),

            render: function () {
                var holder = this.$el;
                holder.html(this.template({ model: this.model.toJSON() }));
                holder.attr("data-id", this.model.get('_id'));
                return this;
            }
        });

        return TasksItemView;
    });
