define([
        'text!templates/PayrollExpenses/list/ListHeader.html',
        'text!templates/PayrollExpenses/list/cancelEdit.html',
        'text!templates/PayrollExpenses/list/ListTotal.html',
        'views/listViewBase',
        'views/Filter/FilterView',
        'views/PayrollExpenses/generate/GenerateView',
        'views/PayrollExpenses/CreateView',
        "views/PayrollPayments/CreateView",
        'collections/PayrollExpenses/editCollection',
        'collections/PayrollPayments/editCollection',
        'collections/PayrollExpenses/oneMonthCollection',
        'collections/Employees/employee',
        'models/PayRollModel',
        'populate',
        'dataService',
        'async',
        'moment',
        'helpers'
    ],

    function (headerTemplate, cancelEditTemplate, totalTemplate, listViewBase, filterView, GenerateView, createView, PaymentCreateView, editCollection, PaymentCollection, monthCollection, employeesCollection, currentModel, populate, dataService, async, moment, helpers) {
        var payRollListView = Backbone.View.extend({
            el            : '#content-holder',
            contentType   : 'PayrollExpenses',
            viewType      : 'list',//needs in view.prototype.changeLocationHash
            responseObj   : {},
            whatToSet     : {},
            formUrl       : "#easyErp/PayrollExpenses/form/",
            headerTemplate: _.template(headerTemplate),
            totalTemplate : _.template(totalTemplate),
            // rowTemplate   : _.template(rowTemplate),
            cancelTemplate: _.template(cancelEditTemplate),
            changedPeriods: {},
            changesCount  : 0,

            events: {
                "click .statusCheckbox"  : "statusCheck",
                "click tr.mainRow"       : "gotoForm",
                "click .datePicker"      : "datePickerChange",
            },

            initialize: function (options) {
                var collectionsObjects;

                this.collection = options.collection;
                collectionsObjects = this.collection.toJSON()[0];
                this.collectionOnMonth = new monthCollection(collectionsObjects.collection);

                this.total = collectionsObjects.total;
                this.allCollection = collectionsObjects.allCollection;
                this.startTime = options.startTime;

                this.render();

                this.$bodyContainer = this.$el.find('#payRoll-listTable');
            },

            datePickerChange: function (e) {
                e.stopPropagation();

                var $input = $(e.target).closest('input');

                $input.prop('disabled', false);
            },

            showHideCreateCancelBtns: function (option) {
                var $btnHolder = $('.createBtnHolder');
                var $saveBtn = $btnHolder.find('#top-bar-saveBtn');
                var $deleteBtn = $btnHolder.find('#top-bar-deleteBtn');

                if (option) {
                    option.save ? $saveBtn.show() : $saveBtn.hide();
                    option.delete ? $deleteBtn.show() : $deleteBtn.hide();
                }
            },

            statusCheck: function (e) {
                e.stopPropagation();

                var $target = $(e.target);
                var $checkbox = $target.find('.checkbox');
                var state = $checkbox.prop('checked');
                var $tr = $target.closest('tr');
                var dataKey = $tr.attr('data-id');

                $checkbox.prop('checked', !state);

                if (!this.changedPeriods[dataKey]) {
                    this.changedPeriods[dataKey] = {};
                }

                if (!this.changedPeriods[dataKey].hasOwnProperty('status')) {
                    this.changedPeriods[dataKey].status = state;
                    this.changesCount++;
                } else {
                    delete this.changedPeriods[dataKey].status;
                    this.changesCount--;
                }

                if (this.changesCount !== 0) {
                    this.showHideCreateCancelBtns({save: true, delete: true});
                } else {
                    this.showHideCreateCancelBtns({save: false, delete: false});
                }

            },

            generate: function () {
                var keys = [];

                this.total.forEach(function (el) {
                    var key = Object.keys(el)[0];

                    keys.push(key);
                });

                new GenerateView({keys: keys});
            },

            gotoForm: function (e) {
                if (!this.formUrl) {
                    return;
                }
                App.ownContentType = true;
                var id = $(e.target).closest("tr").attr("data-id");
                window.location.hash = this.formUrl + id;
            },

            renderFilter: function (self) {
                self.filters = new filterView({
                    contentType: self.contentType
                });

                self.filters.bind('filter', function (filter) {
                    self.showFilteredPage(filter, self)
                });

                self.filters.render({
                    dataKey: {
                        sort: {
                            key  : '_id',
                            order: -1
                        }
                    }
                });
            },

            hideSaveCancelBtns: function () {
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');
                var copyBtnEl = $('#top-bar-copy');

                this.changed = false;

                saveBtnEl.hide();
                cancelBtnEl.hide();
                createBtnEl.show();
                copyBtnEl.hide();

                return false;
            },

            render: function () {
                var currentEl = this.$el;

                currentEl.html('');
                currentEl.append(headerTemplate);

                currentEl.find('#payRoll-TableBody').append(this.totalTemplate({
                    total           : this.total,
                    currencySplitter: helpers.currencySplitter,
                    weekSplitter    : helpers.weekSplitter
                }));

                this.hideSaveCancelBtns();

                $('#top-bar-deleteBtn').hide();
                $('#top-bar-createBtn').hide();
                $('#topBarPaymentGenerate').hide();

                currentEl.find('.datePicker input').datepicker({
                    dateFormat : "dd/mm/yy",
                    changeMonth: true,
                    changeYear : true
                }).keyup(function(e) {
                    if(e.keyCode == 8 || e.keyCode == 46) {
                        $.datepicker._clearDate(this);
                    }
                });;

                return this;
            }
        });

        return payRollListView;
    });
