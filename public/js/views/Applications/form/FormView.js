define([
        'text!templates/Applications/form/FormTemplate.html',
        'views/Applications/EditView',
        'collections/Workflows/WorkflowsCollection'
    ],

    function (ApplicationsFormTemplate, EditView, WorkflowsCollection) {
        var FormApplicationsView = Backbone.View.extend({
            el        : '#content-holder',
            initialize: function (options) {
                this.workflowsCollection = new WorkflowsCollection({id: 'Applications'});
                this.formModel = options.model;
            },
            events    : {
                "click .breadcrumb a, .refuseEmployee": "changeWorkflow",
                "click .hireEmployee"                 : "isEmployee"
            },
            render    : function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(ApplicationsFormTemplate, formModel));
                return this;
            },

            editItem      : function () {
                new EditView({model: this.formModel});
            },
            changeWorkflow: function (e) {
                var mid = 39;
                var model;
                var name = '', status = '';
                var id;
                if ($(e.target).hasClass("applicationWorkflowLabel")) {
                    var breadcrumb = $(e.target).closest('li');
                    var a = breadcrumb.siblings().find("a");
                    if (a.hasClass("active")) {
                        a.removeClass("active");
                    }
                    breadcrumb.find("a").addClass("active");
                    name = breadcrumb.data("name");
                    status = breadcrumb.data("status");
                }
                else {
                    var workflow = this.workflowsCollection.findWhere({name: "Refused"});
                    if (!workflow) {
                        throw new Error('Workflow "Refused" not found');
                        return;
                    }
                    id = workflow.get('_id');
                }
                this.formModel.save({
                    workflow: id
                }, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (model) {
                        Backbone.history.navigate("easyErp/Applications", {trigger: true});
                    },
                    error  : function (model, xhr, options) {
                        Backbone.history.navigate("easyErp", {trigger: true});
                    }
                });

            },
            isEmployee    : function (e) {
                this.model.save({
                    isEmployee: true
                }, {
                    headers: {
                        mid: 39
                    },
                    success: function (model) {
                        Backbone.history.navigate("easyErp/Employees", {trigger: true});
                    }
                });
            },
            deleteItems   : function () {
                var mid = 39;

                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Applications/list", {trigger: true});
                    }
                });

            }
        });

        return FormApplicationsView;
    });