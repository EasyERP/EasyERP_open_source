define([
    "text!templates/Employees/thumbnails/ThumbnailsItemTemplate.html",
    'views/Employees/EditView',
    'views/Employees/CreateView',
        'views/Filter/FilterView',
    'dataService',
    'models/EmployeesModel',
    'common',
    'text!templates/Alpabet/AphabeticTemplate.html'
],

    function (thumbnailsItemTemplate, editView, createView, filterView, dataService, currentModel, common, AphabeticTemplate) {
        var EmployeesThumbnalView = Backbone.View.extend({
            el: '#content-holder',
            countPerPage: 0,
            template: _.template(thumbnailsItemTemplate),
            defaultItemsNumber: null,
            listLength: null,
            filter: null,
            newCollection: null,
            //page: null, //if reload page, and in url is valid page
            contentType: 'Employees',//needs in view.prototype.changeLocationHash
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
                this.page = options.collection.page;
                this.render();
                this.getTotalLength(this.defaultItemsNumber, this.filter);
                this.asyncLoadImgs(this.collection);
            },

            events: {
                "click #showMore": "showMore",
                "click .thumbnailwithavatar": "gotoEditForm",
                "click .letter:not(.empty)": "alpabeticalRender"
            },

            //modified for filter Vasya
            getTotalLength: function(currentNumber,filter, newCollection) {
                dataService.getData('/totalCollectionLength/Employees', { currentNumber: currentNumber, filter:this.filter, newCollection: this.newCollection }, function (response, context) {
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
                common.getImages(ids, "/getEmployeesImages");
            },

            //modified for filter Vasya
            alpabeticalRender: function (e) {
                var selectedLetter;
                var target;

                this.filter = {};
                if (e && e.target) {
                    target = $(e.target);
                    selectedLetter = $(e.target).text();
                    target.parent().find(".current").removeClass("current");
                    target.addClass("current");
                    if ($(e.target).text() == "All") {
                        selectedLetter = "";
                    }
                    this.filter['letter'] = selectedLetter;
                };

                this.startTime = new Date();
                this.newCollection = false;
                this.$el.find('.thumbnailwithavatar').remove();

                this.defaultItemsNumber = 0;
                this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
                this.collection.showMoreAlphabet({ count:this.defaultItemsNumber, filter: this.filter });
                this.getTotalLength(this.defaultItemsNumber, this.filter);
            },

            render: function () {
                var self = this;
                var currentEl = this.$el;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
                var FilterView;
                var showList;

                currentEl.html('');
                common.buildAphabeticArray(this.collection,function(arr){
                    $(".startLetter").remove();
                    self.alphabeticArray = arr;
                    self.$el.prepend(_.template(AphabeticTemplate, { alphabeticArray: self.alphabeticArray,selectedLetter: (self.selectedLetter==""?"All":self.selectedLetter),allAlphabeticArray:self.allAlphabeticArray}));
                var currentLetter = (self.filter) ? self.filter.letter : null;
                    if (currentLetter) {
                        $('#startLetter a').each(function() {
                            var target = $(this);
                            if (target.text() == currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
                });

                if (this.collection.length > 0) {
                    currentEl.append(this.template({ collection: this.collection.toJSON() }));
                } else {
                    currentEl.html('<h2>No Employees found</h2>');
                }
                currentEl.append(createdInTag);
                dataService.getData('/department/getForDD', null, function (departments) {
                    departments.data.forEach(function (department) {
                        department.name = department.departmentName;
                    });
                    dataService.getData('/employee/getFilterValues', null, function (values) {
                        FilterView = new filterView({ collection: departments.data, customCollection: values});
                        // Filter custom event listen ------begin
                        FilterView.bind('filter', function () {
                            showList = $('.drop-down-filter input:checkbox:checked').map(function() {return this.value;}).get();
                            self.showFilteredPage(null, showList)
                        });
                        FilterView.bind('defaultFilter', function () {
                            showList = _.pluck(departments.data, '_id');
                            self.showFilteredPage(null, showList)
                        });
                        // Filter custom event listen ------end
                    });
                });
                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });
                return this;
            },

            showFilteredPage: function (e, showList) {
                var itemsNumber = $("#itemsNumber").text();
                var self = this;
                var chosen = this.$el.find('.chosen');

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.filter ={};
                if (showList.length) this.filter['department'] = showList;
                if (chosen) {
                    chosen.each(function (index, elem) {
                        if (self.filter[elem.children[1].value]) {
                            self.filter[elem.children[1].value].push(elem.children[2].value);
                        } else {
                            self.filter[elem.children[1].value] = [];
                            self.filter[elem.children[1].value].push(elem.children[2].value);
                        }
                    });
                }

                this.startTime = new Date();
                this.newCollection = true;
                this.$el.find('.thumbnailwithavatar').remove();

                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({ count: itemsNumber, page: 1, filter: this.filter, newCollection:  this.newCollection });
                this.getTotalLength(itemsNumber, this.filter, this.newCollection);
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find(".filterOptions, .filterActions, .search-options, .drop-down-filter").hide();
                };
            },

            gotoEditForm: function (e) {
               this.$el.delegate('a', 'click', function(e){ e.stopPropagation(); e.default; });
                var clas = $(e.target).parent().attr("class");
                if ((clas === "dropDown") || (clas === "inner")) {
                } else {
                    e.preventDefault();
                    var id = $(e.target).closest('.thumbnailwithavatar').attr("id");
                    var model = new currentModel({validate: false});
                    model.urlRoot = '/Employees/form';
                    model.fetch({
                        data: {id: id},
                        success: function (model) {
                            new editView({ model: model });
                        },
                        error: function () { alert('Please refresh browser'); }
                    });
                }
            },

            showMore: function (event) {
                event.preventDefault();
                this.collection.showMore({ filter: this.filter, newCollection: this.newCollection });
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

        return EmployeesThumbnalView;
    });