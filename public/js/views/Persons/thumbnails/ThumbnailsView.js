define([
        'common',
        'views/Persons/EditView',
        'views/Persons/CreateView',
        'text!templates/Alpabet/AphabeticTemplate.html',
        "text!templates/Persons/thumbnails/ThumbnailsItemTemplate.html",
        'dataService',
        'views/Filter/FilterView',
        'models/UsersModel'
    ],

    function (common, editView, createView, AphabeticTemplate, ThumbnailsItemTemplate, dataService, filterView, usersModel) {
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
                this.defaultItemsNumber = this.collection.namberToShow || 50;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;

                this.render();

                this.getTotalLength(this.defaultItemsNumber, this.filter);
                this.asyncLoadImgs(this.collection);
            },

            events: {
                "click #showMore": "showMore",
                "click .letter:not(.empty)": "alpabeticalRender",
                "click .gotoForm": "gotoForm",
                "click .company": "gotoCompanyForm",
                "click .saveFilterButton": "saveFilter",
                "click .removeFilterButton": "removeFilter",
                "click .clearFilterButton": "clearFilter"
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
            alpabeticalRender: function (e, showList) {
                var selectedLetter;
                var target;
                var checkedElements = $('.drop-down-filter input:checkbox:checked');
                var chosen = this.$el.find('.chosen');
                var self = this;

                this.$el.find('.thumbnailwithavatar').remove();
                this.startTime = new Date();
                this.newCollection = false;
                this.filter = {};

                if (e && e.target) {
                    selectedLetter = $(e.target).text();
                    target = $(e.target);
                    if ($(e.target).text() == "All") {
                        selectedLetter = "";
                    }
                    target.parent().find(".current").removeClass("current");
                    target.addClass("current");
                }


                if (chosen) {
                    chosen.each(function (index, elem) {
                        if (self.filter[elem.children[1].value]) {
                            $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                self.filter[elem.children[1].value].push($(element).next().text());
                            })
                        } else {
                            self.filter[elem.children[1].value] = [];
                            $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                self.filter[elem.children[1].value].push($(element).next().text());
                            })
                        }
                    });
                };

                if (showList) {
                    if (showList.indexOf('isCustomer') !== -1) {
                        this.filter['isCustomer'] = 1;
                    }else if (showList.indexOf('isSupplier') !== -1) {
                        this.filter['isSupplier'] = 1;
                    } else {
                        delete this.filter['isSupplier'];
                        delete this.filter['isCustomer'];
                    }
                    if (this.filter['isSupplier'] && this.filter['isCustomer']) {
                        delete this.filter['isSupplier'];
                        delete this.filter['isCustomer'];
                    }
                }

                if (selectedLetter || selectedLetter === '') this.filter['letter'] = selectedLetter;

                if ((checkedElements.length && checkedElements.attr('id') === 'defaultFilter') || (!chosen.length && !showList)) {
                    self.filter = 'empty';
                };

                this.defaultItemsNumber = 0;

                this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
                this.collection.showMoreAlphabet({ count: this.defaultItemsNumber, page: 1, filter: this.filter });
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
                if (!App.currentUser.savedFilters){
                    App.currentUser.savedFilters = {};
                }
                App.currentUser.savedFilters['Persons'] = filterObj.filter;

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

                delete App.currentUser.savedFilters['Persons'];

                $(".saveFilterButton").hide();
                $(".removeFilterButton").hide();
                $(".clearFilterButton").hide();
            },

            clearFilter: function () {
                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');
                this.$el.find('.chooseOption').children().remove();
                this.$el.find('.filterOptions').removeClass('chosen');

                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });

                this.alpabeticalRender(null);

                $(".clearFilterButton").hide();
                $(".removeFilterButton").show();
                $(".saveFilterButton").hide();
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

            render: function () {
                var self = this;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
                var currentEl = this.$el;
                var filterObject;
                var FilterView;
                var showList;

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

                currentEl.prepend('<div class="filtersActive"><button id="saveFilterButton" class="saveFilterButton">Save Filter</button>' +
                    '<button id="clearFilterButton" class="clearFilterButton">Clear Filter</button>' +
                    '<button id="removeFilterButton" class="removeFilterButton">Remove Filter</button></div>'
                );

                $("#clearFilterButton").hide();
                $("#saveFilterButton").hide();
                $("#removeFilterButton").hide();

                if (App.currentUser.savedFilters && App.currentUser.savedFilters['Persons']) {
                    $("#clearFilterButton").show();
                    $("#removeFilterButton").show();
                }

                filterObject = [
                    {
                        name: 'isCustomer',
                        _id: 'isCustomer'
                    },
                    {
                        name: 'isSupplier',
                        _id: 'isSupplier'
                    }
                ];
                dataService.getData('/supplier/getFilterValues', null, function (values) {
                    FilterView = new filterView({ collection: filterObject, customCollection: values});
                    // Filter custom event listen ------begin
                    FilterView.unbind();
                    FilterView.bind('filter', function () {
                        showList = $('.drop-down-filter input:checkbox:checked').map(function() {return this.value;}).get();
                        self.alpabeticalRender(null, showList)
                    });
                    FilterView.bind('defaultFilter', function () {
                        showList = [];
                        self.alpabeticalRender(null, showList);
                        $(".saveFilterButton").hide();
                        $(".clearFilterButton").hide();
                        $(".removeFilterButton").show();
                    });
                    // Filter custom event listen ------end

                });
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
                    this.$el.find(".filterOptions, .filterActions, .search-options, .drop-down-filter").hide();
                };
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
                this.changeLocationHash(null, (this.defaultItemsNumber < 50) ? 50 : this.defaultItemsNumber, this.filter);
                this.getTotalLength(this.defaultItemsNumber, this.filter);

                if (showMore.length != 0) {
                    showMore.before(this.template({ collection: this.collection.toJSON() }));
                    $(".filter-check-list").eq(1).remove();

                    showMore.after(created);
                } else {
                    content.html(this.template({ collection: this.collection.toJSON() }));

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
                holder.append(this.template({ collection: newModels.toJSON() }));
                holder.prepend(alphaBet);
                holder.append(created);
                created.before(showMore);
                this.asyncLoadImgs(newModels);
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
            }
        });

        return PersonsThumbnalView;
    });