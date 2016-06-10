define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/pagination'
], function (Backbone, $, _, Pagination) {
    'use strict';
    var View = Pagination.extend({
        viewType: 'thumbnails', // needs in view.prototype.changeLocationHash

        events: {
            'click #showMore'            : 'showMore',
            'click .thumbnail'           : 'gotoEditForm',
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

            this.render();
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

            this.collection.getNextPage({filter: this.filter, viewType: this.viewType, contentType: this.contentType});
        },

        // trigger by collection
        showMoreContent: function (newModels) {
            var $holder = this.$el;
            var $showMore = $holder.find('#showMoreDiv');
            var $created = $holder.find('#timeRecivingDataFromServer');
            var $content = $holder.find('#thumbnailContent');

            if ($showMore.length !== 0) {
                $showMore.before(this.template({collection: this.collection.toJSON()}));

                $showMore.after($created);
            } else {
                $content.html(this.template({collection: this.collection.toJSON()}));
            }
            this.asyncLoadImgs(newModels);
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
                } else {
                    $showMore.show();
                }
            } else {
                $showMore.hide();
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
