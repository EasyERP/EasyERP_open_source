define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Projects/thumbnails/ThumbnailsItemTemplate.html',
    'views/selectView/selectView',
    'views/thumbnailsViewBase',
    'views/Projects/EditView',
    'views/Projects/CreateView',
    'views/Filter/filterView',
    'services/projects',
    'services/select',
    'dataService',
    'common',
    'constants',
    'populate'
], function (Backbone, $, _, thumbnailsItemTemplate, selectView, BaseView, EditView, CreateView, FilterView, projects, selectService, dataService, common, CONSTANTS, populate) {
    'use strict';
    var ProjectThumbnalView = BaseView.extend({
        el           : '#content-holder',
        template     : _.template(thumbnailsItemTemplate),
        newCollection: true,
        contentType  : 'Projects',

        initialize: function (options) {
            $(document).off('click');
            this.responseObj = {};

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.asyncLoadImgs(this.collection);
            this.stages = [];

            BaseView.prototype.initialize.call(this, options);
        },

        events: {
            'click .health-wrapper .health-container'                                           : projects.showHealthDd,
            'click .health-wrapper ul li div'                                                   : projects.chooseHealthDd,
            'click .forStage .newSelectList li'                                                 : projects.chooseOption,
            'click .tasksByProject'                                                             : 'dropDown',
            'click .stageSelect'                                                                : selectService.showStageSelect,
            'click .project'                                                                    : 'useProjectFilter',
            'click .forProjectsTypes .newSelectList li:not(.miniStylePagination):not(.disabled)': 'chooseOption',
            'click .current-selected:not(.disabled)'                                            : 'showNewSelect'
        },

        chooseOption: function (e) {
            var id;
            var $target = $(e.target);
            var model;
            var $idContainer;

            $('.newSelectList').hide();

            $idContainer = $target.parents('.thumbnail');
            id = $idContainer.attr('id');

            $target.parents('.forProjectsTypes').find('.current-selected').text($target.text());

            model = this.collection.get(id);
            model.save({projecttype: $target.text()}, {
                patch   : true,
                validate: false
            });

        },

        showNewSelect: function (e) {
            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new selectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        useProjectFilter: function (e) {
            var project = $(e.target).attr('id');
            var filter = {
                project: {
                    key  : 'project._id',
                    type : 'ObjectId',
                    value: [project]
                }
            };

            e.preventDefault();

            Backbone.history.navigate('#easyErp/Tasks/list/p=1/c=100/filter=' + encodeURIComponent(JSON.stringify(filter)), {trigger: true});
        },

        hideHealth: projects.hideHealth,

        asyncLoadImgs: function (collection) {
            var arr = _.filter(collection.toJSON(), function (item) {
                return item.salesManager;
            });
            var ids = _.map(arr, function (item) {
                return item.salesManager._id;
            });

            common.getImages(ids, CONSTANTS.URLS.EMPLOYEES + 'getEmployeesImages');
        },

        gotoEditForm: function (e) {
            var id;

            e.preventDefault();
            App.ownContentType = true;
            id = $(e.target).closest('.thumbnail').attr('id');

            window.location.hash = '#easyErp/Projects/form/' + id;

            App.projectInfo = App.projectInfo || {};
            App.projectInfo.currentTab = 'overview';
        },

        deleteItems: function () {
            var mid = 39;
            var model = this.collection.get(this.$el.attr('id'));

            this.$el.fadeToggle(200, function () {
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
                $(this).remove();
            });

        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $currentEl
                .find('#thumbnailContent')
                .append(this.template({collection: this.collection.toJSON()}));

            common.populateWorkflowsList('Projects', '.filter-check-list', '', '/workflows', null, function (stages) {
                self.stages = stages || [];
            });

            populate.get('.current-selected', CONSTANTS.URLS.PROJECT_TYPE, {}, 'name', this, false, true);
            populate.getPriority('#priority', this);
            return this;
        }
    });

    return ProjectThumbnalView;
});
