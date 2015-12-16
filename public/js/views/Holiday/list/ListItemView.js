define([
        'text!templates/Holiday/list/ListTemplate.html'
    ],

    function (listTemplate) {
        var HolidayListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;
            },
            render    : function () {
                var result = this.collection.toJSON();
                this.$el.append(_.template(listTemplate, {holidayCollection: result}));
            }
        });

        return HolidayListItemView;
    });
