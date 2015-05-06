define([
    'text!templates/Projects/list/ListTemplate.html'
],

function (listTemplate) {
    var projectsListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = (options.page - 1 ) * options.itemsNumber;//Counting the start index of list items
        },
        
        render: function() {
            this.$el.append(_.template(listTemplate, { projectsCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        }
    });

    return projectsListItemView;
});
