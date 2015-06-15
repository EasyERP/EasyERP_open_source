/**
 * Created by Roman on 12.06.2015.
 */
define([
    'text!templates/rowEditor.html',
    "populate"
], function(rowHtml, populate){
    var View = Backbone.View.extend({

        template: _.template(rowHtml),

        initialize: function(option){
            this.render(option);
        },

        render: function(option){
            var el = option.el;
            var prev = option.prev;
            var next = option.next;
            var context = option.context;

           /* var isSelect = !!option.isSelect;
            var optionsArray = option.optionsArray;

            el.html(this.template({
                isSelect: isSelect,
                optionsArray: optionsArray
            }));*/

            populate.showSelect(el, prev, next, context);

            return this;
        }

    });

    return View;
});