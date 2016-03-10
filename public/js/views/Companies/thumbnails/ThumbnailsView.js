define([
        'Backbone',
        'jQuery',
        'Underscore',
        'common',
        'views/Companies/EditView',
        'views/Companies/CreateView',
        'views/Notes/AttachView',
        'text!templates/Alpabet/AphabeticTemplate.html',
        "text!templates/Companies/thumbnails/ThumbnailsItemTemplate.html",
        'dataService',
        'views/Filter/FilterView',
        'constants'
    ],

    function (Backbone, $, _, common, EditView, CreateView, AttachView, AphabeticTemplate, ThumbnailsItemTemplate, dataService, FilterView, CONSTANTS) {
        'use strict';
        var CompaniesThumbnalView = Backbone.View.extend({
            el                : '#content-holder',
            countPerPage      : 0,
            template          : _.template(ThumbnailsItemTemplate),
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            newCollection     : null,
            page              : null,
            contentType       : 'Companies',
            viewType          : 'thumbnails',

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
                "click #showMore"          : "showMore",
                "click .letter:not(.empty)": "alpabeticalRender",
                "click .gotoForm"          : "gotoForm",
                "click .saveFilterButton"  : "saveFilter",
                "click .removeFilterButton": "removeFilter"
            },

            importFiles: function () {
                new AttachView({
                    modelName: this.contentType,
                    import   : true
                });
            },

            asyncLoadImgs: function (collection) {
                var ids = _.map(collection.toJSON(), function (item) {
                    return item._id;
                });
                common.getImages(ids, "/customers/getCustomersImages");
            },

            getTotalLength: function (currentNumber) {
                dataService.getData('/customers/totalCollectionLength', {
                    currentNumber: currentNumber,
                    filter       : this.filter,
                    newCollection: this.newCollection,
                    contentType  : this.contentType
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

            alpabeticalRender: function (e) {
                var selectedLetter;
                var target;

                this.$el.find('.thumbnailwithavatar').remove();
                this.startTime = new Date();
                this.newCollection = false;

                this.filter = {};

                if (e && e.target) {
                    target = $(e.target);
                    selectedLetter = $(e.target).text();

                    target.parent().find(".current").removeClass("current");
                    target.addClass("current");
                    if ($(e.target).text() === "All") {
                        selectedLetter = "";
                        this.filter = {};
                    }

                    this.filter.letter = selectedLetter;
                }

                this.defaultItemsNumber = 0;

                this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
                this.collection.showMoreAlphabet({count: this.defaultItemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(this.defaultItemsNumber, this.filter);
            },

            gotoForm: function (e) {
                e.preventDefault();
                App.ownContentType = true;
                var id = $(e.target).closest("a").data("id");
                window.location.hash = "#easyErp/Companies/form/" + id;
            },

            render: function () {
                var self = this;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
                var $currentEl = this.$el;

                $currentEl.html('');

                if (this.collection.length > 0) {
                    $currentEl.append(this.template({collection: this.collection.toJSON()}));
                } else {
                    $currentEl.html('<h2>No companies found</h2>');
                }
                common.buildAphabeticArray(this.collection, function (arr) {
                    $("#startLetter").remove();
                    self.alphabeticArray = arr;
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

                context.$el.find('.thumbnailwithavatar').remove();

                context.changeLocationHash(null, context.defaultItemsNumber, filter);
                context.collection.showMoreAlphabet({count: context.defaultItemsNumber, page: 1, filter: filter});
                context.getTotalLength(this.defaultItemsNumber, filter);
            },

            hideItemsNumber: function (e) {
                var el = this.$(e.target);  // changed after ui test

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find('.search-options').addClass('hidden');
                }
            },

            showMore: function (event) {
                event.preventDefault();
                this.collection.showMore({filter: this.filter, newCollection: this.newCollection});
            },

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
                window.location = '/Customers/exportToCsv?type=Company';
            },

            exportToXlsx: function () {
                //todo change after routes refactoring
                window.location = '/Customers/exportToXlsx?type=Company';
            }
        });
        return CompaniesThumbnalView;
    });