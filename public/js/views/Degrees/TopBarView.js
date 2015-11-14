define([
    'text!templates/Degrees/TopBarTemplate.html',
    'custom',
    'Common'
],
    function (ContentTopBarTemplate, Custom, Common) {
        var TopBarView = Backbone.View.extend({
            el:'#top-bar',
            contentType: "Degrees",
            actionType: null,
            template: _.template(ContentTopBarTemplate),
            
            events:{
            	"click a.changeContentView": 'changeContentViewType',
            	"click ul.changeContentIndex a": 'changeItemIndex',
            	"click #top-bar-deleteBtn": "deleteEvent",
            	"click #top-bar-discardBtn": "discardEvent"
            },
            changeContentViewType: Custom.changeContentViewType,
            changeItemIndex: Custom.changeItemIndex,
            initialize: function(options){
            	this.actionType = options.actionType;
            	if (this.actionType !== "Content")
            		Custom.setCurrentVT("form");
            	this.collection = options.collection;
            	this.collection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            render: function(){
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();
                var collectionLength = this.collection.length;
                var itemIndex = Custom.getCurrentII();
                this.$el.html(this.template({ viewType: viewType, contentType: this.contentType, collectionLength: collectionLength, itemIndex: itemIndex }));
                Common.displayControlBtnsByActionType(this.actionType, viewType);
                return this;
            },
            
            deleteEvent: function(event)
            {
            	event.preventDefault();
            	var answer=confirm("Really DELETE items ?!");
            	if (answer==true) this.trigger('deleteEvent');
            },
            
            discardEvent: function(event)
            {
            	event.preventDefault();
            	Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
            }
        });
        return TopBarView;
    });