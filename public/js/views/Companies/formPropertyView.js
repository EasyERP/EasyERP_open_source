define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Companies/filterView',
    'text!templates/Companies/formPropertyTemplate.html'
], function (Backbone, $, _, FilterView,  propertyTemplate) {
    var selectView = Backbone.View.extend({
        template       : _.template(propertyTemplate),

        events: {
            'keyup .editable'      : 'setChangeValueToModel',
            'click #addProperty'   : 'addProperty',
            'click #removeProperty': 'removeProperty',
            'click #saveBtn'       : 'saveChanges',
            'click #cancelBtn'     : 'cancelChanges'
        },

        setChangeValueToModel: function (e){
            var $target = $(e.target);
            var property = $target.attr('data-id').replace('_', '.');
            var value = $target.val();

            $target.closest('.propertyFormList').addClass('active');

            if (!this.modelChanged){
                this.modelChanged = {};
            }
            this.modelChanged[property] = value;
            this.showButtons();
        },

        showButtons : function (){
            this.$el.find('.btnBlock').addClass('showButtons');
        },

        hideButtons : function (){
            this.$el.find('.btnBlock').removeClass('showButtons');
        },

        addProperty: function () {
            new FilterView({
                model    : this.parentModel,
                attribute: this.attribute,
                saveDeal : this.saveDeal
            });
        },

        saveChanges: function (e) {
            var self = this;
            this.model.save(this.modelChanged, {
                patch: true,
                success : function (){
                    self.modelChanged = '';
                    self.hideButtons();
                }
            });
            this.$el.find('.active').removeClass('active');
        },

        cancelChanges : function (e) {
            this.modelChanged = '';
            this.render();
        },

        removeProperty: function () {
            var saveObject = {};
            this.model = '';

            saveObject[this.attribute] = null;
            this.saveDeal(saveObject, 'formProperty');
        },

        initialize: function (options) {
            this.attribute = options.attribute;
            this.parentModel = options.parentModel;
            this.saveDeal = options.saveDeal;
        },

        render: function () {
            var property = this.model ? this.model.toJSON() : '';

            this.$el.html(_.template(propertyTemplate, {property: property}));
            return this;
        }
    });

    return selectView;
});
