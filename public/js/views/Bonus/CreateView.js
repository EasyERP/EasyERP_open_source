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
                var cid = options.cid;
                var startPicker = '#' + cid + 'StartDate';
                var endPicker = '#' + cid + 'EndDate';

                this.$el.prepend(this.template({options: data, startDate: this.startDate, endDate: this.endDate, cid: cid}));

                $(startPicker).datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        var startDate = $(self.$el).find(startPicker).datepicker('getDate');
                        var parrent = $(startPicker).parent('td');
                        var value = $(self.$el).find(startPicker).val();

                        startDate.setDate(startDate.getDate());
                        $(self.$el).find(endPicker).datepicker('option', 'minDate', startDate);
                        parrent.find('div').html(value).show();
                        $(startPicker).hide();
                    }
                });

                $(endPicker).datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function () {
                        var endDate = $(self.$el).find(endPicker).datepicker('getDate');
                        var parrent = $(endPicker).parent('td');
                        var value = $(self.$el).find(endPicker).val();

                        endDate.setDate(endDate.getDate());
                        $(self.$el).find(startPicker).datepicker('option', 'maxDate', endDate);
                        parrent.find('div').html(value).show();
                        $(endPicker).hide();
                    }
                });

                $(startPicker).datepicker('setDate',self.startDate);
                $(endPicker).datepicker('setDate',self.endDate);

                return this;
            }

        });

        return CreateView;
    });
