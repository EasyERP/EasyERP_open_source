define([
    'Backbone',
    'jQuery',
    'Underscore',
    'pagination'
], function (Backbone, $, _, Pagination) {
    'use strict';
    var View = Pagination.extend({
        el                : '#content-holder',
        countPerPage      : 0,
        newCollection     : true,
        filter            : null,
        defaultItemsNumber: null,
        viewType          : 'thumbnails', // needs in view.prototype.changeLocationHash

        events: {
            'click #showMore'            : 'showMore',
            'click .thumbnail'           : 'gotoEditForm',
            'click .dropDown'            : 'dropDown',
            'click .filterButton'        : 'showfilter',
            'click .newSelectList li'    : 'chooseOption',
            click                        : 'hide',
            'click .filter-check-list li': 'checkCheckbox'
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
        
        hide: function (e) {
            if (!$(e.target).closest('.filter-check-list').length) {
                $('.allNumberPerPage').hide();

                if ($('.filter-check-list').is(':visible')) {
                    $('.filter-check-list').hide();
                    this.showFilteredPage();
                }
            }
        },

        showFilteredPage: function (filter) {
            this.$el.find('.thumbnail').remove();
            this.startTime = new Date();
            this.newCollection = true;

            this.filter = filter;

            if (Object.keys(filter).length === 0) {
                this.filter = {};
            }

            this.changeLocationHash(null, this.defaultItemsNumber, filter);
            this.collection.showMore({count: this.defaultItemsNumber, page: 1, filter: filter});
        },

        hideItemsNumber: function (e) {
            var el = e.target;

            this.$el.find('.allNumberPerPage, .newSelectList').hide();

            if (!el.closest('.search-view')) {
                $('.search-content').removeClass('fa-caret-up');
                this.$el.find('.search-options').addClass('hidden');
            }
        },

        showMore: function (e) {
            e.preventDefault();

            this.collection.getNextPage({filter: this.filter, newCollection: this.newCollection});
        },

        showMoreContent: function (newModels) {
            var $holder = this.$el;
            var $showMore = $holder.find('#showMoreDiv');
            var $created = $holder.find('#timeRecivingDataFromServer');
            var $content = $holder.find('#thumbnailContent');
            

            this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
            this.getTotalLength(this.defaultItemsNumber, this.filter);

            if ($showMore.length !== 0) {
                $showMore.before(this.template({collection: this.collection.toJSON()}));

                $showMore.after($created);
            } else {
                $content.html(this.template({collection: this.collection.toJSON()}));
            }
            this.asyncLoadImgs(newModels);
            // this.filterView.renderFilterContent();
        },

        createItem: function () {
            var CreateView = this.CreateView || Backbone.View.extend({});

            return new CreateView();
        },

        editItem: function () {
            var EditView = this.EditView || Backbone.View.extend({});
            
            return new EditView({collection: this.collection});
        }
    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});
