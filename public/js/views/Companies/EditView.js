define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Companies/EditTemplate.html',
    'views/CustomersSuppliers/salesPurchases',
    'common',
    'constants'
], function (Backbone, $, _, ParentView, EditTemplate, SalesPurchasesView, common, CONSTANTS) {
    'use strict';
    var EditView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'Companies',
        imageSrc   : '',
        template   : _.template(EditTemplate),

        initialize: function (options) {
            this.mId = CONSTANTS.MID[this.contentType];
            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');
            this.currentModel = (options.model) || options.collection.getElement();
            this.currentModel.urlRoot = '/Companies';
            this.responseObj = {};

            this.render();
        },

        events: {
            'click #tabList a'  : 'switchTab',
            'click #contacts'   : 'editContacts',
            'click #saveBtn'    : 'saveItem',
            'click #cancelBtn'  : 'hideDialog',
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click .details'    : 'toggleDetails'
        },

        chooseOption: function (e) {
            $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
        },

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },

        editContacts: function (e) {
            var link = this.$('#tabList a');
            var index;

            e.preventDefault();

            if (link.hasClass('selected')) {
                link.removeClass('selected');
            }

            index = link.index($(e.target).addClass('selected'));
            this.$('.tab').hide().eq(index).show();
        },

        saveItem: function (event) {
            var self = this;
            var mid = this.mId;
            var usersId = [];
            var groupsId = [];
            var whoCanRW;
            var website;
            var data;
            var thisEl = this.$el;

            var isCustomer = thisEl.find('#isCustomer').is(':checked');
            var isSupplier = thisEl.find('#isSupplier').is(':checked');
            var active = thisEl.find('#active').is(':checked');
            var salesPerson = thisEl.find('#employeesDd').attr('data-id');
            var salesTeam = thisEl.find('#departmentDd').data('id');
            var implementedBy = thisEl.find('#implementedBy').data('id');
            var reference = thisEl.find('#reference').val();
            var language = thisEl.find('#language').text();

            if (event) {
                event.preventDefault();
            }
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

            whoCanRW = this.$el.find('[name="whoCanRW"]:checked').val();
            website = this.$el.find('#websiteEdit').val();

            website.replace('http://', '');
            data = {
                name: {
                    first: this.$el.find('#name').val(),
                    last : ''
                },

                imageSrc: this.imageSrc,
                social  : {
                    LI: $.trim(thisEl.find('#LI').val()),
                    FB: $.trim(thisEl.find('#FB').val())
                },

                email : this.$el.find('#emailEdit').val(),
                phones: {
                    phone : this.$el.find('#phone').val(),
                    mobile: this.$el.find('#mobile').val(),
                    fax   : this.$el.find('#fax').val()
                },

                address: {
                    street : this.$el.find('#street').val(),
                    city   : this.$el.find('#city').val(),
                    state  : this.$el.find('#state').val(),
                    zip    : this.$el.find('#zip').val(),
                    country: this.$el.find('#country').attr('data-id')
                },

                website       : this.$el.find('#websiteEdit').val(),
                internalNotes : $.trim(this.$el.find('#internalNotes').val()),
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
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            };

            this.currentModel.save(data, {
                headers: {
                    mid: mid
                },

                wait   : true,
                success: function (model) {
                    $('.edit-companies-dialog').remove();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#easyErp/Companies/form/' + model.id, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        deleteItem: function (event) {
            var mid = 39;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer === true) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },

                    success: function () {
                        $('.edit-companies-dialog').remove();
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    },

                    error: function (models, err) {
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
            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            var self = this;
            var salesPurchasesEl;
            var thisEl;
            var model;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-companies-dialog',
                width      : '80%',
                title      : 'Edit Company',
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
                        click: self.hideDialog
                    },
                    {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }
                ],

                modal: true
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

            $('#text').datepicker({dateFormat: 'd M, yy'});

            this.delegateEvents(this.events);
            common.canvasDraw({model: this.currentModel.toJSON()}, this);

            model = this.currentModel.toJSON();

            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    $('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $('.groupsAndUser').append('<tr data-type="targetGroups" data-id="' + item._id + '"><td>' +
                            item.name + '</td><td class="text-right"></td></tr>');
                        $('#targetGroups').append('<li id="' + item._id + '">' + item.name + '</li>');
                    });
                    model.groups.users.forEach(function (item) {
                        $('.groupsAndUser').append('<tr data-type="targetUsers" data-id="' + item._id + '"><td>' +
                            item.login + '</td><td class="text-right"></td></tr>');
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
