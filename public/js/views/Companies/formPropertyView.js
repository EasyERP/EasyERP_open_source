define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Companies/filterView',
    'models/CompaniesModel',
    'text!templates/Companies/formPropertyTemplate.html'
], function (Backbone, $, _, FilterView, CompaniesModel,  propertyTemplate) {
    var selectView = Backbone.View.extend({
        template       : _.template(propertyTemplate),

        events: {
            'keyup .editable'      : 'setChangeValueToModel',
            'click #addProperty'   : 'addProperty',
            'click #removeProperty': 'removeProperty',
            'click #saveBtn'       : 'saveChanges',
            'click #cancelBtn'     : 'cancelChanges'
        },

        initialize: function (options) {
            var company;

            this.attribute = options.attribute;
            this.parentModel = options.parentModel;
            this.saveDeal = options.saveDeal;
            this.isLead = options.isLead;

            company = this.parentModel.get(this.attribute);

            if (company){
                this.model = new CompaniesModel(company);
            }
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
                saveDeal : this.saveDeal,
                isLead   : this.isLead
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
            var self = this;

            saveObject[this.attribute] = null;
            self.saveDeal(saveObject, 'formProperty');

            if (this.isLead && this.model.get('isHidden')){
                this.model.destroy();
            }
        },

        render: function () {
            var property = this.model ? this.model.toJSON() : '';

            this.$el.html(_.template(propertyTemplate, {property: property}));
            return this;
        }
    });

    return selectView;
});
