define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Companies/CreateTemplate.html',
    'views/CustomersSuppliers/salesPurchases',
    'models/CompaniesModel',
    'common',
    'custom',
    'constants'
], function (Backbone, $, _, ParentView, CreateTemplate, SalesPurchasesView, CompanyModel, common, custom, CONSTANTS) {
    'use strict';
    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Companies',
        template   : _.template(CreateTemplate),
        imageSrc   : '',

        initialize: function () {
            this.mId = CONSTANTS.MID[this.contentType];
            _.bindAll(this, 'saveItem', 'render');
            this.model = new CompanyModel();
            this.responseObj = {};

            this.render();
        },

        events: {
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click .details'    : 'toggleDetails'
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
        },

        saveItem: function () {
            var self = this;
            var mid = this.mId;
            var companyModel = new CompanyModel();
            var name = {
                first: $.trim(this.$el.find('#companyName').val()),
                last : ''
            };
            var address = {};
            var email = $.trim(this.$el.find('#email').val());
            var phone = $.trim(this.$el.find('#phone').val());
            var mobile = $.trim(this.$el.find('#mobile').val());
            var fax = $.trim(this.$el.find('#fax').val());
            var website = $.trim(this.$el.find('#website').val().replace('http://', ''));
            var internalNotes = $.trim(this.$el.find('#internalNotes').val());
            var salesPerson = this.$('#employeesDd').data('id');
            var salesTeam = this.$('#departmentDd').data('id');
            var implementedBy = this.$('#implementedBy').data('id');
            var reference = $.trim(this.$el.find('#reference').val());
            var language = $.trim(this.$el.find('#language').text());
            var isCustomer = this.$el.find('#isCustomer').is(':checked');
            var isSupplier = this.$el.find('#isSupplier').is(':checked');
            var LI = $.trim(this.$el.find('#LI').val());
            var viewType = custom.getCurrentVT();
            var FB = $.trim(this.$el.find('#FB').val());

            var active = this.$el.find('#active').is(':checked');
            var usersId = [];
            var groupsId = [];
            var whoCanRW;

            this.$el.find('.person-info').find('.address').each(function () {
                var el = $(this);
                address[el.attr('name')] = $.trim(el.val());
            });

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            whoCanRW = this.$el.find('[name="whoCanRW"]:checked').val();
            companyModel.save({
                name    : name,
                imageSrc: this.imageSrc,
                email   : email,

                social: {
                    LI: LI,
                    FB: FB
                },

                phones: {
                    phone : phone,
                    mobile: mobile,
                    fax   : fax
                },

                address      : address,
                website      : website,
                internalNotes: internalNotes,

                salesPurchases: {
                    isCustomer   : isCustomer,
                    isSupplier   : isSupplier,
                    active       : active,
                    salesPerson  : salesPerson || null,
                    salesTeam    : salesTeam || null,
                    implementedBy: implementedBy || null,
                    reference    : reference,
                    language     : language
                },

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            }, {
                headers: {
                    mid: mid
                },

                wait: true,

                success: function (model, res) {
                    var navigateUrl;
                    self.hideDialog();

                    custom.getFiltersValues(true); // added for refreshing filters after creating

                    navigateUrl = (viewType === 'form') ? '#easyErp/Companies/form/' + res.id : window.location.hash;
                    Backbone.history.navigate(navigateUrl, {trigger: true});
                },

                error: function (models, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var companyModel = new CompanyModel();
            var formString = this.template({});
            var self = this;
            var salesPurchasesEl;

            var thisEl = this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'create-dialog',
                title        : 'Create Company',
                width        : '80%',
                buttons      : [
                    {
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },
                    {
                        text : 'Cancel',
                        click: self.hideDialog
                    }]
            });

            salesPurchasesEl = thisEl.find('#salesPurchases-container');

           /* this.renderAssignees(this.currentModel);*/

            salesPurchasesEl.append(
                new SalesPurchasesView({
                    parrent: self
                }).render().el
            );

            common.canvasDraw({model: companyModel.toJSON()}, this);

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y'
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return CreateView;
});
