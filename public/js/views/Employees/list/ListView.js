define([
        'views/listViewBase',

        'text!templates/Employees/list/ListHeader.html',
        'views/Employees/CreateView',
        'views/Employees/EditView',
        'views/Employees/list/ListItemView',
        'views/Filter/FilterView',
        'models/EmployeesModel',
        'collections/Employees/filterCollection',
        'common'

    ],

    function (listViewBase, listTemplate, createView, EditView, listItemView, filterView, currentModel, contentCollection, common) {
        var EmployeesListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            contentType             : "Employees",
            totalCollectionLengthUrl: '/totalCollectionLength/Employees',
            formUrl                 : "#easyErp/Employees/form/",
            exportToXlsxUrl         : '/employee/exportToXlsx',
            exportToCsvUrl          : '/employee/exportToCsv',
            events                  : {
                "click"                              : "hideItemsNumber",
                "click .letter:not(.empty)"          : "alpabeticalRender",
                "click .list td:not(.notForm)"       : "gotoEditForm"
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

            gotoEditForm: function (e) {
                var id = $(e.target).closest("tr").data("id");
                var model = new currentModel({validate: false});

                e.preventDefault();

                model.urlRoot = '/Employees/form';
                model.fetch({
                    data   : {id: id},
                    success: function (model) {
                        new EditView({model: model});
                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: 'Please refresh browser'
                        });
                    }
                });
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
