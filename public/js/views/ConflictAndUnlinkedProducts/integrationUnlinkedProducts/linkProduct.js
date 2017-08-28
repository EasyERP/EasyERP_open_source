define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/integrationUnlinkedProducts/LinkProductTemplate.html',
    'collections/Products/filterCollection'
], function (Backbone,
             $,
             _,
             ParentView,
             LinkProductTemplate,
             SearchCollection) {
    'use strict';
    var LinkProductView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'integrationUnlinkedProducts',
        template   : _.template(LinkProductTemplate),
        events     : {
            'click #searchBtn'  : 'searchProduct',
            'click .itemForLink': 'chooseLinkedItem'
        },

        initialize: function (options) {
            this.currentModel = options.model;
            this.isFromIntegration = options.isFromIntegration;

            this.render();

            this.searchProduct();
        },

        searchProduct: function (e) {
            var $target = e ? $(e.target) : null;
            var $searchContainer = $target && $target.closest('.searchContainer');
            var $search = $target && $searchContainer.find('#searchProducts');
            var searchValue = $target ? $search.val() : '';
            var filterOpts = {
                value: searchValue
            };
            var collectionOpts = {
                page    : 1,
                showMore: false,
                reset   : true,
                filter  : filterOpts,
                viewType: 'forBundle'
            };

            e && e.preventDefault();

            if (!this.searchProdCollection) {
                this.searchProdCollection = new SearchCollection(collectionOpts);
                this.searchProdCollection.bind('reset', _.bind(this.renderSearchProducts, this));
            } else {
                this.searchProdCollection.getFirstPage(collectionOpts);
            }
        },

        renderSearchProducts: function () {
            var $thisEl = this.$el;
            var $container = $thisEl.find('#productsForLink');
            var array = this.searchProdCollection.toJSON();

            if (!array.length) {
                return $container.html('Not found anything');
            }

            $container.html('');

            _.each(array, function (item) {
                var el = '<li class="itemForLink" data-id="' + item._id + '">' + item.name + ' <span data-id="' + item._id + '"></span></li>';

                $container.append(el);
            });
        },

        linkProduct: function () {
            var linkedProductId = $('#linkedProduct').attr('data-id');
            var data = {
                action         : 'link',
                linkedProductId: linkedProductId
            };

            if (!linkedProductId) {
                return App.render({
                    message: 'Please, choose some linked product'
                });
            }

            if (this.isFromIntegration) {
                data = {
                    action         : 'singleLink',
                    linkedProductId: linkedProductId
                };

                if (!this.currentModel.toJSON().fields.hasOrder) {
                    data.withoutOrder = true;
                } else {
                    data.withoutOrder = false;
                }
            }

            this.currentModel.save(data, {
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

        chooseLinkedItem: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var $container = $thisEl.find('#linkedProduct');
            var $itemForLink = $thisEl.find('.itemForLink');
            var $el = $target.closest('.itemForLink');
            var val = $target.text();
            var id = $target.attr('data-id');

            $itemForLink.removeClass('focus');
            $el.addClass('focus');

            $container.attr('data-id', id).text(val);
        },

        render: function () {
            var self = this;
            var formString = self.template();

            self.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 800,
                title      : 'Link Product',
                buttons    : {
                    save: {
                        text : 'Link it',
                        class: 'btn blue',
                        id   : 'linkProduct',
                        click: function () {
                            self.linkProduct();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });
        }

    });

    return LinkProductView;
});


