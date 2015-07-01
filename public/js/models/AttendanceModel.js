/**
 * Created by German on 30.06.2015.
 */
define([], function () {
    var AttendanceModel = Backbone.Model.extend({
        defaults: {
            employees: [],
            years: ['Line Year',2014],
            status: [
                'All',
                'Hired',
                'Not Hired'
            ],
            labelMonth: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            weekDays: ["S", "M", "T", "W", "T", "F", "S"],
            leaveDays: 0,
            lastLeave: 0,
            workingDays: 0,
            lastWorkingDays: 0,
            vacation: 0,
            lastVacation: 0,
            personal: 0,
            lastPersonal: 0,
            sick: 0,
            lastSick: 0,
            education: 0,
            lastEducation: 0,
            currentEmployee: null,
            currentStatus: null,
            currentTime: null
        }
    });

    return AttendanceModel;
});