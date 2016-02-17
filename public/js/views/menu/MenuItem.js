define([
    'Backbone',
    'jQuery',
    'text!templates/menu/MenuItemTemplate.html'
], function (Backbone, $, MenuItemTemplate) {
    'use strict';
    var MenuItem = Backbone.View.extend({
        tagName : 'li',
        template: _.template(MenuItemTemplate),

        initialize: function (options) {
            //_.bindAll(this, 'render');
            //this.model.bind('change', this.render);
        },
        close     : function () {
            this.unbind();
            this.model.unbind();
        },
        render    : function () {
            var model = this.model.toJSON();
            var template = this.template(model);

            $(this.el).html(template);

            this.el.id = model._id;

            return this;
        }
    });

    return MenuItem;
});
