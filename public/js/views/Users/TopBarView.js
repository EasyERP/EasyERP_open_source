define([
    'text!templates/Users/TopBarTemplate.html',
    'custom',
    'common'
],
    function (TopBarTemplate, Custom, Common) {
        var TopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Users",
            collectionLength: 0,
            template: _.template(TopBarTemplate),
            
            events:{
                "click a.changeContentView": 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-discardBtn": "discardEvent",
                "click #top-bar-editBtn": "editEvent",
                "click #top-bar-createBtn": "createEvent"
            },

            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            changeItemIndex: function (e) {
                var actionType = "Content";
                Custom.changeItemIndex(e, actionType, this.contentType, this.collection);
            },
            
            initialize: function(options){
                this.actionType = options.actionType;
                if (this.actionType !== "Content")
                    Custom.setCurrentVT("form");
                if (options.collection) {
                    this.collection = options.collection;
                    this.collection.bind('reset', _.bind(this.render, this));
                }
                this.render();
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Really DELETE items ?!");
                if (answer == true) this.trigger('deleteEvent');
            },
            createEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },
            editEvent: function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },
            render: function(){
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({ viewType: viewType, contentType:this.contentType}));
                Common.displayControlBtnsByActionType('Content', viewType);
                return this;
            },

            discardEvent: function (event) {
                event.preventDefault();
                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
            }

        });



        return TopBarView;
    });
