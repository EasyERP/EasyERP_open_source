define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Persons/EditTemplate.html',
    'views/CustomersSuppliers/salesPurchases',
    'common',
    'populate',
    'constants'
], function (Backbone, $, _, ParentView, EditTemplate, SalesPurchasesView, common, populate, CONSTANTS) {
    'use strict';
    var EditView = ParentView.extend({
        contentType: 'Persons',
        imageSrc   : '',
        template   : _.template(EditTemplate),

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');
            this.currentModel = (options.model) || options.collection.getElement();
            this.currentModel.urlRoot = '/Persons';
            this.responseObj = {};

            this.render();
        },

        events: {
            'click #saveBtn'    : 'saveItem',
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click .details'    : 'showDetailsBox'
        },

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },

        hideDialog: function () {
            $('.edit-person-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        saveItem: function () {
            var self = this;
            var mid = this.mId;
            var thisEl = this.$el;
            var whoCanRW;
            var data;

            var dateBirth = thisEl.find('.dateBirth').val();
            var company = $('#companiesDd').data('id');
            var jobPosition = $.trim(thisEl.find('#jobPositionInput').val());
            var isCustomer = thisEl.find('#isCustomer').is(':checked');
            var isSupplier = thisEl.find('#isSupplier').is(':checked');
            var active = thisEl.find('#active').is(':checked');
            var salesPerson = thisEl.find('#employeesDd').data('id');
            var salesTeam = thisEl.find('#departmentDd').data('id');
            var implementedBy = thisEl.find('#implementedBy').data('id');
            var reference = thisEl.find('#reference').val();
            var language = thisEl.find('#language').text();
            var usersId = [];
            var groupsId = [];

            company = company || null;
            jobPosition = jobPosition || null;

            if (salesPerson === '') {
                salesPerson = null;
            }
            if (salesTeam === '') {
                salesTeam = null;
            }
            if (implementedBy === '') {
                implementedBy = null;
            }

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });
            whoCanRW = thisEl.find('[name="whoCanRW"]:checked').val();

            data = {
                imageSrc: this.imageSrc,
                name    : {
                    first: $.trim(thisEl.find('#firstName').val()),
                    last : $.trim(thisEl.find('#lastName').val())
                },

                dateBirth: dateBirth,
                company  : company,
                address  : {
                    street : $.trim(thisEl.find('#addressInput').val()),
                    city   : $.trim(thisEl.find('#cityInput').val()),
                    state  : $.trim(thisEl.find('#stateInput').val()),
                    zip    : $.trim(thisEl.find('#zipInput').val()),
                    country: thisEl.find('#countryInput').attr('data-id')
                },

                website    : $.trim(thisEl.find('#websiteInput').val()),
                jobPosition: jobPosition,
                skype      : $.trim(thisEl.find('#skypeInputEdit').val()),
                phones     : {
                    phone : $.trim(thisEl.find('#phoneInput').val()),
                    mobile: $.trim(thisEl.find('#mobileInput').val()),
                    fax   : $.trim(thisEl.find('#faxInput').val())
                },

                social: {
                    LI: $.trim(thisEl.find('#LI').val()),
                    FB: $.trim(thisEl.find('#FB').val())
                },

                email         : $.trim(thisEl.find('#emailInput').val()),
                salesPurchases: {
                    isCustomer   : isCustomer,
                    isSupplier   : isSupplier,
                    active       : active,
                    salesPerson  : salesPerson,
                    salesTeam    : salesTeam,
                    implementedBy: implementedBy,
                    reference    : reference,
                    language     : language
                },

                groups: {
                    owner: thisEl.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            };

            this.currentModel.save(data, {
                headers: {
                    mid: mid
                },

                success: function (model) {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#easyErp/Persons/form/' + model.id, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        chooseOption: function (e) {
            $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
        },

        deleteItem: function (event) {
            var mid = this.mId;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer === true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },

                    success: function () {
                        $('.edit-person-dialog').remove();
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            }
        },

        render: function () {
            var self = this;
            var thisEl;
            var salesPurchasesEl;
            var model;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-person-dialog',
                title      : 'Edit Person',
                width      : '900',
                buttons    : [
                    {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    },
                    {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }
                ]

            });

            thisEl = this.$el;
            salesPurchasesEl = thisEl.find('#salesPurchases-container');

            this.renderAssignees(this.currentModel);

            salesPurchasesEl.append(
                new SalesPurchasesView({
                    parrent  : self,
                    model    : this.currentModel,
                    editState: true
                }).render().el
            );

            populate.getCompanies('#companiesDd', '/customers/getCompaniesForDd', {}, this, false, true);

            common.canvasDraw({model: this.currentModel.toJSON()}, this);
            thisEl.find('.dateBirth').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null
            });

            this.delegateEvents(this.events);
            model = this.currentModel.toJSON();

            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    $('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $('.groupsAndUser').append('<tr data-type="targetGroups" data-id="' + item._id + '"><td>'
                            + item.name + '</td><td class="text-right"></td></tr>');
                        $('#targetGroups').append('<li id="' + item._id + '">' + item.name + '</li>');
                    });
                    model.groups.users.forEach(function (item) {
                        $('.groupsAndUser').append('<tr data-type="targetUsers" data-id="' + item._id + '"><td>'
                            + item.login + '</td><td class="text-right"></td></tr>');
                        $('#targetUsers').append('<li id="' + item._id + '">' + item.login + '</li>');
                    });

                }
            }

            this.delegateEvents(this.events);
            return this;
        }
    });
    return EditView;
});
