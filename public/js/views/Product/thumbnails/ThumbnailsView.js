define([
        "text!templates/Product/thumbnails/ThumbnailsItemTemplate.html",
        'views/Product/EditView',
        'views/Product/CreateView',
        'dataService',
        'models/ProductModel',
        'models/UsersModel',
        'views/Filter/FilterView',
        'common',
        'text!templates/Alpabet/AphabeticTemplate.html'
    ],

    function (thumbnailsItemTemplate, editView, createView, dataService, currentModel, usersModel, filterView, common, AphabeticTemplate) {
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
                this.defaultItemsNumber = this.collection.namberToShow || 50;
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
                "click .clearFilterButton": "clearFilter"
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
                var target;
                var selectedLetter;
                var self = this;
                var chosen = this.$el.find('.chosen');
                var checkedElements = $('.drop-down-filter input:checkbox:checked');
                var showList;

                this.$el.find('.thumbnailwithavatar').remove();
                this.startTime = new Date();
                this.newCollection = false;
                this.filter =  {};

                if (e && e.target) {
                    target = $(e.target);
                    target.parent().find(".current").removeClass("current");
                    target.addClass("current");
                    selectedLetter = $(e.target).text();

                    if (target.text() == "All") {
                        selectedLetter = "";
                    }
                    this.filter['letter'] = selectedLetter;
                }

                if (chosen) {
                    chosen.each(function (index, elem) {
                        if (elem.children[2].attributes.class.nodeValue === 'chooseDate') {
                            if (self.filter[elem.children[1].value]) {
                                self.filter[elem.children[1].value].push({start: $('#start').val(), end: $('#end').val()});

                            } else {
                                self.filter[elem.children[1].value] = [];
                                self.filter[elem.children[1].value].push({start: $('#start').val(), end: $('#end').val()});
                            }
                        } else {
                            if (self.filter[elem.children[1].value]) {
                                self.filter[elem.children[1].value].push(elem.children[2].value);
                            } else {
                                self.filter[elem.children[1].value] = [];
                                self.filter[elem.children[1].value].push(elem.children[2].value);
                            }
                        }

                    });
                }

                if (checkedElements.length && checkedElements.attr('id') === 'defaultFilter') {
                    self.filter = {};
                }
                this.filter['canBePurchased'] = true;
                this.defaultItemsNumber = 0;

                if (!chosen.length && !showList) {
                    self.filter = 'empty';
                }

                this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
                this.collection.showMoreAlphabet({count: this.defaultItemsNumber, filter: this.filter});
                this.getTotalLength(this.defaultItemsNumber, this.filter);

                if (checkedElements.attr('id') === 'defaultFilter'){
                    $(".saveFilterButton").hide();
                    $(".clearFilterButton").hide();
                    $(".removeFilterButton").show();
                } else {
                    $(".saveFilterButton").show();
                    $(".clearFilterButton").show();
                    $(".removeFilterButton").show();
                }
            },

            saveFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
                var key;
                var filterObj = {};
                var mid = 39;

                key = subMenu.trim();

                filterObj['filter'] = {};
                filterObj['filter'] = this.filter;
                filterObj['key'] = key;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        patch:true,
                        validate: false,
                        success: function (model) {
                            console.log('Filter was saved to db');
                        },
                        error: function (model,xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );

                App.currentUser.savedFilters['Product'] = filterObj.filter;

                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');
                this.$el.find('.chooseOption').children().remove();

                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });

                $(".saveFilterButton").hide();
                $(".removeFilterButton").show();
                $(".clearFilterButton").show();

            },

            removeFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
                var key;
                var filterObj = {};
                var mid = 39;

                this.clearFilter();

                key = subMenu.trim();
                filterObj['key'] = key;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        patch:true,
                        validate: false,
                        success: function (model) {
                            console.log('Filter was remover from db');
                        },
                        error: function (model,xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );

                delete App.currentUser.savedFilters['Product'];

                $(".saveFilterButton").hide();
                $(".removeFilterButton").hide();
                $(".clearFilterButton").hide();
            },

            clearFilter: function () {
                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');
                this.$el.find('.chooseOption').children().remove();

                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });

                this.alpabeticalRender(null);

                $(".clearFilterButton").hide();
                $(".removeFilterButton").show();
                $(".saveFilterButton").hide();
            },

            render: function () {
                var self = this;
                var currentEl = this.$el;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
                var FilterView;

                currentEl.html('');
                common.buildAphabeticArray(this.collection, function (arr) {
                    $(".startLetter").remove();
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

                if (this.collection.length > 0) {
                    currentEl.append(this.template({collection: this.collection.toJSON()}));
                } else {
                    currentEl.html('<h2>No Products found</h2>');
                }
                currentEl.append(createdInTag);

                currentEl.prepend('<div class="filtersActive"><button id="saveFilterButton" class="saveFilterButton">Save Filter</button>' +
                    '<button id="clearFilterButton" class="clearFilterButton">Clear Filter</button>' +
                    '<button id="removeFilterButton" class="removeFilterButton">Remove Filter</button></div>'
                );

                $("#clearFilterButton").hide();
                $("#saveFilterButton").hide();
                $("#removeFilterButton").hide();

                if (App.currentUser.savedFilters && App.currentUser.savedFilters['Product']) {
                    $("#clearFilterButton").show();
                    $("#removeFilterButton").show();
                }

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });
                dataService.getData('/product/getFilterValues', null, function (values) {
                    FilterView = new filterView({ collection: [], customCollection: values});
                    // Filter custom event listen ------begin
                    FilterView.bind('filter', function () {
                        self.alpabeticalRender()
                    });
                    FilterView.bind('defaultFilter', function () {
                        self.alpabeticalRender()
                    });
                    // Filter custom event listen ------end
                });

                return this;
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find(".filterOptions, .filterActions, .search-options, .drop-down-filter").hide();
                };
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
                this.changeLocationHash(null, (this.defaultItemsNumber < 50) ? 50 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);

                if (showMore.length != 0) {
                    showMore.before(this.template({collection: this.collection.toJSON()}));
                    $(".filter-check-list").eq(1).remove();

                    showMore.after(created);
                } else {
                    content.html(this.template({collection: this.collection.toJSON()}));

                }
                this.asyncLoadImgs(newModels);
            },
            //modified for filter Vasya
            showMoreAlphabet: function (newModels) {

                var holder = this.$el;
                var alphaBet = holder.find('#startLetter');
                var created = holder.find('#timeRecivingDataFromServer');
                var showMore = holder.find('#showMoreDiv');
                var content = holder.find(".thumbnailwithavatar");
                this.defaultItemsNumber += newModels.length;
                this.changeLocationHash(null, (this.defaultItemsNumber < 50) ? 50 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);
                holder.append(this.template({collection: newModels.toJSON()}));
                holder.prepend(alphaBet);
                holder.append(created);
                created.before(showMore);
                this.asyncLoadImgs(newModels);
            },

            createItem: function () {
                //create editView in dialog here
                new createView();
            }
        });

        return ProductThumbnalView;
    });