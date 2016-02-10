define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/Leads/form/FormTemplate.html',
        'views/Leads/EditView'
    ],

    function (Backbone, $, _, FormTemplate, EditView) {
        'use strict';

        var FormView = Backbone.View.extend({
            el        : '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
            },

            events: {
                "click .breadcrumb a, #cancelCase, #reset": "changeWorkflow",
                "click #convertToOpportunity"             : "openDialog"
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(FormTemplate, formModel));
                var that = this;
                $("#dialog-form").dialog({
                    autoOpen: false,
                    height  : 150,
                    width   : 350,
                    modal   : true,
                    title   : "Convert to opportunity",
                    buttons : {
                        "Create opportunity": function () {
                            var self = this;
                            var createCustomer = ($("select#createCustomerOrNot option:selected").val()) ? true : false;
                            that.formModel.save({
                                isOpportunitie : true,
                                isConverted    : true,
                                convertedDate  : new Date(),
                                createCustomer : createCustomer,
                                expectedRevenue: {
                                    currency: null,
                                    progress: null,
                                    value   : null
                                }
                            }, {
                                headers: {
                                    mid: 39
                                },
                                success: function () {
                                    $(self).dialog("close");
                                    //that.opportunitiesCollection.add(model);
                                    Backbone.history.navigate("easyErp/Opportunities", {trigger: true});
                                }

                            });

                        },
                        Cancel              : function () {
                            $(this).dialog('close');
                        }
                    },

                    close: function () {
                        $(this).dialog('close');
                    }
                }, this);
                return this;
            },

            editItem: function () {
                //create editView in dialog here
                new EditView({model: this.formModel});
            },

            openDialog: function () {
                $("#dialog-form").dialog("open");
            },

            deleteItems: function () {
                var mid = 39;

                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("easyErp/Leads/list", {trigger: true});
                    },
                    error  : function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: "You do not have permission to perform this action"
                            });
                        }
                    }
                });

            }
        });

        return FormView;
    });
