define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/projectsDashboard/list/ListHeader.html',
    'text!templates/projectsDashboard/list/ListTemplate.html',
    'views/projectsDashboard/list/ListItemView',
    'collections/projectsDashboard/filterCollection',
    'async',
    'helpers',
    'dataService'
], function ($, _, listViewBase, listHeaderTemplate, listTemplate, ListItemView, contentCollection, async, helpers, dataService) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'projectsDashboard',
        changedModels    : {},
        responseObj      : {},

        initialize: function (options) {
            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            listViewBase.prototype.initialize.call(this, options);
        },

        events: {
            'click .mainTr': 'showHidden'
        },

        showHidden: function (e) {
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var dataId = $tr.attr('data-id');
            var $body = this.$el;
            var childTr = $body.find('[data-main="' + dataId + '"]');
            var sign = $.trim($tr.find('.expand').text());

            if (sign === '+') {
                $tr.find('.expand').text('-');
            } else {
                $tr.find('.expand').text('+');
            }

            childTr.toggleClass('hidden');
        },

        asyncRenderInfo: function (asyncKeys) {
            var self = this;
            var body = this.$el.find('#listTable');
            var total = 0;

            async.each(asyncKeys, function (asyncId, cb) {
                dataService.getData('jobs/getAsyncData', {
                    _id: asyncId,
                    filter: self.filter
                }, function (result) {
                    var items = result.data;
                    var totalSum = 0;
                    var mainTr = body.find('[data-id="' + asyncId + '"]');

                    if (!asyncId) {
                        mainTr = body.find('[data-id="null"]');
                    }
                    items.forEach(function (el) {
                        totalSum += el.quotation ? el.quotation.paymentInfo.total / (el.quotation.currency.rate || 1) : 0;
                        mainTr.after("<tr data-main='" + asyncId + "' class='hidden _pms-tr'><td><a href='" + '#easyErp/Projects/form/' + el.project._id + "'>" + el.project.name + "</a></td><td>" + (el.customer ? el.customer.name : '') + "</td><td>" + el.name + "</td><td class='money'>" + (el.quotation ? helpers.currencySplitter((el.quotation.paymentInfo.total / (el.quotation.currency.rate || 1) / 100).toFixed(2)) : 0) + "</td></tr>");
                    });

                    mainTr.find('.sum').text(helpers.currencySplitter((totalSum / 100).toFixed(2)));

                    total += totalSum;

                    cb(null, result);
                });

            }, function () {
                self.$el.find('#totalSum').text(helpers.currencySplitter((total / 100).toFixed(2)));
            });
        },

        showMoreContent: function (newModels) {
            var $holder = this.$el;
            var itemView;
            var asyncKeys = [];

            $holder.find('#listTable').empty();

            itemView = new this.ListItemView({
                collection : newModels,
                page       : this.collection.currentPage,
                itemsNumber: this.collection.pageSize
            });

            $holder.append(itemView.render());

            newModels.toJSON().forEach(function (el) {
                asyncKeys.push(el._id._id || null);
            });

            this.asyncRenderInfo(asyncKeys);

            itemView.undelegateEvents();
        },


        render: function () {
            var $currentEl;
            var itemView;
            var self = this;
            var template;
            var asyncKeys = [];

            template = _.template(listTemplate);
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.html(_.template(listHeaderTemplate));

            itemView = new ListItemView({
                collection : this.collection,
                itemsNumber: this.collection.namberToShow
            });

            $currentEl.append(itemView.render());// added two parameters page and items number

            this.collection.toJSON().forEach(function (el) {
                asyncKeys.push(el._id._id || null);
            });

            this.asyncRenderInfo(asyncKeys);
        }

    });

    return ListView;
});
