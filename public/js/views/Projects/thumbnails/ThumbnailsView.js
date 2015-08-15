define([
        "text!templates/Projects/thumbnails/ThumbnailsItemTemplate.html",
        'text!templates/stages.html',
        'views/Projects/EditView',
        'views/Projects/CreateView',
        'dataService',
        'models/ProjectsModel',
        'views/Filter/FilterView',
        'common',
        'populate'
    ],

    function (thumbnailsItemTemplate, stagesTamplate, editView, createView, dataService, currentModel, filterView, common, populate) {
        var ProjectThumbnalView = Backbone.View.extend({
            el: '#content-holder',
            countPerPage: 0,
            template: _.template(thumbnailsItemTemplate),
            newCollection: true,
            filter: null,
            defaultItemsNumber: null,
            contentType: 'Projects',//needs in view.prototype.changeLocationHash
            viewType: 'thumbnails',//needs in view.prototype.changeLocationHash

            initialize: function (options) {
                $(document).off("click");

                this.startTime = options.startTime;
                this.collection = options.collection;
                this.responseObj = {};
                this.asyncLoadImgs(this.collection);
                _.bind(this.collection.showMore, this.collection);
                this.countPerPage = options.collection.length;
                this.stages = [];
                this.filter = options.filter;
                this.defaultItemsNumber = this.collection.namberToShow || 50;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;

                this.render();

                this.getTotalLength(this.defaultItemsNumber, this.filter);
            },

            events: {
                "click #showMore": "showMore",
                "click .thumbnail": "gotoEditForm",
                "click .filterButton": "showfilter",
                "click .health-wrapper .health-container": "showHealthDd",
                "click .health-wrapper ul li div": "chooseHealthDd",
                "click .stageSelect": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click": "hideHealth",
                "click .filter-check-list li": "checkCheckbox"
            },

            checkCheckbox: function (e) {
                var target$ = $(e.target);
                if (!target$.is("input")) {
                    target$.closest("li").find("input").prop("checked", !target$.closest("li").find("input").prop("checked"));
                }
            },

            showNewSelect: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideHealth();
                    return false;
                } else {
                    $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
                    return false;
                }
            },

            chooseOption: function (e) {
                var self = this;
                var targetElement = $(e.target).parents(".thumbnail");
                var id = targetElement.attr("id");
                var model = this.collection.get(id);

                model.save({'workflow._id': $(e.target).attr("id"), 'workflow.name': $(e.target).text()}, {
                    headers: {
                        mid: 39
                    },
                    patch: true,
                    validate: false,
                    success: function () {
                        self.showFilteredPage(_.pluck(self.stages, '_id'));
                    }
                });

                this.hideHealth();
                return false;
            },

            chooseHealthDd: function (e) {
                var target$ = $(e.target);
                var target = target$.parents(".health-wrapper");
                var currTargHelth = target$.attr("class").replace("health", "");
                var id = target.parents(".thumbnail").attr("id");
                var model = this.collection.get(id);
                var helth = parseInt(currTargHelth);

                target.find(".health-container a").attr("class", target$.attr("class")).attr("data-value", currTargHelth);

                model.save({health: helth}, {
                    headers: {
                        mid: 39
                    },
                    patch: true,
                    validate: false,
                    success: function () {
                        $(".health-wrapper ul").hide();
                    }
                });
            },

            hideHealth: function () {
                $(".health-wrapper ul").hide();
                $(".newSelectList").hide();
            },

            showHealthDd: function (e) {
                $(e.target).parents(".health-wrapper").find("ul").toggle();
                return false;
            },

            showfilter: function (e) {
                $(".filter-check-list").toggle();
                return false;
            },

            hide: function (e) {
                if (!$(e.target).closest(".filter-check-list").length) {
                    $(".allNumberPerPage").hide();
                    if ($(".filter-check-list").is(":visible")) {
                        $(".filter-check-list").hide();
                        this.showFilteredPage();
                    }
                }

            },

            showFilteredPage: function (filter, context) {
               /* var itemsNumber = $("#itemsNumber").text();

                var alphaBet = this.$el.find('#startLetter');
                var selectedLetter = $(alphaBet).find('.current').length ? $(alphaBet).find('.current')[0].text : '';

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                context.startTime = new Date();
                context.newCollection = false;

                context.$el.find('.thumbnailwithavatar').remove();*/

                this.$el.find('.thumbnail').remove();
                this.startTime = new Date();
                this.newCollection = false;

                context.changeLocationHash(null, context.defaultItemsNumber, filter);
                context.collection.showMore({count: context.defaultItemsNumber, page: 1, filter: filter});
                context.getTotalLength(this.defaultItemsNumber, filter);
            },


            getTotalLength: function (currentNumber, filter, newCollection) {
                dataService.getData('/totalCollectionLength/Projects', {
                    currentNumber: currentNumber,
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var showMore = context.$el.find('#showMoreDiv');
                    if (response.showMore) {
                        if (showMore.length === 0) {
                            var created = context.$el.find('#timeRecivingDataFromServer');
                            created.before('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
                        } else {
                            showMore.show();
                        }
                    } else {
                        showMore.hide();
                    }
                }, this);
            },

            asyncLoadImgs: function (collection) {
                var arr = _.filter(collection.toJSON(), function (item) {
                    return item.projectmanager !== null;
                });
                var ids = _.map(arr, function (item) {
                    return item.projectmanager._id;
                });
                common.getImages(ids, "/getEmployeesImages");
            },

            pushStages: function (stages) {
                this.stages = stages;
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find('.search-options').addClass('hidden');
                };
                //this.$el.find(".allNumberPerPage, .newSelectList").hide();
                //if (!el.closest('.search-view')) {
                //    $('.search-content').removeClass('fa-caret-up');
                //}
                //;
            },

            render: function () {
                var self = this;
                var currentEl = this.$el;
                var createdInTag;

                currentEl.html('');

                if (this.collection.length > 0) {
                    currentEl.append(this.template({collection: this.collection.toJSON()}));
                } else {
                    currentEl.html('<h2>No projects found</h2>');
                }

                self.filterView = new filterView({contentType: self.contentType});

                self.filterView.bind('filter', function (filter) {
                    self.showFilteredPage(filter, self)
                });
                self.filterView.bind('defaultFilter', function () {
                    self.showFilteredPage({}, self);
                });

                self.filterView.render();

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                        $("#top-bar-deleteBtn").hide();
                });

                $(document).on("click", function (e) {
                    self.hide(e);
                    self.hideHealth(e);
                    self.hideItemsNumber(e);
                });

                populate.getPriority("#priority", this);

                createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
                currentEl.append(createdInTag);

                return this;
            },

            gotoEditForm: function (e) {
                var clas = $(e.target).parent().attr("class");
                if ((clas === "dropDown") || (clas === "inner")) {
                } else {
                    e.preventDefault();
                    var id = $(e.target).closest('.thumbnail').attr("id");
                    var model = new currentModel({validate: false});
                    model.urlRoot = '/Projects/form/' + id;
                    model.fetch({
                        success: function (model) {
                            new editView({model: model});
                        },
                        error: function () {
                            alert('Please refresh browser');
                        }
                    });
                }
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

                this.defaultItemsNumber += newModels.length;
                this.changeLocationHash(null, (this.defaultItemsNumber < 50) ? 50 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);

                if (showMore.length != 0) {
                    showMore.before(this.template({collection: this.collection.toJSON()}));

                    showMore.after(created);
                } else {
                    content.html(this.template({collection: this.collection.toJSON()}));
                }
                this.asyncLoadImgs(newModels);
                this.filterView.renderFilterContent();
            },

            createItem: function () {
                //create editView in dialog here
                new createView();
            },

            editItem: function () {
                //create editView in dialog here
                new editView({collection: this.collection});
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
