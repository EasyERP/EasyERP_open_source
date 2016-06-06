define([
    'Backbone',
    'jQuery',
    'Underscore',
    'common',
    'views/thumbnailsViewBase',
    'views/Persons/EditView',
    'views/Persons/CreateView',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'text!templates/Persons/thumbnails/ThumbnailsItemTemplate.html',
    'dataService',
    'views/Filter/FilterView',
    'constants'
], function (Backbone, $, _, common, BaseView, EditView, CreateView, AphabeticTemplate, ThumbnailsItemTemplate, dataService, FilterView, CONSTANTS) {
    'use strict';

    var PersonsThumbnalView = BaseView.extend({
        el                : '#content-holder',
        countPerPage      : 0,
        template          : _.template(ThumbnailsItemTemplate),
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        newCollection     : null,
        contentType       : 'Persons', // needs in view.prototype.changeLocationHash
        viewType          : 'thumbnails', // needs in view.prototype.changeLocationHash
        exportToXlsxUrl   : '/Customers/exportToXlsx/?type=Persons',
        exportToCsvUrl    : '/Customers/exportToCsv/?type=Persons',

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;


            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();

            this.asyncLoadImgs(this.collection);
            this.stages = [];

            BaseView.prototype.initialize.call(this, options);
        },

        events: {
            'click #showMore'          : 'showMore',
            'click .letter:not(.empty)': 'alpabeticalRender',
            'click .gotoForm'          : 'gotoForm',
            'click .company'           : 'gotoCompanyForm'
        },

        getTotalLength: function (currentNumber) {
            dataService.getData('/persons/totalCollectionLength', {
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

        asyncLoadImgs: function (collection) {
            var ids = _.map(collection.toJSON(), function (item) {
                return item._id;
            });
            common.getImages(ids, '/customers/getCustomersImages');
        },

        alpabeticalRender: function (e) {
            var selectedLetter;
            var target = $(e.target);

            if (e && e.target) {
                target = $(e.target);
                selectedLetter = $(e.target).text();

                if (!this.filter) {
                    this.filter = {};
                }
                this.filter.letter = {
                    key  : 'letter',
                    value: selectedLetter,
                    type : null
                };

                target.parent().find('.current').removeClass('current');
                target.addClass('current');
                if ($(e.target).text() === 'All') {
                    delete this.filter;
                    delete App.filter.letter;
                } else {
                    App.filter.letter = this.filter.letter;
                }
            }

            this.filter = App.filter;

            this.filterView.renderFilterContent(this.filter);
            _.debounce(
                function () {
                    this.trigger('filter', App.filter);
                }, 10);

            this.startTime = new Date();
            this.newCollection = false;
            this.$el.find('.thumbnailwithavatar').remove();

            this.defaultItemsNumber = 0;

            this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
            this.collection.showMoreAlphabet({count: this.defaultItemsNumber, page: 1, filter: this.filter});
            this.getTotalLength(this.defaultItemsNumber, this.filter);
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('a').data('id');

            e.preventDefault();
            App.ownContentType = true;
            window.location.hash = '#easyErp/Persons/form/' + id;
        },

        gotoCompanyForm: function (e) {
            var id = $(e.target).closest('a').data('id');

            e.preventDefault();
            window.location.hash = '#easyErp/Companies/form/' + id;
        },

        showFilteredPage: function (filter, context) {
            $('#top-bar-deleteBtn').hide();
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

        render: function () {
            var self = this;
            var createdInTag = '<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>';
            var $currentEl = this.$el;

            $currentEl.html('');

            if (this.collection.length > 0) {
                $currentEl.append(this.template({collection: this.collection.toJSON()}));
            } else {
                $currentEl.html('<h2>No persons found</h2>');
            }

            common.buildAphabeticArray(this.collection, function (arr) {
                var currentLetter;

                $('#startLetter').remove();
                self.alphabeticArray = arr;
                $('#searchContainer').after(_.template(AphabeticTemplate, {
                    alphabeticArray   : self.alphabeticArray,
                    allAlphabeticArray: self.allAlphabeticArray
                }));

                currentLetter = (self.filter && self.filter.letter) ? self.filter.letter.value : 'All';

                if (currentLetter) {
                    $('#startLetter a').each(function () {
                        var target = $(this);
                        if (target.text() === currentLetter) {
                            target.addClass('current');
                        }
                    });
                }
            });

            self.filterView = new FilterView({contentType: self.contentType});

            self.filterView.bind('filter', function (filter) {
                self.showFilteredPage(filter, self);
            });
            self.filterView.bind('defaultFilter', function () {
                self.showFilteredPage({}, self);
            });

            self.filterView.render();

            $(document).on('click', function (e) {
                self.hideItemsNumber(e);
            });

            $currentEl.append(createdInTag);
            return this;
        },

        hideItemsNumber: function (e) {
            var el = $(e.target);  // change after ui tests

            this.$el.find('.allNumberPerPage, .newSelectList').hide();
            if (!el.closest('.search-view')) {
                $('.search-content').removeClass('fa-caret-up');
                this.$el.find('.search-options').addClass('hidden');
            }
        },

        /* showMore       : function (event) {
         //event.preventDefault();
         this.collection.showMore({filter: this.filter, newCollection: this.newCollection});
         },
         showMoreContent: function (newModels) {
         var holder = this.$el;
         var content = holder.find("#thumbnailContent");
         var showMore = holder.find('#showMoreDiv');
         var created = holder.find('#timeRecivingDataFromServer');
         this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);
         this.getTotalLength(this.defaultItemsNumber, this.filter);

         if (showMore.length !== 0) {
         showMore.before(this.template({collection: this.collection.toJSON()}));
         $(".filter-check-list").eq(1).remove();
         showMore.hide();
         showMore.after(created);
         } else {
         content.html(this.template({collection: this.collection.toJSON()}));

         }
         this.asyncLoadImgs(newModels);

         this.filterView.renderFilterContent();
         },*/

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

            model = this.collection.get(this.$el.attr('id'));
            this.$el.fadeToggle(200, function () {
                model.destroy({
                    headers: {
                        mid: mid
                    }
                });
                $(this).remove();
            });
            common.buildAphabeticArray(this.collection, function (arr) {
                var currentLetter;

                $('#startLetter').remove();
                self.alphabeticArray = arr;
                $('#searchContainer').after(_.template(AphabeticTemplate, {
                    alphabeticArray   : self.alphabeticArray,
                    selectedLetter    : (self.selectedLetter === '' ? 'All' : self.selectedLetter),
                    allAlphabeticArray: self.allAlphabeticArray
                }));
                currentLetter = (self.filter && self.filter.letter) ? self.filter.letter.value : null;
                if (currentLetter) {
                    $('#startLetter a').each(function () {
                        var target = $(this);
                        if (target.text() === currentLetter) {
                            target.addClass('current');
                        }
                    });
                }
            });
        },

        exportToCsv: function () {
            var tempExportToCsvUrl = '';

            if (this.exportToCsvUrl) {
                tempExportToCsvUrl = this.exportToCsvUrl;
                if (this.filter) {
                    tempExportToCsvUrl += '&filter=' + encodeURIComponent(JSON.stringify(this.filter));
                }
                window.location = tempExportToCsvUrl;
            }
        },

        exportToXlsx: function () {
            var tempExportToXlsxUrl = '';

            if (this.exportToXlsxUrl) {
                tempExportToXlsxUrl = this.exportToXlsxUrl;
                if (this.filter) {
                    tempExportToXlsxUrl += '&filter=' + encodeURIComponent(JSON.stringify(this.filter));
                }
                window.location = tempExportToXlsxUrl;
            }
        }
    });

    return PersonsThumbnalView;
});
