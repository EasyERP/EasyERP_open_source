/**
 * Created by German on 02.07.2015.
 */
define([
    'text!templates/vacationDashboard/statisticsTemplate.html'
], function (statiscticsBlock) {
    var StatisticsView = Backbone.View.extend({
        el        : '#statistics',
        initialize: function (options) {
            this.free = options.free;
            this.almostFree = options.almostFree;
            this.partiallyBusy = options.partiallyBusy;
            this.fullyBusy = options.fullyBusy;
            this.overworked = options.overworked;
            this.freedNextWeek = options.freedNextWeek;
        },

        events: {},

        render: function (options) {
            var self = this;
            var startTime = options.startTime;

            self.$el.html(_.template(statiscticsBlock, {
                free         : options.free,
                almostFree   : options.almostFree,
                partiallyBusy: options.partiallyBusy,
                fullyBusy    : options.fullyBusy,
                overworked   : options.overworked,
                freedNextWeek: options.freedNextWeek
            }));

            $('#timeRecivingDataFromServer').html("Calculated in " + (new Date() - startTime) + " ms");
        }
    });

    return StatisticsView;
});