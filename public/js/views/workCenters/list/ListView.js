define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/workCenters/list/ListHeader.html',
    'views/workCenters/list/ListItemView',
    'views/workCenters/CreateView',
    'views/workCenters/EditView',
    'constants'
], function (Backbone, $, _, ListViewBase, listTemplate, ListItemView, CreateView, EditView, CONSTANTS) {
    var WorkCentersListView = ListViewBase.extend({
        CreateView  : CreateView,
        EditView    : EditView,
        listTemplate: listTemplate,
        ListItemView: ListItemView,
        contentType : CONSTANTS.WORKCENTERS,

        initialize: function (options) {
            this.collection = options.collection;

            ListViewBase.prototype.initialize.call(this, options);
        },

        events: {
            'click tr td:not(.notForm, .checkbox)': 'editItem'
        },

        editItem: function (e) {
            var id = $(e.target).closest('tr').attr('data-id');
            var model = this.collection.get(id);

            return new EditView({model: model});
        },

        render: function () {
            var $currentEl;

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate)({}));

            $currentEl.append(new ListItemView({
                collection: this.collection
            }).render());

            return this;
        }
    });

    return WorkCentersListView;
});
