define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Projects/list/ListHeader.html',
    'text!templates/stages.html',
    'views/Projects/CreateView',
    'views/Projects/list/ListItemView',
    'views/Projects/EditView',
    'models/ProjectsModel',
    'collections/Projects/filterCollection',
    'services/projects',
    'services/select',
    'common'
], function ($, _, ListViewBase, listTemplate, stagesTamplate, CreateView, ListItemView, EditView, CurrentModel, ContentCollection, projects, selectService, common) {
    var ProjectsListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : _.template(listTemplate),
        ListItemView     : ListItemView,
        ContentCollection: ContentCollection,
        formUrl          : '#easyErp/Projects/form/',
        contentType      : 'Projects', //  needs in view.prototype.changeLocationHash

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.ContentCollection = ContentCollection;

            this.render();
        },

        events: {
            'click .stageSelect'                     : selectService.showStageSelect,
            'click .newSelectList li'                : projects.chooseOption,
            'click .health-wrapper .health-container': projects.showHealthDd,
            'click .health-wrapper ul li div'        : projects.chooseHealthDd
        },

        hideNewSelect: function (e) {
            $('.newSelectList').remove();
        },

        hideHealth: projects.hideHealth,

        render: function () {
            var itemView;
            var $currentEl;
            var self;

            $('.ui-dialog ').remove();
            self = this;

            $currentEl = this.$el;

            $currentEl.html(this.listTemplate());

            itemView = new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            });

            $currentEl.append(itemView.render()); // added two parameters page and items number
            common.populateWorkflowsList('Projects', '.filter-check-list', '', '/workflows', null, function (stages) {
                self.stages = stages || [];
            });

            this.renderFilter();

            // todo add to after main render
            this.renderPagination($currentEl, this);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        }

    });

    return ProjectsListView;
});
