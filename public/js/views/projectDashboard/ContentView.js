/**
 * Created by liliya on 28.09.15.
 */
define([
        "text!templates/projectDashboard/DashboardTemplate.html",
        'collections/Projects/ProjectsCollection',
        "helpers",
        "dataService"
    ],
    function (DashboardTemplate, projectCollection, helpers, dataService) {
        var ContentView = Backbone.View.extend({
            contentType: "Dashboard",
            actionType: "Content",
            template: _.template(DashboardTemplate),
            el: '#content-holder',
            initialize: function (options) {
                this.startTime = options.startTime;
                this.render();
            },
            events:{

            },

            render: function () {
                var self = this;

                dataService.getData('project/getForDashboard', null, function(result){
                    self.collection = result;

                    self.$el.html(self.template({
                        projectCollection: self.collection,
                        startNumber: 0,
                        currencySplitter: helpers.currencySplitter}
                    ));

                    self.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-self.startTime)+" ms</div>");
                });

            }
        });
        return ContentView;
    }
);
