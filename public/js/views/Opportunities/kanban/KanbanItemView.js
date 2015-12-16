define([
        "text!templates/Opportunities/kanban/KanbanItemTemplate.html"
    ],
    function (KanbanItemTemplate) {
        var OpportunitiesItemView = Backbone.View.extend({
            className: "item",

            id: function () {
                return this.model.get("_id");
            },

            initialize: function (options) {
                this.render(options);
            },

            template: _.template(KanbanItemTemplate),

            render: function () {
                this.$el.html(this.template({model: this.model.toJSON()}));
                return this;
            }
        });

        return OpportunitiesItemView;
    });