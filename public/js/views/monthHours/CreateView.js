/**
 * Created by Liliya on 23.06.2015.
 */
define([
        "text!templates/monthHours/createTemplate.html"

    ],
    function (CreateTemplate){
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
