define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Capacity/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function (Backbone, $, _, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    var TopBarView = Backbone.View.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.CAPACITY,
        template   : _.template(ContentTopBarTemplate),

        events: {
            'click a.changeContentView': 'changeContentViewType',
            'click #top-bar-deleteBtn' : 'deleteEvent',
            'click #top-bar-saveBtn'   : 'saveEvent',
            'click #top-bar-editBtn'   : 'editEvent',
            'click #top-bar-createBtn' : 'createEvent'
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

        render: function () {
            var viewType = Custom.getCurrentVT();
            this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

            $('title').text(this.contentType);

            Common.displayControlBtnsByActionType('Content', viewType);
            return this;
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
