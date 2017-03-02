define([
    'jQuery',
    'Underscore',
    'constants',
    'dataService',
    'Backbone'
], function ($, _, CONSTANTS, dataService, Backbone) {
    return function (View) {
        var Mixin = {
            goSort: function (e) {
                var $targetEl;
                var newRows = this.$el.find('#false').length ? this.$el.find('#false') : this.$el.find('.false');
                var filter = this.filter || {};
                var target$;
                var currentParrentSortClass;
                var sortClass;
                var sortConst;
                var sortBy;
                var sortObject;
                var data;
                var el = 'th';

                this.startTime = new Date();

                if ((this.changed && this.changedModels && Object.keys(this.changedModels).length) ||
                    (this.isNewRow ? this.isNewRow() : newRows.length)) {
                    return App.render({
                        type   : 'notify',
                        message: 'Please, save previous changes or cancel them!'
                    });
                }

                if ($(e.target).closest('th') && $(e.target).closest('th').length) {
                    target$ = $(e.target).closest('th');
                } else {
                    target$ = $(e.target).closest('li');
                    el = 'li';
                }

                currentParrentSortClass = target$.attr('class');
                sortClass = currentParrentSortClass.split(' ')[1];
                sortConst = 1;
                sortBy = target$.data('sort').split(' ');
                sortObject = {};

                if (!sortClass) {
                    target$.addClass('sortUp');
                    sortClass = 'sortUp';
                }

                switch (sortClass) {
                    case 'sortDn':
                        target$.parent().find(el).removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortDn').addClass('sortUp');
                        sortConst = 1;
                        break;
                    case 'sortUp':
                        target$.parent().find(el).removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortUp').addClass('sortDn');
                        sortConst = -1;
                        break;
                    // skip default case
                }

                sortBy.forEach(function (sortField) {
                    sortObject[sortField] = sortConst;
                });

                this.sort = sortObject;

                data = {
                    sort     : sortObject,
                    startDate: this.startDate,
                    endDate  : this.endDate
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

                this.collection.getFirstPage(data);
            }
        };

        _.extend(View.prototype, Mixin);

        return View;
    };
});
