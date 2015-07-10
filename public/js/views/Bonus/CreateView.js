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
                var self = this;
                var startDate;

                this.$el.prepend(this.template({options: data, startDate: this.startDate, endDate: this.endDate}));

                $('.startDate input').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        var startDate = $(self.$el).find('.startDate input').datepicker('getDate');
                        var parrent = $('.startDate input').parent('td');
                        var value = $(self.$el).find('.startDate input').val();

                        startDate.setDate(startDate.getDate());
                        $(self.$el).find('.endDate input').datepicker('option', 'minDate', startDate);
                        parrent.find('div').html(value).show();
                        $('.startDate input').hide();
                    }
                });

                $('.endDate input').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        var endDate = $(self.$el).find('.endDate input').datepicker('getDate');
                        var parrent = $('.endDate input').parent('td');
                        var value = $(self.$el).find('.endDate input').val();

                        endDate.setDate(endDate.getDate());
                        $(self.$el).find('.startDate input').datepicker('option', 'maxDate', endDate);
                        parrent.find('div').html(value).show();
                        $('.endDate input').hide();
                    }
                });

                $('.startDate input').datepicker('setDate',this.startDate);
                $('.endDate input').datepicker('setDate',this.endDate);

                return this;
            }

        });

        return CreateView;
    });
