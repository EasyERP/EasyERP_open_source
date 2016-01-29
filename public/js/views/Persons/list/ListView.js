define([
        'jQuery',
        'Underscore',
        'views/listViewBase',
        'text!templates/Persons/list/ListHeader.html',
        'views/Persons/CreateView',
        'views/Persons/list/ListItemView',
        'collections/Persons/filterCollection',
        'views/Filter/FilterView',
        'common',
        'constants'
    ],

    function ($, _, listViewBase, listTemplate, createView, listItemView, contentCollection, filterView, common, CONSTANTS) {
        'use strict';
        var PersonsListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            totalCollectionLengthUrl: '/persons/totalCollectionLength',
            formUrl                 : "#easyErp/Persons/form/",
            contentType             : 'Persons',//needs in view.prototype.changeLocationHash
            viewType                : 'list',//needs in view.prototype.changeLocationHash
            exportToXlsxUrl         : '/Customers/exportToXlsx/type=Person',
            exportToCsvUrl          : '/Customers/exportToCsv/type=Person',

            events: {
                "click .letter:not(.empty)": "alpabeticalRender"
            },

            initialize: function (options) {
                this.mId = CONSTANTS.MID[this.contentType];
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                _.bind(this.collection.showMoreAlphabet, this.collection);
                this.allAlphabeticArray = common.buildAllAphabeticArray();
                this.filter = options.filter;
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            },

            render: function () {
                var self;
                var $currentEl;

                $('.ui-dialog ').remove();

                self = this;
                $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(this.listTemplate));
                $currentEl.append(new this.listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());

                this.renderCheckboxes();
                this.renderAlphabeticalFilter(this);
                this.renderPagination($currentEl, this);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                this.renderFilter(self);
            }
        });

        return PersonsListView;
    });
