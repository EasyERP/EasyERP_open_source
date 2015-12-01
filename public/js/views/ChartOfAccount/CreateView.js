/**
 * Created by lilya on 01/12/15.
 */
define([
        "text!templates/ChartOfAccount/CreateTemplate.html"
    ],
    function (CreateTemplate) {

        var CreateView = Backbone.View.extend({
            el: '#chartOfAccount',
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
