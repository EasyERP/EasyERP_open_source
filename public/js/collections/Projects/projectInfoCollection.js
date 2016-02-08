/**
 * Created by liliya on 29.09.15.
 */
define([
        'Backbone',
        'models/ProjectsModel',
        'constants'
    ],
    function (Backbone, ProjectModel, CONSTANTS) {
        'use strict';

        var ProjectsCollection = Backbone.Collection.extend({
            model     : ProjectModel,
            url       : function () {
                return CONSTANTS.URLS.PROJECT_DASHBOARD;
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