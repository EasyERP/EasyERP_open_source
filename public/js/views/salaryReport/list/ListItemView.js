/**
 * Created by liliy on 20.01.2016.
 */
define([
        'text!templates/salaryReport/list/ListTemplate.html'
    ],

    function (listTemplate) {
        var ListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
            },

            render: function () {
                this.$el.append(_.template(listTemplate, {collection: this.collection}));
            }
        });

        return ListItemView;
    });
