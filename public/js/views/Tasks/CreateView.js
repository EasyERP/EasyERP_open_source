define([
    "text!templates/Tasks/CreateTemplate.html",
    "models/TasksModel",
    "common",
    "populate",
    'views/Notes/AttachView'

],
       function (CreateTemplate, TaskModel, common, populate, attachView) {

           var CreateView = Backbone.View.extend({
               el: "#content-holder",
               contentType: "Tasks",
               template: _.template(CreateTemplate),

               initialize: function (options) {
                   _.bindAll(this, "saveItem", "render");
                   this.model = new TaskModel();
                   this.responseObj = {};
                   this.render();
               },

               events: {
                   "click #tabList a": "switchTab",
                   "click #deadline": "showDatePicker",
                   "change #workflowNames": "changeWorkflows",
                   "click .current-selected": "showNewSelect",
                   "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                   "click .newSelectList li.miniStylePagination": "notHide",
                   "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                   "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                   "click": "hideNewSelect"
               },
               addAttach: function (event) {
                   var s = $(".inputAttach:last").val().split("\\")[$(".inputAttach:last").val().split('\\').length - 1];
                   $(".attachContainer").append('<li class="attachFile">' +
                                                '<a href="javascript:;">' + s + '</a>' +
                                                '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
                                                );
                   $(".attachContainer .attachFile:last").append($(".input-file .inputAttach").attr("hidden", "hidden"));
                   $(".input-file").append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
               },
               deleteAttach: function (e) {
                   $(e.target).closest(".attachFile").remove();
               },

               fileSizeIsAcceptable: function (file) {
                   if (!file) { return false; }
                   return file.size < App.File.MAXSIZE;
               },


               notHide: function (e) {
                   return false;
               },

               getWorkflowValue: function (value) {
                   var workflows = [];
                   for (var i = 0; i < value.length; i++) {
                       workflows.push({ name: value[i].name, status: value[i].status, _id: value[i]._id });
                   }
                   return workflows;
               },

               showDatePicker: function (e) {
                   if ($(".createFormDatepicker").find(".arrow").length === 0) {
                       $(".createFormDatepicker").append("<div class='arrow'></div>");
                   }

               },
               switchTab: function (e) {
                   e.preventDefault();
                   var link = this.$("#tabList a");
                   if (link.hasClass("selected")) {
                       link.removeClass("selected");
                   }
                   var index = link.index($(e.target).addClass("selected"));
                   this.$(".tab").hide().eq(index).show();
               },
               hideDialog: function () {
                   $(".edit-dialog").remove();
               },

               saveItem: function () {
                   var self = this;
                   var mid = 39;
                   var summary = $.trim(this.$el.find("#summaryTask").val());
                   var project = $("#projectDd").data("id");
                   var assignedTo = $("#assignedToDd").data("id");
                   var deadline = $.trim(this.$el.find("#deadline").val());
                   var tags = $.trim(this.$el.find("#tags").val()).split(',');
                   var description = $.trim(this.$el.find("#description").val());
                   var sequence = $.trim(this.$el.find("#sequence").val());
                   var StartDate = $.trim(this.$el.find("#StartDate").val());
                   var workflow = this.$el.find("#workflowsDd").data("id");
                   var estimated = $.trim(this.$el.find("#estimated").val());
                   var logged = $.trim(this.$el.find("#logged").val());
                   var priority = $("#priorityDd").data("id");
                   var type = this.$("#type").data("id");
                   this.model.save({
                       type: type,
                       summary: summary,
                       assignedTo: assignedTo ? assignedTo : "",
                       workflow: workflow,
                       project: project ? project : "",
                       tags: tags,
                       deadline: deadline,
                       description: description,
                       priority: priority,
                       sequence: sequence,
                       StartDate: StartDate,
                       estimated: estimated,
                       logged: logged
                   },
                   {
                       headers: {
                           mid: mid
                       },
                       wait: true,
                       success: function (model, response) {
                           var currentModel = model.changed;
                           self.attachView.sendToServer(null,currentModel);
                       },

                       error: function (model, xhr) {
                           self.errorNotification(xhr);
                       }

                   });
               },
               nextSelect: function (e) {
                   this.showNewSelect(e, false, true);
               },
               prevSelect: function (e) {
                   this.showNewSelect(e, true, false);
               },

               showNewSelect: function (e, prev, next) {
                   populate.showSelect(e, prev, next, this);
                   return false;
               },
               hideNewSelect: function (e) {
                   $(".newSelectList").hide();
               },
               chooseOption: function (e) {
                   $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
               },
               render: function () {
                   var afterPid = (window.location.hash).split('pId=')[1];
                   var projectID = afterPid ? afterPid.split('/')[0] : null;
                   var formString = this.template();
                   var self = this;
                   this.$el = $(formString).dialog({
                       closeOnEscape: false,
                       dialogClass: "edit-dialog task-edit-dialog",
                       width: 600,
                       title: "Create Task",
                       buttons: {
                           save: {
                               text: "Create",
                               class: "btn",
                               click: self.saveItem
                           },
                           cancel: {
                               text: "Cancel",
                               class: "btn",
                               click: self.hideDialog
                           }
                       }
                   });
                   var notDiv = this.$el.find('.attach-container');
                   this.attachView = new attachView({
                       model: new TaskModel(),
                       url:"/uploadTasksFiles",
                       isCreate:true
                   });

                   notDiv.append(this.attachView.render().el);
                   if (projectID) {
                       populate.get("#projectDd", "/getProjectsForDd", {}, "projectName", this, false, false, projectID);
                   } else {
                       populate.get("#projectDd", "/getProjectsForDd", {}, "projectName", this, true);
                   }
                   populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", { id: "Tasks" }, "name", this, true);
                   populate.get2name("#assignedToDd", "/getPersonsForDd", {}, this, true);
                   populate.getPriority("#priorityDd", this, true);
                   $('#StartDate').datepicker({
                       dateFormat: "d M, yy",
                       changeMonth: true,
                       changeYear: true
                   });
                   this.$el.find("#logged").spinner({
                       min: 0,
                       max: 9999
                   });
                   this.$el.find("#estimated").spinner({
                       min: 0,
                       max: 9999
                   });

                   this.delegateEvents(this.events);
                   return this;
               }

           });

           return CreateView;
       });
