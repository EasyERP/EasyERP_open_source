/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
define(['text!templates/bonusType/list/listTemplate.html'], function (listTemplate) {
    var bonusTypeListItemView = Backbone.View.extend({

        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
            this.page = options.page ? parseInt(options.page, 10) : 1;
            this.startNumber = (this.page - 1) * options.itemsNumber;

            if (!this.startNumber) {
                this.startNumber = 0;
            }
        },

        render: function () {
            var collect = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {bonusTypeCollection: collect, startNumber: this.startNumber}));
        }
    });

    return bonusTypeListItemView;
});
