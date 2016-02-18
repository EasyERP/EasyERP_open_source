define([
        'views/listViewBase',
        'text!templates/journalEntry/list/ListHeader.html',
        'views/journalEntry/list/ListItemView',
        'views/salesInvoice/EditView',
        'models/InvoiceModel',
        'collections/journalEntry/filterCollection',
        'constants',
        'helpers',
        'dataService',
    'common',
    'moment'
    ],

    function (listViewBase, listTemplate, listItemView, EditView, InvoiceModel, contentCollection, CONSTANTS, helpers, dataService, common, moment) {
        var ListView = listViewBase.extend({
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            totalCollectionLengthUrl: '/journalEntry/totalCollectionLength',
            contentType             : CONSTANTS.JOURNALENTRY,

            initialize: function (options) {
                $(document).off("click");

                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.page = options.collection.page;

                this.render();
                this.contentCollection = contentCollection;
            },

            events: {
                "click .Invoice": "viewSourceDocument",
                "click .jobs": "viewSourceDocumentJOb"
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
                        new EditView({model: model, redirect: true, collection: this.collection, notCreate: true});
                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: 'Please refresh browser'
                        });
                    }
                });
            },

            calcTotal: function () {
                var $curEl = this.$el;
                var $rows = $curEl.find('#listTable tr').not('#listFooter');

                var total = {
                    debit : 0,
                };

                $rows.each(function (index, element) {
                    var $curElement = $(element);
                    var $val = $curElement.find('.value');

                    var debitVal = parseInt($val.attr('data-amount'));

                    total.debit += debitVal;
                });

                return total;
            },

            render: function () {
                var $currentEl;
                var itemView;
                var total;
                var $footer;

                $('.ui-dialog ').remove();

                $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));
                itemView = new listItemView({
                    collection : this.collection,
                    itemsNumber: this.collection.namberToShow
                });

                dataService.getData("journal/getReconcileDate", {}, function (result) {
                    $('#reconcileDate').text(common.utcDateToLocaleDate(result.date));
                    var newDate = moment(new Date());
                    var date = moment(result.date);
                    var same = false;

                    if (newDate.isSame(date, 'month year date')){
                        same = true;
                    }

                    if (same){
                        $('#reconcileBtn').addClass('btnSuccess');
                    } else {
                        $('#reconcileBtn').addClass('btnAttention');
                    }

                });

                $currentEl.prepend(itemView.render());//added two parameters page and items number

                this.renderCheckboxes();

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                total = this.calcTotal();

                $footer = $currentEl.find('#listFooter');

                $footer.find('#totalDebit').text(helpers.currencySplitter(total['debit'].toFixed(2)));
                //$footer.find('#totalCredit').text(helpers.currencySplitter(total['credit'].toFixed(2)));
            }

        });

        return ListView;
    });
