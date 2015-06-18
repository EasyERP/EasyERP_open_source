/**
 * Created by Roman on 17.06.2015.
 */
define([
    'text!templates/Revenue/index.html',
    'text!templates/Revenue/weeksArray.html',
    'models/Revenue',
    'moment'
], function (mainTemplate, weeksArray, RevenueModel, moment) {
    var View = Backbone.View.extend({
        el: '#content-holder',

        template: _.template(mainTemplate),
        weeksArrayTemplate: _.template(weeksArray),

        $currentStartWeek: null,
        $revenueBySales: null,

        events: {
            'change #currentStartWeek': 'changeWeek'
        },

        initialize: function () {
            this.model = new RevenueModel();
            this.listenTo(this.model, 'change:currentYear', this.changeYear);
            this.listenTo(this.model, 'change:currentStartWeek', this.changeWeek);
            this.listenTo(this.model, 'change:weeksArr', this.changeWeeksArr);

            var currentStartWeek = moment().week() - 6;
            var currentYear = moment().weekYear();
            var currentMonth = parseInt(moment().week(currentStartWeek).format("MM"));

            this.changeWeek = _.debounce(this.updateWeek, 500);

            this.model.set({
                currentStartWeek: currentStartWeek,
                currentYear: currentYear,
                currentMonth: currentMonth
            });

            this.render();
        },

        getDate: function(num){
            return moment().day("Monday").week(num).format("DD.MM");
        },

        getModelValue: function(attr){
            return this.model.get(attr);
        },

        updateWeek: function () {
            var modelData;
            var currentStartWeek = parseInt(this.$currentStartWeek.val());
            var currentYear = this.model.get('currentYear');
            var newCurrMonth;
            var yearOfMonth;

            if (currentStartWeek === 0) {
                currentStartWeek = 53;
                currentYear -= 1;
            }
            if (currentStartWeek) {
                if (currentStartWeek > 53) {
                    currentStartWeek = 1;
                    currentYear += 1;
                }
                if (currentStartWeek < 1) {
                    currentStartWeek = 53;
                    currentYear -= 1;
                }
            }
            if (currentYear < 2014) {
                currentYear = 2014;
            }

            newCurrMonth = parseInt(moment().week(currentStartWeek).format("MM"));

            if (currentStartWeek === 1) {
                yearOfMonth = currentYear - 1;
            } else {
                yearOfMonth = currentYear;
            }

            modelData = {
                currentStartWeek: currentStartWeek,
                currentYear: currentYear,
                yearOfMonth: yearOfMonth,
                newCurrMonth: newCurrMonth
            };

            this.model.set(modelData);

            return false;
        },

        changeWeek: function () {
            var prevVal = this.model.previous('currentStartWeek');
            var weekVal = this.model.get('currentStartWeek');

            if(prevVal === 53) {
                this.$currentStartWeek.val(weekVal);
            }

            this.sendRequest();
        },

        changeYear: function () {
            var thisEl = this.$el;
            var year = thisEl.find('#currentYear');
            var yearVal = this.model.get('currentYear');

            year.text(yearVal);
        },

        changeWeeksArr: function () {
            var self = this;
            var weekArr = this.getModelValue('weeksArr');

            if(!this.rendered){
                return setTimeout(function(){
                    self.changeWeeksArr();
                }, 10);
            }

            this.$revenueBySales.html(this.weeksArrayTemplate({weeksArr: weekArr}));
        },

        sendRequest: function () {
            var model = this.model.toJSON();
            var weeksArr = [];
            var week;

            if (model.currentMonth !== model.newCurrMonth) {
                model.currentMonth = model.newCurrMonth;
            }

            for (var i = 0; i <= 13; i++) {
                if (model.currentStartWeek + i > 53) {
                    week = model.currentStartWeek + i - 53;
                    weeksArr.push({
                        lastDate: this.getDate(week),
                        week: week,
                        year: model.currentYear + 1
                    });
                } else {
                    week = model.currentStartWeek + i;
                    weeksArr.push({
                        lastDate: this.getDate(week),
                        week: week,
                        year: model.currentYear
                    });
                }
            }

            this.model.set('weeksArr', weeksArr);
        },

        render: function () {
            var self = this;
            var thisEl = this.$el;
            var model = this.model.toJSON();

            this.$el.html(this.template(model));

            this.$currentStartWeek = thisEl.find('#currentStartWeek');
            this.$revenueBySales = thisEl.find('#revenueBySales');

            this.rendered = true;

            return this;
        }
    });

    return View;
});