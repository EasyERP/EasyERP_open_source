define([
        'jQuery',
        'Underscore',
        'Backbone',
        'views/listViewBase',
        'views/payrollComponentTypes/CreateView',
        'views/payrollComponentTypes/EditView',
        'views/payrollComponentTypes/list/ListItemView',
        'text!templates/payrollComponentTypes/list/ListHeader.html',
        'collections/payrollComponentTypes/filterCollection',
        'common',
        'dataService',
        'constants',
        'helpers'
    ],

    function ($,
              _,
              Backbone,
              listViewBase,
              CreateView,
              editView,
              listItemView,
              listTemplate,
              ContentCollection,
              common,
              dataService,
              CONSTANTS,
              helpers) {
        var WeeklySchedulerListView = listViewBase.extend({
            template: _.template(listTemplate),
            createView              : CreateView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : ContentCollection,
            contentType             : 'weeklyScheduler',
            changedModels           : {},

            initialize: function (options) {
                var self = this;
                var eventChannel = options.eventChannel;
                var componentType = options.type;

                self.eventChannel = eventChannel;
                self.type = componentType;

                self.collection = new ContentCollection({
                    count: 100,
                    type : componentType
                });

                self.collection.bind('reset', this.render, self);
            },

            events: {
                "click  .list tbody td:not(.notForm, .validated)": "goToEditDialog",
                "click  .fa-plus": "create",
                "click  .fa-trash-o": "remove"
            },

            create: function (e) {
                var self = this;

                e.preventDefault();

                new CreateView({eventChannel: self.eventChannel});
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
                        success: function(model, response) {
                            self.eventChannel.trigger('updateWeeklyScheduler');
                    }});
                }
            },

            goToEditDialog: function (e) {
                var self = this;
                var modelId = $(e.target).closest('tr').attr('data-id');
                var model = self.collection.get(modelId);

                e.preventDefault();

                new editView({
                    eventChannel: self.eventChannel,
                    model: model
                });
            },

            render: function () {
                var self = this;
                var $currentEl;

                $('.ui-dialog ').remove();

                $currentEl = this.$el;

                $currentEl.html('');

                currentEllistRenderer(self);

                self.renderCheckboxes();

                function currentEllistRenderer(self) {
                    var itemView;

                    $currentEl.append(_.template(listTemplate, {currentDb: true}));

                    itemView = new listItemView({
                        collection : self.collection,
                        page       : self.page,
                        type       : self.type,
                        itemsNumber: 1
                    });

                    $currentEl.append(itemView.render());
                }
            }

        });

        return WeeklySchedulerListView;
    });
