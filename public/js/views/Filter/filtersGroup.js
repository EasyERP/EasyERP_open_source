define([
    'Backbone',
    'jQuery',
    'Underscore',
    'collections/Filter/filterCollection',
    'text!templates/Filter/filtersGroup.html',
    'text!templates/Filter/filtersGroupElements.html',
    'constants'
], function (Backbone, $, _, FilterCollection, GroupTemplate,
             GroupElementsTemplate, CONSTANTS) {
    var FilterGroup = Backbone.View.extend({
        mainTemplate         : _.template(GroupTemplate),
        groupElementsTemplate: _.template(GroupElementsTemplate),
        currentPage          : 1,

        events: {
            'click .filterValues li'      : 'selectValue',
            'input .ulContent input'      : 'inputEvent',
            'change .ulContent input'     : 'inputEvent',
            'click .miniStylePagination a': 'paginationChange'

        },

        initialize: function (options) {
            var sortOptions = options.sortOptions || {};

            _.bindAll(this, 'renderContent');

            this.collection = options.collection;
            this.displayName = options.displayName;
            this.filterViewName = options.filterViewName;
            this.filterBackendName = options.filterBackendName;
            this.filterType = options.filterType;
            this.filteredCollection = new FilterCollection(this.collection.toJSON(), sortOptions);

            this.collection.on('change reset', function () {
                this.filteredCollection.set(this.collection.toJSON());
            }, this);

            this.filteredCollectionChange = _.debounce(
                function () {
                    this.filteredCollection.sort();
                    this.trigger('valueSelected', this.removeSavedState);
                    this.renderContent();
                }, 700);

            _.bindAll(this, 'filteredCollectionChange');

            this.filteredCollection.on('change', this.filteredCollectionChange);

            this.filteredCollection.on('reset', this.renderContent);

            this.collectionLength = this.filteredCollection.length;

            if (options.elementToShow || (CONSTANTS.FILTERVALUESCOUNT > this.collectionLength)) {
                this.elementToShow = this.collectionLength;
            } else {
                this.elementToShow = CONSTANTS.FILTERVALUESCOUNT;
            }

            this.paginationBool = this.collectionLength > this.elementToShow;

            this.allPages = Math.ceil(this.collectionLength / this.elementToShow);

            this.inputEvent = _.debounce(
                function (e) {
                    var target = e.target;
                    var value = target.value;
                    var newFilteredCollection;

                    this.currentPage = 1;

                    if (!value) {
                        return this.filteredCollection.reset(this.collection.toJSON());
                    }

                    newFilteredCollection = this.filterCollection(value);

                    this.filteredCollection.reset(newFilteredCollection);
                }, 500);

            _.bindAll(this, 'inputEvent');

            this.render();
        },

        selectValue: function (e) {
            var $currentElement = $(e.target);
            var currentValue = $currentElement.attr('data-value');
            var filterGroupElement = $currentElement.closest('.filterGroup');
            var groupType = filterGroupElement.attr('data-value');
            var currentFilter = App.filtersObject.filter;
            var filterValues = currentFilter ? currentFilter[this.filterViewName] : null;
            var collectionElement;
            var elementState;
            var intVal;
            var index;

            $currentElement.toggleClass('checkedValue');
            elementState = $currentElement.hasClass('checkedValue');
            intVal = parseInt(currentValue, 10);
            currentValue = (intVal.toString().length !== currentValue.length || isNaN(intVal) || currentValue.length === 24) ? currentValue : intVal;
            collectionElement = this.collection.findWhere({_id: currentValue});

            if (elementState) {
                if (!filterValues) {
                    if (!currentFilter) {
                        App.filtersObject.filter = {};
                    }

                    App.filtersObject.filter[this.filterViewName] = {
                        key  : groupType,
                        value: [],
                        type : this.filterType || null
                    };

                    filterValues = App.filtersObject.filter[this.filterViewName];
                }

                filterValues.value.push(currentValue);
            } else {
                index = filterValues.value.indexOf(currentValue);

                if (index !== -1) {
                    filterValues.value.splice(index, 1);

                    if (filterValues.value.length === 0) {
                        delete App.filtersObject.filter[this.filterViewName];
                    }
                }
            }

            this.removeSavedState = true;

            collectionElement.set({status: elementState});
        },

        filterCollection: function (value) {
            var resultCollection;
            var regex;

            regex = new RegExp(value, 'i');

            resultCollection = this.collection.filter(function (model) {

                var searchItem = model.get('name') ? model.get('name').toString() : '';

                return searchItem.match(regex);
            });

            return resultCollection;
        },

        renderContent: function () {
            var displayCollection;
            var $curEl = this.$el;
            var $ulElement = $curEl.find('#' + this.filterViewName + 'Ul');
            var $ulContent = $curEl.find('.ulContent');
            var $paginationLi = $ulContent.find('.miniStylePagination');

            var $groupNameElement = $curEl.find('.groupName');
            var currentFilter = App.filtersObject.filter;
            var filterValues = currentFilter && currentFilter[this.filterViewName] ? currentFilter[this.filterViewName].value : [];

            var $prevPage;
            var $nextPage;

            this.removeSavedState = false;

            this.collectionLength = this.filteredCollection.length;
            this.paginationBool = this.collectionLength > this.elementToShow;

            this.allPages = Math.ceil(this.collectionLength / this.elementToShow);

            this.start = (this.currentPage - 1) * this.elementToShow;
            this.end = Math.min(this.currentPage * this.elementToShow, this.collectionLength);

            displayCollection = this.filteredCollection.toJSON();
            displayCollection = displayCollection.slice(this.start, this.end);

            $ulElement.html(this.groupElementsTemplate({
                collection: displayCollection
            }));

            $paginationLi
                .find('.counter')
                .html((this.start + 1) + '-' + this.end + ' of ' + this.collectionLength);

            $paginationLi.toggle(this.allPages > 1);

            $prevPage = $paginationLi.find('.prev');
            $nextPage = $paginationLi.find('.next');

            $prevPage.toggleClass('disabled', this.currentPage === 1);
            $nextPage.toggleClass('disabled', this.currentPage === this.allPages);

            $groupNameElement.toggleClass('checkedGroup', !!filterValues.length);
        },

        paginationChange: function (e) {
            var curEl = $(e.target);

            if (curEl.hasClass('prev')) {
                this.currentPage--;
            } else {
                this.currentPage++;
            }

            this.renderContent();
        },

        render: function () {
            var $curEl = this.$el;

            $curEl.append(this.mainTemplate({
                filterViewName   : this.filterViewName,
                filterBackendName: this.filterBackendName,
                paginationBool   : this.paginationBool,
                groupName        : this.displayName
            }));

            $curEl.attr('data-value', this.filterBackendName);

            this.renderContent();

            return this;
        }
    });

    return FilterGroup;
});
