define([
        'Backbone',
        'Underscore',
        'text!templates/Tasks/list/ListTemplate.html'
    ],

    function (Backbone, _, ListTemplate) {
        var TasksListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page < 1) ? 0 : (options.page - 1) * options.itemsNumber;//Counting the start index of list items
            },

            render: function () {
                this.$el.append(_.template(ListTemplate, {
                    tasksCollection: this.collection.toJSON(),
                    startNumber    : this.startNumber
                }));
            }
        });

        return TasksListItemView;
    });
