/**
 * Created by liliya on 30.09.15.
 */
define([
        "text!templates/Projects/projectInfo/wTracks/generate.html",
        'populate',
        'dataService'
    ],
    function (generateTemplate, populate, dataService) {
        var CreateView = Backbone.View.extend({
            template: _.template(generateTemplate),
            responseObj: {},

            events: {
                "click .newSelectList li:not(.miniStylePagination)"               : "chooseOption",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect"
            },

            initialize: function(options){
                this.model = options.model;

                this.render();
            },

            chooseOption: function(){

            },

            generateItems: function(){

            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;
            },

            chooseOption: function (e) {
                $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
                $(".newSelectList").hide();
            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
            },

            render: function(){
                var dialog = this.template({project: this.model.toJSON()});
                var self = this;

                this.$el = $(dialog).dialog({
                    dialogClass: "edit-dialog",
                    width: 800,
                    title: "Generate weTrack",
                    buttons:{
                        save:{
                            text: "Generate",
                            class: "btn",
                            id:"generateBtn",
                            click: self.generateItems()
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: function(){
                                self.hideDialog();
                            }
                        }
                    }
                });

                dataService.getData("/employee/getForDD", null, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee
                    });

                    self.responseObj['#employee'] = employees;
                });

                dataService.getData("/department/getForDD", null, function (departments) {
                    departments = _.map(departments.data, function (department) {
                        department.name = department.departmentName;

                        return department
                    });

                    self.responseObj['#department'] = departments;
                });

            }
        });
        return CreateView;
    });