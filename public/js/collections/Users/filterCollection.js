define([
    'Backbone',
    'Underscore',
    'models/UsersModel',
    'common',
    'constants',
    'collections/parent'
], function (Backbone, _, UserModel, common, CONSTANTS, Parent) {
    'use strict';
    var UsersCollection = Parent.extend({
        model       : UserModel,
        url         : CONSTANTS.URLS.USERS,
        page        : null,
        namberToShow: null,
        viewType    : null,
        contentType : null,

        initialize: function (options) {
            var page;

            options = options || {};

            this.startTime = new Date();
            this.contentType = options.contentType;

            page = options.page;

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        parse: function (response) {
            if (response.data) {
                _.map(response.data, function (user) {
                    if (user.lastAccess) {
                        user.lastAccess = common.utcDateToLocaleDateTime(user.lastAccess);
                    }
                    return user;
                });
            }

            return Parent.prototype.parse.call(this, response);
        }
    });
    return UsersCollection;
});
