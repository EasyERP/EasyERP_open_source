define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Companies/filterView',
    'models/CompaniesModel',
    'text!templates/Companies/formPropertyTemplate.html'
], function (Backbone, $, _, FilterView, CompaniesModel, propertyTemplate) {
    'use strict';

    var selectView = Backbone.View.extend({
        template: _.template(propertyTemplate),

        events: {
            'keyup .editable'      : 'setChangeValueToModel',
            'click #addProperty'   : 'addProperty',
            'click #removeProperty': 'removeProperty',
            'click #saveBtn'       : 'saveChanges',
            'click #cancelBtn'     : 'cancelChanges'
        },

        initialize: function (options) {
            this.data = options.data;

            this.saveDeal = options.saveDeal;
        },

        setChangeValueToModel: function (e) {
            var $target = $(e.target);
            var property = $target.attr('data-id').replace('_', '.');
            var value = $target.val();

            $target.closest('.propertyFormList').addClass('active');

            if (!this.modelChanged) {
                this.modelChanged = {};
            }

            this.modelChanged[property] = value;
            this.showButtons();
        },

        showButtons: function () {
            this.$el.find('.btnBlock').addClass('showButtons');
        },

        hideButtons: function () {
            this.$el.find('.btnBlock').removeClass('showButtons');
        },

        addProperty: function () {
            new FilterView({
                attribute: 'company',
                saveDeal : this.saveDeal
            });
        },

        saveChanges: function (e) {
            var self = this;

            e.preventDefault();

            this.model.save(this.modelChanged, {
                patch  : true,
                success: function () {
                    self.modelChanged = {};
                    self.hideButtons();
                }
            });
            this.$el.find('.active').removeClass('active');
        },

        cancelChanges: function (e) {
            e.preventDefault();

            this.modelChanged = {};
            this.render();
        },

        removeProperty: function () {
            var saveObject = {};

            saveObject.company = null;

            this.saveDeal(saveObject, 'formProperty');
        },

        render: function () {
            this.$el.html(_.template(propertyTemplate, {property: this.data}));
            return this;
        }
    });

    return selectView;
});
