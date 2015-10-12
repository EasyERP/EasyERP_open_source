/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
define([
        'text!templates/bonusType/topBarTemplate.html',
        'custom',
        'common',
        'constants'
    ], function (ContentTopBarTemplate, Custom, Common, CONSTANTS) {

        var topBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: CONSTANTS.BONUSTYPE,
            contentHeader:"BonusType",
            viewType: null,
            template: _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView": 'changeContentViewType',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-editBtn": "editEvent",
                "click #top-bar-createBtn": "createEvent",
                "click #top-bar-saveBtn": "saveEvent"
            },


            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            createEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
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
            },

            initialize: function (options) {
                if (options.collection) {
                    this.collection = options.collection;
                }
                this.render();
            },

            render: function () {
                $('title').text(this.contentHeader);
                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({ viewType: viewType, contentType: this.contentType, contentHeader:this.contentHeader}));
                Common.displayControlBtnsByActionType('Content', viewType);

                return this;
            }
        });

        return topBarView;
    });