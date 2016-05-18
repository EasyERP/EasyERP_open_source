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
                "click #top-bar-generate": "closeMonth",
                "click #top-bar-reclose" : "recloseEvent"
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

            recloseEvent: function (event) {
                event.preventDefault();
              //  this.trigger('recloseEvent');

                var dates = [];
                var checked = $("input.checkbox:checked");
                var url;

                this.url = '/journal/journalEntry/recloseMonth';

                checked.each(function (ind, el) {
                    dates.push(el.value);
                });

                $.ajax({
                    type       : 'POST',
                    url        : this.url,
                    contentType: "application/json",
                    data       : JSON.stringify(dates),

                    success: function () {
                        url = window.location.hash;

                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});

                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: "error"
                        });
                    }
                });
            },

            render: function () {
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();

                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));
                Common.displayControlBtnsByActionType(this.actionType, viewType);

                return this;
            }
        });

        return TopBarView;
    });