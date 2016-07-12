define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/menu/LeftMenuTemplate.html'
], function (Backbone, _, $, LeftMenuTemplate) {
    'use strict';
    var LeftMenuView = Backbone.View.extend({
        el            : '#submenuHolder',
        currentSection: null,
        selectedId    : null,

        initialize: function (options) {
            if (!options.collection) {
                App.render({
                    type   : 'error',
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
            var $activeRoot = this.$el.find('.opened');
            var $current = $(e.target).closest('.root');
            var isSubMenu = !!$(e.target).closest($current.find('ul')).length;

            if (isSubMenu) {
                return;
            }

            this.$el.find('#loginSelect').removeClass('opened');

            $activeRoot.find('ul').animate({height: 0}, 200, function () {
                $activeRoot.removeClass('opened');
            });

            if (!$current.hasClass('opened')) {
                $activeRoot.find('ul').animate({height: 0}, 200, function () {
                    $activeRoot.removeClass('opened');
                });

                $current.addClass('opened').find('ul').css({height: 0}).animate({height: $current.find('ul').get(0).scrollHeight}, 200);
            }
        },

        selectMenuItem: function (rootIndex, childIndex) {
            var $rootElement = this.$el.find('li.root').eq(rootIndex);

            this.$el.find('li.opened').removeClass('opened');
            this.$el.find('ul.opened').removeClass('opened');
            this.$el.find('li.active').removeClass('active');
            this.$el.find('li.selected').removeClass('selected');

            $rootElement.find('li').eq(childIndex + 1).addClass('selected');
            $rootElement.addClass('active opened');
        },

        render: function () {
            var $el = this.$el;

            $el.find('nav').html(_.template(LeftMenuTemplate)({
                menuList     : this.collection.toJSON(),
                currentRoot  : this.currentRoot,
                currentModule: this.currentModule
            }));

            return this;
        }
    });

    return LeftMenuView;
});
