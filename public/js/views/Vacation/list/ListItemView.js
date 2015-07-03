define([
        'text!templates/Vacation/list/ListTemplate.html',
        'text!templates/Vacation/list/ListTotal.html',
        'async'
    ],

    function (listTemplate, listTotal, async) {
        var VacationListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.daysCount = options.daysCount;
            },

            createMonthRows: function () {
                var self = this;
                var colObject = this.collection.toJSON();
                var totalArray = new Array(self.daysCount);

                async.each(colObject, function (document) {
                    var array = document.vacationArray;
                    var resultArray = new Array(self.daysCount);
                    var countVacationDays = 0;

                    array.forEach(function (element) {
                        var startDay = new Date(element.startDate).getDate();
                        var endDay = new Date(element.endDate).getDate();

                        for (var i = endDay; i >= startDay; i--) {
                            countVacationDays++;
                            totalArray[i-1] = totalArray[i-1] ? totalArray[i-1] += 1 : 1;
                            resultArray[i-1] = '<td data-id="' + element._idVacation + '" class="editable ' + element.vacationType + '" data-content="vacType">' + element.vacationType + '</td>';
                        }
                    });

                    document.vacationArrayHTML = resultArray;
                    document.countVacationDays = countVacationDays;

                });
                return {colObject: colObject, totalArray: totalArray};
            },

            render: function () {
                var result = this.createMonthRows();

                this.$el.append(_.template(listTemplate, {vacationCollection: result.colObject}));

                var listTotalEl = this.$el.closest('table').find('#listTotal');

                listTotalEl.html('');
                listTotalEl.append(_.template(listTotal, {array: result.totalArray}));
            }
        });

        return VacationListItemView;
    });
