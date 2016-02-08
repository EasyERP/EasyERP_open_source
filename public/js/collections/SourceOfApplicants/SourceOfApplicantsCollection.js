define([
        'Backbone',
        'jQuery',
        'models/SourceOfApplicantsModel',
        'constants'
    ],
    function (Backbone, $, SourceOfApplicantsModel, CONSTANTS) {
        'use strict';

        var SourceOfApplicantsCollection = Backbone.Collection.extend({
            model     : SourceOfApplicantsModel,
            url       : function () {
                return CONSTANTS.URLS.SOURCESOFAPPLICANTS;
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
            parse     : function (response) {
                return response.data;
            }
        });
        return SourceOfApplicantsCollection;
    });