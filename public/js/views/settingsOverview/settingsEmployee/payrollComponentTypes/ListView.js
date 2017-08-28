define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/listViewBase',
    'text!templates/settingsOverview/settingsEmployee/payrollStructureTypes/ListTemplate.html',
    'views/settingsOverview/settingsEmployee/payrollStructureTypes/structureElement/CreateView',
    'views/settingsOverview/settingsEmployee/payrollComponentTypes/EditView',
    'collections/payrollComponentTypes/filterCollection',
    'helpers/ga',
    'constants/googleAnalytics'
], function ($, _, Backbone, ListViewBase, ListTemplate, CreateView, EditView, ContentCollection, ga, GA) {
    var WeeklySchedulerListView = ListViewBase.extend({
        CreateView       : CreateView,
        contentCollection: ContentCollection,
        contentType      : 'weeklyScheduler',
        changedModels    : {},
        template         : _.template(ListTemplate),

        events: {
            'click .goToEdit'         : 'goToEditDialog',
            'click .goToRemove'       : 'remove',
            'click #top-bar-createBtn': 'create',
            'click .toggleList'       : 'toggleList'
        },

        initialize: function (options) {
            var eventChannel = {};
            var self = this;
            var componentType = options.type;

            _.extend(eventChannel, Backbone.Events);
            this.eventChannel = eventChannel;

            self.type = componentType;

            self.collection = new ContentCollection({
                count: 100,
                type : componentType
            });

            self.collection.bind('reset add change', this.render, self);
        },

        create: function (e) {
            var self = this;

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CREATE_PAYROLL_DEDUCTIONS
            });

            return new CreateView({
                collection       : this.collection,
                eventChannel     : this.eventChannel,
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

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_PAYROLL_DEDUCTIONS
            });

            if (confirm('Are you sure you want to DELETE this Payroll Component Type?')) {
                model = self.collection.get(modelId);
                model.destroy({
                    success: function () {
                        self.$el.find('tr[data-id="' + model.id + '"]').remove();
                    }
                });
            }
        },

        toggleList: function (e) {
            e.preventDefault();

            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {
            var self = this;
            var modelId = $(e.target).closest('tr').attr('data-id');
            var model = self.collection.get(modelId);

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.EDIT_PAYROLL_DEDUCTIONS
            });

            return new EditView({
                collection: this.collection,
                model     : model,
                type      : self.type
            });
        },

        render: function () {
            this.$el.html(this.template({collection: this.collection.toJSON()}));

            return this;
        }

    });

    return WeeklySchedulerListView;
});
