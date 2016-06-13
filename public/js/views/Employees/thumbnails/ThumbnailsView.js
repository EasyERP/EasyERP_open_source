define([
    'jQuery',
    'Underscore',
    'text!templates/Employees/thumbnails/ThumbnailsItemTemplate.html',
    'views/thumbnailsViewBase',
    'views/Employees/EditView',
    'views/Employees/CreateView',
    'views/Filter/FilterView',
    'dataService',
    'models/EmployeesModel',
    'common',
    'text!templates/Alpabet/AphabeticTemplate.html',
    'constants'
], function ($, _, thumbnailsItemTemplate, BaseView, EditView, CreateView, FilterView, dataService, CurrentModel, common, AphabeticTemplate, CONSTANTS) {
    'use strict';

    var EmployeesThumbnalView = BaseView.extend({
        el                : '#content-holder',
        countPerPage      : 0,
        template          : _.template(thumbnailsItemTemplate),
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        newCollection     : null,
        contentType       : 'Employees',
        viewType          : 'thumbnails',

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray();

            this.asyncLoadImgs(this.collection);
            this.stages = [];

            BaseView.prototype.initialize.call(this, options);

            this.filter = options.filter || {};
        },

        asyncLoadImgs: function (collection) {
            var ids = _.map(collection.toJSON(), function (item) {
                return item._id;
            });
            common.getImages(ids, '/employees/getEmployeesImages');
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var createdInTag = "<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + 'ms </div>';

            $currentEl.html('');

            if (this.collection.length > 0) {
                $currentEl.append(this.template({collection: this.collection.toJSON()}));
            } else {
                $currentEl.html('<h2>No Employees found</h2>');
            }
            self.filterView = new FilterView({contentType: self.contentType});

            self.filterView.bind('filter', function (filter) {
                self.showFilteredPage(filter, self);
            });
            self.filterView.bind('defaultFilter', function () {
                self.showFilteredPage({}, self);
            });

            self.filterView.render();

            this.renderAlphabeticalFilter();
            $currentEl.append(createdInTag);

            return this;
        },

        gotoEditForm: function (e) {
            var className;
            var id;
            var model;
            var self = this;
            var target = $(e.target);

            this.$el.delegate('a', 'click', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });

            className = target.parent().attr('class');

            if ((className !== 'dropDown') || (className !== 'inner')) {
                id = target.closest('.thumbnailwithavatar').attr('id');
                model = new CurrentModel({validate: false});

                model.urlRoot = CONSTANTS.URLS.EMPLOYEES;

                model.fetch({
                    data   : {id: id, viewType: 'form'},
                    success: function (response) {
                        return new self.EditView({model: response});
                    },

                    error: function () {
                        App.render({
                            type   : 'error',
                            message: 'Please refresh browser'
                        });
                    }
                });
            }
        },

        exportToCsv: function () {
            // todo change after routes refactoring
            window.location = '/employees/exportToCsv';
        },

        exportToXlsx: function () {
            // todo change after routes refactoring
            window.location = '/employees/exportToXlsx';
        }
    });

    return EmployeesThumbnalView;
});
