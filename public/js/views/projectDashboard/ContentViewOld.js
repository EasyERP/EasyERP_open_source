define([
    "text!templates/projectDashboard/DashboardTemplateOld.html",
    "common",
    "dataService",
],
       function (DashboardTemplate, common, dataService) {
           var ContentView = Backbone.View.extend({
               contentType: "Dashboard",
               actionType: "Content",
               template: _.template(DashboardTemplate),
               el: '#content-holder',
               initialize: function (options) {
                   this.startTime = options.startTime;
                   this.render();
               },
               events: {
                   "click .choseDateRange .item": "newRange"
               },
               populateProjectForDashboard:function (url, callback) {
                   dataService.getData(url, {}, function (response) {
                       if (callback) {
                           callback(response);
                       }
                   });
               },
               renderProjectPM:function(){
                   var self = this;
                   this.populateProjectForDashboard("/getProjectPMForDashboard",function(collection){
                       collection = collection.data;
                       var k=0;
                       collection.forEach(function(item){
                           k++;
                           if (item.projectmanager)
                               $("#ProjectPMContent").append("<tr><td>"+k+"</td><td><a href='#easyErp/Employees/form/"+item.projectmanager._id+"'>"+item.projectmanager.name+"</a></td><td><a href='#easyErp/Tasks/list/pId="+item._id+"'>"+item.projectName+"</a></td><td class='health-wrapper'><a href='javascript:;' class='center health"+item.health+"'></a></td></tr>");
                       });
                       if (collection.length==0){
                           $(".projectInProgress").hide();
                       }
                       else{
                           $(".projectInProgress").show();
                       }
                   });
               },
               renderProjectStatus:function(){
                   var self = this;
                   this.populateProjectForDashboard("/getProjectStatusCountForDashboard",function(collection){
                       var n = collection.workflow.length;
                       var k = collection.data.length;
                       $("#projectStatus").append("<tr></tr>");
                       for (var i=0;i<n;i++){
                           $("#projectStatus tr").append("<th>"+collection.workflow[i].name+"</th>");  
                       }
                       $("#projectStatus").append("<tr></tr>");
                       for (var i=0;i<n;i++){
                           var s = 0;
                           for (var j=0;j<k;j++){
                               if (collection.workflow[i]._id==collection.data[j]._id){
                                   s = collection.data[j].count;
                                   break;
                               }
                           }
                           $("#projectStatus tr").eq(1).append("<td>"+s+"</td>");
                       }


                   });
               },
               renderProjectEnd:function(){
                   var self = this;
                   this.populateProjectForDashboard("/getProjectByEndDateForDashboard",function(data){
                       data= data.data;
                       var k=0;
                       data.This.forEach(function(item){
                           k++;
                           if (item.projectmanager)
                               $("#projectEndTW").find("tr").eq(0).after("<tr><td>"+k+"</td><td><a href='#easyErp/Employees/form/"+item.projectmanager._id+"'>"+item.projectmanager.name+"</a></td><td><a href='#easyErp/Tasks/list/pId="+item._id+"'>"+item.projectName+"</a></td><td class='health-wrapper'><a href='javascript:;' class='center health"+item.health+"'></a></td></tr>");
                       });
                       if (data.This.length===0){
                           $("#projectEndTW").hide();
                       }
                       else{
                           $("#projectEndTW").show();
                       }

                       k=0;
                       data.Next.forEach(function(item){
                           k++;
                           $("#projectEndNW").find("tr").eq(0).after("<tr><td>"+k+"</td><td><a href='#easyErp/Employees/form/"+item.projectmanager._id+"'>"+item.projectmanager.name+"</a></td><td><a href='#easyErp/Tasks/list/pId="+item._id+"'>"+item.projectName+"</a></td><td class='health-wrapper'><a href='javascript:;' class='center health"+item.health+"'></a></td></tr>");
                       });
                       if (data.Next.length===0){
                           $("#projectEndNW").hide();
                       }
                       else{
                           $("#projectEndNW").show();
                       }

                       k=0;
                       data.Next2.forEach(function(item){
                           k++;
                           $("#projectEndN2W").find("tr").eq(0).after("<tr><td>"+k+"</td><td><a href='#easyErp/Employees/form/"+item.projectmanager._id+"'>"+item.projectmanager.name+"</a></td><td><a href='#easyErp/Tasks/list/pId="+item._id+"'>"+item.projectName+"</a></td><td class='health-wrapper'><a href='javascript:;' class='center health"+item.health+"'></a></td></tr>");
                       });
                       if (data.Next2.length===0){
                           $("#projectEndN2W").hide();
                       }
                       else{
                           $("#projectEndN2W").show();
                       }

                   });
               },
               
               render: function () {
                   this.$el.html(this.template());
                   this.renderProjectPM();
                   this.renderProjectStatus();
                   this.renderProjectEnd();
                   this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
               }
           });
           return ContentView;
       }
      );
