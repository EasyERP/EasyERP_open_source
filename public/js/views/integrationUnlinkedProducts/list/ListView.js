define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/integrationUnlinkedProducts/list/ListHeader.html',
    'views/integrationUnlinkedProducts/list/ListItemView',
    'views/integrationUnlinkedProducts/linkProduct',
    'views/integrationUnlinkedProducts/buildProduct',
    'dataService'
], function (Backbone, $, _, listViewBase, listTemplate, ListItemView, LinkProductView, BuildProductView, dataService) {
    'use strict';
    var unlinkedListView = listViewBase.extend({
        el          : '#content-holder',
        viewType    : 'list',
        contentType : 'integrationUnlinkedProducts',
        ListItemView: ListItemView,

        initialize: function (options) {
            var unlinkedProduct;
            this.isFromIntegration = window.location.hash.indexOf('fromIntegration') > -1;
            this.isFromForm = window.location.hash.indexOf('fromForm') > -1;

            if (!this.isFromIntegration) {
                unlinkedProduct = this.collection.toJSON().find(function (product) {
                    return !product.fields.isBuilt && !product.fields.linkedProductId;
                });

                if (!unlinkedProduct) {
                    $('#top-bar-saveBtn').show();
                }
            }

            this.collection = options.collection;

            this.render();
        },

        events: {
            'click tr .toBuild'   : 'toBuild',
            'click tr .toLink'    : 'toLink',
            'click .toCancelBuild': 'toCancelBuild',
            'click .toUnlink'     : 'toUnlink'
        },

        saveItem: function () {
            var id = App.filtersObject.filter.order ? App.filtersObject.filter.order.value[0] : null;
            var url = this.isFromForm ? 'easyErp/order/tform/' + id : window.location.hash;

            dataService.patchData('integration/linkOrder/' + id, null, function (err, response) {
                if (err) {
                    return App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }

                if (response) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true, replace: true});
                }
            });
        },

        updateUnlinkedProduct: function (e, data) {
            var $target = $(e.target);
            var id = $target.closest('tr').attr('data-id');
            var model = this.collection.get(id);
            var modelFields = model.toJSON().fields;

            if (data.action === 'cancelBuilt') {
                data.isValid = modelFields.nativeIsValid;
                data.name = modelFields.hasOwnProperty('nativeName') ? modelFields.nativeName : modelFields.name;
                data.sku = modelFields.hasOwnProperty('nativeSKU') ? modelFields.nativeSKU : modelFields.sku;
            }

            model.save(data, {
                patch  : true,
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        toBuild: function (e) {
            var $target = $(e.target);
            var id = $target.closest('tr').attr('data-id');
            var model = this.collection.get(id);
            var modelObj = model.toJSON();
            var data = {
                action : 'autoBuilt',
                isBuilt: true
            };

            if (!modelObj.fields.isValid) {
                return new BuildProductView({
                    model            : model,
                    isFromIntegration: this.isFromIntegration
                });
            }

            if (this.isFromIntegration) {
                if (!modelObj.fields.hasOrder) {
                    data = {
                        action      : 'singleBuilt',
                        withoutOrder: true
                    };
                } else {
                    data = {
                        action      : 'singleBuilt',
                        withoutOrder: false
                    };
                }
            }

            model.save(data, {
                patch  : true,
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        toLink: function (e) {
            var $target = $(e.target);
            var id = $target.closest('tr').attr('data-id');

            return new LinkProductView({
                model            : this.collection.get(id),
                isFromIntegration: this.isFromIntegration
            });
        },

        toCancelBuild: function (e) {
            this.updateUnlinkedProduct(e, {action: 'cancelBuilt'});
        },

        toUnlink: function (e) {
            this.updateUnlinkedProduct(e, {action: 'unlink'});
        },

        render: function () {
            var $currentEl = this.$el;

            $($currentEl).html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append((new ListItemView({
                collection     : this.collection,
                fromIntegration: this.isFromIntegration
            }).render()));
        }
    });

    return unlinkedListView;
});
