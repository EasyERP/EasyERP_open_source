define([
        'text!templates/vacationDashboard/TopBarTemplate.html'
    ],
    function (ContentTopBarTemplate) {
        "use strict";
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: 'DashboardVacation',
            template   : _.template(ContentTopBarTemplate),

            events: {
                "click #updateDate" : "changeDateRange",
                "click .dateRange": "toggleDateRange"
            },

            changeDateRange: function (e) {
                this.trigger('changeDateRange');
            },

            toggleDateRange: function (e) {
                var targetEl = $(e.target);
                var ul = targetEl.closest('ul');

                ul.find('.frameDetail').toggleClass('hidden');
            },

            initialize: function (options) {
                if (options && options.collection) {
                    this.collection = options.collection;
                }

                this.render();
            },

            render: function () {
                $('title').text(this.contentType);

                this.$el.html(this.template({contentType: this.contentType}));

                return this;
            }
        });

        return TopBarView;
    });
