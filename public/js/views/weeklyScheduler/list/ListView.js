define([
        'jQuery',
        'Underscore',
        'Backbone',
        'views/listViewBase',
        'views/weeklyScheduler/CreateView',
        'views/weeklyScheduler/EditView',
        'views/weeklyScheduler/list/ListItemView',
        'text!templates/weeklyScheduler/list/ListHeader.html',
        'collections/weeklyScheduler/filterCollection',
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
            el      : '#weeklyScheduler',
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

                self.eventChannel = eventChannel;
                self.collection = new ContentCollection({count: 100});

                this.collection.bind('reset', this.render, self);
            },

            events: {
                "click  .list tbody td:not(.notForm, .validated)": "goToEditDialog",
                "click .newSelectList li"                        : "chooseOption"
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
                        page       : self.page
                    });

                    $currentEl.append(itemView.render());
                }
            }

        });

        return WeeklySchedulerListView;
    });
