/**
 * Created by liliy on 25.03.2016.
 */
define([
        'text!templates/closeMonth/TopBarTemplate.html',
        'custom',
        'common'
    ],
    function (ContentTopBarTemplate, Custom, Common) {
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: "closeMonth",
            actionType : null, //Content, Edit, Create
            template   : _.template(ContentTopBarTemplate),

            events: {
                "click #top-bar-generate"     : "closeMonth"
            },

            initialize: function (options) {
                this.actionType = options.actionType;

                if (options.collection) {
                    this.collection = options.collection;
                    this.collection.bind('reset', _.bind(this.render, this));
                }
                this.render();
            },

            closeMonth: function (event) {
                event.preventDefault();
                this.trigger('generateEvent');
            },

            render     : function () {
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();

                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));
                Common.displayControlBtnsByActionType(this.actionType, viewType);

                return this;
            }
        });

        return TopBarView;
    });