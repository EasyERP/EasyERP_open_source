define([
        'views/listViewBase',
        'text!templates/Pagination/PaginationTemplate.html',
        'text!templates/Tasks/list/ListHeader.html',
        'text!templates/stages.html',
        'views/Tasks/CreateView',
        'views/Tasks/list/ListItemView',
        'views/Tasks/EditView',
        'models/TasksModel',
        'views/Projects/EditView',
        'models/ProjectsModel',
        'collections/Tasks/filterCollection',
        'views/Filter/FilterView',
        'common',
    ],

    function (listViewBase, paginationTemplate, listTemplate, stagesTamplate, createView, listItemView, editView, currentModel, projectEditView, projectModel, contentCollection, filterView, common) {
        var TasksListView = listViewBase.extend({

            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            contentType             : "Tasks",
            totalCollectionLengthUrl: '/totalCollectionLength/Tasks',
            // formUrl                 : "#easyErp/Tasks/form/",

            events: {
                "click td:not(:has('input[type='checkbox']'))": "goToEditDialog",
                "click .project"                              : "goToProject",
                "click .stageSelect"                          : "showNewSelect",
                "click .stageSelectType"                      : "showNewSelectType",
                "click .newSelectList li"                     : "chooseOption"
            },

            initialize: function (options) {
                $(document).off("click");
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.parrentContentId = options.collection.parrentContentId;
                this.stages = [];
                this.sort = options.sort;
                this.filter = options.filter;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
            },

            goToProject: function (e) {
                var projectId = $(e.target).data('id');
                var model = new projectModel({validate: false});
                model.urlRoot = '/Projects/form/' + projectId;
                model.fetch({
                    success: function (model) {
                        new projectEditView({model: model});
                    },
                    error  : function () {
                        App.render({
                            type: 'error',
                            message: "Please refresh browser"
                        });
                    }
                });
                return false;
            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new currentModel({validate: false});
                model.urlRoot = '/Tasks/form';
                model.fetch({
                    data   : {id: id},
                    success: function (model) {
                        new editView({model: model});
                    },
                    error  : function () {
                        App.render({
                            type: 'error',
                            message: "Please refresh browser"
                        });
                    }
                });
            },

            pushStages: function (stages) {
                this.stages = stages;
            },

            showNewSelectType: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();
                    return false;
                } else {
                    var targetElement = $(e.target).parents("td");
                    targetElement.find(".newSelectList").show();
                    return false;
                }
            },

            showNewSelect: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();
                    return false;
                } else {
                    $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
                    return false;
                }
            },

            chooseOption: function (e) {
                var that = this;
                var target = $(e.target);
                var targetParrentElement = target.parents("td");
                var selectType = targetParrentElement.attr("id").split("_")[0];
                var model;
                var id;
                if (selectType == 'stages') {
                    if ($(target).attr('data-status') === 'done') {
                        id = targetParrentElement.attr("id").replace("stages_", "");
                        model = this.collection.get(id);
                        model.urlRoot = '/Tasks';
                        model.save({
                                workflow     : target.attr("id"),
                                sequence     : -1,
                                sequenceStart: model.toJSON().sequence,
                                workflowStart: model.toJSON().workflow ? model.toJSON().workflow._id : null,
                                progress     : 100
                            },
                            {
                                headers : {
                                    mid: 39
                                },
                                patch   : true,
                                validate: false,
                                success : function () {
                                    that.showFilteredPage({}, that);
                                }
                            });
                    } else {
                        id = targetParrentElement.attr("id").replace("stages_", "");
                        model = this.collection.get(id);
                        model.urlRoot = '/Tasks';
                        model.save({
                                workflow     : target.attr("id"),
                                sequence     : -1,
                                sequenceStart: model.toJSON().sequence,
                                workflowStart: model.toJSON().workflow ? model.toJSON().workflow._id : null,
                                estimated    : model.toJSON().estimated,
                                logged       : model.toJSON().logged
                            },
                            {
                                headers : {
                                    mid: 39
                                },
                                patch   : true,
                                validate: false,
                                success : function () {
                                    that.showFilteredPage({}, that);
                                }
                            });
                    }
                } else if (selectType == 'type') {
                    id = targetParrentElement.attr("id").replace("type_", "");
                    model = this.collection.get(id);
                    model.urlRoot = '/Tasks';
                    var type = target.attr("id");
                    model.save({
                            type: type
                        },
                        {
                            headers : {
                                mid: 39
                            },
                            patch   : true,
                            validate: false,
                            success : function (model) {
                                that.showFilteredPage({}, that);//When add filter by Type, then uncoment this code
                            }
                        });
                }
                this.hideNewSelect();
                return false;
            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
            },

            render: function () {
                var self;
                var $currentEl;

                $('.ui-dialog ').remove();

                self = this;
                $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));
                var itemView = new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });
                itemView.bind('incomingStages', this.pushStages, this);
                $currentEl.append(itemView.render());

                this.renderCheckboxes();

                common.populateWorkflowsList("Tasks", ".filter-check-list", "#workflowNamesDd", "/Workflows", null, function (stages) {
                    var stage = (self.filter) ? self.filter.workflow || [] : [];
                    itemView.trigger('incomingStages', stages);

                });
                this.renderFilter(this);
                this.renderPagination($currentEl, this);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            }

        });

        return TasksListView;
    });
