define([
        'jQuery',
        'Underscore',
        'views/listViewBase',
        'text!templates/Leads/list/ListHeader.html',
        'text!templates/stages.html',
        'views/Leads/CreateView',
        'views/Leads/list/ListItemView',
        'views/Leads/EditView',
        'models/LeadsModel',
        'collections/Leads/filterCollection',
        'views/Filter/FilterView',
        'common',
        'dataService'
    ],

    function ($, _, listViewBase, listTemplate, stagesTemplate, createView, listItemView, editView, currentModel, contentCollection, filterView, common, dataService) {
        var LeadsListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            totalCollectionLengthUrl: '/totalCollectionLength/Leads',
            formUrl                 : "#easyErp/Leads/form/",
            contentType             : 'Leads',//needs in view.prototype.changeLocationHash

            events: {
                "click .list td:not(.notForm)": "goToEditDialog",
                "click #convertToOpportunity" : "openDialog",
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
                this.filter = options.filter||{};
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.startNumber = (this.page - 1) * this.defaultItemsNumber;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
            },

            chooseOption: function (e) {
                var self = this;
                var targetElement = $(e.target).parents("td");
                var id = targetElement.attr("id");
                var obj = this.collection.get(id);
                obj.set({workflow: $(e.target).attr("id")});
                obj.save(obj.changed, {
                    headers: {
                        mid: 39
                    },
                    patch  : true,
                    success: function () {
                        self.showFilteredPage(self.filter, self);
                    }
                });

                this.hideNewSelect();
                return false;
            },

            pushStages: function (stages) {
                this.stages = stages;
            },

            openDialog: function () {
                $("#dialog-form").dialog("open");
            },

            render: function () {
                var self;
                var $currentEl;

                $('.ui-dialog ').remove();

                self = this;
                $currentEl = this.$el;

                var itemView;

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));

                itemView = new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });

                itemView.bind('incomingStages', this.pushStages, this);

                common.populateWorkflowsList("Leads", ".filter-check-list", "", "/Workflows", null, function (stages) {
                    var stage = (self.filter) ? self.filter.workflow : null;
                    itemView.trigger('incomingStages', stages);
                });

                $currentEl.append(itemView.render());

                this.renderCheckboxes();

                this.renderFilter(self);

                this.renderPagination($currentEl, this);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            hideNewSelect: function (e) {
                $(".newSelectList").hide();
            },

            showNewSelect: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();
                    return false;
                } else {
                    $(e.target).parent().append(_.template(stagesTemplate, {stagesCollection: this.stages}));
                    return false;
                }

            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new currentModel({validate: false});
                model.urlRoot = '/Leads/form';
                model.fetch({
                    data   : {id: id},
                    success: function (model) {
                        new editView({model: model});
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

        return LeadsListView;
    });
