define([
        'text!templates/JobPositions/list/ListTemplate.html'
    ],
    function (ListTemplate) {
        var JobPositionsListItemView = Backbone.View.extend({
            el: '#listTable',
            initialize: function (options) {
                this.collection = options.collection;
                this.page = options.page ? parseInt(options.page, 10) : 1;
                this.startNumber = (this.page - 1) * options.itemsNumber;
            },

            render: function () {
                this.$el.append(_.template(ListTemplate, {
                    jobPositionsCollection: this.collection.toJSON(),
                    startNumber           : this.startNumber
                }));
            }
        });
        return JobPositionsListItemView;
    });
