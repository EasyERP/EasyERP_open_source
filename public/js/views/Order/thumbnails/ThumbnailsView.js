define([
        'common',
        'views/Persons/EditView',
        'views/Persons/CreateView',
        'text!templates/Alpabet/AphabeticTemplate.html',
        "text!templates/Persons/thumbnails/ThumbnailsItemTemplate.html",
        'dataService'
    ],

    function (common, editView, createView, AphabeticTemplate, ThumbnailsItemTemplate, dataService) {
        var PersonsThumbnalView = Backbone.View.extend({
            el                : '#content-holder',
            countPerPage      : 0,
            template          : _.template(ThumbnailsItemTemplate),
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            newCollection     : null,
            contentType       : 'Persons',//needs in view.prototype.changeLocationHash
            viewType          : 'thumbnails',//needs in view.prototype.changeLocationHash

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
            },

            events        : {
                "click #showMore"          : "showMore",
                "click .letter:not(.empty)": "alpabeticalRender",
                "click .gotoForm"          : "gotoForm",
                "click .company"           : "gotoCompanyForm"
            },
//modified for filter Vasya
            getTotalLength: function (currentNumber, filter, newCollection) {
                dataService.getData('/totalCollectionLength/Persons', {
                    currentNumber: currentNumber,
                    filter       : this.filter,
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

            asyncLoadImgs    : function (collection) {
                var ids = _.map(collection.toJSON(), function (item) {
                    return item._id;
                });
                common.getImages(ids, "/getCustomersImages");
            },
            //modified for filter Vasya
            alpabeticalRender: function (e) {
                this.$el.find('.thumbnailwithavatar').remove();
                this.startTime = new Date();
                this.newCollection = false;
                var target = $(e.target);
                target.parent().find(".current").removeClass("current");
                target.addClass("current");
                var selectedLetter = $(e.target).text();
                if ($(e.target).text() == "All") {
                    selectedLetter = "";
                }
                this.filter = (this.filter) ? this.filter : {};
                this.filter['letter'] = selectedLetter;
                this.defaultItemsNumber = 0;
                this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
                this.collection.showMoreAlphabet({count: this.defaultItemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(this.defaultItemsNumber, this.filter);
            },
            gotoForm         : function (e) {
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
            render         : function () {
                var self = this;
                var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>";
                var $currentEl = this.$el;

                $currentEl.html('');
                if (this.collection.length > 0) {
                    $currentEl.append(this.template({collection: this.collection.toJSON()}));
                } else {
                    $currentEl.html('<h2>No persons found</h2>');
                }

                common.buildAphabeticArray(this.collection, function (arr) {
                    $("#startLetter").remove();
                    self.alphabeticArray = arr;
                    $('#searchContainer').after(_.template(AphabeticTemplate, {
                        alphabeticArray   : self.alphabeticArray,
                        allAlphabeticArray: self.allAlphabeticArray
                    }));
                    var currentLetter = (self.filter && self.filter.letter) ? self.filter.letter : "All";
                    if (currentLetter) {
                        $('#startLetter a').each(function () {
                            var target = $(this);
                            if (target.text() == currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
                });
                $currentEl.append(createdInTag);
                return this;
            },

            showMore        : function (event) {
                event.preventDefault();
                this.collection.showMore({filter: this.filter, newCollection: this.newCollection});
            },
            //modified for filter Vasya
            showMoreContent : function (newModels) {
                var holder = this.$el;
                var content = holder.find("#thumbnailContent");
                var showMore = holder.find('#showMoreDiv');
                var created = holder.find('#timeRecivingDataFromServer');
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
                holder.append(this.template({collection: newModels.toJSON()}));
                //holder.prepend(alphaBet);
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
                new editView({collection: this.collection});
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