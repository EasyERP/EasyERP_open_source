define([
    'Backbone',
    'jQuery',
    'Underscore',
    'common',
    'views/thumbnailsViewBase',
    'views/Companies/EditView',
    'views/Companies/CreateView',
    'views/Notes/AttachView',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'text!templates/Companies/thumbnails/ThumbnailsItemTemplate.html',
    'dataService',
    'views/Filter/filterView',
    'constants'
], function (Backbone,
             $,
             _,
             common,
             BaseView,
             EditView,
             CreateView,
             AttachView,
             AphabeticTemplate,
             ThumbnailsItemTemplate,
             dataService,
             FilterView,
             CONSTANTS) {
    'use strict';
    var CompaniesThumbnalView = BaseView.extend({
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
        exportToXlsxUrl   : '/Customers/exportToXlsx/?type=Companies',
        exportToCsvUrl    : '/Customers/exportToCsv/?type=Companies',

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
            'click .letter:not(.empty)': 'alpabeticalRender'
        },

        importFiles: function () {
            return new AttachView({
                modelName: this.contentType,
                import   : true
            });
        },

        asyncLoadImgs: function (collection) {
            var ids = _.map(collection.toJSON(), function (item) {
                return item._id;
            });
            common.getImages(ids, '/customers/getCustomersImages');
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('a').data('id');

            e.preventDefault();
            App.ownContentType = true;
            window.location.hash = '#easyErp/Companies/form/' + id;
        },

        render: function () {
            var self = this;
            var createdInTag = '<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>';
            var $currentEl = this.$el;

            $currentEl.html('');

            if (this.collection.length > 0) {
                $currentEl.append(this.template({collection: this.collection.toJSON()}));
            } else {
                $currentEl.html('<h2>No companies found</h2>');
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
            $currentEl.append(createdInTag);

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
            return this;
        },

        hideItemsNumber: function (e) {
            var el = this.$(e.target);  // changed after ui test

            this.$el.find('.allNumberPerPage, .newSelectList').hide();
            if (!el.closest('.search-view')) {
                $('.search-content').removeClass('fa-caret-up');
                this.$el.find('.search-options').addClass('hidden');
            }
        },

        showMoreAlphabet: function (newModels) {
            var $holder = this.$el;
            var $created = $holder.find('#timeRecivingDataFromServer');
            var $showMore = $holder.find('#showMoreDiv');

            this.defaultItemsNumber += newModels.length;
            this.changeLocationHash(null, (this.defaultItemsNumber < 100) ? 100 : this.defaultItemsNumber, this.filter);

            $holder.append(this.template({collection: newModels.toJSON()}));
            $holder.append($created);
            $created.before($showMore);
            this.asyncLoadImgs(newModels);
        },

        /* createItem: function () {
         new CreateView();
         },

         editItem: function () {
         new EditView({collection: this.collection});
         },*/

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
                currentLetter = (self.filter) ? self.filter.letter.value : null;
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

    return CompaniesThumbnalView;
});
