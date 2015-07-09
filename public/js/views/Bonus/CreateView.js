define([
        "text!templates/Bonus/CreateTemplate.html",
        'models/BonusModel'
    ],
    function (CreateTemplate, currentModel) {

        var CreateView = Backbone.View.extend({
            el: '#bonusTable',
            template: _.template(CreateTemplate),

            initialize: function (options) {
                var model = new currentModel();
                var data = options;

                this.startDate = data.StartDate;
                this.endDate = data.EndDate;

                model.set({
                    startDate: data.StartDate,
                    endDate: data.EndDate
                });

                this.render(model);
            },

            events: {},

            render: function (options) {
                var data = options.toJSON();

                this.$el.prepend(this.template({options: data, startDate: this.startDate, endDate: this.endDate}));

                $('.startDate input').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        var startDate = $('.startDate input').datepicker('getDate');
                        startDate.setDate(startDate.getDate());
                        $('.endDate input').datepicker('option', 'minDate', startDate);
                    }
                });
                $('.endDate input').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        var endDate = $('.endDate input').datepicker('getDate');
                        endDate.setDate(endDate.getDate());
                        $('.startDate input').datepicker('option', 'maxDate', endDate);
                    }
                });

                $('.startDate input').datepicker('setDate',this.startDate);
                $('.endDate input').datepicker('setDate',this.endDate);

                return this;
            }

        });

        return CreateView;
    });
