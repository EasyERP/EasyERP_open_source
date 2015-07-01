/**
 * Created by German on 30.06.2015.
 */
define([
    'text!templates/Attendance/monthTemplate.html'
], function (ListTemplate) {
    var MonthView = Backbone.View.extend({
        el: '#attendanceMonth',
        initialize: function (options) {
            this.months = options.month;
            this.days = options.attendance;
        },
        events: {},

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                months: this.months,
                days: this.days
            }));
        }
    });

    return MonthView;
});