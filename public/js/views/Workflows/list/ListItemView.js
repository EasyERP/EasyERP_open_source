define([
        "text!templates/Workflows/list/ListItemTemplate.html"
    ],
    function (ListItemTemplate) {
        var ListItemView = Backbone.View.extend({
            tagName   : "div",
            className : "row",
            initialize: function () {
                //this.render();
            },

            template: _.template(ListItemTemplate),

            render: function () {
                this.$el.html("");
                //console.log(this.template({ model: this.model }));
                this.$el.html(this.template({model: this.model}));
                return this;
            }
        });

        return ListItemView;
    });
