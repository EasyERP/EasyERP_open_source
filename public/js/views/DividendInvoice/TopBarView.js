define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/DividendInvoice/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
],
    function (Backbone, $, _, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.DIVIDENDINVOICE,
            template   : _.template(ContentTopBarTemplate),

            events: {
                'click a.changeContentView': 'changeContentViewType',
                'click #top-bar-deleteBtn' : 'deleteEvent',
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

            createEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },

            render: function () {
                var viewType = Custom.getCurrentVT();
                $('title').text(this.contentType);
                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

                Common.displayControlBtnsByActionType('Content', viewType);
                return this;
            },

            editEvent: function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },

            deleteEvent: function (event) {
                var answer = confirm('Really DELETE items ?!');
                event.preventDefault();
                if (answer === true) {
                    this.trigger('deleteEvent');
                }
            }
        });

        return TopBarView;
    });
