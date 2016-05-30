define([
    'Backbone',
    'jQuery',
    'Underscore',
    'dataService',
    'common',
    'populate'
], function (Backbone, $, _, dataService, common, populate) {
    'use strict';
    var ProjectThumbnalView = Backbone.View.extend({
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
            
            this.collection.showMore({filter: this.filter, newCollection: this.newCollection});
        },

        showMoreContent: function (newModels) {
            var holder = this.$el;
            var showMore = holder.find('#showMoreDiv');
            var created = holder.find('#timeRecivingDataFromServer');
            var content = holder.find('#thumbnailContent');

            if (this.newCollection) {
                this.defaultItemsNumber = 100;
                this.newCollection = false;
            } else {
                this.defaultItemsNumber += newModels.length;

                if (this.defaultItemsNumber < 100) {
                    this.defaultItemsNumber = 100;
                }
            }

            this.changeLocationHash(null, this.defaultItemsNumber, this.filter);
            this.getTotalLength(this.defaultItemsNumber, this.filter);

            if (showMore.length != 0) {
                showMore.before(this.template({collection: this.collection.toJSON()}));

                showMore.after(created);
            } else {
                content.html(this.template({collection: this.collection.toJSON()}));
            }
            this.asyncLoadImgs(newModels);
            // this.filterView.renderFilterContent();
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

    return ProjectThumbnalView;
});
