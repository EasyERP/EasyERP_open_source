define([
        "text!templates/Product/thumbnails/ThumbnailsItemTemplate.html",
        'views/Product/EditView',
        'views/Product/CreateView',
        'dataService',
        'models/ProductModel',
        'views/Filter/FilterView',
        'common',
        'text!templates/Alpabet/AphabeticTemplate.html'
    ],

    function (thumbnailsItemTemplate, editView, createView, dataService, currentModel, filterView, common, AphabeticTemplate) {
        var ProductThumbnalView = Backbone.View.extend({
            el: '#content-holder',
            countPerPage: 0,
            template: _.template(thumbnailsItemTemplate),
            defaultItemsNumber: null,
            listLength: null,
            filter: null,
            newCollection: null,
            //page: null, //if reload page, and in url is valid page
            contentType: 'Product',//needs in view.prototype.changeLocationHash
            viewType: 'thumbnails',//needs in view.prototype.changeLocationHash

            initialize: function (options) {
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
                "click #showMore": "showMore",
                /*"click .thumbnailwithavatar": "gotoForm",*/
                "click .thumbnailwithavatar": "gotoEditForm",
                "click .letter:not(.empty)": "alpabeticalRender",
                "click .saveFilterButton": "saveFilter",
                "click .removeFilterButton": "removeFilter",
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find('.search-options').addClass('hidden');
                };
            },


            //modified for filter Vasya
            getTotalLength: function (currentNumber, filter, newCollection) {
                dataService.getData('/product/totalCollectionLength', {
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: newCollection
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
                common.getImages(ids, "/product/getProductsImages");
            },

            //modified for filter Vasya
            alpabeticalRender: function (e) {
                var selectedLetter;
                var target;

                this.filter = {};
                if (e && e.target) {
                    target = $(e.target);
                    selectedLetter = $(e.target).text();

                    this.filter['letter'] = selectedLetter;

                    target.parent().find(".current").removeClass("current");
                    target.addClass("current");
                    if ($(e.target).text() == "All") {
                        selectedLetter = "";
                        this.filter = {};
                    }
                };

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
                var currentEl = this.$el;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";

                currentEl.html('');
                common.buildAphabeticArray(this.collection, function (arr) {
                    $("#startLetter").remove();
                    self.alphabeticArray = arr;
                    $('#searchContainer').after(_.template(AphabeticTemplate, { alphabeticArray: self.alphabeticArray, selectedLetter: (self.selectedLetter == "" ? "All" : self.selectedLetter), allAlphabeticArray: self.allAlphabeticArray }));
                    var currentLetter = (self.filter) ? self.filter.letter : null;
                    if (currentLetter) {
                        $('#startLetter a').each(function () {
                            var target = $(this);
                            if (target.text() == currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
                });

                currentEl.append(this.template({collection: this.collection.toJSON()}));

                currentEl.append(createdInTag);

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                self.filterView = new filterView({ contentType: self.contentType });

                self.filterView.bind('filter', function (filter) {
                    self.showFilteredPage(filter)
                });
                self.filterView.bind('defaultFilter', function () {
                    self.showFilteredPage({});
                });

                self.filterView.render();

                return this;
            },

            showFilteredPage: function (filter) {
                var itemsNumber = $("#itemsNumber").text();

                var alphaBet = this.$el.find('#startLetter');
                var selectedLetter = $(alphaBet).find('.current').length ? $(alphaBet).find('.current')[0].text : '';

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.startTime = new Date();
                this.newCollection = false;

                if (Object.keys(filter).length === 0){
                    this.filter = {};
                }
                this.defaultItemsNumber = 0;
                this.$el.find('.thumbnailwithavatar').remove();

                this.changeLocationHash(null, this.defaultItemsNumber, filter);
                this.collection.showMoreAlphabet({ count: this.defaultItemsNumber, page: 1, filter: filter });
                this.getTotalLength(this.defaultItemsNumber, filter);
            },

            gotoForm: function (e) {
                e.preventDefault();
                App.ownContentType = true;
                var id = $(e.target).closest('.thumbnailwithavatar').attr("id");
                window.location.hash = "#easyErp/Product/form/" + id;
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
                    var model = new currentModel({validate: false});
                    model.urlRoot = '/Product/form/';
                    model.fetch({
                        data: {id: id},
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

            //modified for filter Vasya
            showMoreContent: function (newModels) {
                var holder = this.$el;
                var content = holder.find("#thumbnailContent");
                var showMore = holder.find('#showMoreDiv');
                var created = holder.find('#timeRecivingDataFromServer');
                this.defaultItemsNumber += newModels.length;
                this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);

                if (showMore.length != 0) {
                    showMore.before(this.template({collection: this.collection.toJSON()}));
                    $(".filter-check-list").eq(1).remove();

                    showMore.after(created);
                } else {
                    content.html(this.template({collection: this.collection.toJSON()}));

                }
                this.asyncLoadImgs(newModels);

                this.filterView.renderFilterContent();
            },
            //modified for filter Vasya
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
                new createView();
            },

            exportToCsv: function () {
                //todo change after routes refactoring
                window.location = '/Product/exportToCsv'
            },

            exportToXlsx: function () {
                //todo change after routes refactoring
                window.location = '/Product/exportToXlsx'
            }


        });

        return ProductThumbnalView;
    });