define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Users/CreateTemplate.html',
    'models/UsersModel',
    'common',
    'populate',
    'Validation',
    'views/selectView/selectView',
    'views/dialogViewBase',
    'helpers/ga'
], function (Backbone, $, _, CreateTemplate, UsersModel, common, populate, Validation, SelectView, DialogViewBase, ga) {

    var UsersCreateView = /*Backbone.View*/DialogViewBase.extend({
        el         : '#content-holder',
        contentType: 'Users',
        template   : _.template(CreateTemplate),
        imageSrc   : '',
        initialize : function () {
            _.bindAll(this, 'saveItem');
            this.model = new UsersModel();
            this.responseObj = {};
            this.render();
        },

        events: {
            'submit form'                                                     : 'submit',
            'mouseenter .avatar'                                              : 'showEdit',
            'mouseleave .avatar'                                              : 'hideEdit',
            'click .current-selected'                                         : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)'               : 'chooseOption',
            'click .newSelectList li.miniStylePagination'                     : 'notHide',
            'click .newSelectList li.miniStylePagination .next:not(.disabled)': 'nextSelect',
            'click .newSelectList li.miniStylePagination .prev:not(.disabled)': 'prevSelect',
            click                                                             : 'hideNewSelect',
            'keypress #login'                                                 : 'checkLoginInputKey'
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
            $('.newSelectList').hide();
        },

        checkLoginInputKey: function (e) {
            var char = String.fromCharCode(e.charCode);

            if (Validation.loginCharNotValid(char)) {
                e.preventDefault();
            }
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        showEdit: function () {
            $('.upload').animate({
                height : '20px',
                display: 'block'
            }, 250);

        },

        hideEdit: function () {
            $('.upload').animate({
                height : '0px',
                display: 'block'
            }, 250);

        },

        saveItem: function () {
            var self = this;
            var mid = 39;
            this.model.save({
                imageSrc: this.imageSrc,
                email   : $.trim(this.$el.find('#email').val()),
                login   : $.trim(this.$el.find('#login').val()),
                pass    : $.trim(this.$el.find('#password').val()),
                profile : $.trim(this.$el.find('#profilesDd').data('id'))
            }, {
                headers: {
                    mid: mid
                },

                wait: true,

                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                },

                confirmPass: $('#confirmpassword').val()
            });

        },

        render: function () {
            var formString = this.template();
            var self = this;
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '600',
                title      : 'Create User',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                            ga && ga.trackingEditCancel();
                        }
                    }
                }
            });
            populate.get('#profilesDd', 'profiles/forDd', {}, 'profileName', this, true);
            common.canvasDraw({model: this.model.toJSON()}, this);
            return this;
        }
    });

    return UsersCreateView;
});
