define([
        'Underscore',
        'jQuery',
        'views/listViewBase',
        'text!templates/journalEntry/list/ListHeader.html',
        'views/journalEntry/list/ListItemView',
        'views/salesInvoice/EditView',
        'views/Filter/FilterView',
        'models/InvoiceModel',
        'collections/journalEntry/filterCollection',
        'constants',
        'helpers',
        'dataService',
        'common',
        'moment'
    ],

    function (_, $, listViewBase, listTemplate, ListItemView, EditView, filterView, InvoiceModel, contentCollection, CONSTANTS, helpers, dataService, common, moment) {
        'use strict';
        var ListView = listViewBase.extend({
            listTemplate            : listTemplate,
            listItemView            : ListItemView,
            filterView              : filterView,
            contentCollection       : contentCollection,
            totalCollectionLengthUrl: 'journal/journalEntry/totalCollectionLength',
            contentType             : CONSTANTS.JOURNALENTRY,

            initialize: function (options) {
                $(document).off("click");

                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.page = options.collection.page;
                this.filter = options.filter || {};

                this.render();
                this.contentCollection = contentCollection;
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            },

            events: {
                "click .Invoice": "viewSourceDocument",
                "click .jobs"   : "viewSourceDocumentJOb"
            },

            viewSourceDocument: function (e) {
                var $target = $(e.target);
                var id = $target.attr('data-id');

                var model = new InvoiceModel({validate: false});

                model.urlRoot = '/Invoice/form';
                model.fetch({
                    data   : {
                        id       : id,
                        currentDb: App.currentDb
                    },
                    success: function (model) {
                        new EditView({model: model, redirect: true, notCreate: true});
                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: 'Please refresh browser'
                        });
                    }
                });
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                var itemView;
                var page = holder.find("#currentShowPage").val();

                holder.find("#listTable").empty();

                itemView = new this.listItemView({
                    collection : newModels,
                    page       : page,
                    itemsNumber: this.defaultItemsNumber
                });

                holder.append(itemView.render());

                itemView.undelegateEvents();

                var pagination = holder.find('.pagination');
                if (newModels.length !== 0) {
                    pagination.show();
                } else {
                    pagination.hide();
                }
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.calcTotal();

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            calcTotal: function () {
                var $curEl = this.$el;
                var $rows = $curEl.find('#listTable tr').not('#listFooter');

                var total = 0;

                $rows.each(function (index, element) {
                    var $curElement = $(element);
                    var $val = $curElement.find('.value');

                    var debitVal = parseInt($val.attr('data-amount'), 10);

                    total += debitVal;
                });

                $curEl.find('#listFooter').find('#totalDebit').text(helpers.currencySplitter(total.toFixed(2)));
                return total;
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

                dataService.getData("journal/getReconcileDate", {}, function (result) {
                    $('#reconcileDate').text(common.utcDateToLocaleDate(result.date));
                    var newDate = moment(new Date());
                    var date = moment(result.date);
                    var same = false;

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

                this.renderCheckboxes();

                this.renderFilter(this);

                this.renderPagination($currentEl, this);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                this.calcTotal();
            }

        });

        return ListView;
    });
