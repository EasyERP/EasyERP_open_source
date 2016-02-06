define([
    'Backbone',
        'jQuery',
        'Underscore',
        'views/listViewBase',
        'text!templates/Employees/list/ListHeader.html',
        'views/Employees/CreateView',
        'views/Employees/list/ListItemView',
        'views/Filter/FilterView',
        'views/Employees/form/FormView',
        'collections/Employees/filterCollection',
        'models/EmployeesModel',
        'common'
    ],

    function (Backbone, $, _, listViewBase, listTemplate, createView, listItemView, filterView, FormView, contentCollection, CurrentModel, common) {
        'use strict';
        var EmployeesListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            contentType             : "Employees",
            totalCollectionLengthUrl: '/employees/totalCollectionLength',
            formUrl                 : "#easyErp/Employees/form/",
            formView                : FormView,
            exportToXlsxUrl         : '/employees/exportToXlsx',
            exportToCsvUrl          : '/employees/exportToCsv',
            events                  : {
                "click"                    : "hideItemsNumber",
                "click .letter:not(.empty)": "alpabeticalRender"
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

        return EmployeesListView;
    });
