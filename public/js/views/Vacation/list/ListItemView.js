define([
        'text!templates/Vacation/list/ListTemplate.html',
        'async'
    ],

    function (listTemplate, async) {
        var VacationListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.daysCount = options.daysCount;
            },

            createMonthRows: function () {
                var self = this;
                var colObject = this.collection.toJSON();

                async.each(colObject, function (document) {
                    var array = document.vacationArray;
                    var resultArray = new Array(self.daysCount);

                    array.forEach(function (element) {
                        var startDay = new Date(element.startDate).getDate();
                        var endDay = new Date(element.endDate).getDate();

                        for (var i = endDay; i >= startDay; i--) {
                            resultArray[i] = '<td data-id="' + element._idVacation + '">' + element.vacationType + '</td>';
                        }
                    });

                    document.vacationArrayHTML = resultArray;

                });
                return colObject;
            },

            render: function () {
                var result = this.createMonthRows();

                this.$el.append(_.template(listTemplate, {vacationCollection: result}));
            }
        });

        return VacationListItemView;
    });
