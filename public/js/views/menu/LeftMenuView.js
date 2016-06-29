define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/menu/LeftMenuTemplate.html'
], function (Backbone, _, $, LeftMenuTemplate) {
    'use strict';
    var LeftMenuView = Backbone.View.extend({
        tagName: 'nav',
        className: 'menu',
        el: '#submenu-holder nav',
        currentSection: null,
        selectedId: null,

        initialize: function (options) {
            if (!options.collection) {
                App.render({
                    type: 'error',
                    message: 'No collection specified!'
                });
            }

            this.collection = options.collection;
            this.currentRoot = options.currentRoot;
            this.currentModule = options.currentModule;

            this.render();
        },

        events: {
            'click .root': 'openRoot'
        },

        openRoot: function (e) {
            this.$el.find('.root.opened').removeClass('opened');
            $(e.target).closest('.root').addClass('opened')
        },
        selectMenuItem: function (rootIndex, childIndex) {
            var $rootElement = this.$el.find('li.root').eq(rootIndex);

            this.$el.find('li.opened').removeClass('opened');
            this.$el.find('li.active').removeClass('active');
            this.$el.find('li.selected').removeClass('selected');

            $rootElement.find('li').eq(childIndex).addClass('selected');
            $rootElement.addClass('active opened');
        },

        updateState: function (isCollapsed) {
            var $submenu = this.$el.closest('#submenu-holder');

            if (isCollapsed) {
                $submenu.addClass('collapsed');
            } else {
                $submenu.removeClass('collapsed');
            }

        },


        render: function () {
            var $el = this.$el;

            $el.html(_.template(LeftMenuTemplate)({
                menuList: this.collection.toJSON(),
                currentRoot: this.currentRoot,
                currentModule: this.currentModule
            }));

            return this;
        }
    });

    return LeftMenuView;
});
