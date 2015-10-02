define([
        'views/listViewBase',

        'text!templates/Companies/list/ListHeader.html',
        'views/Companies/CreateView',
        'views/Companies/list/ListItemView',

        'collections/Companies/filterCollection',
        'views/Filter/FilterView',
        'common'
    ],

    function (listViewBase, listTemplate, createView, listItemView,
              contentCollection, filterView, common) {

        var CompaniesListView = listViewBase.extend({

            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            contentType             : "Companies",
            viewType                : "list",
            totalCollectionLengthUrl: '/totalCollectionLength/Companies',
            formUrl                 : "#easyErp/Companies/form/",
            exportToXlsxUrl         : '/Customers/exportToXlsx?type=Company',
            exportToCsvUrl          : '/Customers/exportToCsv?type=Company',
            events                  : {
                "click .letter:not(.empty)": "alpabeticalRender",
            },

            initialize: function (options) {

                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                _.bind(this.collection.showMoreAlphabet, this.collection);
                this.allAlphabeticArray = common.buildAllAphabeticArray();
                this.filter = options.filter;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;

                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;

                this.filterView;
            },

            render: function () {
                var self;
                var currentEl;

                $('.ui-dialog ').remove();

                self = this;
                currentEl = this.$el;

                currentEl.html('');
                currentEl.append(_.template(this.listTemplate));
                currentEl.append(new this.listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());

                this.renderCheckboxes();
                this.renderAlphabeticalFilter(this);
                this.renderPagination(currentEl, this);

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                this.renderFilter(self);
            },
        });
        return CompaniesListView;
    });