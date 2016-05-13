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
        'views/Filter/FilterView',
        'common',
        'text!templates/stages.html',
        'constants'
    ],
    function ($, _, listViewBase, listTemplate, createView, ListItemView, EditView, CurrentModel, contentCollection, filterView, common, stagesTamplate, CONSTANTS) {
        'use strict';
        var ApplicationsListView = listViewBase.extend({

            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : ListItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            contentType             : "Applications",
            totalCollectionLengthUrl: '/applications/totalCollectionLength',
            formUrl                 : "#easyErp/Applications/form/",

            events: {
                "click .list td:not(.notForm)": "goToEditDialog",
                "click .stageSelect"          : "showNewSelect",
                "click .newSelectList li"     : "chooseOption"
            },

            initialize: function (options) {
                $(document).off("click");
                this.mId =  CONSTANTS.MID[this.contentType];
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.parrentContentId = options.collection.parrentContentId;
                this.stages = [];
                this.filter = options.filter;
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
            },

            showNewSelect: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();
                    return false;
                }

                $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
                return false;

            },

            chooseOption: function (e) {
                var self = this;
                var mid = this.mId;
                var targetElement = $(e.target).parents("td");
                var id = targetElement.attr("id");
                var obj = this.collection.get(id);
                obj.save({
                    workflow     : $(e.target).attr("id"),
                    workflowStart: targetElement.find(".stageSelect").attr("data-id"),
                    sequence     : -1,
                    sequenceStart: targetElement.attr("data-sequence")
                }, {
                    headers : {
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

                $('.ui-dialog ').remove();

                self = this;
                $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));
                var itemView = new ListItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });

                $currentEl.append(itemView.render());

                itemView.bind('incomingStages', itemView.pushStages, itemView);

                common.populateWorkflowsList("Applications", ".filter-check-list", "", "/Workflows", null, function (stages) {
                    self.stages = stages;
                    itemView.trigger('incomingStages', stages);
                });

                this.renderCheckboxes();
                this.renderPagination($currentEl, this);
                this.renderFilter(self);
                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new CurrentModel({validate: false});
                model.urlRoot = '/applications/' + id;
                model.fetch({
                    success: function (model) {
                        new EditView({model: model});
                    },
                    error  : function () {
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