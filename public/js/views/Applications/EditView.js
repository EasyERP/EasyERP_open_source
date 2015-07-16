define([
    "text!templates/Applications/EditTemplate.html",
    'views/Notes/AttachView',
    'views/Assignees/AssigneesView',
    "common",
    "populate",
    "custom"
],
       function (EditTemplate, attachView, AssigneesView, common, populate, custom) {

           var EditView = Backbone.View.extend({
               el: "#content-holder",
               contentType: "Applications",
               imageSrc: '',
               template: _.template(EditTemplate),
               initialize: function (options) {
                   _.bindAll(this, "saveItem");
                   _.bindAll(this, "render", "deleteItem");
                   this.employeesCollection = options.collection;
                   this.currentModel = (options.model) ? options.model : options.collection.getElement();
                   this.currentModel.urlRoot = "/Applications";
                   this.responseObj = {};
                   this.refuseId  = 0;
                   this.render();

               },

               events: {
                   "click #tabList a": "switchTab",
                   "click .breadcrumb a, #refuse": "changeWorkflow",
                   "change #workflowNames": "changeWorkflows",
                   'keydown': 'keydownHandler',
                   "mouseenter .avatar": "showEdit",
                   "mouseleave .avatar": "hideEdit",
                   "click .current-selected": "showNewSelect",
                   "click": "hideNewSelect",
                   'click .dialog-tabs a': 'changeTab',
                   "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                   "click .newSelectList li.miniStylePagination": "notHide",
                   "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                   "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                   "click .hireEmployee": "isEmployee",
                   "click .refuseEmployee": "refuseEmployee"
               },
               refuseEmployee: function (e) {
                   e.preventDefault();
                   var self = this;
                   var workflowStart = this.currentModel.get("workflow")&&this.currentModel.get("workflow")._id?this.currentModel.get("workflow")._id:this.currentModel.get("workflow");

                   this.currentModel.save({
                       workflow: self.refuseId
                   }, {
                       patch: true,
                       success: function (model) {
                           model = model.toJSON();
                           var viewType = custom.getCurrentVT();
                           switch (viewType) {
                           case 'list':
                               {
                                   $("tr[data-id='" + model._id + "'] td").eq(6).find("a").text("Refused");
                               }
                               break;
                           case 'kanban':
                               {
                                   $(".column[data-id='" + self.refuseId + "']").find(".columnNameDiv").after($("#" + model._id));
                                   if (self.refuseId) {
                                       var counter = $(".column[data-id='" + self.refuseId + "']").closest(".column").find(".totalCount");
                                       counter.html(parseInt(counter.html()) + 1);
                                       counter = $(".column[data-id='" + workflowStart + "']").closest(".column").find(".totalCount");
                                       counter.html(parseInt(counter.html()) - 1);

                                   }

                               }
                           }
                           self.hideDialog();
                       },
                       error: function (model, xhr, options) {
                           self.errorNotification(xhr);
                       }
                   });
                   return false;

               },
               isEmployee: function (e) {
                   e.preventDefault();
                   this.currentModel.save({
                       isEmployee: true,
                       hired: true
                   }, {
                       headers: {
                           mid: 39
                       },
                       patch: true,
                       success: function () {
                           Backbone.history.navigate("easyErp/Employees", { trigger: true });
                       }
                   });
               },

               notHide: function (e) {
                   return false;
               },

               nextSelect: function (e) {
                   this.showNewSelect(e, false, true);
               },
               prevSelect: function (e) {
                   this.showNewSelect(e, true, false);
               },

               changeTab: function (e) {
                   var holder = $(e.target);
                   holder.closest(".dialog-tabs").find("a.active").removeClass("active");
                   holder.addClass("active");
                   var n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                   var dialog_holder = $(".dialog-tabs-items");
                   dialog_holder.find(".dialog-tabs-item.active").removeClass("active");
                   dialog_holder.find(".dialog-tabs-item").eq(n).addClass("active");
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

               getWorkflowValue: function (value) {
                   var workflows = [];
                   for (var i = 0; i < value.length; i++) {
                       workflows.push({ name: value[i].name, status: value[i].status });
                   }
                   return workflows;
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
                   $(".add-group-dialog").remove();
                   $(".add-user-dialog").remove();
                   $(".crop-images-dialog").remove();
               },
               showEdit: function () {
                   $(".upload").animate({
                       height: "20px",
                       display: "block"
                   }, 250);

               },
               hideEdit: function () {
                   $(".upload").animate({
                       height: "0px",
                       display: "block"
                   }, 250);

               },

               saveItem: function () {
                   var self = this;
                   var mid = 39;
                   var viewType = custom.getCurrentVT();
                   var relatedUser = this.$el.find("#relatedUsersDd option:selected").val();
                   relatedUser = relatedUser ? relatedUser : null;
                   var department = this.$el.find("#departmentDd").data("id");
                   department = department ? department : null;
                   var dateBirthSt = $.trim(this.$el.find("#dateBirth").val());
                   var nextAction = $.trim(this.$el.find("#nextAction").val());
                   var jobPositionId = this.$el.find("#jobPositionDd").data("id") ? this.$el.find("#jobPositionDd").data("id") : null;
                   var usersId = [];
                   var groupsId = [];
                   $(".groupsAndUser tr").each(function () {
                       if ($(this).data("type") == "targetUsers") {
                           usersId.push($(this).data("id"));
                       }
                       if ($(this).data("type") == "targetGroups") {
                           groupsId.push($(this).data("id"));
                       }

                   });
                   var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
                   var workflow = this.$el.find("#workflowsDd").data("id") ? this.$el.find("#workflowsDd").data("id") : null;
                   var data = {
                       imageSrc: this.imageSrc,
                       name: {
                           first: this.$el.find("#first").val(),
                           last: this.$el.find("#last").val()
                       },
                       dateBirth: dateBirthSt,
                       personalEmail: $.trim(this.$el.find("#pemail").val()),
                       workPhones: {
                           phone: $.trim(this.$el.find("#phone").val()),
                           mobile: $.trim(this.$el.find("#mobile").val())
                       },
                       degree: this.$el.find("#degreesDd option:selected").val(),
                       relatedUser: relatedUser,
                       nextAction: nextAction,
                       source: this.$el.find("#sourceDd").data("id"),
                       jobType: this.$el.find("#jobTypeDd").data("id"),
                       referredBy: $.trim(this.$el.find("#referredBy").val()),
                       department: department,
                       jobPosition: jobPositionId,
                       expectedSalary: $.trim(this.$el.find("#expectedSalary").val()),
                       proposedSalary: parseInt($.trim(this.$el.find("#proposedSalary").val()), 10),
                       tags: $.trim(this.$el.find("#tags").val()).split(','),
                       otherInfo: this.$el.find("#otherInfo").val(),
                       groups: {
                           owner: $("#allUsersSelect").data("id"),
                           users: usersId,
                           group: groupsId
                       },
                       whoCanRW: whoCanRW
                   };
                   var currentWorkflow = this.currentModel.get('workflow');
                   if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id != workflow)) {
                       data['workflow'] = workflow;
                       data['sequence'] = -1;
                       data['sequenceStart'] = this.currentModel.toJSON().sequence;
                       data['workflowStart'] = currentWorkflow._id;
                   };
                   this.currentModel.save(data, {
                       headers: {
                           mid: mid
                       },
                       patch: true,
                       success: function (model, result) {
                           model = model.toJSON();
                           result = result.result;
                           var editHolder = self.$el;
                           switch (viewType) {
                           case 'list':
                               {
                                   var tr_holder = $("tr[data-id='" + model._id + "'] td");
                                   tr_holder.eq(2).text(data.name.first + " " + data.name.last);
                                   tr_holder.eq(3).text(data.personalEmail);
                                   tr_holder.eq(4).find("a").text(data.workPhones.phone).attr("href", "skype:" + data.workPhones.phone + "?call");
                                   tr_holder.eq(5).text(self.$el.find("#jobPositionDd").text());
                                   tr_holder.eq(6).find("a").text(self.$el.find("#workflowsDd").text());
                                   tr_holder.eq(7).text(data.jobType);
                                   if (data.workflow) {
                                       Backbone.history.fragment = "";
                                       Backbone.history.navigate(window.location.hash.replace("#", ""), { trigger: true });
                                   }
                               }
                               break;
                           case 'kanban':
                               {
                                   var kanban_holder = $("#" + model._id);
                                   kanban_holder.find(".application-header .left").html(data.name.first + "<br/>" + data.name.last);
                                   if (parseInt(data.proposedSalary))
                                       kanban_holder.find(".application-header .right").text(data.proposedSalary + "$");
                                   kanban_holder.find(".application-content p.center").text(self.$el.find("#jobPositionDd").text());
                                   kanban_holder.find(".application-content p.right").text(nextAction);
                                   if (new Date()>new Date(nextAction)){
                                       kanban_holder.find(".application-content p.right").addClass("red");
                                   }else{
                                       kanban_holder.find(".application-content p.right").removeClass("red");
                                   }

                                   if (result && result.sequence) {
                                       $("#" + data.workflowStart).find(".item").each(function () {
                                           var seq = $(this).find(".inner").data("sequence");
                                           if (seq > data.sequenceStart) {
                                               $(this).find(".inner").attr("data-sequence", seq - 1);
                                           }
                                       });
                                       kanban_holder.find(".inner").attr("data-sequence", result.sequence);
                                   }
                                   if (data.workflow) {
                                       $(".column[data-id='" + data.workflow + "']").find(".columnNameDiv").after(kanban_holder);
                                       var counter = $(".column[data-id='" + data.workflow + "']").closest(".column").find(".totalCount");
                                       counter.html(parseInt(counter.html()) + 1);
                                       counter = $(".column[data-id='" + data.workflowStart + "']").closest(".column").find(".totalCount");
                                       counter.html(parseInt(counter.html()) - 1);

                                   }
                                   $(".column[data-id='" + data.workflow + "']").find(".columnNameDiv").after(kanban_holder);

                               }
                           }
                           self.hideDialog();
                       },
                       error: function (model, xhr) {
                           self.errorNotification(xhr);
                       }
                   });
               },
               deleteItem: function (event) {
                   var mid = 39;
                   event.preventDefault();
                   var self = this;
                   var answer = confirm("Realy DELETE items ?!");
                   if (answer == true) {
                       this.currentModel.destroy({
                           headers: {
                               mid: mid
                           },
                           success: function (model) {
                               model = model.toJSON();
                               var viewType = custom.getCurrentVT();
                               switch (viewType) {
                               case 'list':
                                   {
                                       $("tr[data-id='" + model._id + "'] td").remove();
                                   }
                                   break;
                               case 'kanban':
                                   {
                                       $("#" + model._id).remove();
                                       var wId = model.workflow._id;
                                       var newTotal = ($("td[data-id='" + wId + "'] .totalCount").html() - 1);
                                       $("td[data-id='" + wId + "'] .totalCount").html(newTotal);
                                   }
                               }
                               self.hideDialog();
                           },
                           error: function (model, xhr) {
                               self.errorNotification(xhr);
                           }
                       });
                   }
               },
               hideNewSelect: function (e) {
                   $(".newSelectList").hide();
               },
               showNewSelect: function (e, prev, next) {
                   populate.showSelect(e, prev, next, this);
                   return false;
               },

               chooseOption: function (e) {
                   $(e.target).parents("dd").find(".current-selected").text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
               },

               render: function () {
                   var id =null;
                   var self = this;
                   var formString = this.template({
                       model: this.currentModel.toJSON()
                   });
                   this.$el = $(formString).dialog({
                       closeOnEscape: false,
                       dialogClass: "edit-dialog",
                       width: 690,
                       title: "Edit Application",
                       buttons: {
                           save: {
                               text: "Save",
                               class: "btn",
                               click: self.saveItem
                           },
                           cancel: {
                               text: "Cancel",
                               class: "btn",
                               click: self.hideDialog
                           },
                           delete: {
                               text: "Delete",
                               class: "btn",
                               click: self.deleteItem
                           }
                       }
                   });
                   var notDiv = this.$el.find('.attach-container');
                   notDiv.append(
                       new attachView({
                           model: this.currentModel,
                           url:"/uploadApplicationFiles"
                       }).render().el
                   );
                   notDiv = this.$el.find('.assignees-container');
                   notDiv.append(
                       new AssigneesView({
                           model: this.currentModel
                       }).render().el
                   );
                   populate.getWorkflow("#workflowsDd", "#workflowNamesDd", "/WorkflowsForDd", { id: "Applications" }, "name", this,false,function(data){
                       var id;
                       for (var i=0;i<data.length;i++){
                           if (data[i].name=="Refused"){
                               self.refuseId = data[i]._id;
                               if (self.currentModel&&self.currentModel.toJSON().workflow&&self.currentModel.toJSON().workflow._id==data[i]._id){
                                   $(".refuseEmployee").hide();
                               }
                               break;
                           }
                       }
                   });
                   populate.get("#departmentDd", "/DepartmentsForDd", {}, "departmentName", this);
                   populate.get("#jobPositionDd", "/JobPositionForDd", {}, "name", this);
                   populate.get("#jobTypeDd", "/jobType", {}, "_id", this);
                   common.canvasDraw({ model: this.currentModel.toJSON() }, this);
                   $('#nextAction').datepicker({
                       dateFormat: "d M, yy",
                       changeMonth: true,
                       changeYear: true,
                       minDate: this.currentModel.toJSON().creationDate
                   });
                $('#dateBirth').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth : true,
                    changeYear : true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });
                   var model = this.currentModel.toJSON();
                   if (model.groups)
                       if (model.groups.users.length > 0 || model.groups.group.length) {
                           $(".groupsAndUser").show();
                           model.groups.group.forEach(function (item) {
                               $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.departmentName + "</td><td class='text-right'></td></tr>");
                               $("#targetGroups").append("<li id='" + item._id + "'>" + item.departmentName + "</li>");
                           });
                           model.groups.users.forEach(function (item) {
                               $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
                               $("#targetUsers").append("<li id='" + item._id + "'>" + item.login + "</li>");
                           });

                       }
                   return this;
               }
           });
           return EditView;
       });
