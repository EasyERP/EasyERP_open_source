define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/Filter/filterView',
    'common',
    'constants',
    'dataService'
], function (Backbone, $, _, BaseView, FilterView, common, CONSTANTS, dataService) {
    'use strict';

    var TFormBaseView = BaseView.extend({
        viewType     : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination: true,
        hasAlphabet  : false,
        formView     : null,
        selectedId   : null,
        ContentModel : null,
        FormView     : null,

        events: {
            'click .compactView:not(.checkbox)': 'goToForm',
            'click .closeBtn'                  : 'returnToList',
            'click #sortBy'                    : 'openSortDrop'
        },

        initialize: function (options) {
            this.selectedId = options.modelId;
            this.mId = CONSTANTS.MID[this.contentType];
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;

            BaseView.prototype.initialize.call(this, options);

            this.addFormView();
        },

        openSortDrop: function (e) {
            var $target = $(e.target);

            e.preventDefault();

            $target.closest('.dropDown').toggleClass('open');
        },

        returnToList: function (e) {
            var currentPage = this.collection.currentPage;
            var count = this.collection.pageSize;
            var url;
            var filter;
            e.preventDefault();

            url = this.listUrl + 'p=' + currentPage + '/c=' + count;

            if (this.filter) {
                filter = encodeURI(JSON.stringify(this.filter));
                url += '/filter=' + filter;
            }

            Backbone.history.navigate(url, {trigger: true});
        },

        goSort: function (e) {
            var filter = this.filter || {};
            var $target;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;
            var data;

            this.startTime = new Date();

            $target = $(e.target).closest('li');
            currentParrentSortClass = $target.attr('class');
            sortClass = currentParrentSortClass.split(' ')[1];
            sortConst = 1;
            sortBy = $target.data('sort').split(' ');
            sortObject = {};

            if (!sortClass) {
                $target.addClass('sortUp');
                sortClass = 'sortUp';
            }

            switch (sortClass) {
                case 'sortDn':
                    $target.parent().find('li').removeClass('sortDn').removeClass('sortUp');
                    $target.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                    break;
                case 'sortUp':
                    $target.parent().find('li').removeClass('sortDn').removeClass('sortUp');
                    $target.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                    break;
                // skip default case
            }

            sortBy.forEach(function (sortField) {
                sortObject[sortField] = sortConst;
            });

            data = {
                sort: sortObject
            };

            data.filter = filter;

            if (this.viewType) {
                data.viewType = this.viewType;
            }
            if (this.parrentContentId) {
                data.parrentContentId = this.parrentContentId;
            }
            if (this.contentType) {
                data.contentType = this.contentType;
            }

            data.page = 1;

            this.changeLocationHash(null, this.collection.pageSize);
            this.collection.getFirstPage(data);
        },

        showMoreContent: function (newModels) {
            var collectionObj = newModels.toJSON();
            var $holder = this.$el;
            var $listHolder = $holder.find('#listContent');

            $listHolder.empty();

            this.renderList(collectionObj);

            $holder.find('#timeRecivingDataFromServer').remove();
            $holder.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        addFormView: function () {
            this.renderFormView();
        },

        goToForm: function (e) {
            var self = this;
            var $thisEl = this.$el;
            var $target = $(e.target);
            var date = new Date();
            var modelId = $target.closest('.compactView').data('id');

            e.preventDefault();

            if (modelId === this.selectedId){
                return false;
            }

            this.selectedId = modelId;
            this.renderFormView(function () {
                $thisEl.find('#timeRecivingDataFromServer').remove();
                $thisEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - date) + ' ms</div>');

                self.changeLocationHash(self.collection.currentPage, self.collection.pageSize, self.filter);
            });
        },

        renderFormView: function (cb) {
            var modelId = this.selectedId;
            var $thisEl = this.$el;
            var self = this;
            var model;

            model = new this.ContentModel();
            model.urlRoot = model.url() + modelId;


            model.fetch({
                success: function (model) {

                    if (self.formView) {
                        self.formView.undelegateEvents();
                    }

                    self.formView = new self.FormView({model: model, el: '#formContent'});
                    self.formView.render();

                    $thisEl.find('#listContent .selected').removeClass('selected');
                    $thisEl.find('tr[data-id="' + modelId + '"]').addClass('selected');

                    self.selectedId = model.id;

                    if (cb && typeof cb === 'function') {
                        cb();
                    }
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Server error'
                    });
                }
            });
        },

        deleteItems: function () {
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#listTable');
            var collection = this.collection;
            var url = collection.url;
            var $checkedInputs;
            var ids = [];
            var answer;
            var edited = this.edited || $thisEl.find('tr.false, #false');
            var collectionObj = this.collection.toJSON();
            var collIds = _.pluck(collectionObj, '_id');
            var diffIds;
            var needId;
            var needReset = false;

            if (!edited.length) { // ToDo refactor
                this.changed = false;
            }

            if (this.changed) {
                return this.cancelChanges();
            }

            answer = confirm('Really DELETE items ?!');

            if (answer === false) {
                return false;
            }

            $checkedInputs = $table.find('input:checked');

            $.each($checkedInputs, function () {
                var $el = $(this);

                ids.push($el.val());
            });

            ids = _.compact(ids);

            if (ids.indexOf(this.selectedId) !== -1) {
                diffIds = _.difference(collIds, ids);
                needId = diffIds[0];

                this.selectedId = needId;
                needReset = !needReset;
            }

            dataService.deleteData(url, {contentType: this.contentType, ids: ids}, function (err) {
                if (err) {
                    return App.render({
                        type   : 'error',
                        message: 'Can\'t remove items'
                    });
                }

                self.getPage();

                if (needReset) {
                    self.renderFormView();
                }
            });
        },

        render: function () {
            var $currentEl;
            var collectionObj = this.collection.toJSON();

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html(this.contentTemplate());
            this.renderList(collectionObj);
        }
    });

    return TFormBaseView;
});
