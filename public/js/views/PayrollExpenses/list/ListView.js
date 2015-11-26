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
                "click .statusCheckbox": "statusCheck",
                "click tr.mainRow"     : "gotoForm",
                "click .datePicker"    : "datePickerClick",
                "change .datePicker"   : "datePickerChange",
                "click .totalRowCB"    : "dataKeyCbCheck"
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

            dataKeyCbCheck: function (e) {
                e.stopPropagation();

                if (this.changesCount !== 0) {
                    return false;
                }

                var $target = $(e.target);

                var id = $target.attr('id');
                var $curEl = this.$el
                var $allCheckBoxes;
                var $checkedCB;
                var status;

                if (id && id === 'check_all') {
                    status = $target.prop('checked');
                    $allCheckBoxes = $curEl.find('.totalRowCB').not($target);
                    $allCheckBoxes.prop('checked', status);
                }

                $checkedCB = this.$el.find('.totalRowCB:checked');

                if ($checkedCB.length) {
                    this.showHideSaveCancelBtns({delete: true});
                } else {
                    this.showHideSaveCancelBtns({delete: false});
                }
            },

            datePickerClick: function (e) {
                e.stopPropagation();

                var $target = $(e.target);
                var $input = $target.is('input') ? $target : $(e.target).find('input');

                this.$el.find('.datePicker input').not($input).prop('disabled', true);

                $input.prop('disabled', false);

                console.log();
            },

            datePickerChange: function (e) {
                e.stopPropagation();
                var $input = $(e.target).closest('input');
                var inputVal = $input.datepicker("getDate");
                var $td = $input.closest('td');

                var $tr = $td.closest('tr');
                var dataKey = $tr.attr('id');

                var defVal = $td.attr('data-val');

                if (!this.changedPeriods[dataKey]) {
                    this.changedPeriods[dataKey] = {};
                }

                inputVal = inputVal ? inputVal.toString() : '';

                if (defVal !== inputVal) {
                    this.changedPeriods[dataKey].date = inputVal;
                    this.changesCount++;
                } else {
                    delete this.changedPeriods[dataKey].date;
                    this.changesCount--;
                }

                $input.prop('disabled', true);
                this.showHideSaveCancelBtns();
            },

            showHideSaveCancelBtns: function (options) {
                var $btnHolder = $('.createBtnHolder');
                var $saveBtn = $btnHolder.find('#top-bar-saveBtn');
                var $deleteBtn = $btnHolder.find('#top-bar-deleteBtn');

                if (!options) {
                    if (this.changesCount) {
                        options = {save: true, delete: true};
                    } else {
                        options = {save: false, delete: false};
                    }
                }

                options.save ? $saveBtn.show() : $saveBtn.hide();
                options.delete ? $deleteBtn.show() : $deleteBtn.hide();
            },

            saveItem: function () {
                var self = this;

                dataService.patchData("/payroll/byDataKey", JSON.stringify(self.changedPeriods), function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    self.changesCount = 0;
                    self.changedPeriods = {};

                    self.showHideSaveCancelBtns();
                }, 'application/json');
            },

            deleteItems: function () {
                var self = this;
                var checkboxes;
                var checkboxesValues = [];
                var keys;
                var $tr;
                var $statusCb;
                var $dateTd;

                var curDataKey;

                if (this.changesCount) {
                    keys = Object.keys(this.changedPeriods);

                    for (var i = keys.length - 1; i >= 0; i--) {
                        $tr = $('#' + keys[i]);

                        $statusCb = $tr.find('.statusCheckbox .checkbox');
                        $dateTd = $tr.find('.datePicker');

                        $statusCb.find('.checkbox').prop('checked', !$statusCb.prop('checked'));
                        $dateTd.find('input').datepicker('setDate', new Date($dateTd.attr('data-val')));
                    }
                } else {
                    checkboxes = this.$el.find('.totalRowCB:checked');

                    $.each(checkboxes, function () {
                        checkboxesValues.push($(this).attr('data-id'));
                    })

                    dataService.deleteData("/payroll/byDataKey", JSON.stringify({dataKeys: checkboxesValues}), function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        for (var i = checkboxes.length - 1; i >= 0; i--) {

                            curDataKey = $(checkboxes[i]).attr('data-id');

                            checkboxes[i].closest('tr').remove();

                            self.total = _.reject(self.total, function (el) {
                                return Object.keys(el)[0] === curDataKey;
                            });
                        }
                    }, 'application/json');
                }

                self.showHideSaveCancelBtns({save: false, delete: false});
            },

            statusCheck: function (e) {
                e.stopPropagation();

                var $target = $(e.target);
                var isCheckBox = $target.hasClass('checkbox');
                var $checkbox = isCheckBox ? $target : $target.find('.checkbox');
                var state = $checkbox.prop('checked');
                var $tr = $target.closest('tr');
                var dataKey = $tr.attr('id');

                if (!isCheckBox) {
                    $checkbox.prop('checked', !state);
                }

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

                this.showHideSaveCancelBtns();
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
                var id = $(e.target).closest("tr").attr("id");
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
                    weekSplitter    : helpers.weekSplitter,
                    moment          : moment,
                }));

                this.hideSaveCancelBtns();

                $('#top-bar-deleteBtn').hide();
                $('#top-bar-createBtn').hide();
                $('#topBarPaymentGenerate').hide();

                currentEl.find('.datePicker input').datepicker({
                    dateFormat : "dd/mm/yy",
                    changeMonth: true,
                    changeYear : true
                }).keyup(function (e) {
                    if (e.keyCode == 8 || e.keyCode == 46) {
                        $.datepicker._clearDate(this);
                    }
                });
                ;

                return this;
            }
        });

        return payRollListView;
    });
