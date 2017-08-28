define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Employees/list/ListHeader.html',
    'views/Employees/CreateView',
    'views/Employees/EditView',
    'views/Employees/list/ListItemView',
    'collections/Employees/filterCollection',
    'models/EmployeesModel',
    'common',
    'views/guideTours/guideNotificationView'
], function ($, _, ListViewBase, listTemplate, CreateView, EditView, ListItemView, contentCollection, CurrentModel, common, GuideNotify) {
    'use strict';
    var EmployeesListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        hasAlphabet      : true,
        hasPagination    : true,
        contentType      : 'Employees',
        formUrl          : '#easyErp/Employees/',
        letterKey        : 'name.last',
        type             : 'Employees',

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray(this.contentType);
            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            ListViewBase.prototype.initialize.call(this, options);
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new CurrentModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/employees/';
            model.fetch({
                data   : {id: id},
                success: function (response) {
                    return new EditView({model: response});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        render: function () {
            var $currentEl;

            $('.ui-dialog ').remove();
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(this.listTemplate));
            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

        }

    });

    return EmployeesListView;
});
