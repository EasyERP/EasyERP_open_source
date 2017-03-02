define([
    'Backbone',
    'Underscore',
    'jQuery',
    'models/OptionsValuesModel',
    'collections/productSettings/optionValuesCollection',
    'collections/productType/filterCollection',
    'text!templates/productSettings/form/FormTemplate.html',
    'constants',
    'dataService',
    'views/selectView/selectView',
    'populate',
    'moment'
], function (Backbone, _, $, OptionsValuesModel, OptionValuesCollection, ProductTypeCollection, OptionsFormTemplate, CONSTANTS, dataService, SelectView, populate, moment) {
    'use strict';

    var FormOpportunitiesView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            //var model = options.model.toJSON();

            this.optionsValuesModel = new OptionsValuesModel;
            this.formModel = options.model;
            this.formModel.urlRoot = '/products/options/';
            this.checkedPrTypes = [];
            this.responseObj = {};
            this.modelChanged = {};
            this.value = '';
        },

        events: {
            'click .deleteValue'        : 'deleteValue',
            'dblclick .valueItem'       : 'editValue',
            'click #addNewOptionsValue' : 'addNewOptionsValue',
            'click #saveNewOptionsValue': 'saveNewOptionsValue',
            'click .closeUpdateValue'   : 'closeUpdateValue',
            'click .updateValue'        : 'updateValue',
            'click #saveChangeTypes'    : 'saveChangeTypes'
        },

        hideNewSelect: function () {
            this.$el.find('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        saveNewOptionsValue: function () {
            var self = this;
            var $thisEl = this.$el;
            var $values = $thisEl.find('#optionsValues').find('.optionValue');
            var objectId = $thisEl.find('#optionsValues').data('id');
            var values = [];
            var value;

            _.forEach($values, function (item, key) {
                value = $(item).val().trim();

                if (value) {
                    values.push({
                        value   : value,
                        optionId: objectId
                    });
                }
            });

            this.optionsValuesModel.save({optionsValues: values}, {
                patch  : true,
                wait   : true,
                success: function () {
                    self.getOptionValues();
                },
                error  : function (model, response) {
                    if (response) {
                        App.render({
                            type   : 'error',
                            message: response.error
                        });
                    }
                }
            });

            $values.remove();
        },

        deleteValue: function (e) {
            var self = this;
            var $target = $(e.target);
            var deleteId = $target.closest('.valueItem').data('id');

            dataService.deleteData(CONSTANTS.URLS.SETTINGS_PRODUCTS_VALUES,
                {
                    id: deleteId
                },
                function (err, result) {
                    if (err) {
                        return  self.errorNotification(err);
                    }

                    App.render({
                        type   : 'notify',
                        message: result.success
                    });

                    self.getOptionValues();
                },
                CONSTANTS.PRODUCTS_SETTINGS
            );
        },

        updateValue: function (e) {
            var $target = $(e.target);
            var updateId = $target.closest('.valueItem').data('id');
            var self = this;
            this.value = $target.closest('.valueItem').find('input').val();

            dataService.patchData(CONSTANTS.URLS.SETTINGS_PRODUCTS_VALUES,
                {
                    _id  : updateId,
                    value: this.value
                },
                function (err, result) {
                    self.closeUpdateValue(self.value);

                    App.render({
                        type   : 'notify',
                        message: result.success
                    });

                    self.getOptionValues();
                },
                CONSTANTS.PRODUCTS_SETTINGS
            );
        },

        editValue: function (e) {
            var $target = $(e.target);

            this.closeUpdateValue();

            this.value = $target.html();

            $target.closest('.valueItem').find('.deleteValue').remove();
            $target.after('<button class="closeUpdateValue btn blue">Close</button>');
            $target.after('<button class="updateValue btn blue">Apply</button>');
            $target.replaceWith('<input id="editValue" class="_editable" type="text" value="' + this.value + '">');
        },

        closeUpdateValue: function (value) {
            var $thisEl = this.$el;
            var $target = $thisEl.find('#editValue');
            value = value || this.value;

            $target.closest('.valueItem').find('.updateValue').remove();
            $target.closest('.valueItem').find('.closeUpdateValue').remove();
            $target.after('<button class="deleteValue icon-close3"></button>');
            $target.replaceWith('<span>' + this.value + '</span>');
        },

        addNewOptionsValue: function (e) {
            var $thisEl = this.$el;
            var $boxForValues = $thisEl.find('#optionsValues');

            e.stopPropagation();
            e.preventDefault();

            $boxForValues.append('<input type="text" class="_animate optionValue">');
        },

        setChangeValueToModel: function (e) {
            var $target = $(e.target);
            var property = $target.attr('id').replace('_', '.');
            var value = $target.val();

            $target.closest('.propertyFormList').addClass('active');

            if (property === 'social.LI') {
                value = value.replace('linkedin', '[]');
            }

            this.modelChanged[property] = value;
            this.showButtons();
        },

        saveChangeTypes: function () {
            var $thisEl = this.$el;
            //var url = CONSTANTS.URLS.SETTINGS_PRODUCTS_TYPES;
            var data = {
                checkedPrTypes: this.checkedPrTypes
            };
            var productName = $thisEl.find('#name');
            var $productTypes = $thisEl.find('#productTypes');
            var checkedNow = $productTypes.find($('input:checked'));

            checkedNow = _.map(checkedNow, function (item) {
                return $(item).data('id');
            });

            data.checkedNow = checkedNow;
            data.name = productName.val();
            //data.modelId = $productTypes.data('id');

            this.formModel.save(data, {
                patch  : true,
                wait   : true,
                success: function (xhr) {
                    App.render({
                        type   : 'notify',
                        message: 'Product options saved.'
                    });
                },

                error: function (model, response) {
                    if (response) {
                        App.render({
                            type   : 'error',
                            message: response.error
                        });
                    }
                }
            });
        },

        getOptionValues: function () {
            var optionValuesCollection = new OptionValuesCollection();
            var self = this;
            var $thisEl = this.$el;
            var objectId = this.formModel.toJSON()._id;
            var formModel = this.formModel.toJSON();
            var prTypesCollection = this.productTypesCollection.toJSON();

            this.checkedPrTypes = [];

            prTypesCollection.forEach(function (item, key) {
                if (item.options.length && (item.options.indexOf(objectId) !== -1)) {
                    self.checkedPrTypes.push(item._id);
                }
            });

            optionValuesCollection.fetch({
                data   : {
                    id: objectId
                },
                success: function (result) {
                    $thisEl.html(_.template(OptionsFormTemplate, {
                        model         : formModel,
                        values        : result.toJSON(),
                        productTypes  : prTypesCollection,
                        checkedPrTypes: self.checkedPrTypes
                    }));
                },
                error  : function (xhr) {
                    if (xhr) {
                        App.render({
                            type   : 'error',
                            message: xhr.error
                        });
                    }
                }
            });
        },

        getProductTypeValues: function () {

            this.productTypesCollection = new ProductTypeCollection();

            this.productTypesCollection.on('reset', this.getOptionValues, this);

            this.productTypesCollection.fetch({
                reset  : true,
                success: function () {

                },
                error  : function (xhr) {
                    if (xhr) {
                        App.render({
                            type   : 'error',
                            message: xhr.error
                        });
                    }
                }
            });
        },

        render: function () {
            var $thisEl = this.$el;

            this.getProductTypeValues();

            return this;
        }
    });

    return FormOpportunitiesView;
});
