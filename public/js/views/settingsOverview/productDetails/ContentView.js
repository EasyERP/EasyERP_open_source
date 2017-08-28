define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/TabsTemplate.html',
    'collections/warehouse/filterCollection',
    'collections/priceLists/filterCollection',
    'collections/productType/filterCollection',
    'collections/productSettings/filterCollection',
    'collections/shippingMethod/filterCollection',
    'collections/Products/ProductCategories',
    'views/settingsOverview/productDetails/warehouse/warehouseView',
    'views/settingsOverview/productDetails/priceLists/ListView',
    'views/settingsOverview/productDetails/productTypes/ListView',
    'views/settingsOverview/productDetails/productOptions/ListView',
    'views/settingsOverview/productDetails/shippingMethod/ListView',
    'views/settingsOverview/productDetails/productCategories/IndexView'
], function (Backbone, $, _, Parent, DashboardTemplate, WarehouseCollection, PriceListsCollection, ProductTypesCollection, ProductOptionsCollection, ShippingMethodCollection, ProductCategoriesCollection, WarehouseView, PriceListsView, ProductTypesView, ProductOptionsView, ShippingMethodView, ProductCategoriesView) {

    var ContentView = Parent.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;

            $('#top-bar').hide();

            this.watehouseCollection = new WarehouseCollection();
            this.priceListsCollection = new PriceListsCollection();
            this.productTypesCollection = new ProductTypesCollection();
            this.productOptionsCollection = new ProductOptionsCollection();
            this.shippingMethodCollection = new ShippingMethodCollection();
            this.productCategoriesCollection = new ProductCategoriesCollection({forParent: false});

            this.watehouseCollection.bind('reset', this.renderWarehouse, this);
            this.priceListsCollection.bind('reset', this.renderPriceLists, this);
            this.productTypesCollection.bind('reset', this.renderProductTypes, this);
            this.productOptionsCollection.bind('reset', this.renderProductOptions, this);
            this.shippingMethodCollection.bind('reset', this.renderShipping, this);
            this.productCategoriesCollection.bind('reset', this.renderProductCategories, this);

            this.render();
        },

        renderWarehouse: function () {
            new WarehouseView({
                collection: this.watehouseCollection
            }).render();
        },

        renderShipping: function () {
            new ShippingMethodView({
                collection: this.shippingMethodCollection
            }).render();
        },

        renderProductTypes: function () {
            new ProductTypesView({
                collection: this.productTypesCollection
            }).render();
        },

        renderProductOptions: function () {
            new ProductOptionsView({
                collection: this.productOptionsCollection
            }).render();
        },

        renderPriceLists: function () {
            new PriceListsView({
                collection: this.priceListsCollection
            }).render();
        },

        renderProductCategories: function () {
            new ProductCategoriesView({
                collection: this.productCategoriesCollection
            }).render();
        },

        render: function () {
            var formString = this.template();

            this.$el.html(formString);

            return this;
        }

    });

    return ContentView;
});
