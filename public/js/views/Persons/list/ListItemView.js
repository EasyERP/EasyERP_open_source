define([
        'text!templates/Persons/list/ListTemplate.html'
    ],

    function (listTemplate) {
        var PersonsListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;
            },
            render    : function () {
                this.$el.append(_.template(listTemplate, {
                    personsCollection: this.collection.toJSON(),
                    startNumber      : this.startNumber
                }));
            }
        });

        return PersonsListItemView;
    });
