/**
 * Created by liliya on 17.09.15.
 */

define([
    'text!templates/Projects/projectInfo/paymentTemplate.html',
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
            if (this.model.length > 0) {
                var el = $(this.el);
                var checkLength = el.find("input.checkbox:checked").length;
                var checkAll$=el.find('#check_all')

                if (checkLength > 0) {
                    $("#top-bar-deleteBtn").show();
                    checkAll$.prop('checked', false);

                    if (checkLength == this.model.length) {

                        checkAll$.prop('checked', true);
                    }
                }
                else {
                    $("#top-bar-deleteBtn").hide();
                    checkAll$.prop('checked', false);
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

            currentEl.find('#check_all').click(function () {
                currentEl.find(':checkbox').prop('checked', this.checked);
                //if (currentEl.find("input.checkbox:checked").length > 0) {
                //    currentEl.find("#top-bar-deleteBtn").show();
                //} else {
                //    currentEl.find("#top-bar-deleteBtn").hide();
                //}
            });

        }
    });

    return paymentView;
});