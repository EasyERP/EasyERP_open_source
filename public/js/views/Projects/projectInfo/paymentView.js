/**
 * Created by liliya on 17.09.15.
 */

define([
    'views/customerPayments/list/ListView',
    'text!templates/Projects/projectInfo/paymentTemplate.html',
    'helpers',
    'common'

], function (ListView, paymentTemplate, helpers, common) {
    var paymentView = ListView.extend({

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


        render: function (options) {
            var currentEl = this.$el;
            var self = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;
            var template = _.template(paymentTemplate);

            currentEl.html('');

            if (options && options.activeTab){
                self.hideDialog();

                tabs = $(".chart-tabs");
                target =  tabs.find('#paymentsTab');

                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                n = target.parents(".chart-tabs").find("li").index(target.parent());
                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find(".dialog-tabs-item").eq(n).addClass("active");
            }


            currentEl.append(template({
                paymentCollection: this.collection.toJSON(),
                startNumber: 0,
                utcDateToLocaleDate: common.utcDateToLocaleDate,
                currencySplitter: helpers.currencySplitter
            }));

            return this;
        }
    });

    return paymentView;
});