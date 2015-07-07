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
                var totalArray = new Array(this.daysCount);

                async.each(colObject, function (document) {
                    var resultArray = new Array(self.daysCount);
                    var countVacationDays = 0;

                    for (var i = self.daysCount; i >= 1; i--) {
                        var element = document.vacArray[i];
                        if (element) {
                            countVacationDays++;
                            totalArray[i - 1] = totalArray[i - 1] ? totalArray[i - 1] += 1 : 1;
                            resultArray[i - 1] = '<td data-dayID="' + (i - 1) + '" class="editable ' + element + '" data-content="vacType">' + element + '</td>';
                        } else {
                            resultArray[i - 1] = '<td data-dayID="' + (i - 1) + '" class="editable" data-content="vacType"></td>';
                        }
                    }

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
