define([
    'jQuery',
    'Underscore',
    'text!templates/Employees/thumbnails/ThumbnailsItemTemplate.html',
    'views/thumbnailsViewBase',
    'views/Employees/EditView',
    'views/Employees/CreateView',
    'views/Filter/filterView',
    'dataService',
    'models/EmployeesModel',
    'common',
    'constants'

], function ($, _, thumbnailsItemTemplate, BaseView, EditView, CreateView, FilterView, dataService, CurrentModel, common, CONSTANTS) {
    'use strict';

    var EmployeesThumbnalView = BaseView.extend({
        el          : '#content-holder',
        countPerPage: 0,
        template    : _.template(thumbnailsItemTemplate),
        hasAlphabet : true,
        contentType : 'Employees',
        viewType    : 'thumbnails',
        letterKey   : 'name.last',
        type        : 'Employees',

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray(this.contentType);

            this.asyncLoadImgs(this.collection);
            this.stages = [];

            BaseView.prototype.initialize.call(this, options);

            this.filter = options.filter;
        },

        asyncLoadImgs: function (collection) {
            var ids = _.map(collection.toJSON(), function (item) {
                return item._id;
            });
            common.getImages(ids, '/employees/getEmployeesImages');
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

        render: function () {
            var $currentEl = this.$el;

            $currentEl
                .find('#thumbnailContent')
                .append(this.template({collection: this.collection.toJSON()}));

            return this;
        }
    });

    return EmployeesThumbnalView;
});
