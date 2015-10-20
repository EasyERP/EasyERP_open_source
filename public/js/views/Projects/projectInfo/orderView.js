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
            "click #createQuotation": "createQuotation",
            "click #removeQuotation": "removeItems",
            "click  .list tbody td:not(.notForm)": "goToEditDialog",
            "click .stageSelect": "showNewSelect"
        },

        initialize: function (options) {
            this.collection = options.collection;
            this.projectID = options.projectId;
            this.customerId = options.customerId;
            this.projectManager = options.projectManager;
        },

        render: function () {
            var currentEl = this.$el;
            var self  = this;

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
                    $("#removeOredr").show();
                } else {
                    $("#removeOredr").hide();
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
