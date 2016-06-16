define([
    'Backbone',
    'Underscore',
    'text!templates/rowEditor.html',
    'populate'
], function (Backbone, _, rowHtml, populate) {
    var View = Backbone.View.extend({

        template: _.template(rowHtml),

        initialize: function (option) {
            this.render(option);
        },

        render: function (option) {
            var el = option.el;
            var prev = option.prev;
            var next = option.next;
            var context = option.context;

            populate.showSelect(el, prev, next, context);

            return this;
        }

    });

    return View;
});
