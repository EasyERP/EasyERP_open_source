/**
 * Created by liliya on 17.09.15.
 */

define([
    'text!templates/Bonus/invoiceTemplate.html',
    'common'

], function (invoiceTemplate, common) {
    var invoiceView = Backbone.View.extend({

        el: '#invoices',

        initialize: function (options) {
            this.collection = options.model;

            this.render();
        },

        template: _.template(invoiceTemplate),

        events: {
            "click .checkbox": "checked"
        },

        checked: function (e) {
            if (this.models.length > 0) {
                var checkLength = $("input.checkbox:checked").length;

                if ($("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                    $('#check_all').prop('checked', false);

                    if (checkLength == this.models.length) {
                        $('#check_all').prop('checked', true);
                    }
                }
                else {
                    $("#top-bar-deleteBtn").hide();
                    $('#check_all').prop('checked', false);
                }
            }
        },



        render: function () {
            var currentEl = this.$el;
            var template = _.template(invoiceTemplate);
            currentEl.append(template({
                collection: this.collection,
                startNumber: 0,
                utcDateToLocaleDate: common.utcDateToLocaleDate
            }));

            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                } else {
                    $("#top-bar-deleteBtn").hide();
                }
            });
        }
    });

    return invoiceView;
});