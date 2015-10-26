define([
    'text!templates/Projects/projectInfo/quotations/quotationTemplate.html',
    'text!templates/Projects/projectInfo/quotations/ListTemplate.html',
    'text!templates/stages.html',
    'views/salesQuotation/EditView',
    'views/salesQuotation/list/ListView',
    'views/Projects/projectInfo/quotations/CreateView',
    'models/QuotationModel',
    'common',
    'helpers',
    'dataService'

], function (quotationTopBar, ListTemplate, stagesTemplate, editView, listView, quotationCreateView, currentModel, common, helpers, dataService) {
    var quotationView = listView.extend({

        el            : '#quotations',
        templateHeader: _.template(quotationTopBar),
        templateList  : _.template(ListTemplate),

        events: {
            "click .checkbox"                    : "checked",
            "click #createQuotation"             : "createQuotation",
            "click #removeQuotation"             : "removeItems",
            "click  .list tbody td:not(.notForm)": "goToEditDialog",
            "click .stageSelect"                 : "showNewSelect"
        },

        initialize: function (options) {
            this.collection = options.collection;
            this.projectID = options.projectId;
            this.customerId = options.customerId;
            this.projectManager = options.projectManager;
        },

        goToEditDialog: function (e) {
            e.preventDefault();
            var self = this;

            var id = $(e.target).closest("tr").attr("data-id");
            var model = new currentModel({validate: false});

            model.urlRoot = '/quotation/form/' + id;
            model.fetch({
                success: function (model) {
                    new editView({model: model, redirect: true, pId: self.projectID, customerId: self.customerId});
                },
                error  : function () {
                    alert('Please refresh browser');
                }
            });
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
            var table = $("#quotationTable")

            listTableCheckedInput = table.find("input:not('#check_all_quotations'):checked");
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
                    $("#removeQuotation").show();
                    $('#check_all_quotations').prop('checked', false);

                    if (checkLength == this.collection.length) {
                        $('#check_all_quotations').prop('checked', true);
                    }
                }
                else {
                    $("#removeQuotation").hide();
                    $('#check_all_quotations').prop('checked', false);
                }
            }
        },

        createQuotation: function (e) {
            e.preventDefault();
            new quotationCreateView({
                projectId     : this.projectID,
                customerId    : this.customerId,
                collection    : this.collection,
                projectManager: this.projectManager
            });
        },

        render: function () {
            var currentEl = this.$el;
            var self = this;

            currentEl.prepend(this.templateHeader);

            currentEl.find('#listTableQuotation').html(this.templateList({
                quotations : this.collection.toJSON(),
                startNumber: 0,
                dateToLocal: common.utcDateToLocaleDate
            }));

            this.$el.find('.icon').hide();

            $('#check_all_quotations').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0) {
                    $("#removeQuotation").show();
                } else {
                    $("#removeQuotation").hide();
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

    return quotationView;
});