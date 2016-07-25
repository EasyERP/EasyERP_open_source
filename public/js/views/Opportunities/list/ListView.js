define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Opportunities/list/ListHeader.html',
    'views/Opportunities/CreateView',
    'views/Opportunities/list/ListItemView',
    'views/Opportunities/EditView',
    'models/OpportunitiesModel',
    'collections/Opportunities/filterCollection',
    'common',
    'dataService',
    'text!templates/stages.html'
], function (Backbone,
             $,
             _,
             ListViewBase,
             listTemplate,
             CreateView,
             ListItemView,
             EditView,
             CurrentModel,
             contentCollection,
             common,
             dataService,
             stagesTemplate) {
    'use strict';

    var OpportunitiesListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        formUrl          : '#easyErp/Opportunities/tform/',
        contentType      : 'Opportunities', // needs in view.prototype.changeLocationHash
        hasPagination    : true,

        initialize: function (options) {
            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.stages = [];
            this.filter = options.filter || {};
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            ListViewBase.prototype.initialize.call(this, options);
        },

        events: {
            'click .stageSelect'     : 'showNewSelect',
            'click .newSelectList li': 'chooseOption'
        },

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target);
            var targetElement = $target.parents('td');
            var id = targetElement.attr('id');
            var obj = this.collection.get(id);

            obj.save({
                workflow     : $target.attr('id'),
                workflowStart: targetElement.find('.stageSelect').attr('data-id'),
                sequence     : -1,
                sequenceStart: targetElement.attr('data-sequence')
            }, {
                headers: {
                    mid: 25
                },
                patch  : true,
                success: function () {
                    self.showFilteredPage(self.filter, self);
                }
            });

            this.hideNewSelect();
            return false;
        },

        hideNewSelect: function () {
            $('.newSelectList').remove(); // change after ui tests
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
            } else {
                $(e.target).parent().append(_.template(stagesTemplate, {stagesCollection: this.stages}));
            }

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

            itemView.bind('incomingStages', this.pushStages, this);

            common.populateWorkflowsList('Opportunities', '.filter-check-list', '', '/Workflows', null, function (stages) {
                var stage = (self.filter) ? self.filter.workflow : null;

                itemView.trigger('incomingStages', stages);
            });

            $currentEl.append(itemView.render());

            // this.renderFilter();

            // this.renderPagination($currentEl, this);

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },


        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        }

    });

    return OpportunitiesListView;
});
