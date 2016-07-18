define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/formProperty/formPropertyTemplate.html',
    'text!templates/selectView/selectContent.html'
], function (Backbone, $, _, propertyTemplate, selectContent) {
    var selectView = Backbone.View.extend({
        template       : _.template(propertyTemplate),
        contentTemplate: _.template(selectContent),

        events: {
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect'
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

        initialize: function (options) {
            this.type = options.type;
            this.attribute = options.attribute;
         /*   this.model = options.model;*/
            this.responseObj = options.responseObj || [];
        },

        notHide: function () {
            return false;
        },

        nextSelect: function (e) {
            e.stopPropagation();
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            e.stopPropagation();
            this.showNewSelect(e, true, false);
        },

        filterCollection: function (value) {
            var resultCollection;
            var regex;

            regex = new RegExp(value, 'i');

            resultCollection = this.collection.filter(function (model) {
                return model.get('name').match(regex);
            });

            return resultCollection;
        },

        render: function () {
            var self = this;
            var urlType = this.type === 'Company' ? 'Companies' : 'Persons';

            this.$el.html( _.template(propertyTemplate, {type : this.type, property : this.model.toJSON(), urlType : urlType}) );

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
