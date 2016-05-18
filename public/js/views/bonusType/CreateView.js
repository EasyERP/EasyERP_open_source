/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
define(["text!templates/bonusType/createTemplate.html"], function (CreateTemplate) {
    var CreateView = Backbone.View.extend({
        el      : "#listTable",
        template: _.template(CreateTemplate),

        initialize: function (options) {
            this.render(options);
        },

        render: function (options) {
            this.$el.prepend(this.template(options));
            return this;
        }
    });

    return CreateView;
});
