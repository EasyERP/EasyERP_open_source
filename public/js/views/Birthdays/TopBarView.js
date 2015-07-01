define([
    'text!templates/Birthdays/TopBarTemplate.html'
],
    function (ContentTopBarTemplate) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            template: _.template(ContentTopBarTemplate),
            initialize: function(options){
				this.collection = options.collection;
				this.render();
            },
            render: function(){
                $('title').text('Birthdays');
                this.$el.html(this.template());
                return this;
            }
        });
        return TopBarView;
    });
