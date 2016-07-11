define([
    'Backbone',
    'Underscore',
    'text!templates/Deals/form/FormTemplate.html',
    'text!templates/Deals/workflowProgress.html',
    'views/Notes/NoteView',
    'views/Deals/EditView',
    'constants',
    'dataService'
], function (Backbone, _, OpportunitiesFormTemplate, workflowProgress, NoteView, EditView, constants, dataService) {
    var FormOpportunitiesView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.formModel = options.model;
            this.formModel.urlRoot = constants.URLS.OPPORTUNITIES;
        },

        render: function () {
            var formModel = this.formModel.toJSON();
            var self = this;

            this.$el.html(_.template(OpportunitiesFormTemplate, formModel));

            dataService.getData('/workflows/', {id: 'Deals'}, function (response){
                self.responseObj = {workflows : response.data};
                self.$el.find('#worflowProgress').append(_.template(workflowProgress, {workflows : self.responseObj.workflows, workflow : formModel.workflow  }));

            });

            this.$el.find('.notes').append(
                new NoteView({
                    model: this.formModel,
                    contentType: 'opportunities'
                }).render().el
            );



            return this;
        },

        editItem: function () {
            // create editView in dialog here
            return new EditView({model: this.formModel});
        },

        deleteItems: function () {
            var mid = 39;

            this.formModel.destroy({
                headers: {
                    mid: mid
                },
                success: function () {
                    Backbone.history.navigate('#easyErp/Deals/kanban', {trigger: true});
                }
            });

        }
    });

    return FormOpportunitiesView;
});
