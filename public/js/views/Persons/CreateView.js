define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Persons/CreateTemplate.html',
    'views/CustomersSuppliers/salesPurchases',
    'models/PersonsModel',
    'views/guideTours/guideNotificationView',
    'common',
    'populate',
    'constants',
    'custom'
], function (Backbone, $, _, ParentView, CreateTemplate, SalesPurchasesView, PersonModel,GuideNotify, common, populate, CONSTANTS, custom) {
    'use strict';
    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Persons',
        template   : _.template(CreateTemplate),
        imageSrc   : '',

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];

            this.saveDeal = options.saveDeal;
            this.company = options.company;

            _.bindAll(this, 'saveItem', 'render');
            this.model = new PersonModel();
            this.models = (options && options.model) ? options.model : null;
            this.responseObj = {};

            this.render();
        },

        events: {
            'mouseenter .avatar'  : 'showEdit',
            'mouseleave .avatar'  : 'hideEdit',
            'click .details'      : 'showDetailsBox',
            'click .shippingRadio': 'shippingShow'
        },

        chooseOption: function (e) {
            $(e.target).parents('ul').closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

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
            var thisEl = this.$el;
            var viewType = custom.getCurrentVT();

            var company = $('#companiesDd').data('id');
            var dateBirth = $('.dateBirth').val();
            var department = $('#departmentDd option:selected').val();

            var usersId = [];
            var groupsId = [];
            var whoCanRW;
            var data;
            var model;
            var firstName = $.trim(thisEl.find('#firstName').val());
            var lastName = $.trim(thisEl.find('#lastName').val());

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
                shippingAddress.name = firstName + ' ' + lastName;
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

            data = {
                name: {
                    first: firstName,
                    last : lastName
                },

                imageSrc       : this.imageSrc,
                dateBirth      : dateBirth,
                company        : company,
                department     : department,
                address        : address,
                shippingAddress: shippingAddress,
                website        : $.trim($('#websiteInput').val()),
                jobPosition    : $.trim($('#jobPositionInput').val()),
                skype          : $.trim($('#skype').val()),
                social         : {
                    LI: $.trim(thisEl.find('#LI').val()),
                    FB: $.trim(thisEl.find('#FB').val())
                },

                phones: {
                    phone : $.trim($('#phoneInput').val()),
                    mobile: $.trim($('#mobileInput').val()),
                    fax   : $.trim($('#faxInput').val())
                },

                email         : $.trim($('#emailInput').val()),
                salesPurchases: {
                    isCustomer   : thisEl.find('#isCustomer').is(':checked'),
                    isSupplier   : thisEl.find('#isSupplier').is(':checked'),
                    active       : thisEl.find('#active').is(':checked'),
                    implementedBy: thisEl.find('#implementedBy').data('id') || null,
                    salesPerson  : thisEl.find('#employeesDd').data('id') || null,
                    salesTeam    : thisEl.find('#departmentDd').data('id') || null,
                    reference    : thisEl.find('#reference').val(),
                    language     : thisEl.find('#language').text()
                },

                groups: {
                    owner: thisEl.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            };

            model = new PersonModel();
            model.save(data, {
                headers: {
                    mid: mid
                },

                wait   : true,
                success: function (model, res) {
                    var navigateUrl;
                    self.hideDialog();

                    if (self.saveDeal && (typeof self.saveDeal === 'function')) {
                        self.saveDeal({customer: res.id}, 'formProperty');
                    } else {
                        Backbone.history.fragment = '';

                        navigateUrl = (viewType === 'form') ? '#easyErp/Persons/form/' + res.id : window.location.hash;
                        Backbone.history.navigate(navigateUrl, {trigger: true});
                    }

                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var personModel = new PersonModel();
            var formString = this.template();
            var self = this;
            var salesPurchasesEl;

            var thisEl = this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Person',
                width      : '800px',
                position   : {within: $('#wrapper')},
                buttons    : [
                    {
                        id   : 'create-person-dialog',
                        class: 'btn blue',
                        text : 'Create',
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

            /*this.renderAssignees(personModel);*/

            salesPurchasesEl.append(
                new SalesPurchasesView({
                    parrent: self
                }).render().el
            );

            populate.get('#countryInputCreate', '/countries/getForDD', {}, 'name', this);
            populate.get('#countryInputCreateShipping', '/countries/getForDD', {}, 'name', this);
            populate.get('#language', CONSTANTS.URLS.EMPLOYEES_LANGUAGES, {}, 'name', this);
            populate.get2name('#employeesDd', '/employees/getForDD', {}, this);
            populate.getCompanies('#companiesDd', '/customers/getCompaniesForDd', {}, this, false, true, this.company);
            common.canvasDraw({model: personModel.toJSON()}, this);
            this.$el.find('.dateBirth').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null
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
