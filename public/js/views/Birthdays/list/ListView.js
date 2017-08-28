define([
    'Backbone',
    'Underscore',
    'text!templates/Birthdays/list/ListTemplate.html',
    'views/Birthdays/list/ListItemView',
    'common',
    'views/guideTours/guideNotificationView'
], function (Backbone, _, ListTemplate, ListItemView, common, GuideNotify) {
    'use strict';

    var ContentView = Backbone.View.extend({
        el        : '#content-holder',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.employeesCollection = options.collection.toJSON()[0];
            this.render();
        },
        
        render: function () {
            var list;
            var ids;

            this.$el.html(_.template(ListTemplate));
            list = this.$el.find('#birthdaysList');
            list.find('#weekList').append(new ListItemView({collection: this.employeesCollection.weekly}).render().el);
            list.find('#weekList.next').append(new ListItemView({collection: this.employeesCollection.nextweek}).render().el);
            list.find('#monthList').append(new ListItemView({collection: this.employeesCollection.monthly}).render().el);
            ids = _.map(this.employeesCollection.nextweek, function (item) {
                return item._id;
            });
            ids = ids.concat(_.map(this.employeesCollection.monthly, function (item) {
                return item._id;
            }));
            common.getImages(ids, '/employees/getEmployeesImages');
            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');


            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        }
    });
    return ContentView;
});
