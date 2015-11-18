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
        var payRollListView = listViewBase.extend({
            el            : '#content-holder',
            contentType: 'PayrollExpenses',
            viewType   : 'list',//needs in view.prototype.changeLocationHash
            responseObj: {},
            whatToSet  : {},
            formUrl    : "#easyErp/PayrollExpenses/form/",
            headerTemplate: _.template(headerTemplate),
            totalTemplate : _.template(totalTemplate),
            // rowTemplate   : _.template(rowTemplate),
            cancelTemplate: _.template(cancelEditTemplate),
            changedModels : {},

            events: {
                "click #mainRow td:not(.notForm)": "gotoForm"
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

            generate: function () {
                var keys = [];

                this.total.forEach(function(el){
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

                return this;
            }
        });

        return payRollListView;
    });
