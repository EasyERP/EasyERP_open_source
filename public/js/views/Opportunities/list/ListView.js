define([
        'views/listViewBase',
        'text!templates/Opportunities/list/ListHeader.html',
        'views/Opportunities/CreateView',
        'views/Opportunities/list/ListItemView',
        'views/Opportunities/EditView',
        'models/OpportunitiesModel',
        'collections/Opportunities/filterCollection',
        'views/Filter/FilterView',
        'common',
        'dataService',
        'text!templates/stages.html'
    ],

    function (listViewBase, listTemplate, createView, listItemView, editView, currentModel, contentCollection, filterView, common, dataService, stagesTamplate) {
        var OpportunitiesListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : null,
            totalCollectionLengthUrl: '/totalCollectionLength/Opportunities',
            formUrl                 : "#easyErp/Opportunities/form/",
            contentType             : 'Opportunities',//needs in view.prototype.changeLocationHash

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
            },

            events: {

                "click .list td:not(.notForm)": "goToEditDialog",
                "click .stageSelect"          : "showNewSelect",
                "click .newSelectList li"     : "chooseOption",

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
                    headers: {
                        mid: 39
                    },
                    patch  : true,
                    success: function (err, model) {
                        self.showFilteredPage({}, self);
                    }
                });

                this.hideNewSelect();
                return false;
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

                itemView = new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });
                $currentEl.append(itemView.render());
                itemView.bind('incomingStages', itemView.pushStages, itemView);

                this.renderCheckboxes();

                common.populateWorkflowsList("Opportunities", ".filter-check-list", "", "/Workflows", null, function (stages) {
                    self.stages = stages;
                    var stage = (self.filter) ? self.filter.workflow : null;
                    itemView.trigger('incomingStages', stages);
                });

                this.renderPagination($currentEl, this);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new currentModel({validate: false});
                model.urlRoot = '/Opportunities/form';
                model.fetch({
                    data   : {id: id},
                    success: function (model) {
                        new editView({model: model});
                    },
                    error  : function () {
                        alert('Please refresh browser');
                    }
                });
            },

        });

        return OpportunitiesListView;
    });
