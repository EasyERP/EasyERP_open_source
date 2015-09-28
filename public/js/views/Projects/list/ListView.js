define([
        'views/listViewBase',
        'text!templates/Projects/list/ListHeader.html',
        'text!templates/stages.html',
        'views/Projects/CreateView',
        'views/Projects/list/ListItemView',
        'views/Projects/EditView',
        'views/Projects/form/FormView',
        'models/ProjectsModel',
        'collections/Projects/filterCollection',
        'views/Filter/FilterView',
        'common',
        'dataService',
        'custom'
    ],

    function (listViewBase, listTemplate, stagesTamplate, CreateView, listItemView, editView, formView, currentModel, contentCollection, filterView, common, dataService, custom) {
        var ProjectsListView = listViewBase.extend({
            createView              : CreateView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            totalCollectionLengthUrl: '/totalCollectionLength/Projects',
            formUrl                 : '#easyErp/Projects/form/',
            contentType             : 'Projects',//needs in view.prototype.changeLocationHash

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

            events: {
                "click .stageSelect"             : "showNewSelect",
                "click .newSelectList li"        : "chooseOption",
                "click #health .health-container": "showHealthDd",
                "click #health ul li div"        : "chooseHealthDd",
                //"click td:not(:has('input[type='checkbox']'))": "goToEditDialog",
            },

            chooseHealthDd: function (e) {
                var target$ = $(e.target);
                var target = target$.parents("#health");
                target.find("div a").attr("class", target$.attr("class")).attr("data-value", target$.attr("class").replace("health", "")).parents("#health").find("ul").toggle();
                var id = target.data("id");
                var model = this.collection.get(id);
                model.save({health: target.find("div a").data("value")}, {
                    headers : {
                        mid: 39
                    },
                    patch   : true,
                    validate: false,
                    success : function () {
                        target$.parents("#health").find("ul").hide();
                    }
                });
                return false;

            },

            showHealthDd: function (e) {
                $(e.target).parents("#health").find("ul").toggle();
                return false;
            },

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
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
                var target$ = $(e.target);
                var targetElement = target$.parents("td");
                var id = targetElement.attr("id");
                var model = this.collection.get(id);

                model.save({'workflow._id': target$.attr("id"), 'workflow.name': target$.html()}, {
                    headers : {
                        mid: 39
                    },
                    patch   : true,
                    validate: false,
                    success : function () {
                        self.showFilteredPage({}/*_.pluck(self.stages, '_id')*/);
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
                var currentEl;

                $('.ui-dialog ').remove();

                self = this;
                currentEl = this.$el;

                var itemView;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                itemView = new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });
                itemView.bind('incomingStages', this.pushStages, this);

                common.populateWorkflowsList("Projects", ".filter-check-list", "", "/Workflows", null, function (stages) {
                    var stage = (self.filter) ? self.filter.workflow || [] : [];
                    itemView.trigger('incomingStages', stages);
                });

                currentEl.append(itemView.render());//added two parameters page and items number

                this.renderCheckboxes();

                this.renderFilter(self);

                this.renderPagination(currentEl, this);

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            }

        });

        return ProjectsListView;
    });
