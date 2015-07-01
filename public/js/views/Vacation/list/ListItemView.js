define([
    'text!templates/Vacation/list/ListTemplate.html'
],

function (listTemplate) {
    var VacationListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
        },
        render: function() {
            var result = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, { vacationCollection: result }));
        }
    });

    return VacationListItemView;
});
