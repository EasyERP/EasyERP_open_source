define([
    'models/UsersModel',
    'common'
],
function (UserModel, common) {
        var UsersCollection = Backbone.Collection.extend({
            model: UserModel,
            url: "/Users/",
            page:null,
            namberToShow: null,
            viewType: null,
            contentType: null,
            initialize: function (options) {
				this.startTime = new Date();
                var that = this;
                this.namberToShow = options.count;
                this.page = options.page || 1;
                if (options && options.viewType) {
                    this.url += options.viewType;
                }
                this.fetch({
                    data: options,
                    reset: true,
                    success: function () {
                        that.page ++;
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                    }
                });
            },

            showMore: function (options) {
                var that = this;
                var filterObject = options || {};
                filterObject['page'] = (options && options.page) ? options.page: this.page;
                filterObject['count'] = (options && options.count) ? options.count: this.namberToShow;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page ++;
                        that.trigger('showmore', models);
                    },
                    error: function () {
                        alert('Some Error');
                    }
                });
            },

            parse: true,
            parse: function (response) {
                if (response.data) {
                    _.map(response.data, function (user) {
                    	if (user.lastAccess)
                    	    user.lastAccess = common.utcDateToLocaleDateTime(user.lastAccess);
                        return user;
                    });
                }
                return response.data;
            }
        });
        return UsersCollection;
});