define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/priceLists/list/ListHeader.html',
    'views/priceLists/CreateView',
    'views/priceLists/list/ListItemView',
    'views/priceLists/EditView',
    'models/PriceListsModel',
    'collections/priceLists/filterCollection',
    'common',
    'constants'
], function (
    Backbone,
    $,
    _,
    listViewBase,
    listTemplate,
    CreateView,
    ListItemView,
    EditView,
    CurrentModel,
    contentCollection,
    common,
    CONSTANTS) {
    'use strict';

    var SettingsProductsListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        formUrl          : '#easyErp/priceLists/tform/',
        contentType      : CONSTANTS.PRICELISTS,
        hasPagination    : false,

        events: {
            'click .stageSelect'         : 'showNewSelect',
            'click .newSelectList li'    : 'chooseOption'
            //'click #convertToOpportunity': 'openDialog'
        },

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;
            this.stages = [];

            listViewBase.prototype.initialize.call(this, options);
        },

        chooseOption: function (e) {
            var self = this;
            var target$ = $(e.target);
            var targetElement = target$.parents('td');
            var id = targetElement.attr('id');
            var model = this.collection.get(id);

            model.save({workflow: target$.attr('id')}, {
                headers: {
                    mid: 24
                },
                patch  : true,
                success: function () {
                    self.showFilteredPage(self.filter, self);
                }
            });

            this.hideNewSelect();
            return false;
        },

        pushStages: function (stages) {
            this.stages = stages;
        },

        render: function () {
            var self = this;
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));

            itemView = new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            });

            itemView.bind('incomingStages', this.pushStages, this);

            $currentEl.append(itemView.render());

        },

        hideNewSelect: function () {
            $('.newSelectList').remove();
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
                return false;
            }
            $(e.target).parent().append(_.template(stagesTemplate, {stagesCollection: this.stages}));
            return false;
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
        }
    });

    return SettingsProductsListView;
});
