define(['Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'models/billOfMaterials',
    'text!templates/billOfMaterials/list/listHeader.html',
    'views/billOfMaterials/list/ListItemView',
    'constants',
    'dataService'
], function (Backbone, $, _, ListViewBase, BillOfMaterialsModel, listTemplate, ListItemView, CONSTANTS, dataService) {
    'use strict';

    var BillOfMaterials = ListViewBase.extend({
        listTemplate: listTemplate,
        contentType : 'billOfMaterials',
        ListItemView: ListItemView,

        initialize: function (options) {
            this.collection = options.collection;
            this.page = options.collection.page;
            this.filter = options.filter;

            ListViewBase.prototype.initialize.call(this, options);

            // this.render();
        },

        hideNewSelect: function () {
            $('.newSelectList').remove();
        },

        render: function () {
            var self;
            var $currentEl;

            self = this;

            $currentEl = this.$el;
            $currentEl.html('');

            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            this.renderPagination($currentEl, this);

        }
    });
    return BillOfMaterials;
});