/**
 * Created by soundstorm on 20.05.15.
 */
define([
    "text!templates/Payment/CreateTemplate.html",
    "collections/Persons/PersonsCollection",
    "collections/Departments/DepartmentsCollection",
    "models/QuotationModel",
    "common",
    "populate",
    'constants'
    ],
    function (CreateTemplate, PersonCollection, DepartmentCollection, QuotationModel, common, populate, constants) {
        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Payment",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                //_.bindAll(this, "saveItem", "render");
                this.responseObj = {};
                this.model = new QuotationModel();
                this.render();
            },

            events: {
                'keydown': 'keydownHandler',
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide"
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },
            notHide: function () {
                return false;
            },
            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },
            keydownHandler: function (e) {
                switch (e.which) {
                    case 27:
                        this.hideDialog();
                        break;
                    default:
                        break;
                }
            },
            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
            },
            render: function () {
                var self = this;

                this.$el = $(this.template()).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-dialog",
                    title: "Cretae Payment",
                    buttons: [
                        {
                            id: "create-payment-dialog",
                            text: "Create",
                            click: function () {
                                self.saveItem();
                            }
                        },
                        {
                            text: "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    ]
                });

                populate.get2name("#supplierDd", "/supplier", {}, this, false, true);
                populate.get("#period", "/destination", {}, 'name', this, true, true);
                populate.get("#paymentMethod", "/destination", {}, 'name', this, true, true);

                this.$el.find('#paymentDate').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                }).datepicker('setDate', new Date());

                this.delegateEvents(this.events);
                return this;
            }
        });

        return CreateView;
    });