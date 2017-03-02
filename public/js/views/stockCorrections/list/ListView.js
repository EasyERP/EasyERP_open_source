define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/stockCorrections/list/listHeader.html',
    'views/stockCorrections/CreateView',
    'views/stockCorrections/list/ListItemView',
    'models/stockCorrectionModel',
    'collections/stockCorrections/filterCollection',
    'constants'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, CurrentModel, contentCollection, CONSTANTS) {
    'use strict';

    var bonusTypeListView = ListViewBase.extend({
        CreateView   : CreateView,
        viewType     : 'list',
        responseObj  : {},
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : CONSTANTS.STOCKCORRECTIONS,
        changedModels: {},
        hasPagination: true,

        initialize: function (options) {
            $(document).off('click');

            this.CurrentModel = CurrentModel;

            this.formUrl = 'easyErp/' + this.contentType + '/tform/';

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            ListViewBase.prototype.initialize.call(this, options);

            this.render();
        },

        events: {
            'click .stageSelect'                               : 'showNewSelect',
            'click td.editable'                                : 'editRow',
            click                                              : 'hideItemsNumber',
            'change .editable '                                : 'setEditable',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
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

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.numberToShow
            }).render());

            return this;
        }
    });

    return bonusTypeListView;
});

