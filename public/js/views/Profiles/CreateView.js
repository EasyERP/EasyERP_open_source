define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Profiles/CreateProfileTemplate.html',
    'models/ProfilesModel',
    'text!templates/Profiles/ModulesAccessListTemplate.html',
    'populate',
    'views/selectView/selectView',
    'views/dialogViewBase'
], function (Backbone, $, _, CreateProfileTemplate, ProfilesModel, ModulesAccessTemplate, populate, SelectView, DialogViewBase) {
    var CreateView = /*Backbone.View*/DialogViewBase.extend({
        el         : '#content-holder',
        contentType: 'Profiles',
        template   : _.template(CreateProfileTemplate),
        initialize : function (options) {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new ProfilesModel();
            this.profilesCollection = options.collection;
            this.responseObj = {};
            this.render();
        },

        events: {
            keydown                                                           : 'keydownHandler',
            'click .current-selected'                                         : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)'               : 'chooseOption',
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            click                                                             : 'hideNewSelect'
        },

        notHide: function () {
            return false;
        },

        showNewSelect: function (e) {
            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $target.parents('ul').closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            this.$el.find('.newSelectList').hide();
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },

        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },

        hideNewSelect: function () {
            this.$el.find('.newSelectList').hide();
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        keydownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                default:
                    break;
            }
        },

        saveItem: function () {
            var choice = $('input[name=group]:checked').val();
            var self = this;
            var profileId;

            switch (choice) {
                case 'new':
                    this.selectedProfile = this.profilesCollection.findWhere({profileName: 'banned'});
                    break;
                case 'base':
                    profileId = $('#profilesDd').data('id');
                    this.selectedProfile = this.profilesCollection.get(profileId);
                    break;
                // skip default;
            }

            if (!this.selectedProfile) {
                throw new Error('Base profile is undefined');
            }

            this.model.save({
                profileName       : $.trim(this.$el.find('#profileName').val()),
                profileDescription: $.trim(this.$el.find('#profileDescription').val()),
                profileAccess     : this.selectedProfile.get('profileAccess')
            }, {
                headers: {
                    mid: 39
                },

                wait   : true,
                success: function (models, response, options) {
                    self.hideDialog();
                    $('#top-bar-editBtn').hide();
                    $('#top-bar-deleteBtn').hide();
                    Backbone.history.navigate('easyErp/Profiles', {trigger: true});
                    response.data.profileAccess = models.toJSON().profileAccess;
                    self.profilesCollection.set(response.data, {remove: false});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var formString = this.template();
            var self = this;
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : 500,
                title      : 'Create Profile',
                buttons    : {
                    save: {
                        text : 'Create',
                        id   : 'saveBtn',
                        class: 'btn blue',
                        click: self.saveItem
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }

                }
            });

            populate.get('#profilesDd', 'profiles/forDd', {}, 'profileName', this, true);
            this.delegateEvents(this.events);

            return this;
        }
    });

    return CreateView;
});
