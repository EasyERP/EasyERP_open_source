define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/JobPositions/list/ListHeader.html',
    'views/JobPositions/CreateView',
    'views/JobPositions/list/ListItemView',
    'collections/JobPositions/filterCollection',
    'models/JobPositionsModel',
    'views/JobPositions/EditView',
    'common',
    'text!templates/stages.html',
    'views/guideTours/guideNotificationView'
], function (Backbone, $, _, listViewBase, listTemplate, CreateView, ListItemView, contentCollection, CurrentModel, EditView, common, stagesTamplate, GuideNotify) {
    'use strict';

    var JobPositionsListView = listViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        hasPagination    : true,
        contentType      : 'JobPositions', // needs in view.prototype.changeLocationHash

        events: {
            'click .stageSelect'     : 'showNewSelect',
            'click .newSelectList li': 'chooseOption'
        },

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.newCollection = options.newCollection;
            this.page = options.collection.page;
            this.filter = options.filter;

            this.contentCollection = contentCollection;

            listViewBase.prototype.initialize.call(this, options);
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hide(e);
                return false;
            }

            $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
            return false;

        },

        chooseOption: function (e) {
            var afterPage = '';
            var location = window.location.hash;
            var pageSplited = location.split('/p=')[1];
            var targetElement = $(e.target).parents('td');
            var id = targetElement.attr('id').replace('stages_', '');
            var obj = this.collection.get(id);

            if (pageSplited) {
                afterPage = pageSplited.split('/')[1];
                location = location.split('/p=')[0] + '/p=1' + '/' + afterPage;
            }
            obj.urlRoot = '/JobPositions';
            this.hide(e);
            obj.save({
                workflow                : $(e.target).attr('id'),
                expectedRecruitment     : obj.toJSON().expectedRecruitment,
                totalForecastedEmployees: obj.toJSON().totalForecastedEmployees,
                numberOfEmployees       : obj.toJSON().numberOfEmployees
            }, {
                headers: {
                    mid: 39
                },
                patch  : true,
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(location, {trigger: true});
                }
            });

            return false;
        },

        pushStages: function (stages) {
            this.stages = stages;
        },

        render: function () {
            var self;
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            itemView = new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            });
            $currentEl.append(itemView.render());
            itemView.bind('incomingStages', itemView.pushStages, itemView);

            common.populateWorkflowsList('Job positions', null, null, '/Workflows', null, function (stages) {
                self.stages = stages;
                itemView.trigger('incomingStages', stages);
            });

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
            // this.renderPagination($currentEl, this);
            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new CurrentModel({validate: false});

            e.preventDefault();
            model.urlRoot = '/JobPositions';
            model.fetch({
                data: {
                    id      : id,
                    viewType: 'form'
                },

                success: function (response) {
                    return new EditView({model: response});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        }
    });

    return JobPositionsListView;
});
