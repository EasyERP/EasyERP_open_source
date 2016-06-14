define([
    'Backbone',
    'jQuery',
    'Underscore',
    'collections/Filter/filterCollection',
    'text!templates/Filter/filtersGroup.html',
    'text!templates/Filter/rightFiltersGroupElements.html',
    'constants'
], function (Backbone, $, _, FilterCollection, GroupTemplate, 
             GroupElementsTemplate, CONSTANTS) {
    var FilterGroup = Backbone.View.extend({
        mainTemplate         : _.template(GroupTemplate),
        groupElementsTemplate: _.template(GroupElementsTemplate),
        currentPage          : 1,

        events: {
            "click .filterValues li": "selectValue"
        },

        initialize: function (options) {
            var sortOptions = options.sortOptions || {};

            _.bindAll(this, "renderContent");
            this.collection = options.collection;
            this.groupName = options.groupName;
            this.filterViewName = options.filterViewName;
            this.filterBackendName = options.filterBackendName;
            this.filterType = options.filterType;
            this.filteredCollection = new FilterCollection(this.collection.toJSON(), sortOptions);

            this.collection.on('change', function () {
                this.filteredCollection.set(this.collection.toJSON());
            }, this);

            this.filteredCollection.on('reset', this.renderContent);

            this.collectionLength = this.filteredCollection.length;
            this.elementToShow = options.elementToShow || (CONSTANTS.FILTERVALUESCOUNT > this.collectionLength) ? this.collectionLength : CONSTANTS.FILTERVALUESCOUNT;
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

            _.bindAll(this, "inputEvent");

            this.render();
        },

        selectValue: function (e) {
            var $currentElement = $(e.target);
            var currentValue = $currentElement.attr('data-value');
            var filterGroupElement = $currentElement.closest('.filterGroup');
            var groupType = filterGroupElement.attr('data-value');
            var $groupNameElement = filterGroupElement.find('.groupName');
            var collectionElement;
            var intVal;
            var index;
            var self = this;
            var elementState;
            
            var filterValues = App.filter[this.filterViewName];

            $currentElement.toggleClass('checkedValue');
            elementState = $currentElement.hasClass('checkedValue');
            intVal = parseInt(currentValue, 10);
            currentValue = (isNaN(intVal) || currentValue.length === 24) ? currentValue : intVal;
            collectionElement = this.collection.findWhere({_id: currentValue});

            if (elementState) {
                if (!filterValues) {
                    App.filter[this.filterViewName] = {
                        key  : groupType,
                        value: [],
                        type : this.filterType || null
                    };

                    filterValues = App.filter[this.filterViewName];
                }

                filterValues.value.push(currentValue);
            } else {
                index = filterValues.value.indexOf(currentValue);

                if (index !== -1) {
                    filterValues.value.splice(index, 1);
                    
                    if (filterValues.value.length === 0) {
                        delete filterValues;
                    }
                }
            }

            collectionElement.set({status: elementState});
            $groupNameElement.toggleClass('checkedGroup', !!filterValues.value.length);

            this.trigger('valueSelected');
            
            (_.debounce(
                function () {
                    self.renderContent();
                }, 500))();

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
            var $ulElement = this.$el.find("#" + this.filterViewName + "Ul");
            var $ulContent = $ulElement.closest('.ulContent');
            var $paginationLi = $ulContent.find('.miniStylePagination');

            this.collectionLength = this.filteredCollection.length;
            this.paginationBool = this.collectionLength > this.elementToShow;

            this.allPages = Math.ceil(this.collectionLength / this.elementToShow);

            this.start = (this.currentPage - 1) * this.elementToShow;
            this.end = Math.min(this.currentPage * this.elementToShow, this.collectionLength);

            var $prevPage;
            var $nextPage;

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
        },

        paginationChange: function (e, context) {
            var curEl = $(e.target);

            if (curEl.hasClass('prev')) {
                context.currentPage--;
            } else {
                context.currentPage++;
            }

            context.renderContent();
        },

        render: function () {
            var self = this;
            var $curEl = this.$el;
            var $searchInput;

            $curEl.append(this.mainTemplate({
                filterViewName   : this.filterViewName,
                filterBackendName: this.filterBackendName,
                paginationBool   : this.paginationBool,
                groupName        : this.groupName
            }));

            $curEl.attr('data-value', this.filterBackendName);

            this.renderContent();

            $curEl
                .find("#" + this.filterViewName + "Container .miniStylePagination a")
                .click(function (e) {
                    self.paginationChange(e, self);
                });

            $searchInput = $curEl.find(".ulContent input");

            $searchInput.on('input', function (e) {
                self.inputEvent(e);
            });

            $searchInput.change(function (e) {
                self.inputEvent(e);
            });

            return this;
        }
    });

    return FilterGroup;
})