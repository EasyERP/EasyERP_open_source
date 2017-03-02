define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesInvoices/list/ListHeader.html',
    'views/salesInvoices/CreateView',
    'views/salesInvoices/EditView',
    'models/InvoiceModel',
    'views/salesInvoices/list/ListItemView',
    'collections/salesInvoices/filterCollection',
    'views/Filter/filterView',
    'common',
    'dataService',
    'helpers',
    'constants'
], function (Backbone,
             $,
             _,
             listViewBase,
             listTemplate,
             CreateView,
             EditView,
             InvoiceModel,
             ListItemView,
             contentCollection,
             FilterView,
             common,
             dataService,
             helpers,
             CONSTANTS) {
    'use strict';

    var InvoiceListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.SALESINVOICES,
        changedModels    : {},
        hasPagination    : true,
        baseFilter       : {
            name : 'forSales',
            value: {
                key  : 'forSales',
                type : 'boolean',
                value: [true]
            }
        },

        initialize: function (options) {
            $(document).off('click');

            this.formUrl = 'easyErp/' + this.contentType + '/tform/';
            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter ? options.filter : {};
            this.filter.forSales = {key: 'forSales', value: [true], type: 'boolean'};
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            listViewBase.prototype.initialize.call(this, options);
        },


        saveItem: function () {
            var model;
            var self = this;
            var id;
            var i;
            var keys = Object.keys(this.changedModels);

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
                model = this.collection.get(id);

                model.save({
                    validated: self.changedModels[id].validated
                }, {
                    headers: {
                        mid: 55
                    },

                    patch   : true,
                    validate: false,
                    success : function () {
                        $('#top-bar-saveBtn').hide();
                    }
                });
            }

            this.changedModels = {};

        },

        currentEllistRenderer: function (self) {
            var $currentEl = self.$el;
            var itemView;

            $currentEl.append(_.template(listTemplate, {currentDb: true}));
            itemView = new ListItemView({
                collection : self.collection,
                page       : self.page,
                itemsNumber: self.collection.namberToShow
            });

            $currentEl.append(itemView.render());
        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            this.currentEllistRenderer(self);

            // self.renderPagination($currentEl, self);
            // self.renderFilter(self, {name: 'forSales', value: {key: 'forSales', value: [true]}});

            this.recalcTotal();

            // $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');
        },

        recalcTotal: function () {
            var self = this;
            var columns = ['balance', 'total', 'paid'];

            _.each(columns, function (col) {
                var sum = 0;

                _.each(self.collection.toJSON(), function (model) {
                    if (col === 'paid') {
                        sum += parseFloat(model[col]);
                    } else {
                        sum += parseFloat(model.paymentInfo[col]);
                    }
                });

                self.$el.find('#' + col).text(helpers.currencySplitter(sum.toFixed(2)));
            });
        },

        importFromMagento: function () {
            var url = '/integration/invoices';
            var self = this;

            dataService.getData(url, {}, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }

                self.render();
            });
        },

        exportToMagento: function () {
            var url = '/integration/invoices';
            var data = {};
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#listTable');
            var temportaryArr = [];
            var invoices = [];
            var $checkedInputs;
            var $el;

            $checkedInputs = $table.find('input:checked');

            $.each($checkedInputs, function () {
                $el = $(this);

                invoices.push($el.val());
            });

            data = {
                entity: invoices
            };

            dataService.postData(url, data, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }
                alert(result.success);
            });
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (!id) {
                return;
            }

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;

            Backbone.history.navigate(url, {trigger: true});
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new InvoiceModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/invoices/';
            model.fetch({
                data: {
                    id       : id,
                    currentDb: App.currentDb,
                    viewType : 'form'
                },

                success: function (model) {
                    return new EditView({model: model});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        }

    });

    return InvoiceListView;
});
