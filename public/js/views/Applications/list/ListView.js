define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Applications/list/ListHeader.html',
    'views/Applications/CreateView',
    'views/Applications/list/ListItemView',
    'views/Applications/EditView',
    'models/ApplicationsModel',
    'collections/Applications/filterCollection',
    'common',
    'text!templates/stages.html',
    'constants'
], function ($,
             _,
             ListViewBase,
             listTemplate,
             CreateView,
             ListItemView,
             EditView,
             CurrentModel,
             contentCollection,
             common,
             stagesTamplate,
             CONSTANTS) {
    'use strict';

    var ApplicationsListView = ListViewBase.extend({

        CreateView              : CreateView,
        listTemplate            : listTemplate,
        ListItemView            : ListItemView,
        contentCollection       : contentCollection,
        contentType             : 'Applications',
        formUrl                 : '#easyErp/Applications/',

        events: {
            'click .list td:not(.notForm)': 'goToEditDialog',
            'click .stageSelect'          : 'showNewSelect',
            'click .newSelectList li'     : 'chooseOption'
        },

        initialize: function (options) {
            $(document).off('click');
            this.mId = CONSTANTS.MID[this.contentType];
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.stages = [];
            this.filter = options.filter;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            this.render();

           // this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            this.contentCollection = contentCollection;
        },

        hideNewSelect: function () {
            $('.newSelectList').remove();  // changed after ui tests
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
                return false;
            }

            $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
            return false;

        },

        chooseOption: function (e) {
            var self = this;
            var mid = this.mId;
            var targetElement = $(e.target).parents('td');
            var id = targetElement.attr('id');
            var obj = this.collection.get(id);
            obj.save({
                workflow     : $(e.target).attr('id'),
                workflowStart: targetElement.find('.stageSelect').attr('data-id'),
                sequence     : -1,
                sequenceStart: targetElement.attr('data-sequence')
            }, {
                headers: {
                    mid: mid
                },
                patch   : true,
                validate: false,
                success : function () {
                    self.showFilteredPage({}, self);
                }
            });

            this.hideNewSelect();
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

            common.populateWorkflowsList('Applications', '.filter-check-list', '', '/Workflows', null, function (stages) {
                self.stages = stages;
                itemView.trigger('incomingStages', stages);
            });

            this.renderPagination($currentEl, this);
            this.renderFilter();
            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new CurrentModel({validate: false});

            e.preventDefault();


            model.urlRoot = '/applications/';
            model.fetch({
                data   : {id: id},
                success: function (response) {
                    new EditView({model: response});
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
    return ApplicationsListView;
});
