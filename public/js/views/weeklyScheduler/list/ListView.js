define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/listViewBase',
    'views/weeklyScheduler/CreateView',
    'views/weeklyScheduler/EditView',
    'views/weeklyScheduler/list/ListItemView',
    'text!templates/weeklyScheduler/list/ListHeader.html',
    'collections/weeklyScheduler/filterCollection'
], function ($, _, Backbone, ListViewBase, CreateView, EditView, ListItemView, listTemplate, ContentCollection) {
    var WeeklySchedulerListView = ListViewBase.extend({
        el               : '#weeklyScheduler',
        template         : _.template(listTemplate),
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: ContentCollection,
        contentType      : 'weeklyScheduler',
        changedModels    : {},

        events: {
            'click  .list tbody td:not(.notForm, .validated)': 'goToEditDialog',
            'click  #top-bar-createBtn'                      : 'create',
            'click  .icon-trash'                             : 'remove'
        },

        initialize: function (options) {
            var self = this;

            self.eventChannel = options.eventChannel;
            self.collection = new ContentCollection({count: 100});

            self.collection.bind('reset', this.render, self);
        },

        create: function (e) {
            var self = this;

            e.preventDefault();

            return new CreateView({eventChannel: self.eventChannel});
        },

        remove: function (e) {
            var self = this;
            var modelId = $(e.target).closest('tr').attr('data-id');
            var model;

            e.preventDefault();
            e.stopPropagation();

            if (confirm('Are you sure you want to DELETE this Weekly Scheduler?')) {
                model = self.collection.get(modelId);
                model.destroy({
                    success: function () {
                        self.eventChannel.trigger('updateWeeklyScheduler');
                    }
                });
            }
        },

        goToEditDialog: function (e) {
            var self = this;
            var modelId = $(e.target).closest('tr').attr('data-id');
            var model = self.collection.get(modelId);

            e.preventDefault();

            return new EditView({
                eventChannel: self.eventChannel,
                model       : model
            });
        },

        render: function () {
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;
            $currentEl.html('');
            $currentEl.append(_.template(listTemplate, {currentDb: true}));

            itemView = new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: 1
            });

            $currentEl.append(itemView.render());

        }

    });

    return WeeklySchedulerListView;
});
