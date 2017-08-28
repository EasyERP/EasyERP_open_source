define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'collections/conflicts/filterCollection',
    'text!templates/integrationUnlinkedProducts/list/ListHeader.html',
    'views/ConflictAndUnlinkedProducts/integrationUnlinkedProducts/list/ListItemView',
    'views/ConflictAndUnlinkedProducts/integrationUnlinkedProducts/linkProduct',
    'views/ConflictAndUnlinkedProducts/integrationUnlinkedProducts/buildProduct',
    'dataService'
], function (Backbone, $, _, listViewBase, UnlinkedCollection, listTemplate, ListItemView, LinkProductView, BuildProductView, dataService) {
    'use strict';
    var unlinkedListView = listViewBase.extend({
        el          : '#unlinkedProducts',
        viewType    : 'list',
        contentType : 'integrationUnlinkedProducts',
        ListItemView: ListItemView,

        initialize: function (options) {

            var unlinkedCollection = new UnlinkedCollection({
                viewType        : 'list',
                page            : 1,
                reset           : true,
                count           : 50,
                filter          : options.filter,
                parrentContentId: null,
                contentType     : 'integrationUnlinkedProducts',
                showMore        : false
            });
            unlinkedCollection.bind('reset', this.render, this);

            this.filter = JSON.parse(options.filter);
        },

        events: {
            'click tr .toBuild'      : 'toBuild',
            'click tr .toLink'       : 'toLink',
            'click .toCancelBuild'   : 'toCancelBuild',
            'click .toUnlink'        : 'toUnlink',
            'click #unlinked-saveBtn': 'saveItem'
        },

        saveItem: function () {
            var id = this.filter && this.filter.order ? this.filter.order.value[0] : null;
            var channel = this.filter && this.filter.channel ? this.filter.channel : null;
            var url = this.isFromForm ? 'easyErp/order/tform/' + id : window.location.hash;

            if (!id) {
                id = channel;
            }

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

            // if (this.isFromIntegration) { // changed logic with unlinked view
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
            // }

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

        render: function (models) {
            var $currentEl = this.$el;
            var unlinkedProduct;

            this.collection = models;

            this.isFromIntegration = window.location.hash.indexOf('fromIntegration') > -1;
            this.isFromForm = window.location.hash.indexOf('fromForm') > -1;

            if (!this.isFromIntegration) {
                unlinkedProduct = this.collection.toJSON().find(function (product) {
                    return !product.fields.isBuilt && !product.fields.linkedProductId;
                });

                if (!unlinkedProduct) {
                    $('#unlinked-saveBtn').show();
                }
            }

            $currentEl.html('');

            $currentEl.append(_.template(listTemplate));

            if (!this.collection.length) {
                return $currentEl.find('._integrationProductsTable').html('<div id="conflictInformation">Unlinked products not found</div>');
            }
            $currentEl.append((new ListItemView({
                collection     : this.collection,
                fromIntegration: this.isFromIntegration
            }).render()));
        }
    });

    return unlinkedListView;
});
