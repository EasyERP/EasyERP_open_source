define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Companies/CreateTemplate.html',
    'views/CustomersSuppliers/salesPurchases',
    'models/CompaniesModel',
    'views/guideTours/guideNotificationView',
    'common',
    'custom',
    'constants',
    'populate'
], function (Backbone, $, _, ParentView, CreateTemplate, SalesPurchasesView, CompanyModel,GuideNotify, common, custom, CONSTANTS, populate) {
    'use strict';
    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Companies',
        template   : _.template(CreateTemplate),
        imageSrc   : '',

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            _.bindAll(this, 'saveItem', 'render');
            this.model = new CompanyModel();
            this.responseObj = {};
            this.saveDeal = options.saveDeal;

            this.render();
        },

        events: {
            'mouseenter .avatar'  : 'showEdit',
            'mouseleave .avatar'  : 'hideEdit',
            'click .details'      : 'toggleDetails',
            'click .shippingRadio': 'shippingShow'
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
        },

        shippingShow: function (e) {
            var $target = $(e.target);
            var val = parseInt($target.val(), 10);

            if (val) {
                this.$el.find('#shippingAddress').removeClass('hidden');
            } else {
                this.$el.find('#shippingAddress').addClass('hidden');
            }
        },

        saveItem: function () {
            var self = this;
            var mid = this.mId;
            var companyModel = new CompanyModel();
            var name = {
                first: $.trim(this.$el.find('#companyName').val()),
                last : ''
            };
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
            var sameShippingAddress = parseInt(this.$el.find('input[name=shippingAddress]:checked').val(), 10);
            var address = {
                street : $.trim($('#addressInput').val()),
                city   : $.trim($('#cityInput').val()),
                state  : $.trim($('#stateInput').val()),
                zip    : $.trim($('#zipInput').val()),
                country: $.trim(this.$el.find('#countryInputCreate').attr('data-id')) || ''
            };
            var shippingAddress = sameShippingAddress ? {
                street : $.trim($('#addressInputShipping').val()),
                city   : $.trim($('#cityInputShipping').val()),
                state  : $.trim($('#stateInputShipping').val()),
                zip    : $.trim($('#zipInputShipping').val()),
                name   : $.trim($('#nameInputShipping').val()),
                country: $.trim(this.$el.find('#countryInputCreateShipping').attr('data-id')) || ''
            } : address;

            if (!sameShippingAddress) {
                shippingAddress.name = name.first;
            }

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
                social  : {
                    LI: LI,
                    FB: FB
                },

                phones: {
                    phone : phone,
                    mobile: mobile,
                    fax   : fax
                },

                address        : address,
                shippingAddress: shippingAddress,
                website        : website,
                internalNotes  : internalNotes,

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
                    var navigateUrl = window.location.hash;

                    self.hideDialog();

                    if (self.saveDeal && (typeof self.saveDeal === 'function')) {
                        self.saveDeal({company: res.id}, 'formProperty');
                    } else {
                        custom.getFiltersValues(self); // added for refreshing filters after creating

                        if (viewType !== 'thumbnails') {
                            navigateUrl = (viewType === 'form') ? '#easyErp/Companies/form/' + res.id : window.location.hash;
                        }

                        Backbone.history.fragment = '';

                        Backbone.history.navigate(navigateUrl, {trigger: true});
                    }

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
                autoOpen   : true,
                dialogClass: 'create-dialog',
                title      : 'Create Company',
                width      : '800px',
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },
                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }]
            });

            salesPurchasesEl = thisEl.find('#salesPurchases-container');

            /* this.renderAssignees(this.currentModel);*/

            salesPurchasesEl.append(
                new SalesPurchasesView({
                    parrent: self
                }).render().el
            );

            populate.get('#countryInputCreate', CONSTANTS.URLS.COUNTRIES, {}, '_id', this);
            populate.get('#countryInputCreateShipping', CONSTANTS.URLS.COUNTRIES, {}, '_id', this);
            populate.get2name('#employeesDd', '/employees/getForDD', {}, this);
            populate.get('#language', CONSTANTS.URLS.EMPLOYEES_LANGUAGES, {}, 'name', this.parrent);

            common.canvasDraw({model: companyModel.toJSON()}, this);

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y'
            });

            this.delegateEvents(this.events);

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

            return this;
        }
    });

    return CreateView;
});
