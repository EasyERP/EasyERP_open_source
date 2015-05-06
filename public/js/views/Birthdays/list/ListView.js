define([
    'text!templates/Birthdays/list/ListTemplate.html',
    'views/Birthdays/list/ListItemView',
    'common'
],
function (ListTemplate, ListItemView, common) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
			this.startTime = options.startTime;
            this.employeesCollection = options.collection.toJSON()[0];
            this.render();
        },
        render: function () {
            this.$el.html(_.template(ListTemplate));
            var list = this.$el.find('#birthdaysList');
            list.find("#weekList").append(new ListItemView({ collection: this.employeesCollection.weekly }).render().el);
            list.find("#weekList.next").append(new ListItemView({ collection: this.employeesCollection.nextweek }).render().el);
            list.find("#monthList").append(new ListItemView({ collection: this.employeesCollection.monthly }).render().el);
            var ids = _.map( this.employeesCollection.nextweek,function(item){
				return item._id;
			});
			ids = ids.concat( _.map( this.employeesCollection.monthly,function(item){
				return item._id;
			}));
			common.getImages(ids, "/getEmployeesImages");
			this.$el.append("<div id='timeRecivingDataFromServer'>Created in "+(new Date()-this.startTime)+" ms</div>");
        }
    });
    return ContentView;
});
