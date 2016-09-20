define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/listViewBase',
    // 'views/payrollComponentTypes/CreateView',
    'views/payrollStructureTypes/structureElement/CreateView',
    'views/payrollComponentTypes/EditView',
    'views/payrollComponentTypes/list/ListItemView',
    'text!templates/payrollComponentTypes/list/ListHeader.html',
    'collections/payrollComponentTypes/filterCollection',
    'common',
    'dataService',
    'constants',
    'helpers'
], function ($, _, Backbone, ListViewBase, CreateView, EditView, ListItemView, listTemplate,
             ContentCollection, common, dataService, CONSTANTS, helpers) {
    var WeeklySchedulerListView = ListViewBase.extend({
        template         : _.template(listTemplate),
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: ContentCollection,
        contentType      : 'weeklyScheduler',
        changedModels    : {},

        events: {
            'click  .list tbody td:not(.notForm, .validated)': 'goToEditDialog',
            'click  #top-bar-createBtn'                      : 'create',
            'click  .icon-trash'                  : 'remove'
        },

        initialize: function (options) {
            var self = this;
            var eventChannel = options.eventChannel;
            var componentType = options.type;

            self.eventChannel = eventChannel;
            self.type = componentType;

            self.collection = new ContentCollection({
                count: 100,
                type : componentType
            });

            self.collection.bind('reset', this.render, self);
        },

        create: function (e) {
            var self = this;

            e.preventDefault();

            return new CreateView({
                eventChannel     : self.eventChannel,
                updateAfterCreate: true,
                type             : self.type
            });
        },

        remove: function (e) {
            var self = this;
            var modelId = $(e.target).closest('tr').attr('data-id');
            var model;

            e.preventDefault();
            e.stopPropagation();

            if (confirm('Are you sure you want to DELETE this Payroll Component Type?')) {
                model = self.collection.get(modelId);
                model.destroy({
                    success: function () {
                        if (self.type === 'deductions') {
                            self.eventChannel.trigger('updatePayrollDeductionsType');
                        } else if (self.type === 'earnings') {
                            self.eventChannel.trigger('updatePayrollEarningsType');
                        }
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
                model       : model,
                type        : self.type
            });
        },

        render: function () {
            var $currentEl;
            var itemView;
            var header;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');

            if (this.type === 'deductions') {
                header = 'Payroll Deduction Types';
            } else if (this.type === 'earnings') {
                header = 'Payroll Earning Types';
            }

            $currentEl.append(_.template(listTemplate, {
                currentDb: true,
                header   : header,
                type     : this.type
            }));

            itemView = new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: 1,
                type       : this.type,
                el         : '#listTable' + this.type
            });

            $currentEl.append(itemView.render());
        }

    });

    return WeeklySchedulerListView;
});
