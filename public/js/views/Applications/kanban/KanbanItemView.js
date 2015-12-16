define([
        "text!templates/Applications/kanban/KanbanItemTemplate.html",
        "common"
    ],
    function (KanbanItemTemplate, common) {
        var ApplicationsItemView = Backbone.View.extend({
            className: "item",
            id       : function () {
                return this.model.get("_id");
            },

            initialize: function () {
            },

            template: _.template(KanbanItemTemplate),

            gotoEditForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest(".item").data("index") + 1;
                window.location.hash = "#home/action-Tasks/Edit/" + itemIndex;
            },

            gotoForm: function (e) {
                var id = $(e.target).closest(".item").attr("id");
                App.ownContentType = true;
                window.location.hash = "home/content-Applications/form/" + id;
            },

            deleteEvent: function (e) {
                common.deleteEvent(e, this);
            },

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.attr("data-index", index);
                return this;
            }
        });
        return ApplicationsItemView;
    });
