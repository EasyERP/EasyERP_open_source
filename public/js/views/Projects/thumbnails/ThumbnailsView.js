define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Projects/thumbnails/ThumbnailsItemTemplate.html',
    'text!templates/stages.html',
    'views/thumbnailsViewBase',
    'views/Projects/EditView',
    'views/Projects/CreateView',
    'views/Projects/form/FormView',
    'views/Filter/FilterView',
    'dataService',
    'common',
    'constants',
    'populate',
    'custom'
], function (Backbone, $, _, thumbnailsItemTemplate, stagesTamplate, BaseView, EditView, CreateView, formView, dataService, filterView, common, CONSTANTS, populate, custom) {
    'use strict';
    var ProjectThumbnalView = Backbone.View.extend({
        el                : '#content-holder',
        countPerPage      : 0,
        template          : _.template(thumbnailsItemTemplate),
        newCollection     : true,
        filter            : null,
        defaultItemsNumber: null,
        contentType       : 'Projects', // needs in view.prototype.changeLocationHash
        viewType          : 'thumbnails', // needs in view.prototype.changeLocationHash

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection || Backbone.Collection.extend();
            this.responseObj = {};
            this.asyncLoadImgs(this.collection);
            _.bind(this.collection.showMore, this.collection);
            this.countPerPage = options.collection.length;
            this.stages = [];
            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;

            this.render();
        },

        events: {
            'click .health-wrapper .health-container': 'showHealthDd',
            'click .health-wrapper ul li div'        : 'chooseHealthDd',
            'click .tasksByProject'                  : 'dropDown',
            'click .stageSelect'                     : 'showNewSelect',
            'click .project'                         : 'useProjectFilter'
        },

        useProjectFilter: function (e) {
            var project = $(e.target).attr('id');
            var filter = {
                project: {
                    key  : 'project._id',
                    value: [project]
                }
            };

            e.preventDefault();

            Backbone.history.navigate('#easyErp/Tasks/list/p=1/c=100/filter=' + encodeURIComponent(JSON.stringify(filter)), {trigger: true});
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideHealth();
                return false;
            }
            $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));

            return false;
        },

        chooseOption: function (e) {
            var $targetElement = $(e.target);
            var $thumbnail = $targetElement.parents('.thumbnail');
            var id = $thumbnail.attr('id');
            var model = this.collection.get(id);

            model.save({workflow: $targetElement.attr('id')}, {
                headers: {
                    mid: 39
                },

                patch   : true,
                validate: false,
                success : function () {
                    var filter = window.location.hash.split('filter=')[1];
                    var url = '#easyErp/Projects/thumbnails';

                    if (filter) {
                        url += '/filter=' + filter;
                    }
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});
                }
            });

            this.hideHealth();
            return false;
        },

        chooseHealthDd: function (e) {
            var target$ = $(e.target);
            var target = target$.parents('.health-wrapper');
            var currTargetHealth = target$.attr('class').replace('health', '');
            var id = target.parents('.thumbnail').attr('id');
            var model = this.collection.get(id);
            var health = parseInt(currTargetHealth, 10);

            target.find('.health-container a').attr('class', target$.attr('class')).attr('data-value', currTargetHealth);

            model.save({health: health}, {
                headers: {
                    mid: 39
                },

                patch   : true,
                validate: false,
                success : function () {
                    $('.health-wrapper ul').hide();
                }
            });
        },

        hideHealth: function () {
            var $thisEl = this.$el;

            $thisEl.find('.health-wrapper ul').hide();
            $thisEl.find('.newSelectList').hide();
        },

        showHealthDd: function (e) {
            $(e.target).parents('.health-wrapper').find('ul').toggle();
            return false;
        },

        asyncLoadImgs: function (collection) {
            var arr = _.filter(collection.toJSON(), function (item) {
                return item.salesmanager;
            });
            var ids = _.map(arr, function (item) {
                return item.salesmanager._id;
            });

            common.getImages(ids, CONSTANTS.URLS.EMPLOYEES + 'getEmployeesImages');
        },

        pushStages: function (stages) {
            this.stages = stages;
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var createdInTag;

            $currentEl.html('');
            $currentEl.append(this.template({collection: this.collection.toJSON()}));

            this.bind('incomingStages', this.pushStages, this);

            common.populateWorkflowsList("Projects", ".filter-check-list", "", "/Workflows", null, function (stages) {
                var stage = (self.filter) ? self.filter.workflow || [] : [];
                self.trigger('incomingStages', stages);
            });

            self.filterView = new filterView({contentType: self.contentType});

            self.filterView.bind('filter', function (filter) {
                self.showFilteredPage(filter)
            });
            self.filterView.bind('defaultFilter', function () {
                self.showFilteredPage({});
            });

            self.filterView.render();

            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                } else {
                    $("#top-bar-deleteBtn").hide();
                }
            });

            $(document).on("click", function (e) {
                self.hide(e);
                self.hideHealth(e);
                self.hideItemsNumber(e);
            });

            populate.getPriority("#priority", this);

            createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
            $currentEl.append(createdInTag);

            return this;
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

        showMore: function (event) {
            event.preventDefault();
            this.collection.showMore({filter: this.filter, newCollection: this.newCollection});
        },

        showMoreContent: function (newModels) {
            var holder = this.$el;
            var showMore = holder.find('#showMoreDiv');
            var created = holder.find('#timeRecivingDataFromServer');
            var content = holder.find("#thumbnailContent");
            var numberToShow;

            if (this.newCollection) {
                this.defaultItemsNumber = 100;
                this.newCollection = false;
            } else {
                this.defaultItemsNumber += newModels.length;

                if (this.defaultItemsNumber < 100) {
                    this.defaultItemsNumber = 100;
                }
            }

            this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
            this.getTotalLength(this.defaultItemsNumber, this.filter);

            if (showMore.length != 0) {
                showMore.before(this.template({collection: this.collection.toJSON()}));

                showMore.after(created);
            } else {
                content.html(this.template({collection: this.collection.toJSON()}));
            }
            this.asyncLoadImgs(newModels);
            // this.filterView.renderFilterContent();
        },

        deleteItems: function () {
            var mid = 39,
                model;
            model = this.collection.get(this.$el.attr("id"));
            this.$el.fadeToggle(200, function () {
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
                $(this).remove();
            });

        }
    });

    return ProjectThumbnalView;
});
