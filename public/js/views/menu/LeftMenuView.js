define([
        'Backbone',
        'Undescore',
        'jQuery',
        'views/menu/MenuItem',
        'collections/menu/MenuItems'
    ], function (Backbone, _, $, MenuItemView) {
        'use strict';
        var LeftMenuView = Backbone.View.extend({
            tagName       : 'nav',
            className     : 'menu',
            el            : '#submenu-holder nav',
            currentSection: null,
            selectedId    : null,

            initialize: function (options) {
                if (!options.collection) {
                    throw "No collection specified!";
                }

                this.collection = options.collection;

                if (options.currentRoot) {
                    this.currentSection = options.currentRoot[0] ? options.currentRoot[0].get('mname') : null;
                }

                this.currentChildren = options.currentChildren;

                if (this.currentChildren && this.currentChildren.length > 0) {
                    this.selectedId = this.currentChildren[0].get("_id");
                    this.render(null, this.currentChildren[0].get("_id"));
                } else {
                    this.render();
                }

                this.collection.bind('reset', _.bind(this.render, this));
                this.mouseLeave = _.debounce(this.mouseLeaveEl, 2000);

                _.bindAll(this, 'render');
            },

            events: {
                "click a"     : "selectMenuItem",
                "mouseover a" : "hoverItem",
                "mouseleave a": "mouseLeave"
            },

            setCurrentSection: function (section) {
                this.leftMenu.currentSection = section;
                this.leftMenu.lastClickedLeftMenuItem = null;
                this.leftMenu.selectedId = null;
                this.leftMenu.render();
            },

            mouseOver: function (section, selectedId) {
                if (this.leftMenu) {
                    this.leftMenu.currentSection = section;
                    this.leftMenu.render(true, selectedId);
                } else {
                    this.currentSection = section;
                    this.render(true, selectedId);

                }
            },

            updateLeftMenu: function (currentChildren, currentRoot) {
                this.currentChildren = currentChildren;
                this.currentSection = currentRoot[0] ? currentRoot[0].get('mname') : null;
                this.selectedId = (this.currentChildren && this.currentChildren[0]) ? this.currentChildren[0].get("_id") : null;
                this.render(null, this.selectedId);
            },

            hoverItem: function (e) {
                this.$el.find('li.hover').removeClass('hover');
                $(e.target).closest('li').addClass('hover');
            },

            selectMenuItem: function (e) {
                var root = this.collection.root();

                this.selectedId = $(e.target).data('module-id');
                this.$('li.selected').removeClass('selected');
                this.lastClickedLeftMenuItem = $(e.target).data('module-id');

                $(e.target).closest('li').addClass('selected');

                for (var i = 0; i < root.length; i++) {
                    if (root[i].get('mname') == this.currentSection) {
                        $('#mainmenu-holder .selected').removeClass('selected');
                        $('#' + this.currentSection).closest('li').addClass('selected');
                    }
                }
            },

            mouseLeaveEl: function (option) {
                var self = this;

                var unSelect = function (section) {
                    var selectSection = $('#mainmenu-holder .selected > a').text();

                    if (selectSection === section) {
                        return;
                    }

                    self.mouseOver(selectSection, self.selectedId);
                    $('#mainmenu-holder .hover').not('.selected').removeClass('hover');
                };
                unSelect(option);
            },

            mouseLeave: function (event) {
                this.mouseLeaveEl = _.bind(this.mouseLeaveEl, this, this.currentSection);
                this.mouseLeaveEl = _.debounce(this.mouseLeaveEl, 2000);
                this.mouseLeaveEl();
            },

            renderMenu: function (list, onMouseOver) {
                var self = this;
                var $dom = $('<ul></ul>');
                var clickEl;
                var children;
                var _el;

                if (_.size(list) === 0) {
                    return null;
                }

                _.each(list, function (model) {
                    var html = this.renderMenuItem(model);

                    $dom.append(html);
                }, this);

                clickEl = $dom.find('a')[0];
                children = (this.currentChildren && this.currentChildren[0]) ? this.currentChildren[0].get("_id") : null;

                if (this.currentChildren) {
                    clickEl = $dom.find('li#' + children + " a")[0];
                }

                _el = $('.selected > a').text();

                $(clickEl).on("click", {mouseOver: onMouseOver}, function (option) {
                    if (_el === self.currentSection) {
                        $(clickEl).closest('li').addClass('selected');
                    }
                    if (!option.data.mouseOver) {
                        $(clickEl).closest('li').addClass('selected');
                        window.location.href = $(clickEl).attr('href');
                    }
                });
                if (!this.currentChildren) {
                    $(clickEl).click();
                }
                this.currentChildren = null;

                return $dom;
            },

            renderMenuItem: function (model) {
                var view = new MenuItemView({model: model});
                var elem = view.render().el;
                return elem;
            },

            render: function (onMouseOver, selectedId) {
                var $el = this.$el;
                var currentModule = null;
                var root = this.collection.root();

                $el.html('');

                if (this.currentSection === null) {
                    this.currentSection = root[0].get('mname');
                }

                for (var i = 0, len = root.length; i < len; i++) {
                    if (root[i].get('mname') === this.currentSection) {
                        currentModule = root[i];
                        break;
                    }
                }
                if (currentModule === null) {
                    currentModule = root[0];
                }
                var elem = $el.append(this.renderMenu(this.collection.children(currentModule), onMouseOver));
                var currentSelElem = document.getElementById(selectedId);
                if ($(currentSelElem).length === 0) {
                    currentSelElem = $(this.lastClickedLeftMenuItem);
                }
                $(currentSelElem).closest("ul").find(".selected").removeClass("selected");
                $(currentSelElem).addClass('selected');

                return this;
            }
        });

        return LeftMenuView;
    }
)






























