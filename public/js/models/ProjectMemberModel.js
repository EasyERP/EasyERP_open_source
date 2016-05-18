define(['Backbone'], function (Backbone) {
    'use strict';

    var ProjectMemberModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return '/projectMember';
        }
    });
    return ProjectMemberModel;

});
