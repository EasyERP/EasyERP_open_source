define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/menu/MenuItem',
	'text!templates/menu/LeftMenuTemplate.html'
], function (Backbone, _, $, MenuItemView, LeftMenuTemplate) {
    'use strict';
    var LeftMenuView = Backbone.View.extend({
        tagName       : 'nav',
        className     : 'menu',
        el            : '#submenu-holder nav',
        currentSection: null,
        selectedId    : null,

        initialize: function (options) {
			console.log(options.collection.toJSON());
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
            'click .root' : 'openRoot',
            'click .root ul li' : 'selectMenuItem'
        },

        openRoot:function(e){
            this.$el.find('.root.opened').removeClass('opened');
            $(e.target).closest('.root').addClass('opened')
        },
        selectMenuItem: function (e) {
            this.$el.find('li.opened').removeClass('opened');
            this.$el.find('li.active').removeClass('active');
            this.$el.find('li.selected').removeClass('selected');

            $(e.target).closest('li').addClass('selected');
            $(e.target).closest('li.root').addClass('active opened');
        },

        updateState: function(isCollapsed){
            var $submenu = this.$el.closest('#submenu-holder');

            if (isCollapsed){
                $submenu.addClass('collapsed');
            }else{
                $submenu.removeClass('collapsed');
            }

        },


        render: function () {
            var $el = this.$el;

            $el.html(_.template(LeftMenuTemplate)( {
                menuList: this.collection.toJSON(),
                currentRoot:this.currentRoot,
                currentModule: this.currentModule
            } ));

            /*if (this.currentSection === null) {
                this.currentSection = root[0].get('mname');
            }

            for (i = 0, len = root.length; i < len; i++) {
                if (root[i].get('mname') === this.currentSection) {
                    currentModule = root[i];
                    break;
                }
            }
            if (currentModule === null) {
                currentModule = root[0];
            }
            elem = $el.append(this.renderMenu(this.collection.children(currentModule), onMouseOver));
            currentSelElem = document.getElementById(selectedId);
            if ($(currentSelElem).length === 0) {
                currentSelElem = $(this.lastClickedLeftMenuItem);
            }
            $(currentSelElem).closest('ul').find('.selected').removeClass('selected');
            $(currentSelElem).addClass('selected');*/

            return this;
        }
    });

    return LeftMenuView;
});
