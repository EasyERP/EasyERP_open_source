define([
        'text!templates/wTrack/TopBarTemplate.html',
        'custom',
        'common',
        'constants'
    ],
    function (ContentTopBarTemplate, Custom, Common, CONSTANTS) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: CONSTANTS.WTRACK,
            template: _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView": 'changeContentViewType',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-saveBtn": "saveEvent",
                "click #top-bar-editBtn": "editEvent",
                "click #top-bar-createBtn": "createEvent"
            },

            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            initialize: function (options) {
                if (options.collection) {
                    this.collection = options.collection;
                }
                this.render();
            },

            createEvent: function (event) {
                event.preventDefault();

                this.trigger('createEvent');
            },

            render: function () {
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();

                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

                Common.displayControlBtnsByActionType('Content', viewType);
                return this;
            },

            editEvent: function (event) {
                event.preventDefault();

                this.trigger('editEvent');
            },

            deleteEvent: function (event) {
                event.preventDefault();
                this.trigger('deleteEvent');
            },

            saveEvent: function (event) {
                event.preventDefault();

                this.trigger('saveEvent');
            }
        });

        return TopBarView;
    });
