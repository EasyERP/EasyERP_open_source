define([
        "text!templates/Opportunities/kanban/KanbanItemTemplate.html",
        'moment'
    ],
    function (KanbanItemTemplate, moment) {
        var OpportunitiesItemView = Backbone.View.extend({
            className: "item",

            id: function () {
                return this.model.get("_id");
            },

            initialize: function (options) {
                this.date = moment(new Date());

                this.render(options);
            },

            template: _.template(KanbanItemTemplate),

            render: function () {

                this.$el.html(this.template({model: this.model.toJSON()}));

                if ((this.model.toJSON().workflow.status !== 'Done') && (this.model.toJSON().workflow.status !==  'Cancelled')){
                    if (this.model.toJSON().nextAction.date && moment(new Date(this.model.toJSON().nextAction.date)).isBefore(this.date)) {
                        this.$el.addClass("errorContent");
                    }
                }

                return this;
            }
        });

        return OpportunitiesItemView;
    });