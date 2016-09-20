define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Profiles/TopBarTemplate.html',
    'custom',
    'dataService',
    'common'
], function (Backbone, _, $, TopBarTemplate, Custom, dataService, Common) {
    var TopBarView = Backbone.View.extend({
        el         : '#top-bar',
        contentType: 'Product Categories',
        actionType : null, // Content, Edit, Create
        template   : _.template(TopBarTemplate),

        events: {
            'click #top-bar-deleteBtn': 'deleteEvent',
            'click #top-bar-editBtn'  : 'editEvent',
            'click #top-bar-createBtn': 'createEvent',
            'click #top-bar-saveBtn'  : 'saveEvent'
        },

        initialize: function (options) {
            this.actionType = options.actionType;

            this.render();
        },

        createEvent: function (event) {
            event.preventDefault();

            this.trigger('createEvent');
        },

        editEvent: function (event) {
            event.preventDefault();

            this.trigger('editEvent');
        },

        saveEvent: function (event) {
            event.preventDefault();

            this.trigger('saveEvent');
        },

        render: function () {
            $('title').text(this.contentType);

            this.$el.html(this.template({contentType: this.contentType, viewType: 'list'}));
            Common.displayControlBtnsByActionType(this.actionType);

            return this;
        }
    });

    return TopBarView;
});
