define([
        'models/ProjectsModel'
    ],
    function (ProjectModel) {
        var ProjectsCollection = Backbone.Collection.extend({
            model     : ProjectModel,
            url       : function () {
                return "/Projects";
            },
            initialize: function () {
                var mid = 39;

                this.fetch({
                    data   : $.param({
                        mid: mid
                    }),
                    type   : 'GET',
                    reset  : true,
                    success: this.fetchSuccess,
                    error  : this.fetchError
                });
            },

            parse: true,
            parse: function (response) {
                return response.data;
            }
        });
        return ProjectsCollection;
    });