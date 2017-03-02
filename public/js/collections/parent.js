define([
    'Backbone',
    'Underscore',
    'constants'
], function (Backbone, _, CONSTANTS) {
    /**
     * Drop-in replacement for Backbone.Collection. Encapsulate main pagination logic
     * @see {@link http://backbonejs.org/#Collection|Backbone.Collection }
     * @constructor ParrentCollection
     * @extends Backbone.Collection
     *
     * @property {number} firstPage The first page index. You should only override this value
     * during extension, initialization or reset by the server after
     * fetching. This value should be read only at other times.
     *
     * @property {number} lastPage The last page index. This value
     * is __read only__ and it's calculated during bootstrapping,
     * fetching and resetting. Please don't change this
     * value under any circumstances.
     *
     * @property {number} currentPage The current page index. You
     * should only override this value during extension, initialization or reset
     * by the server after fetching. This value should be read only at other
     * times. If left as default, it will be set to `firstPage`
     * on initialization.
     *
     * @property {number} totalPages How many pages there are. This
     * value is __read only__ and it is calculated from `totalRecords`.
     *
     * @property {number} pageSize How many records to show per
     * page. This value is __read only__ after initialization, if you want to
     * change the page size after initialization, you must call #setPageSize
     *
     * @property {number} totalRecords How many records stored in DB.
     * This value is __read only__.
     */

    var Collection = Backbone.Collection.extend({
        firstPage   : 1,
        lastPage    : null,
        currentPage : null,
        totalPages  : null,
        totalRecords: null,
        pageSize    : CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        offset: function () {
            return this.currentPage * this.pageSize;
        },

        dataComposer: function (page, options) {
            var self = this;
            var data;
            var _opts = {};
            var wait;
            var reset;
            var isNew;
            var showMore;
            var success;
            var remove;
            var error;
            var merge;
            var add;

            page = page || this.currentPage;
            page = parseInt(page, 10);

            if (!page || isNaN(page)) {
                page = this.currentPage = 1;
            }

            options = options || {wait: true, reset: true};

            wait = !!options.wait;
            reset = !!options.reset;
            isNew = !!options.newCollection;

            if (!options.hasOwnProperty('showMore')) {
                showMore = true;
            } else {
                showMore = !!options.showMore;
            }
            if (!options.hasOwnProperty('remove')) {
                remove = true;
            } else {
                remove = !!options.remove;
            }
            if (!options.hasOwnProperty('add')) {
                add = true;
            } else {
                add = !!options.add;
            }
            if (!options.hasOwnProperty('merge')) {
                merge = true;
            } else {
                merge = !!options.merge;
            }

            if (isNew || !options.data) {
                _opts.data = _.extend({}, options);
            } else {
                _opts.data = _.extend({}, options.data);
                wait = !!_opts.data.wait;
                reset = !!_opts.data.reset;
            }

            data = _opts.data;
            data.page = page;
            data.count = data.count || self.pageSize;
            data.filter = data.filter || {};

            _opts.reset = reset;
            _opts.wait = wait;
            _opts.remove = remove;

            delete data.wait;
            delete data.reset;
            delete data.remove;
            delete data.add;
            delete data.merge;
            delete data.showMore;

            if (!data.contentType) {
                delete data.contentType;
            }

            if (data.viewType === 'tform') {
                data.viewType = 'list';
            }

            if (!data.parrentContentId) {
                delete data.parrentContentId;
            }

            self.pageSize = data.count;
            self.currentPage = data.page;

            success = options.success;
            error = options.error;

            _opts.success = function (models, xhr) {
                if (success) {
                    success.call(success.context, models, xhr);
                }
                if (showMore) {
                    self.trigger('showmore', models);
                }

                self.trigger('resetEditCollection');
            };

            _opts.error = function (models, xhr) {
                self.trigger('errorPagination', xhr);

                if (error) {
                    error.call(error.context, models, xhr);
                }
            };

            delete data.success;
            delete data.error;

            return _opts;
        },

        /**
         * Fetch the page.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getPage
         * @memberof ParrentCollection
         * @instance
         */

        getPage: function (page, options) {
            var _opts;

            if (this.parentCT) {
                options.parentCT = this.parentCT;
            }

            _opts = this.dataComposer(page, options);

            return this.fetch(_opts);
        },

        /**
         * Fetch the `first` page.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getFirstPage
         * @memberof ParrentCollection
         * @instance
         */

        getFirstPage: function (options) {
            this.currentPage = 1;

            this.getPage(1, options);
        },

        /**
         * Fetch the `last` page.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getLastPage
         * @memberof ParrentCollection
         * @instance
         */

        getLastPage: function (options) {
            var page = this.lastPage;

            this.currentPage = page;
            this.getPage(page, options);
        },

        /**
         * Fetch the `next` page.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getNextPage
         * @memberof ParrentCollection
         * @instance
         */

        getNextPage: function (options) {
            var page = options.page || this.currentPage + 1;

            // this.direction = 1;

            this.getPage(page, options);
        },

        getPreviousPage: function (options) {
            var page = options.page || this.currentPage - 1;

            // this.direction = 0;

            this.getPage(page, options);
        },

        /**
         * Filters collection by `field` & `value`.
         * @param {string} field Field to filter by.
         * @param {string} value Value to filter by.
         * @param {Backbone.Collection} collection To create correct result.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getSearchedCollection
         * @memberof ParrentCollection
         * @instance
         */

        getSearchedCollection: function (field, value, collection) {
            var newFilteredCollection;
            var self = this;

            _.bind(this.filterCollection, this);

            if (!value) {
                return self.trigger('showmore', this);
            }

            newFilteredCollection = this.filterCollection(field, value, collection);

            return self.trigger('showmore', newFilteredCollection);
        },

        filterCollection: function (field, value, Collection) {
            var resultCollection;
            var regex;

            regex = new RegExp(value, 'i');

            resultCollection = this.filter(function (model) {
                return model.get(field).match(regex);
            });

            return new Collection(resultCollection);
        },

        /**
         *
         * @param response
         * @returns {*}
         */
        parse: function (response) {
            if (response instanceof Array) {
                return response;
            }

            this.totalRecords = response.total;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.lastPage = this.totalPages;
            this.totalDebit = response.totalDebit;
            this.totalCredit = response.totalCredit;

            this.trigger('fetchFinished', {
                totalRecords: this.totalRecords,
                currentPage : this.currentPage,
                pageSize    : this.pageSize
            });

            return response.data;
        }
    });

    return Collection;
});
