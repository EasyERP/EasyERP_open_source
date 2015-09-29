/**
 * Created by liliya on 29.09.15.
 */
define([
        'models/ProjectsModel'
    ],
    function (ProjectModel) {
        var ProjectsCollection = Backbone.Collection.extend({
            model: ProjectModel,
            url: function () {
                return "/getProjectPMForDashboard";
            },
            initialize: function () {
                var mid = 39;

                this.fetch({
                    data: $.param({
                        mid: mid
                    }),
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse: true,
            parse: function (response) {
                return response.data;
            }
        });
        return ProjectsCollection;
    });