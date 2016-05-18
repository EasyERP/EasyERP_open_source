define([
        'text!templates/Tasks/list/ListTemplate.html'
    ],

    function (ListTemplate) {
        var TasksListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.page = options.page ? parseInt(options.page, 10) : 1;
                this.startNumber = (this.page - 1) * options.itemsNumber;   //Counting the start index of list items
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
