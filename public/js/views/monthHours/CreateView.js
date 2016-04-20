/**
 * Created by Liliya on 23.06.2015.
 */
define([
        'Backbone',
        'jQuery',
        'Underscore',
        "text!templates/monthHours/createTemplate.html"

    ],
    function (Backbone, $, _, CreateTemplate) {
        var CreateView = Backbone.View.extend({
            el      : "#listTable",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.render(options);
            },

            render: function (options) {
                var row = this.$el.find('tr').first();
                var $newRow;
                var tds;

                if (row) {
                    this.$el.prepend('<tr id="false" data-id="' + options.cid + '">' + row.html() + '</tr>');
                    $newRow = this.$el.find('#false');
                    tds = $newRow.find('td');

                    $(tds[0]).find('input').attr('value', options.cid);
                    $(tds[1]).text('New');
                    $(tds[2]).text('');
                    $(tds[2]).addClass('editable');
                    $(tds[3]).text('');
                    $(tds[3]).addClass('editable');
                    $(tds[4]).text('');
                    $(tds[4]).addClass('editable');
                    $(tds[5]).text('0');
                    $(tds[6]).text('0');
                    $(tds[7]).text('0');
                    $(tds[8]).text('0');
                    $(tds[9]).text('0');
                    $(tds[10]).text('0');
                    $(tds[11]).text('0');
                    $(tds[12]).text('0');
                    $(tds[13]).text('0');
                } else {
                    this.$el.prepend(this.template(options));
                }
                return this;
            }
        });

        return CreateView;
    });
