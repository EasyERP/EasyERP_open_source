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
            "click .checkbox": "checked",
            "click #createQuotation": "createQuotation"
        },

        initialize: function (options) {
            this.collection = options.model;
            this.projectID = options.projectId;
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

        createQuotation: function(e) {
            e.preventDefault();
            new quotationCreateView({projectId: this.projectID});
        },

        render: function () {
            var currentEl = this.$el;

            currentEl.prepend(this.templateHeader);

            currentEl.find('#listTableQuotation').html(this.templateList({quotations: this.collection, startNumber: 0, dateToLocal: common.utcDateToLocaleDate}));

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