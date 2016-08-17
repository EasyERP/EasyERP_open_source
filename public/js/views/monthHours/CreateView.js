define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/monthHours/createTemplate.html'

], function (Backbone, $, _, CreateTemplate) {
    'use strict';

    var CreateView = Backbone.View.extend({
        el      : '#listTable',
        template: _.template(CreateTemplate),

        initialize: function (options) {
            this.render(options);
        },

        render: function (options) {
            var $row = this.$el.find('tr').first();
            var $newRow;
            var tds;

            if ($row.length) {
                this.$el.prepend("<tr id='false' data-id='" + options.cid + "'>" + $row.html() + '</tr>');
                $newRow = this.$el.find('#false');
                tds = $newRow.find('td');

                $(tds[0]).find('input').attr('value', options.cid);
               /* $(tds[1]).text('New');*/
                $(tds[1]).text('');
                $(tds[1]).addClass('editable errorContent');
                $(tds[2]).text('');
                $(tds[2]).addClass('editable errorContent');
                $(tds[3]).text('');
                $(tds[3]).addClass('editable errorContent');
            } else {
                this.$el.prepend(this.template(options));
            }
            return this;
        }
    });

    return CreateView;
});
