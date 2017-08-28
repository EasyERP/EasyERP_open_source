define(['Backbone',
    'Underscore',
    'text!templates/billOfMaterials/list/ListTemplate.html'
], function (Backbone, _, listTemplate) {
    'use strict';
    var BillOfMaterialsItemView = Backbone.View.extend({
        el         : '#listTable',
        contentType: 'billOfMaterials',

        events: {
            'click td:not(.notForm)': 'goToForm'
        },

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize;
            this.formUrl = '#easyErp/' + this.contentType + '/tform/';
        },

        goToForm: function (e) {
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
            this.$el.append(_.template(listTemplate, {
                billOfMaterialsCollection: this.collection.toJSON()
            }));
        }
    });

    return BillOfMaterialsItemView;
});