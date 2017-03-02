define([
    'Backbone',
    'Underscore',
    'jQuery',
    'models/ProductTypeModel',
    'text!templates/productType/form/FormTemplate.html',
    'constants',
    'dataService',
    'views/selectView/selectView',
    'populate',
    'moment'
], function (Backbone, _, $, ProductTypeModel, ProductTypesFormTemplate, CONSTANTS, dataService, SelectView, populate, moment) {
    'use strict';

    var FormView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.formModel = options.model;
            this.formModel.urlRoot = '/products/productTypes/';
            //this.checkedOptions = this.formModel.toJSON().opts;
            this.checkedOptions = _.pluck(this.formModel.toJSON().opts, '_id');
            this.responseObj = {};
            this.modelChanged = {};
            this.value = '';
        },

        events: {
            'click #saveProductType': 'saveProductType'
        },

        hideNewSelect: function () {
            this.$el.find('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        saveProductType: function () {
            var $thisEl = this.$el;
            var $productOptions = $thisEl.find('#productOptions');
            var checkedNow = $productOptions.find($('input:checked'));
            var name = $thisEl.find('#name').val();
            var data = {};
            var symmetricalDifference;

            checkedNow = _.map(checkedNow, function (item) {
                return $(item).data('id');
            });

            symmetricalDifference = (_.difference(this.checkedOptions, checkedNow)).concat(_.difference(checkedNow, this.checkedOptions));

            if (symmetricalDifference.length) {
                data.options = checkedNow;
            }

            data.name = name;

            this.formModel.set(data);
            this.formModel.save(this.formModel.changed, {
                patch  : true,
                wait   : true,
                success: function () {
                    App.render({
                        type   : 'notify',
                        message: 'Product Type saved.'
                    });
                },

                error: function (model, response) {
                    App.render({
                        type   : 'error',
                        message: response.error
                    });
                }
            });
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formModel = this.formModel.toJSON();

            dataService.getData('/products/options', {}, function (result) {

                $thisEl.html(_.template(ProductTypesFormTemplate, {
                    model         : formModel,
                    options       : result.data,
                    checkedOptions: self.checkedOptions
                }));

                return self;
            }, this);

        }
    });

    return FormView;
});
