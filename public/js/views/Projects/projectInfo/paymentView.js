/**
 * Created by liliya on 17.09.15.
 */

define([
    'views/customerPayments/list/ListView',
    'text!templates/Projects/projectInfo/paymentTemplate.html',
    'views/customerPayments/list/ListItemView',
    'collections/customerPayments/filterCollection',
    'helpers',
    'common'

], function (ListView, paymentTemplate, listItemView, paymentCollection, helpers, common) {
    var paymentView = ListView.extend({

        el: '#payments',
        listItemView            : listItemView,
        contentCollection: paymentCollection,

        initialize: function (options) {
            this.collection = options.model;
            this.filter = options.filter ? options.filter : {};

            this.render();
        },

        template: _.template(paymentTemplate),

        events: {
            "click .checkbox": "checked"
        },

        renderContent: function () {
            var currentEl = this.$el;
            var tBody = currentEl.find("#listTable");
            var itemView;
            var pagenation;

            tBody.empty();
            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);

            if (this.collection.length > 0) {
                itemView = new this.listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });
                tBody.append(itemView.render({thisEl: tBody}));
            }

            pagenation = this.$el.find('.pagination');
            if (this.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }
        },


        goSort: function (e) {
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

            target$ = $(e.target);
            currentParrentSortClass = target$.attr('class');
            sortClass = currentParrentSortClass.split(' ')[1];
            sortConst = 1;
            sortBy = target$.data('sort');
            sortObject = {};

            if (!sortClass) {
                target$.addClass('sortDn');
                sortClass = "sortDn";
            }
            switch (sortClass) {
                case "sortDn":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                }
                    break;
                case "sortUp":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                }
                    break;
            }
            sortObject[sortBy] = sortConst;

            this.fetchSortCollection(sortObject);
            this.getTotalLength(null, this.defaultItemsNumber, this.filter);
        },

        checked: function (e) {
            if (this.collection.length > 0) {
                var el = this.$el;
                var checkLength = el.find("input.checkbox:checked").length;
                var checkAll$=el.find('#check_all_payments');

                if (checkLength > 0) {
                    checkAll$.prop('checked', false);

                    if (checkLength == this.collection.length) {

                        checkAll$.prop('checked', true);
                    }
                }
                else {
                    checkAll$.prop('checked', false);
                }
            }
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".ui-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
            $(".crop-images-dialog").remove();
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

            $('#check_all_payments').click(function () {
                self.$el.find(':checkbox').prop('checked', this.checked);
                if (self.$el.find("input.checkbox:checked").length > 0) {
                    self.$el.find("#removeOrder").show();
                } else {
                    self.$el.find("#removeOrder").hide();
                }
            });

            return this;
        }
    });

    return paymentView;
});