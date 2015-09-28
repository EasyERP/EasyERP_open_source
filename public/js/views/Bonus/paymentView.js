/**
 * Created by liliya on 17.09.15.
 */

define([
    'text!templates/Bonus/paymentTemplate.html',
    'helpers',
    'common'

], function (paymentTemplate, helpers, common) {
    var paymentView = Backbone.View.extend({

        el: '#payments',

        initialize: function (options) {
            this.collection = options.model;

            this.render();
        },

        template: _.template(paymentTemplate),

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

            currentEl.html('');
            var template = _.template(paymentTemplate);
            currentEl.append(template({
                paymentCollection: this.collection,
                startNumber: 0,
                utcDateToLocaleDate: common.utcDateToLocaleDate
            }));

        }
    });

    return paymentView;
});