define([
        'views/menu/TopMenuItemView'
    ],
    function (TopMenuItemView) {

        var TopMenuView = Backbone.View.extend({
            tagName: 'ul',
            el: '#mainmenu-holder nav ul',
            selectedModule: null,
            initialize: function (options) {
                if (!options.collection) throw "No collection specified!";
                this.collection = options.collection;
                this.currentRoot = options.currentRoot;
                this.leftMenu = options.leftMenu;
                this.render();
                _.bindAll(this, 'render', 'clickItem');

            },

            events: {
                "click": "clickItem"
//                "click > li": "mouseOver"
            },

            clickItem: function (event) {
                this.unbind('mouseOver');
                event.preventDefault();
                this.selectedModule = $(event.target).text();
                this.trigger('changeSelection', this.selectedModule);
                this.render();
                this.bind('mouseOver', this.leftMenu.mouseOver, {leftMenu: this.leftMenu});

            },

            mouseOver: function (event) {
                event.preventDefault();
                this.$el.find('.hover').removeClass('hover');
                $(event.target).closest('li').addClass('hover');
                this.selectedModule = $(event.target).text();
                this.trigger('mouseOver', this.selectedModule);
                //this.render();
            },
            updateTopMenu: function (currentRoot) {
                this.currentRoot = currentRoot;
                this.selectedModule = (this.currentRoot[0]).get('mname');
                this.$el.find(".selected").removeClass("selected");
                this.$el.find("#" + this.selectedModule).parent().addClass("selected");
            },
            render: function () {
                if (this.selectedModule === null)
                    if (this.currentRoot) {
                        this.selectedModule = this.currentRoot[0] ? (this.currentRoot[0]).get('mname') : null;
                    } else {
                        this.selectedModule = this.currentRoot[0] ? (this.collection[0]).get('mname') : null;
                    }
                var self = this;
                this.$el.empty();
                _.each(this.collection, function (model) {
                    var view = new TopMenuItemView({model: model});
                    var item = view.render().el;
                    if (model.get('mname') === self.selectedModule)
                        $(item).addClass('selected');
                    self.$el.append(item);
                });
                return this;
            }
        });

        return TopMenuView;
    }
)






























