define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/formProperty/filterView',
    'text!templates/formProperty/formPropertyTemplate.html',
    'text!templates/selectView/selectContent.html'
], function (Backbone, $, _, filterView, propertyTemplate, selectContent) {
    var selectView = Backbone.View.extend({
        template       : _.template(propertyTemplate),
        contentTemplate: _.template(selectContent),

        events: {
            'click #addProperty'   : 'addProperty',
            'click #removeProperty': 'removeProperty',
            'click #saveSpan'      : 'saveClick'
        },

        addProperty: function () {
            new filterView({
                model    : this.parentModel,
                type     : this.type,
                attribute: this.attribute,
                saveDeal : this.saveDeal
            });
        },

        saveClick: function (e) {

            var parent = $(e.target).parent().parent();
            var field;
            var value = this.$el.find('#editInput').val();
            var newModel = {};
            e.preventDefault();

            field = parent.attr('data-id').replace('_', '.');
            newModel[field] = value;

            parent.text(value);
            parent.removeClass('quickEdit');

            this.model.save(newModel,{
                patch  : true,
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
