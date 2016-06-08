define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Tasks/TopBarTemplate.html',
    'custom',
    'common'
], function (Backbone, $, _, ContentTopBarTemplate, Custom, Common) {
    var TopBarView = Backbone.View.extend({
        el              : '#top-bar',
        contentType     : 'Tasks',
        actionType      : null,
        collectionLength: 0,
        template        : _.template(ContentTopBarTemplate),

        events: {
            'click a.changeContentView'    : 'changeContentViewType',
            'click ul.changeContentIndex a': 'changeItemIndex',
            'click #top-bar-deleteBtn'     : 'deleteEvent',
            'click #top-bar-discardBtn'    : 'discardEvent',
            'click #top-bar-editBtn'       : 'editEvent',
            'click #top-bar-createBtn'     : 'createEvent',
            'click #kanban-settings-Btn'   : 'editKanban'
        },

        initialize: function (options) {
            this.actionType = options.actionType;

            if (this.actionType !== 'Content') {
                Custom.setCurrentVT('form');
            }
            
            if (options.collection) {
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
            }

            this.render();
        },

        changeContentViewType: function (e) {
            Custom.changeContentViewType(e, this.contentType, this.collection);
        },

        render: function () {
            var viewType;
            
            $('title').text(this.contentType);
            viewType = Custom.getCurrentVT();
            this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));
            Common.displayControlBtnsByActionType('Content', viewType);
            
            return this;
        },

        deleteEvent: function (event) {
            var answer;
            
            event.preventDefault();
            
            answer = confirm('Really DELETE items ?!');
            
            if (answer === true) {
                this.trigger('deleteEvent');
            }
        },

        editEvent: function (event) {
            event.preventDefault();
            
            this.trigger('editEvent');
        },
        
        createEvent: function (event) {
            event.preventDefault();
            
            this.trigger('createEvent');
        },

        discardEvent: function (event) {
            event.preventDefault();
            
            $('#content-holder').html('');
            Backbone.history.navigate('home/content-' + this.contentType, {trigger: true});
        },

        editKanban: function (event) {
            event.preventDefault();
            
            this.trigger('editKanban');
        }

    });

    return TopBarView;
});
