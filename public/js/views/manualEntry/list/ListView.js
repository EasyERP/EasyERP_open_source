define([
    'Underscore',
    'jQuery',
    'views/listViewBase',
    'text!templates/manualEntry/list/ListHeader.html',
    'views/manualEntry/list/ListItemView',
    'views/selectView/selectView',
    'views/journalEntry/ViewSource',
    'views/manualEntry/CreateView',
    'collections/manualEntry/filterCollection',
    'constants',
    'helpers',
    'dataService',
    'common',
    'moment',
    'custom'
], function (_,
             $,
             ListViewBase,
             listTemplate,
             ListItemView,
             SelectView,
             View,
             CreateView,
             contentCollection,
             CONSTANTS,
             helpers,
             dataService,
             common,
             moment,
             custom) {

    'use strict';

    var ListView = ListViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.MANUALENTRY,
        exportToXlsxUrl  : 'journalEntries/exportToXlsx',
        exportToCsvUrl   : 'journalEntries/exportToCsv',
        hasPagination    : true,
        responseObj      : {},
        CreateView       : CreateView,

        events: {
            'click .source': 'viewSourceDocument'
        },

        initialize: function (options) {
            var dateRange;

            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;
            this.totalDebit = options.collection.totalDebit;
            this.totalCredit = options.collection.totalCredit;

            this.filter = options.filter || custom.retriveFromCash('manualEntry.filter');

            if (!this.filter) {
                this.filter = {};
            }

            dateRange = this.filter.date ? this.filter.date.value : [];

            if (!this.filter.date) {
                this.filter.date = {
                    key  : 'date',
                    value: [new Date(dateRange.startDate), new Date(dateRange.endDate)]
                };
            }

            options.filter = this.filter;

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            ListViewBase.prototype.initialize.call(this, options);

            custom.cacheToApp('manualEntry.filter', this.filter);

            this.responseObj['#source'] = [
                {
                    _id : 'source',
                    name: 'View Source Document'
                }
            ];
        },

        checked: function (e) {
            var self = this;
            var $thisEl = this.$el;
            var $topBar = $('#top-bar');
            var checked = $(e.target).prop('checked');
            var $checkBoxes = $thisEl.find('.checkbox:checked:not(#checkAll,notRemovable)');
            var notRemovable = $thisEl.find('.notRemovable');
            var $checkAll = $thisEl.find('#checkAll');
            var $currentChecked = e ? $(e.target) : $thisEl.find('#checkAll');
            var isCheckedAll = $currentChecked.attr('id') === 'checkAll';
            var checkAllBool;
            var $deleteButton = $topBar.find('#top-bar-deleteBtn');
            var $createButton = $topBar.find('#top-bar-createBtn');
            var $copyButton = $topBar.find('#top-bar-copyBtn');
            var tr = $(e.target).closest('tr');
            var timestamp = tr.attr('data-time');

            if (e) {
                e.stopPropagation();
            }

            $checkBoxes.each(function () {

                if (timestamp) {
                    self.$el.find('[data-time="' + timestamp + '"]').each(function () {
                        $(this).find('.checkbox').prop('checked', checked);
                    });
                } else {
                    $(this).find('.checkbox').prop('checked', checked);
                }
            });

            $checkBoxes = $thisEl.find('.checkbox:checked:not(#checkAll, .notRemovable)');

            checkAllBool = (($checkBoxes.length + notRemovable.length) === this.collection.length);

            $checkAll.prop('checked', checkAllBool);

            if ((!isCheckedAll && $checkBoxes.length) || (isCheckedAll && !checkAllBool)) {
                $deleteButton.show();
                $copyButton.show();
                $createButton.hide();
            } else if (isCheckedAll || !$checkBoxes.length) {
                $deleteButton.hide();
                $copyButton.hide();
                $createButton.show();
            }
        },

        viewSourceDocument: function (e) {
            var $target = $(e.target).closest('.source');
            var closestSpan = $target.find('.current-selected');
            var dataId = closestSpan.attr('data-id');
            var dataName = closestSpan.attr('data-name');
            var dataEmployee = closestSpan.attr('data-employee');
            var data;

            App.startPreload();

            if (this.selectView) {
                this.selectView.remove();
            }

            return new View({type: dataName, employee: dataEmployee, dataId: dataId});
        },

        changeDateRange: function (dateArray) {
            var itemsNumber = $('#itemsNumber').text();
            var searchObject;

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            searchObject = {
                page  : 1,
                filter: this.filter
            };

            this.collection.getFirstPage(searchObject);
            this.changeLocationHash(1, itemsNumber, this.filter);

            App.filtersObject.filter = this.filter;

            custom.cacheToApp('manualEntry.filter', this.filter);
        },

        showFilteredPage: function (filter) {
            var itemsNumber = $('#itemsNumber').text();

            this.startTime = new Date();
            this.newCollection = false;

            this.filter = Object.keys(filter).length === 0 ? {} : filter;

            custom.cacheToApp('manualEntry.filter', this.filter);

            this.changeLocationHash(1, itemsNumber, filter);
            this.collection.getFirstPage({
                count    : itemsNumber,
                page     : 1,
                filter   : filter,
                startDate: this.startDate,
                endDate  : this.endDate
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
            var dataTimes = [];
            var answer;
            var edited = this.edited || $thisEl.find('tr.false, #false');

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
                var dataTime;

                ids.push($el.val());

                dataTime = $el.closest('tr').attr('data-time');

                $table.find('[data-time="' + dataTime + '"]').each(function () {
                    ids.push($(this).closest('tr').attr('data-id'));
                });
            });

            ids = _.compact(ids);

            dataService.deleteData(url, {contentType: this.contentType, ids: ids}, function (err, response) {
                if (err) {
                    return App.render({
                        type   : 'error',
                        message: 'Can\'t remove items'
                    });
                }

                self.getPage();
            });
        },

        render: function () {
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            itemView = new ListItemView({
                collection : this.collection,
                itemsNumber: this.collection.namberToShow
            });

            dataService.getData('journalEntries/getReconcileDate', {}, function (result) {
                var newDate = moment(new Date());
                var date = moment(result.date);
                var same = false;

                $('#reconcileDate').text(common.utcDateToLocaleDate(result.date));

                if (newDate.isSame(date, 'month year date')) {
                    same = true;
                }

                if (same) {
                    $('#reconcileBtn').addClass('btnSuccess');
                } else {
                    $('#reconcileBtn').addClass('btnAttention');
                }

            });

            $currentEl.prepend(itemView.render());

            this.$el.find('#totalDebit').text(helpers.currencySplitter((this.totalDebit / 100).toFixed(2)));
            this.$el.find('#totalCredit').text(helpers.currencySplitter((this.totalCredit / 100).toFixed(2)));

            App.filtersObject.filter = this.filter;
        }
    });

    return ListView;
});
