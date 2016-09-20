define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Quotations/list/ListHeader.html',
    'text!templates/stages.html',
    'views/Quotations/CreateView',
    'views/Quotations/list/ListItemView',
    'views/Orders/list/ListTotalView',
    'views/Quotations/EditView',
    'models/QuotationModel',
    'collections/Quotations/filterCollection',
    'services/projects',
    'dataService',
    'constants',
    'helpers'
], function (Backbone,
             $,
             _,
             ListViewBase,
             listTemplate,
             stagesTemplate,
             CreateView,
             ListItemView,
             ListTotalView,
             EditView,
             CurrentModel,
             contentCollection,
             selectService,
             dataService,
             CONSTANTS,
             helpers) {
    'use strict';

    var QuotationListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.QUOTATIONS,
        EditView         : EditView,
        viewType         : 'list', // needs in view.prototype.changeLocationHash
        forSales         : false,
        hasPagination    : true,

        events: {
            'click .stageSelect'     : selectService.showStageSelect,
            'click .newSelectList li': 'chooseOption'
        },

        initialize: function (options) {
            var self = this;
            $(document).off('click');

            this.formUrl = 'easyErp/' + this.contentType + '/tform/';
            self.startTime = options.startTime;
            self.collection = options.collection;
            self.parrentContentId = options.collection.parrentContentId;
            self.sort = options.sort;
            self.filter = options.filter || {};
            self.filter.forSales = {
                key  : 'forSales',
                type : 'boolean',
                value: [self.forSales]
            };
            self.page = options.collection.currentPage;
            self.contentCollection = contentCollection;

            ListViewBase.prototype.initialize.call(self, options);

            self.stages = [];
        },

        hideNewSelect: selectService.removeNewSelect,

        chooseOption: function (e) {
            var self = this;
            var target$ = $(e.target);
            var targetElement = target$.parents('td');
            var id = targetElement.attr('id');
            var model = this.collection.get(id);

            model.save({
                workflow: target$.attr('id')
            }, {
                headers: {
                    mid: 55
                },

                patch   : true,
                validate: false,
                success : function () {
                    // self.showFilteredPage({}, self); - this code was at salesQuotation list view
                    self.showFilteredPage(self.filter, self);
                }
            });

            this.hideNewSelect();
            return false;
        },

        recalcTotal: function () {
            var $thisEl = this.$el;
            var total = 0;
            var unTaxed = 0;

            _.each(this.collection.toJSON(), function (model) {
                var rate;

                if (model.currency && model.currency.rate) {
                    rate = model.currency.rate;
                    total += parseFloat(model.paymentInfo.total / rate);
                    unTaxed += parseFloat(model.paymentInfo.unTaxed / rate);
                } else {
                    total += parseFloat(model.paymentInfo.total);
                    unTaxed += parseFloat(model.paymentInfo.unTaxed);
                }
            });

            $thisEl.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
            $thisEl.find('#unTaxed').text(helpers.currencySplitter(unTaxed.toFixed(2)));
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        /*goToEditDialog: function (e) {
         var self = this;
         var id = $(e.target).closest('tr').attr('data-id');
         var model = new CurrentModel({validate: false});

         e.preventDefault();

         model.urlRoot = '/quotations/';
         model.fetch({
         data: {
         id      : id,
         viewType: 'form'
         },

         success: function (model) {
         return new self.EditView({model: model});
         },

         error: function () {
         App.render({
         type   : 'error',
         message: 'Please refresh browser'
         });
         }
         });
         },*/

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(this.listTemplate));
            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render()); // added two parameters page and items number

            $currentEl.append(new ListTotalView({element: $currentEl.find('#listTable'), cellSpan: 3}).render());

            this.recalcTotal();
        }
    });

    return QuotationListView;
});
