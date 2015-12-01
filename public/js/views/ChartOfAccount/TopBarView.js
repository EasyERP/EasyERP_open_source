define([
        'text!templates/ChartOfAccount/TopBarTemplate.html',
        'custom',
        'common',
        'constants'
    ],
    function (ContentTopBarTemplate, Custom, Common, CONSTANTS) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: CONSTANTS.CHARTOFACCOUNT,
            template: _.template(ContentTopBarTemplate),

            events: {
                "click #top-bar-deleteBtn"      : "deleteEvent",
                "click #top-bar-saveBtn"        : "saveEvent",
                "click #top-bar-createBtn"      : "createEvent"
            },

            initialize: function (options) {
                if (options.collection)
                    this.collection = options.collection;
                this.render();
            },

            createEvent: function (event) {
                event.preventDefault();

                this.trigger('createEvent');
            },

            deleteEvent: function (event) {
                event.preventDefault();
                this.trigger('deleteEvent');
            },

            saveEvent: function (event) {
                event.preventDefault();

                this.trigger('saveEvent');
            },

            render: function () {
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

                Common.displayControlBtnsByActionType('Content', viewType);
                return this;
            }
        });

        return TopBarView;
    });
