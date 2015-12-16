/**
 * Created by liliya on 29.09.15.
 */
define([
        'models/ProjectsModel'
    ],
    function (ProjectModel) {
        var ProjectsCollection = Backbone.Collection.extend({
            model     : ProjectModel,
            url       : function () {
                return "project/getProjectPMForDashboard";
            },
            initialize: function (options) {
                this.sort = (options && options.sort) ? options.sort : {};

                this.fetch({
                    data   : {
                        sort: this.sort
                    },
                    type   : 'GET',
                    reset  : true,
                    success: this.fetchSuccess,
                    error  : this.fetchError
                });
            },

            parse: function (response) {
                return response.data;
            }
        });
        return ProjectsCollection;
    });