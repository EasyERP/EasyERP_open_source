define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/wTrack/createJob.html',
    'populate',
    'services/productCategories'
], function (Backbone, $, _, Parent, generateTemplate, populate, productCategoriesService) {
    'use strict';

    var CreateView = Parent.extend({
        template   : _.template(generateTemplate),
        responseObj: {},

        events: {
            keydown                  : 'keyDownHandler',
            'click #showBtn'         : productCategoriesService.showCategories,
            'change .productCategory': productCategoriesService.changeCategory,
            'click .deleteTag '      : productCategoriesService.deleteCategory
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                case 13:
                    this.generateItems(e);
                    break;
                default:
                    break;
            }
        },

        initialize: function (options) {
            this.model = options.model;

            this.createJob = options.createJob;
            this.wTrackView = options.wTrackView;

            this.modelJSON = this.model.id ? this.model.toJSON() : this.model;

            _.bindAll(this, 'generateItems');

            this.render();
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var text = $target.text();
            var $ul = $target.closest('ul');
            var $element = $ul.closest('dd').find('a');

            $element.attr('data-id', id);
            $element.text(text);

            $ul.remove();

            return false;
        },

        stopDefaultEvents: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        hideDialog: function () {
            $('.wTrackDialog').remove();
        },

        generateItems: function (e) {
            var self = this;
            var jobName = $('#jobName').val();
            var nameRegExp = /^[a-zA-Z0-9\s][a-zA-Z0-9-,\s\.\/\s]+$/;
            var data = {};
            var warehouse = this.$el.find('#warehouse').attr('data-id');
            var productType = this.$el.find('#productType').attr('data-id');
            var categoryIds = [];
            var categoryElements = this.$el.find('.checkedProductCategory');

            if (categoryElements && categoryElements.length) {
                categoryElements.each(function (key, item) {
                    categoryIds.push($(item).data('id'));
                });
            }

            data.project = self.modelJSON._id || self.modelJSON;
            data.name = jobName;
            data.warehouse = warehouse;
            data.productType = productType;
            data.categoryIds = categoryIds;

            if (!categoryIds.length) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose Product Categories!'
                });
            }

            if (!productType) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose Product Type!'
                });
            }

            if (!warehouse) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose warehouse!'
                });
            }

            this.stopDefaultEvents(e);

            if (nameRegExp.test(jobName)) {
                $.ajax({
                    type       : 'Post',
                    url        : '/jobs/',
                    contentType: 'application/json',
                    data       : JSON.stringify(data),

                    success: function () {
                        self.hideDialog();

                        if (self.wTrackView && typeof (self.wTrackView.generatedWtracks) === 'function') {
                            return self.wTrackView.generatedWtracks();
                        }
                    },

                    error: function () {
                        App.render({
                            type   : 'error',
                            message: 'Error'
                        });
                    }
                });
            } else {
                App.render({
                    type   : 'error',
                    message: 'Please, enter correct Job name!'
                });
            }
        },

        render: function () {
            var self = this;
            var project = this.model.id ? this.model.toJSON() : this.model;
            var dialog = this.template({
                project  : project,
                createJob: self.createJob
            });

            if (!project) {
                return;
            }

            this.$el = $(dialog).dialog({
                dialogClass: 'wTrackDialog',
                width      : 300,
                title      : 'Create Sprint',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn',
                        id   : 'generateBtn',
                        click: self.generateItems
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        id   : 'cancelBtn',

                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            populate.get('#productType', '/products/getProductsTypeForDd', {}, 'name', self, true);
            populate.get('#warehouse', '/warehouse/getForDD', {}, 'name', self, true);

            productCategoriesService.renderProductCategories.call(self);

            return this;
        }
    });

    return CreateView;
});
