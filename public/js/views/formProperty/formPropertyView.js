define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/formProperty/filterView',
    'text!templates/formProperty/formPropertyTemplate.html',
    'text!templates/selectView/selectContent.html'
], function (Backbone, $, _, filterView,  propertyTemplate, selectContent) {
    var selectView = Backbone.View.extend({
        template       : _.template(propertyTemplate),
        contentTemplate: _.template(selectContent),

        events: {
            'click #addProperty'           : 'addProperty',
            'click #removeProperty'        : 'removeProperty'
        },

        chooseOption: function (e) {
            var id;
            var data;
            var $target = $(e.target);
            var attrId = $target.parents('td').find('.current-selected').attr('id');

            $('.newSelectList').hide();

            if ($target.parents('dd').find('.current-selected').length) {
                $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            } else {
                id = $target.parents('td').closest('tr').attr('data-id');

                if (attrId === 'workflow') {
                    data = {_id: id, workflowId: $target.attr('id')};
                } else if (attrId === 'type') {
                    data = {_id: id, type: $target.text()};
                }

                $target.parents('td').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

                dataService.postData('/jobs/update', data, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                });
            }

            this.showSaveButton();
        },

        addProperty : function (){
           new filterView({ model : this.parentModel, type : this.type});
        },

        removeProperty : function (){
            var saveObject = {};
            var self  = this;
            this.model = '';

            saveObject[this.attribute] = null;
            this.saveDeal(saveObject, function (){
                self.render();
            });
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

            this.$el.html( _.template(propertyTemplate, {type : this.type, property : property, urlType : urlType}) );

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
