define([
        'views/listViewBase',
        'text!templates/Applications/list/ListHeader.html',
        'views/Applications/CreateView',
        'views/Applications/list/ListItemView',
        'views/Applications/EditView',
        'models/ApplicationsModel',
        'collections/Applications/filterCollection',
        'views/Filter/FilterView',
        'common',
        'dataService',
        'text!templates/stages.html'
    ],
    function (listViewBase, listTemplate, createView, listItemView, editView, currentModel, contentCollection, filterView, common, dataService, stagesTamplate) {
        var ApplicationsListView = listViewBase.extend({

            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            contentType             : "Applications",
            totalCollectionLengthUrl: '/totalCollectionLength/Applications',
            formUrl                 : "#easyErp/Applications/form/",

            events: {
                "click .list td:not(.notForm)": "goToEditDialog",
                "click .stageSelect"          : "showNewSelect",
                "click .newSelectList li"     : "chooseOption"

            },

            initialize: function (options) {
                $(document).off("click");
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
                this.filterView;
            },

            hideNewSelect: function (e) {
                $(".newSelectList").hide();
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
                var self = this;
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
                        mid: 39
                    },
                    patch   : true,
                    validate: false,
                    success : function (err, model) {
                        self.showFilteredPage({}/*_.pluck(self.stages, '_id')*/);
                    }
                });

                this.hideNewSelect();
                return false;
            },

            pushStages: function (stages) {
                this.stages = stages;
            },

            //checkCheckbox: function (e) {
            //    if (!$(e.target).is("input")) {
            //        $(e.target).closest("li").find("input").prop("checked", !$(e.target).closest("li").find("input").prop("checked"));
            //    }
            //},

            render: function () {
                var self;
                var currentEl;

                $('.ui-dialog ').remove();

                self = this;
                currentEl = this.$el;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                var itemView = new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });

                currentEl.append(itemView.render());

                itemView.bind('incomingStages', itemView.pushStages, itemView);

                common.populateWorkflowsList("Applications", ".filter-check-list", "", "/Workflows", null, function (stages) {
                    self.stages = stages;
                    var stage = (self.filter) ? self.filter.workflow : null;
                    itemView.trigger('incomingStages', stages);
                });

                this.renderCheckboxes();
                this.renderPagination(currentEl, this);
                this.renderFilter(self);
                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new currentModel({validate: false});
                model.urlRoot = '/Applications/form';
                model.fetch({
                    data   : {id: id},
                    success: function (model) {
                        new editView({model: model});
                    },
                    error  : function () {
                        alert('Please refresh browser');
                    }
                });
            }
        });
        return ApplicationsListView;
    });