define([
        'text!templates/vacationDashboard/TopBarTemplate.html'
    ],
    function (ContentTopBarTemplate) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: 'DashboardVacation',
            template: _.template(ContentTopBarTemplate),

            events: {

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
