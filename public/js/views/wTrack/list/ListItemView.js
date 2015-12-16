define([
        'text!templates/wTrack/list/ListTemplate.html'
    ],

    function (listTemplate) {
        var QuotationListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.page = options.page ? options.page : 1;

                this.startNumber = (this.page - 1 ) * options.itemsNumber;
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
