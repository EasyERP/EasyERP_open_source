define([
        'views/listViewBase',
        'text!templates/journalEntry/list/ListHeader.html',
        'views/journalEntry/list/ListItemView',
        'models/journalEntry',
        'collections/journalEntry/filterCollection',
        'dataService',
        'custom',
        'constants',
        'helpers'
    ],

    function (listViewBase, listTemplate, listItemView, currentModel, contentCollection, dataService, custom, CONSTANTS, helpers) {
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

            events: {},

            calcTotal: function () {
                var $curEl = this.$el;
                var $rows = $curEl.find('#listTable tr').not('#listFooter');

                var total = {
                    debit : 0,
                    credit: 0
                }

                $rows.each(function (index, element) {
                    var $curElement = $(element);
                    var $debit = $curElement.find('.debit');
                    var $credit = $curElement.find('.credit');

                    var debitVal = parseInt($debit.attr('data-amount'));
                    var creditVal = parseInt($credit.attr('data-amount'));

                    total.debit += debitVal;
                    total.credit += creditVal;
                })

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
                itemView.bind('incomingStages', this.pushStages, this);


                $currentEl.prepend(itemView.render());//added two parameters page and items number

                this.renderCheckboxes();

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                total = this.calcTotal();

                $footer = $currentEl.find('#listFooter');

                $footer.find('#totalDebit').text(helpers.currencySplitter(total['debit'].toFixed(2)));
                $footer.find('#totalCredit').text(helpers.currencySplitter(total['credit'].toFixed(2)));
            }

        });

        return ListView;
    });
