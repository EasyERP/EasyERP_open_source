/**
 * Created by liliya on 20.10.15.
 */
define([
    'text!templates/Projects/projectInfo/orders/ListTemplate.html',
    'text!templates/Projects/projectInfo/orders/ListHeader.html',
    'text!templates/stages.html',
    'views/salesQuotation/EditView',
    'views/salesOrder/list/ListView',
    'models/QuotationModel',
    'dataService',
    'common'

], function (ListTemplate, lisHeader, stagesTemplate, editView, listView, orderModel, dataService, common) {
    var orderView = listView.extend({

        el: '#orders',
        templateList: _.template(ListTemplate),
        templateHeader: _.template(lisHeader),

        events: {
            "click .checkbox": "checked",
            "click #removeOrder": "removeItems",
            "click  .list tbody td:not(.notForm)": "goToEditDialog",
            "click .stageSelect": "showNewSelect"
        },

        initialize: function (options) {
            this.collection = options.collection;
            this.projectID = options.projectId;
            this.customerId = options.customerId;
            this.projectManager = options.projectManager;
        },

        removeItems: function (event) {
            event.preventDefault();

            var answer = confirm("Realy DELETE items ?!");

            var that = this;
            var mid = 39;
            var model;
            var localCounter = 0;
            var listTableCheckedInput;
            var count;
            var table = $("#ordersTable");

            listTableCheckedInput = table.find("input:not('#check_all_orders'):checked");
            count = listTableCheckedInput.length;
            this.collectionLength = this.collection.length;

            if (answer == true) {
                $.each(listTableCheckedInput, function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            var id = model.get('_id');

                            table.find('[data-id="' + id + '"]').remove();

                            //that.deleteItemsRender(that.deleteCounter, that.deletePage);
                        },
                        error  : function (model, res) {
                            if (res.status === 403 && index === 0) {
                                alert("You do not have permission to perform this action");
                            }
                            that.listLength--;
                            count--;
                            if (count === 0) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            }
                        }
                    });
                });
            }

        },

        checked: function (e) {
            if (this.collection.length > 0) {
                var checkLength = $("input.checkbox:checked").length;

                if ($("input.checkbox:checked").length > 0) {
                    $("#removeOrder").show();
                    $('#check_all_orders').prop('checked', false);

                    if (checkLength == this.collection.length) {
                        $('#check_all_orders').prop('checked', true);
                    }
                }
                else {
                    $("#removeOrder").hide();
                    $('#check_all_orders').prop('checked', false);
                }
            }
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
        },

        render: function (options) {
            var currentEl = this.$el;
            var self  = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;

            if (options && options.activeTab){
                self.hideDialog();

                tabs = $(".chart-tabs");
                target =  tabs.find('#ordersTab');

                target.closest(".chart-tabs").find("a.active").removeClass("active");
                target.addClass("active");
                n = target.parents(".chart-tabs").find("li").index(target.parent());
                dialogHolder = $(".dialog-tabs-items");
                dialogHolder.find(".dialog-tabs-item.active").removeClass("active");
                dialogHolder.find(".dialog-tabs-item").eq(n).addClass("active");
            }

            currentEl.html('');
            currentEl.prepend(this.templateHeader);

            currentEl.find('#listTableOrder').html(this.templateList({
                orderCollection : this.collection.toJSON(),
                startNumber: 0,
                dateToLocal: common.utcDateToLocaleDate
            }));

            this.$el.find('.icon').hide();

            $('#check_all_orders').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0) {
                    $("#removeOrder").show();
                } else {
                    $("#removeOrder").hide();
                }
            });

            dataService.getData("/workflow/fetch", {
                wId         : 'Purchase Order',
                source      : 'purchase',
                targetSource: 'quotation'
            }, function (stages) {
                self.stages = stages;
            });



        }
    });

    return orderView;
});
