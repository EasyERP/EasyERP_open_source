define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/menu/MenuItem',
	'text!templates/menu/LeftMenuTemplate.html',
], function (Backbone, _, $, MenuItemView, LeftMenuTemplate) {
    'use strict';
    var LeftMenuView = Backbone.View.extend({
        tagName       : 'nav',
        className     : 'menu',
        el            : '#submenu-holder nav',
        currentSection: null,
        selectedId    : null,

        initialize: function (options) {
			var keys;
			console.log(options);
            if (!options.collection) {
                App.render({
                    type   : 'error',
                    message: 'No collection specified!'
                });
            }

            this.collection = options.collection;
			
            this.render();
        },

        events: {
            'click .root' : 'openRoot'
        },

        openRoot:function(e){
            this.$el.find('.root.opened').removeClass('opened');
            $(e.target).closest('.root').addClass('opened')
        },
        selectMenuItem: function (e) {
            var root = this.collection.root();
            var i;

            this.selectedId = $(e.target).data('module-id');
            this.$('li.selected').removeClass('selected');
            this.lastClickedLeftMenuItem = $(e.target).data('module-id');

            $(e.target).closest('li').addClass('selected');

            for (i = 0; i < root.length; i++) {
                if (root[i].get('mname') === this.currentSection) {
                    $('#mainmenu-holder .selected').removeClass('selected');
                    $('#' + this.currentSection).closest('li').addClass('selected');
                }
            }
        },


        render: function () {
            var $el = this.$el;

            $el.html(_.template(LeftMenuTemplate)( {menuList: this.collection.toJSON()} ));

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
