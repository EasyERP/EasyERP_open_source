/**
 * Created by liliya on 20.07.15.
 */
define(["text!templates/customerPayments/CreateTemplate.html"], function (CreateTemplate){
    var CreateView = Backbone.View.extend({
        el: "#listTable",
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