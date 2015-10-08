define([
    'text!templates/Projects/projectInfo/quotations/quotationTemplate.html',
    'text!templates/Projects/projectInfo/quotations/ListTemplate.html',
    'views/listViewBase',
    'common',
    'helpers'

], function (quotationTopBar, ListTemplate, listView, common, helpers) {
    var quotationView = listView.extend({

        el            : '#quotations',
        templateHeader: _.template(quotationTopBar),
        templateList  : _.template(ListTemplate),

        events: {
            "click .checkbox": "checked"
        },

        initialize: function (options) {
            this.collection = options.model;
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

            currentEl.prepend(this.templateHeader);

            currentEl.find('#listTableQuotation').html(this.templateList({quotations: this.collection, startNumber: 0, dateToLocal: common.utcDateToLocaleDate}));

            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                } else {
                    $("#top-bar-deleteBtn").hide();
                }
            });
        }

        /*render: function () {
         var currentEl = this.$el;

         new listView({collection: this.collection, el: currentEl});

         currentEl.find('#searchContainer').append(this.template);

         $('#check_all').click(function () {
         $(':checkbox').prop('checked', this.checked);
         if ($("input.checkbox:checked").length > 0) {
         $("#top-bar-deleteBtn").show();
         } else {
         $("#top-bar-deleteBtn").hide();
         }
         });
         }*/
    });

    return quotationView;
});