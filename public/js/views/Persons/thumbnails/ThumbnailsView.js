define([
        'common',
        'views/Persons/EditView',
        'views/Persons/CreateView',
        'text!templates/Alpabet/AphabeticTemplate.html',
        "text!templates/Persons/thumbnails/ThumbnailsItemTemplate.html",
        'dataService',
        'views/Filter/FilterView',
        'custom'
    ],

    function (common, editView, createView, AphabeticTemplate, ThumbnailsItemTemplate, dataService, filterView, custom) {
        var PersonsThumbnalView = Backbone.View.extend({
            el: '#content-holder',
            countPerPage: 0,
            template: _.template(ThumbnailsItemTemplate),
            defaultItemsNumber: null,
            listLength: null,
            filter: null,
            newCollection: null,
            contentType: 'Persons',//needs in view.prototype.changeLocationHash
            viewType: 'thumbnails',//needs in view.prototype.changeLocationHash

            initialize: function (options) {
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

                this.render();

                this.getTotalLength(this.defaultItemsNumber, this.filter);
                this.asyncLoadImgs(this.collection);

                this.filterView;
            },

            events: {
                "click #showMore": "showMore",
                "click .letter:not(.empty)": "alpabeticalRender",
                "click .gotoForm": "gotoForm",
                "click .company": "gotoCompanyForm"
            },
//modified for filter Vasya
            getTotalLength: function (currentNumber, filter, newCollection) {
                dataService.getData('/totalCollectionLength/Persons', { currentNumber: currentNumber, filter: this.filter, newCollection: this.newCollection }, function (response, context) {
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
                common.getImages(ids, "/getCustomersImages");
            },
            //modified for filter Vasya
            alpabeticalRender: function (e) {
                var selectedLetter;
                var target = $(e.target);

                this.$el.find('.thumbnailwithavatar').remove();
                this.startTime = new Date();
                this.newCollection = false;

                this.filter = this.filter ? this.filter : {};

                if (e && e.target) {
                    selectedLetter = target.text();
                    this.filter['letter'] = selectedLetter;

                    if (target.text() == "All") {
                        selectedLetter = "";
                        this.filter = {};
                    }
                    target.parent().find(".current").removeClass("current");
                    target.addClass("current");
                }

                //if (selectedLetter || selectedLetter === '') {
                //    delete this.filter['name'];
                //    this.filter['letter'] = selectedLetter;
                //}

                this.defaultItemsNumber = 0;

                this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
                this.collection.showMoreAlphabet({ count: this.defaultItemsNumber, page: 1, filter: this.filter });
                this.getTotalLength(this.defaultItemsNumber, this.filter);
            },

            gotoForm: function (e) {
                e.preventDefault();
                App.ownContentType = true;
                var id = $(e.target).closest("a").data("id");
                window.location.hash = "#easyErp/Persons/form/" + id;
            },

            gotoCompanyForm: function (e) {
                e.preventDefault();
                var id = $(e.target).closest("a").data("id");
                window.location.hash = "#easyErp/Companies/form/" + id;
            },

            showFilteredPage: function (filter, context, viewType) {
                var itemsNumber = $("#itemsNumber").text();

                var alphaBet = this.$el.find('#startLetter');
                var selectedLetter = $(alphaBet).find('.current').length ? $(alphaBet).find('.current')[0].text : '';

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                context.startTime = new Date();
                context.newCollection = false;

                //if (!filter.name) {
                //    if (selectedLetter !== '') {
                //        filter['letter'] = selectedLetter;
                //    }
                //}

                if (Object.keys(filter).length === 0){
                    this.filter = {};
                }

                context.$el.find('.thumbnailwithavatar').remove();

                context.changeLocationHash(null, context.defaultItemsNumber, filter, viewType);
                context.collection.showMoreAlphabet({ count: context.defaultItemsNumber, page: 1, filter: filter });
                context.getTotalLength(this.defaultItemsNumber, filter);
            },

            render: function () {
                var self = this;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
                var currentEl = this.$el;

                currentEl.html('');

                if (this.collection.length > 0) {
                    currentEl.append(this.template({ collection: this.collection.toJSON() }));
                } else {
                    currentEl.html('<h2>No persons found</h2>');
                }

                common.buildAphabeticArray(this.collection, function (arr) {
                    $("#startLetter").remove();
                    self.alphabeticArray = arr;
                    $("#searchContainer").after(_.template(AphabeticTemplate, {
                        alphabeticArray: self.alphabeticArray,
                        selectedLetter: (self.selectedLetter == "" ? "All" : self.selectedLetter),
                        allAlphabeticArray: self.allAlphabeticArray
                    }));
                    var currentLetter = (self.filter) ? self.filter.letter : null
                    if (currentLetter) {
                        $('#startLetter a').each(function () {
                            var target = $(this);
                            if (target.text() == currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
                });

                self.filterView = new filterView({ contentType: self.contentType });

                self.filterView.bind('filter', function (filter, viewType) {
                    self.showFilteredPage(filter, self, viewType)
                });
                self.filterView.bind('defaultFilter', function () {
                    self.showFilteredPage({}, self);
                });

                self.filterView.render();

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                currentEl.append(createdInTag);
                return this;
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
                //};
            },

            showMore: function (event) {
                //event.preventDefault();
                this.collection.showMore({ filter: this.filter, newCollection: this.newCollection });
            },
            //modified for filter Vasya
            showMoreContent: function (newModels) {
                var holder = this.$el;
                var content = holder.find("#thumbnailContent");
                var showMore = holder.find('#showMoreDiv');
                var created = holder.find('#timeRecivingDataFromServer');
                this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);

                if (showMore.length != 0) {
                    showMore.before(this.template({ collection: this.collection.toJSON() }));
                    $(".filter-check-list").eq(1).remove();

                    showMore.after(created);
                } else {
                    content.html(this.template({ collection: this.collection.toJSON() }));

                }
                this.asyncLoadImgs(newModels);

                this.filterView.renderFilterContent();
            },

            //modified for filter Vasya
            showMoreAlphabet: function (newModels) {
                var holder = this.$el;
                var alphaBet = holder.find('#startLetter');
                var created = holder.find('#timeRecivingDataFromServer');
                var showMore = holder.find('#showMoreDiv');
                var content = holder.find(".thumbnailwithavatar");
                this.defaultItemsNumber += newModels.length;
                this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);
                holder.append(this.template({ collection: newModels.toJSON() }));
                holder.append(created);
                created.before(showMore);
                this.asyncLoadImgs(newModels);
            },

            createItem: function () {
                //create editView in dialog here
                new createView();
            },

            editItem: function () {
                //create editView in dialog here
                new editView({ collection: this.collection });
            },

            deleteItems: function () {
                var mid = 39;
                var model;

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
                        alphabeticArray: self.alphabeticArray,
                        selectedLetter: (self.selectedLetter == "" ? "All" : self.selectedLetter),
                        allAlphabeticArray: self.allAlphabeticArray
                    }));
                    var currentLetter = (self.filter) ? self.filter.letter : null
                    if (currentLetter) {
                        $('#startLetter a').each(function () {
                            var target = $(this);
                            if (target.text() == currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
                });
            },

            exportToCsv: function () {
                //todo change after routes refactoring
                window.location = '/Customers/exportToCsv?type=Person'
            },

            exportToXlsx: function () {
                //todo change after routes refactoring
                window.location = '/Customers/exportToXlsx?type=Person'
            }
        });

        return PersonsThumbnalView;
    });