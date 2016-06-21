define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/listViewBase',
    'views/payrollStructureTypes/CreateView',
    'views/payrollStructureTypes/EditView',
    'views/payrollStructureTypes/list/ListItemView',
    'text!templates/payrollStructureTypes/list/ListHeader.html',
    'collections/payrollStructure/filterCollection'
], function ($,
             _,
             Backbone,
             listViewBase,
             CreateView,
             EditView,
             ListItemView,
             listTemplate,
             ContentCollection) {
    var PayrollStructureTypesListView = listViewBase.extend({
        el               : '#structureType',
        template         : _.template(listTemplate),
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: ContentCollection,
        contentType      : 'payrollStructureTypes',
        changedModels    : {},

        initialize: function (options) {
            var self = this;
            var eventChannel = options.eventChannel;

            self.eventChannel = eventChannel;
            self.collection = new ContentCollection({count: 100});

            self.collection.bind('reset', this.render, self);
        },

        events: {
            'click  .list tbody td:not(.notForm, .validated)': 'goToEditDialog',
            'click  .fa-plus'                                : 'create',
            'click  .fa-trash-o'                             : 'remove'
        },

        create: function (e) {
            var self = this;

            e.preventDefault();

            return new CreateView({eventChannel: self.eventChannel});
        },

        remove: function (e) {
            var self = this;
            var modelId = $(e.target).closest('tr').attr('data-id');
            var model;

            e.preventDefault();
            e.stopPropagation();

            if (confirm('Are you sure you want to DELETE this Payroll Structure?')) {
                model = self.collection.get(modelId);
                model.destroy({
                    success: function () {
                        self.eventChannel.trigger('updatePayrollStructureTypes');
                    }
                });
            }
        },

        goToEditDialog: function (e) {
            var self = this;
            var modelId = $(e.target).closest('tr').attr('data-id');
            var model = self.collection.get(modelId);

            e.preventDefault();

            return new EditView({
                eventChannel: self.eventChannel,
                model       : model
            });
        },

        render: function () {
            var self = this;
            var $currentEl;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');

            currentEllistRenderer(self);

            function currentEllistRenderer(self) {
                var itemView;

                $currentEl.append(_.template(listTemplate, {currentDb: true}));

                itemView = new ListItemView({
                    collection : self.collection,
                    page       : self.page,
                    itemsNumber: 1
                });

                $currentEl.append(itemView.render());
            }
        }

    });

    return PayrollStructureTypesListView;
});
