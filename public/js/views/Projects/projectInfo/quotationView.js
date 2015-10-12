define([
    'text!templates/Projects/projectInfo/quotations/quotationTemplate.html',
    'text!templates/Projects/projectInfo/quotations/ListTemplate.html',
    'views/listViewBase',
    'views/Projects/projectInfo/quotations/CreateView',
    'common',
    'helpers'

], function (quotationTopBar, ListTemplate, listView, quotationCreateView, common, helpers) {
    var quotationView = listView.extend({

        el            : '#quotations',
        templateHeader: _.template(quotationTopBar),
        templateList  : _.template(ListTemplate),

        events: {
            "click .checkbox"       : "checked",
            "click #createQuotation": "createQuotation",
            "click #removeQuotation": "removeItems"
        },

        initialize: function (options) {
            this.collection = options.collection;
            this.projectID = options.projectId;
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
                projectId: this.projectID,
                collection: this.collection
            });
        },


        render: function () {
            var currentEl = this.$el;

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
        }


    });

    return quotationView;
});