define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/IntMagentoTemplate.html',
    'views/dialogViewBase',
    'models/ProductModel',
    'collections/Products/filterCollection',
    'common',
    'populate',
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView',
    'dataService',
    'constants'
], function (Backbone, $, _, IntMagentoTemplate,  ParentView, ProductModel, SearchCollection, common, populate, AttachView, AssigneesView, dataService, CONSTANTS) {

    var IntMagentoView = ParentView.extend({
        el                  : '#content-holder',
        template            : _.template(IntMagentoTemplate),
        imageSrc            : '',
        searchProdCollection: null,

        initialize: function (options) {
            this.eventChannel = options.eventChannel;
            this.bundleObj = {};

            //_.bindAll(this, 'saveItem');

            if (options && options.contentType) {
                this.contentType = options.contentType;
            } else {
                this.contentType = CONSTANTS.PRODUCTS;
            }

            this.viewType = options.viewType || 'list';

            this.model = new ProductModel();
            this.responseObj = {};
            this.render();
        },

        events: {
            'click #searchBtn'       : 'searchProduct',
            'click .itemForBundle'   : 'addToBundle',
            'click .removeBundle'    : 'removeBundle',
            'click #showBtn'         : 'showCategories',
            'change .productCategory': 'changeCategory'
        },

        eventType: function () {
            var $container = this.$('#typeOfEvent');

            return $container.toggleClass('hidden');
        },

        render: function () {
            var formString;
            var self = this;

            formString = self.template({
                contentType: self.contentType
            });

            self.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 800,
                title      : 'Import from Magento',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        id   : 'createBtnDialog',
                        click: self.saveItem
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

            //common.canvasDraw({model: self.model.toJSON()}, self);

            self.delegateEvents(self.events);

            return self;
        }

    });

    return IntMagentoView;
});
