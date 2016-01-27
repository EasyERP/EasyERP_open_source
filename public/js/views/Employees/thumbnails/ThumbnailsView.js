define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/Employees/thumbnails/ThumbnailsItemTemplate.html',
        'views/Employees/EditView',
        'views/Employees/CreateView',
        'views/Filter/FilterView',
        'dataService',
        'models/EmployeesModel',
        'common',
        'text!templates/Alpabet/AphabeticTemplate.html',
        'constants'
    ],

    function (Backbone, $, _, thumbnailsItemTemplate, EditView, CreateView, FilterView, dataService, CurrentModel, common, AphabeticTemplate, CONSTANTS) {
        'use strict';
        var EmployeesThumbnalView = Backbone.View.extend({
            el                : '#content-holder',
            countPerPage      : 0,
            template          : _.template(thumbnailsItemTemplate),
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            newCollection     : null,
            //page: null, //if reload page, and in url is valid page
            contentType       : 'Employees',//needs in view.prototype.changeLocationHash
            viewType          : 'thumbnails',//needs in view.prototype.changeLocationHash

            initialize: function (options) {
                this.mId = CONSTANTS.MID[this.contentType];
                this.asyncLoadImgs(this.collection);
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                _.bind(this.collection.showMoreAlphabet, this.collection);
                this.allAlphabeticArray = common.buildAllAphabeticArray();
                this.filter = options.filter;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(this.defaultItemsNumber, this.filter);
                this.asyncLoadImgs(this.collection);
            },

            events: {
                "click #showMore"           : "showMore",
                "click .thumbnailwithavatar": "gotoEditForm",
                "click .letter:not(.empty)" : "alpabeticalRender",
                "click .saveFilterButton"   : "saveFilter",
                "click .removeFilterButton" : "removeFilter"
            },

            //modified for filter Vasya
            getTotalLength: function (currentNumber) {
                dataService.getData('/employee/totalCollectionLength', {
                    currentNumber: currentNumber,
                    filter       : this.filter,
                    newCollection: this.newCollection,
                    contentType  : this.contentType,
                    mid          : this.mId
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
                var ids = _.map(collection.toJSON(), function (item) {
                    return item._id;
                });
                common.getImages(ids, "/employee/getEmployeesImages");
            },

            alpabeticalRender: function (e) {
                var selectedLetter;
                var target;

                this.filter = {};
                if (e && e.target) {
                    target = $(e.target);
                    selectedLetter = $(e.target).text();

                    this.filter.letter = selectedLetter;

                    target.parent().find(".current").removeClass("current");
                    target.addClass("current");
                    if ($(e.target).text() === "All") {
                        this.filter = {};
                    }
                }

                this.startTime = new Date();
                this.newCollection = false;
                this.$el.find('.thumbnailwithavatar').remove();

                this.defaultItemsNumber = 0;
                this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
                this.collection.showMoreAlphabet({count: this.defaultItemsNumber, filter: this.filter});
                this.getTotalLength(this.defaultItemsNumber, this.filter);
            },

            render: function () {
                var self = this;
                var $currentEl = this.$el;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";

                $currentEl.html('');

                if (this.collection.length > 0) {
                    $currentEl.append(this.template({collection: this.collection.toJSON()}));
                } else {
                    $currentEl.html('<h2>No Employees found</h2>');
                }
                self.filterView = new FilterView({contentType: self.contentType});

                self.filterView.bind('filter', function (filter) {
                    self.showFilteredPage(filter, self);
                });
                self.filterView.bind('defaultFilter', function () {
                    self.showFilteredPage({}, self);
                });

                self.filterView.render();

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });
                common.buildAphabeticArray(this.collection, function (arr) {
                    self.alphabeticArray = arr;
                    $('#startLetter').remove();
                    $("#searchContainer").after(_.template(AphabeticTemplate, {
                        alphabeticArray   : self.alphabeticArray,
                        allAlphabeticArray: self.allAlphabeticArray
                    }));
                    var currentLetter = (self.filter && self.filter.letter) ? self.filter.letter : "All";
                    if (currentLetter) {
                        $('#startLetter a').each(function () {
                            var target = $(this);
                            if (target.text() === currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
                });
                $currentEl.append(createdInTag);

                return this;
            },

            showFilteredPage: function (filter, context) {
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                context.startTime = new Date();
                context.newCollection = false;

                if (Object.keys(filter).length === 0) {
                    this.filter = {};
                }
                this.defaultItemsNumber = 0;
                context.$el.find('.thumbnailwithavatar').remove();

                context.changeLocationHash(null, context.defaultItemsNumber, filter);
                context.collection.showMoreAlphabet({count: context.defaultItemsNumber, page: 1, filter: filter});
                context.getTotalLength(this.defaultItemsNumber, filter);
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find('.search-options').addClass('hidden');
                }
            },

            gotoEditForm: function (e) {
                this.$el.delegate('a', 'click', function (e) {
                    e.stopPropagation();
                    e.default;
                });
                var clas = $(e.target).parent().attr("class");
                if ((clas === "dropDown") || (clas === "inner")) {
                } else {
                    e.preventDefault();
                    var id = $(e.target).closest('.thumbnailwithavatar').attr("id");
                    var model = new CurrentModel({validate: false});
                    model.urlRoot = '/employee/form';
                    model.fetch({
                        data   : {id: id},
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
            },

            showMore: function (event) {
                event.preventDefault();
                this.collection.showMore({filter: this.filter, newCollection: this.newCollection});
            },

            //modified for filter Vasya
            showMoreContent: function (newModels) {
                var holder = this.$el;
                var content = holder.find("#thumbnailContent");
                var showMore = holder.find('#showMoreDiv');
                var created = holder.find('#timeRecivingDataFromServer');
                this.defaultItemsNumber += newModels.length;
                this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);

                if (showMore.length !== 0) {
                    showMore.before(this.template({collection: this.collection.toJSON()}));
                    $(".filter-check-list").eq(1).remove();

                    showMore.after(created);
                } else {
                    content.html(this.template({collection: this.collection.toJSON()}));

                }
                this.asyncLoadImgs(newModels);
                this.filterView.renderFilterContent();
            },

            showMoreAlphabet: function (newModels) {
                var holder = this.$el;
                var created = holder.find('#timeRecivingDataFromServer');
                var showMore = holder.find('#showMoreDiv');

                this.defaultItemsNumber += newModels.length;

                this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);

                holder.append(this.template({collection: newModels.toJSON()}));
                holder.append(created);
                created.before(showMore);

                this.asyncLoadImgs(newModels);
            },

            createItem: function () {
                new CreateView();
            },

            editItem: function () {
                //create editView in dialog here
                new EditView({collection: this.collection});
            },

            deleteItems: function () {
                var mid = this.mId;
                var model;
                var self = this;

                model = this.collection.get(this.$el.attr("id"));
                this.$el.fadeToggle(200, function () {
                    model.destroy({
                        headers: {
                            mid: mid
                        }
                    });
                    $(this).remove();
                });
                common.buildAphabeticArray(this.collection, function (arr) {
                    $("#startLetter").remove();
                    self.alphabeticArray = arr;
                    $("#searchContainer").after(_.template(AphabeticTemplate, {
                        alphabeticArray   : self.alphabeticArray,
                        selectedLetter    : (self.selectedLetter === "" ? "All" : self.selectedLetter),
                        allAlphabeticArray: self.allAlphabeticArray
                    }));
                    var currentLetter = (self.filter) ? self.filter.letter : null;
                    if (currentLetter) {
                        $('#startLetter a').each(function () {
                            var target = $(this);
                            if (target.text() === currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
                });

            },

            exportToCsv: function () {
                //todo change after routes refactoring
                window.location = '/employee/exportToCsv';
            },

            exportToXlsx: function () {
                //todo change after routes refactoring
                window.location = '/employee/exportToXlsx';
            }
        });

        return EmployeesThumbnalView;
    });