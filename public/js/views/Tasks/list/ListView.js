define([
    'Backbone',
    'jQuery',
    'Underscore',
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
    'views/Filter/filterView',
    'common'
], function (Backbone, $, _, ListViewBase, paginationTemplate, listTemplate, stagesTamplate, CreateView, ListItemView, EditView, CurrentModel, ProjectEditView, ProjectModel, ContentCollection, FilterView, common) {
    var TasksListView = ListViewBase.extend({

        CreateView              : CreateView,
        listTemplate            : listTemplate,
        ListItemView            : ListItemView,
        contentCollection       : ContentCollection,
        filterView              : FilterView,
        hasPagination           : true,
        contentType             : 'Tasks',
        totalCollectionLengthUrl: '/totalCollectionLength/Tasks',
        // formUrl                 : "#easyErp/Tasks/form/",

        events: {
            'click td:not(:has("input[type="checkbox"]"), :has(.project))': 'goToEditDialog',
            'click .stageSelect'                                          : 'showNewSelect',
            'click .stageSelectType'                                      : 'showNewSelectType',
            'click .newSelectList li'                                     : 'chooseOption'
        },

        initialize: function (options) {
            $(document).off('click');
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.stages = [];
            this.sort = options.sort;
            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;
            this.contentCollection = ContentCollection;

            ListViewBase.prototype.initialize.call(this, options);
        },

        goToProject: function (e) {

        },

        /*goToProject: function (e) {
         var projectId = $(e.target).data('id');
         var model = new ProjectModel({validate: false});

         model.urlRoot = '/Projects/' + projectId;
         model.fetch({
         success: function (newModel) {
         new ProjectEditView({model: newModel});
         },

         error: function () {
         App.render({
         type   : 'error',
         message: 'Please refresh browser'
         });
         }
         });

         return false;
         },*/



        goToEditDialog: function (e) {
            var id;
            var projectId;

            e.preventDefault();


            id = $(e.target).closest('tr').data('id');
            //projectId = this.collection.get({'id': id}).toJSON().project._id;
            //Backbone.history.navigate('easyErp/Projects/form/' + projectId, {trigger: true});

            model = new CurrentModel({validate: false});

            model.urlRoot = '/Tasks/';
            model.fetch({
                data   : {id: id, viewType: 'form'},
                success: function (newModel) {
                    new EditView({model: newModel});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        pushStages: function (stages) {
            this.stages = stages;
        },

        showNewSelectType: function (e) {
            var targetElement;

            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
            } else {
                targetElement = $(e.target).parents('td');
                targetElement.find('.newSelectList').show();
            }

            return false;
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
            } else {
                $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
            }

            return false;
        },

        chooseOption: function (e) {
            var that = this;
            var target = $(e.target);
            var targetParrentElement = target.parents('td');
            var selectType = targetParrentElement.attr('id').split('_')[0];
            var model;
            var id;
            var modelJSON;
            var type;

            if (selectType === 'stages') {
                if ($(target).attr('data-status') === 'done') {
                    id = targetParrentElement.attr('id').replace('stages_', '');
                    model = this.collection.get(id);
                    modelJSON = model.toJSON();
                    model.urlRoot = '/Tasks';
                    model.save(
                        {
                            workflow     : target.attr('id'),
                            sequence     : -1,
                            sequenceStart: modelJSON.sequence,
                            workflowStart: modelJSON.workflow ? modelJSON.workflow._id : null,
                            progress     : 100
                        },
                        {
                            headers: {
                                mid: 39
                            },

                            patch   : true,
                            validate: false,
                            success : function () {
                                that.showFilteredPage({}, that);
                            }
                        });
                } else {
                    id = targetParrentElement.attr('id').replace('stages_', '');
                    model = this.collection.get(id);
                    modelJSON = model.toJSON();
                    model.urlRoot = '/Tasks';
                    model.save(
                        {
                            workflow     : target.attr('id'),
                            sequence     : -1,
                            sequenceStart: modelJSON.sequence,
                            workflowStart: modelJSON.workflow ? modelJSON.workflow._id : null,
                            estimated    : modelJSON.estimated,
                            logged       : modelJSON.logged
                        },
                        {
                            headers: {
                                mid: 39
                            },

                            patch   : true,
                            validate: false,
                            success : function () {
                                that.showFilteredPage({}, that);
                            }
                        });
                }
            } else if (selectType === 'type') {
                id = targetParrentElement.attr('id').replace('type_', '');
                model = this.collection.get(id);
                model.urlRoot = '/Tasks';
                type = target.attr('id');
                model.save(
                    {
                        type: type
                    },
                    {
                        headers: {
                            mid: 39
                        },

                        patch   : true,
                        validate: false,
                        success : function (newModel) {
                            that.showFilteredPage({}, that); // When add filter by Type, then uncoment this code
                        }
                    });
            }
            this.hideNewSelect();
            return false;
        },

        hideNewSelect: function () {
            $('.newSelectList').hide();
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
            $currentEl.append(itemView.render());

            common.populateWorkflowsList('Tasks', '.filter-check-list', '#workflowNamesDd', '/Workflows', null, function (stages) {
                var stage = (self.filter) ? self.filter.workflow || [] : [];

                itemView.trigger('incomingStages', stages);
            });

            // this.renderFilter();
            // this.renderPagination($currentEl, this);

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        }

    });

    return TasksListView;
});
