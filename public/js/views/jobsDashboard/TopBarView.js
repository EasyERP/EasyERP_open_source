define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/jobsDashboard/TopBarTemplate.html',
    'custom',
    'common'
], function (Backbone, $, _, TopBarTemplate, Custom, Common) {
    var TopBarView = Backbone.View.extend({
        el         : '#top-bar',
        contentType: 'Dashboard',
        actionType : null, // Content, Edit, Create
        template   : _.template(TopBarTemplate),

        events: {
            'click #top-bar-deleteBtn'      : 'deleteEvent',
            'click #top-bar-nextBtn'        : 'nextEvent',
            'click #top-bar-discardBtn'     : 'discardEvent',
            'click #top-bar-editBtn'        : 'editEvent',
            'click #top-bar-createBtn'      : 'createEvent',
            'click #top-bar-exportToXlsxBtn': 'exportToXlsx'
        },
        
        initialize: function (options) {
            this.actionType = options.actionType;
            this.render();
        },

        render: function () {
            $('title').text(this.contentType);
            this.$el.html(this.template({contentType: this.contentType}));
            Common.displayControlBtnsByActionType(this.actionType);

            return this;
        }
    });

    return TopBarView;
});
