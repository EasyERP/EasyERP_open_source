define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/formProperty/filterView',
    'text!templates/formProperty/formPropertyTemplate.html',
    'text!templates/selectView/selectContent.html'
], function (Backbone, $, _, FilterView,  propertyTemplate, selectContent) {
    var selectView = Backbone.View.extend({
        template       : _.template(propertyTemplate),
        contentTemplate: _.template(selectContent),

        events: {
            'change .editable'     : 'setChangeValueToModel',
            'click #addProperty'   : 'addProperty',
            'click #removeProperty': 'removeProperty',
            'click #saveBtn'       : 'saveChanges',
            'click #cancelBtn'     : 'cancelChanges'
        },

        setChangeValueToModel: function (e){
            var $target = $(e.target);
          /*  var type = */

        },

        addProperty: function () {
            new FilterView({
                model    : this.parentModel,
                type     : this.type,
                attribute: this.attribute,
                saveDeal : this.saveDeal
            });
        },

        saveChanges: function (e) {
            var $thisEl = this.$el;
            var name = $thisEl.find('#supplierReference [data-id="first_name"]').val();
            var field;
            var value = this.$el.find('#editInput').val();
            var newModel = {};
            e.preventDefault();

            field = parent.attr('data-id').replace('_', '.');
            newModel[field] = value;

            parent.text(value);
            parent.removeClass('quickEdit');

            this.model.save(newModel, {
                patch  : true
            });
        },

        removeProperty: function () {
            var saveObject = {};
            this.model = '';

            saveObject[this.attribute] = null;
            this.saveDeal(saveObject, 'formProperty');
        },

        initialize: function (options) {
            this.type = options.type;
            this.attribute = options.attribute;
            this.parentModel = options.parentModel;
            this.responseObj = options.responseObj || [];
            this.saveDeal = options.saveDeal;
        },

        render: function () {
            var self = this;
            var urlType = this.type === 'Company' ? 'Companies' : 'Persons';
            var property = this.model ? this.model.toJSON() : '';

            this.$el.html(_.template(propertyTemplate, {type: this.type, property: property, urlType: urlType}));

            this.searchInput = this.$el.find('#selectInput');

            this.searchInput.keyup(function (e) {
                e.stopPropagation();
                self.inputEvent(e);
            });

            return this;
        }
    });

    return selectView;
});
