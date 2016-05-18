define([
    'Backbone',
    'text!templates/wTrack/list/ListTemplate.html'
], function (Backbone, listTemplate) {
    "use strict";

    var QuotationListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.page = options.page ? parseInt(options.page) : 1;

            this.startNumber = (this.page - 1 ) * options.itemsNumber || 0;
        },
        render    : function () {
            this.$el.append(_.template(listTemplate, {
                wTracks    : this.collection.toJSON(),
                startNumber: this.startNumber
            }));
        }
    });

    return QuotationListItemView;
});
