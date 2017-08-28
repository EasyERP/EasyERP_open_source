define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'models/OptionsValuesModel',
    'collections/productSettings/optionValuesCollection',
    'collections/productType/filterCollection',
    'text!templates/settingsOverview/productDetails/productOptions/EditTemplate.html',
    'constants',
    'dataService'
], function (Backbone, _, $, Parent, OptionsValuesModel, OptionValuesCollection, ProductTypeCollection, OptionsFormTemplate, CONSTANTS, dataService) {
    'use strict';

    var FormOpportunitiesView = Parent.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.optionsValuesModel = new OptionsValuesModel;
            this.formModel = options.model;
            this.formModel.urlRoot = '/products/options/';
            this.checkedPrTypes = [];
            this.responseObj = {};
            this.modelChanged = {};
            this.value = '';

            this.collection = options.collection;

            this.render();
        },

        events: {
            'click .deleteValue'        : 'deleteValue',
            'dblclick .valueItem'       : 'editValue',
            'click #addNewOptionsValue' : 'addNewOptionsValue',
            'click #saveNewOptionsValue': 'saveNewOptionsValue',
            'click .closeUpdateValue'   : 'closeUpdateValue',
            'click .updateValue'        : 'updateValue'
        },

        saveNewOptionsValue: function (e, doNotGetOptValues) {
            var self = this;
            var $thisEl = this.$el;
            var $values = $thisEl.find('#optionsValues').find('.optionValue');
            var objectId = $thisEl.find('#optionsValues').data('id');
            var values = [];
            var value;

            if (e) {
                e.preventDefault();
            }
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
                    if (!doNotGetOptValues) {
                        self.getOptionValues();
                    }
                },

                error: function (model, err) {
                    if (err) {
                        App.render({
                            type   : 'error',
                            message: err.responseJSON.error
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
                        App.render({
                            type   : 'error',
                            message: err.responseJSON.error
                        });
                        return;
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

        closeUpdateValue: function () {
            var $thisEl = this.$el;
            var $target = $thisEl.find('#editValue');

            $target.closest('.valueItem').find('.updateValue').remove();
            $target.closest('.valueItem').find('.closeUpdateValue').remove();
            $target.after('<span class="deleteValue icon-trash _circleIconBtn"></span>');
            $target.replaceWith('<span>' + this.value + '</span>');
        },

        addNewOptionsValue: function (e) {
            var $thisEl = this.$el;
            var $boxForValues = $thisEl.find('#optionsValues');

            e.stopPropagation();

            if (!$boxForValues.find('input').length || $boxForValues.find('input').last().val()) {
                if ($boxForValues.find('input').length) {
                    return $boxForValues.find('input').last().after('<input type="text" class="_animate optionValue">');
                }

                $boxForValues.prepend('<input type="text" class="_animate optionValue">');
            }

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
            var self = this;
            var data = {
                checkedPrTypes: this.checkedPrTypes
            };
            var productName = $thisEl.find('#name');
            var $productTypes = $thisEl.find('#productTypes');
            var checkedNow = $productTypes.find($('input:checked'));

            this.saveNewOptionsValue(null, true);

            checkedNow = _.map(checkedNow, function (item) {
                return $(item).data('id');
            });

            data.checkedNow = checkedNow;
            data.name = productName.val();

            this.formModel.save(data, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    App.render({
                        type   : 'notify',
                        message: 'Product options saved.'
                    });

                    self.hideDialog();

                    self.collection.set(model, {remove: false});
                },

                error: function (model, err) {
                    if (err) {
                        App.render({
                            type   : 'error',
                            message: err.responseJSON.error
                        });
                    }
                }
            });
        },

        getOptionValues: function () {
            var optionValuesCollection = new OptionValuesCollection();
            var self = this;
            var objectId = this.formModel.toJSON()._id;
            var formModel = this.formModel.toJSON();
            var prTypesCollection = this.productTypesCollection.toJSON();

            this.checkedPrTypes = [];

            prTypesCollection.forEach(function (elem) {
                _.find(elem.options, function (el) {
                    if (el && el._id.toString() === objectId.toString()) {
                        self.checkedPrTypes.push(elem._id);
                    }
                });
            });

            optionValuesCollection.fetch({
                data: {
                    id: objectId
                },

                success: function (result) {
                    var formString;

                    self.hideDialog();

                    formString = _.template(OptionsFormTemplate, {
                        model         : formModel,
                        values        : result.toJSON(),
                        productTypes  : prTypesCollection,
                        checkedPrTypes: self.checkedPrTypes
                    });

                    self.$el = $(formString).dialog({
                        autoOpen   : true,
                        dialogClass: 'edit-dialog',
                        title      : 'Edit Bank Account',
                        width      : '800px',
                        buttons    : [{
                            text : 'Save',
                            class: 'btn blue',
                            click: function () {
                                self.saveChangeTypes();
                                self.gaTrackingEditConfirm();
                            }
                        }, {
                            text : 'Cancel',
                            class: 'btn',
                            click: function () {
                                self.hideDialog();
                            }
                        }]

                    });

                    self.delegateEvents(self.events);
                },

                error: function (xhr) {
                    if (xhr) {
                        App.render({
                            type   : 'error',
                            message: xhr.responseText
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

                error: function (xhr) {
                    if (xhr) {
                        App.render({
                            type   : 'error',
                            message: xhr.responseText
                        });
                    }
                }
            });
        },

        render: function () {

            this.getProductTypeValues();

            return this;
        }
    });

    return FormOpportunitiesView;
});
