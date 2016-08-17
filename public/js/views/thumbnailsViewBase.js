define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/pagination',
    'helpers'
], function (Backbone, $, _, Pagination, helpers) {
    'use strict';
    var View = Pagination.extend({
        viewType: 'thumbnails', // needs in view.prototype.changeLocationHash

        events: {
            'click #showMore'            : 'showMore',
            'click .thumbnailElement'    : 'gotoEditForm',
            'click .dropDown'            : 'dropDown',
            'click .filterButton'        : 'showfilter',
            'click .filter-check-list li': 'checkCheckbox'
        },

        initialize: function (options) {
            $(document).off('click');
            this.startTime = options.startTime;
            this.collection = options.collection || Backbone.Collection.extend();
            this.responseObj = {};
            this.filter = options.filter;

            options.contentType = this.contentType;
            this.makeRender(options);

            this.makeFilterString = function (filter, contentType) {
                var filterString;

                if (filter && contentType) {
                    filterString = '/?type=' + contentType + '&filter=' + encodeURIComponent(JSON.stringify(filter));
                }

                if (filter && !contentType) {
                    filterString = '/?filter=' + encodeURIComponent(JSON.stringify(filter));
                }

                if (!filter && contentType) {
                    filterString = '/?type=' + contentType;
                }

                return filterString;
            };

            this.render();
        },

        exportToCsv: function () {
            var tempExportToCsvUrl = '';
            var hasSlash;

            if (this.exportToCsvUrl) {
                tempExportToCsvUrl = this.exportToCsvUrl;

                tempExportToCsvUrl += helpers.makeFilterString(this.filter, this.type);

                window.location = tempExportToCsvUrl;
            } else {
                if (this.collection) {
                    hasSlash = this.collection.url.substr(-1) === '/';

                    if (hasSlash) {
                        window.location = this.collection.url + 'exportToCsv' + helpers.makeFilterString(this.filter, this.type);
                    } else {
                        window.location = this.collection.url + '/exportToCsv' + helpers.makeFilterString(this.filter, this.type);
                    }
                }
            }
        },

        exportToXlsx: function () {
            var tempExportToXlsxUrl = '';
            var hasSlash;

            if (this.exportToXlsxUrl) {
                tempExportToXlsxUrl = this.exportToXlsxUrl;

                tempExportToXlsxUrl += helpers.makeFilterString(this.filter, this.type);

                window.location = tempExportToXlsxUrl;
            } else {
                if (this.collection) {
                    hasSlash = this.collection.url.substr(-1) === '/';

                    if (hasSlash) {
                        window.location = this.collection.url + 'exportToXlsx' + helpers.makeFilterString(this.filter, this.type);
                    } else {
                        window.location = this.collection.url + '/exportToXlsx' + helpers.makeFilterString(this.filter, this.type);
                    }
                }
            }
        },

        dropDown: function (e) {
            e.stopPropagation();
        },

        checkCheckbox: function (e) {
            var target$ = $(e.target);

            if (!target$.is('input')) {
                target$.closest('li').find('input').prop('checked', !target$.closest('li').find('input').prop('checked'));
            }
        },

        showfilter: function (e) {
            $('.filter-check-list').toggle();

            return false;
        },

        /*  hideItemsNumber: function (e) {
         var el = e.target;

         this.$el.find('.allNumberPerPage, .newSelectList').hide();

         if (!el.closest('.search-view')) {
         $('.search-content').removeClass('fa-caret-up');
         this.$el.find('.search-options').addClass('hidden');
         }
         },*/

        showMore: function (e) {
            e.preventDefault();

            this.startTime = new Date();

            this.collection.getNextPage({filter: this.filter, viewType: this.viewType, contentType: this.contentType});
        },

        // trigger by collection
        showMoreContent: function (newModels) {
            var $holder = this.$el;
            // var $showMore = $holder.find('#showMoreDiv');
            var $created = $holder.find('#timeRecivingDataFromServer');
            var $content = $holder.find('#thumbnailContent');
            var currentPage = this.collection.currentPage;
            var totalPages = this.collection.totalPages;
            var showMore = currentPage <= totalPages && totalPages !== 1;

            var createdInTag = '<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + 'ms </div>';

            if (showMore) {
                $content.find('h2').remove();
                $content.append(this.template({collection: this.collection.toJSON()}));
            } else {
                $content.html(this.template({collection: this.collection.toJSON()}));
            }

            $created.replaceWith(createdInTag);
            this.asyncLoadImgs(newModels);

            if (this.contentType === 'Products') {
                this.$el.find('.product').draggable({
                    revert: true
                });
            }
        },

        setPagination: function () {
            var $thisEl = this.$el;
            var $showMore = $thisEl.find('#showMoreDiv');
            var $created = $thisEl.find('#timeRecivingDataFromServer');
            var collection = this.collection;
            var showMore = collection.currentPage < collection.totalPages;

            if (showMore) {
                if ($showMore.length === 0) {
                    $created.before('<div id="showMoreDiv"><input type="button" id="showMore" value="Show More"/></div>');
                }
            } else {
                $showMore.remove();
            }

            this.changeLocationHash(null, this.collection.pageSize, this.filter);
        }
    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});
