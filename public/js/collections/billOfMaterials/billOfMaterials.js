define([
        'Backbone',
        'models/billOfMaterials',
        'constants'
    ],
    function (Backbone, BillOfMaterialsModel, CONSTANTS) {
        'use strict';

        var BillOfMaterialsCollection = Backbone.Collection.extend({
            model: BillOfMaterialsModel,
            url  : CONSTANTS.URLS.BILLOFMATERIALS,

            initialize: function (options) {

                this.fetch({
                    data   : options,
                    reset  : true,

                    success: function () {
                    },

                    error  : function (models, xhr) {
                        if (xhr.status === 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            },

            parse: function (response) {
                var items = response.success;
                if (items && items.length) {
                    items.forEach(function(item){
                        item.variants = _.pluck(item.variants, 'value').join(', ');
                    });
                } // in case of needed special parse variants on this collection, but collection use common model
                return items;
            }
        });
        return BillOfMaterialsCollection;
    });