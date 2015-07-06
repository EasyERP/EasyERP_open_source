/**
 * Created by Roman on 17.06.2015.
 */
define([], function(){
    var MainModel = Backbone.Model.extend({
        defaults:{
            bySales: [],
            byProject: [],
            currentStartWeek: null,
            currentYear: null,
            currentMonth: null,
            yearOfMonth: null,
            weeksArr: [],
            bySalesData: [],
            byDepData: [],
            paidBySales: []
        }
    });

    return MainModel;
});