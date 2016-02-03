define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/login/LoginTemplate.html',
    'custom'
], function (Backbone, _, $, LoginTemplate, Custom) {
    'use strict';

    var LoginView = Backbone.View.extend({
        el: '#wrapper',

        initialize: function (options) {
            if (options && options.dbs) {
                this.render(options);
            } else {
                this.render();
            }
        },
        events    : {
            "submit #loginForm"  : "login",
            "click .login-button": "login",
            "focus #ulogin"      : "usernameFocus",
            "focus #upass"       : "passwordFocus",
            "blur #ulogin"   : "usernameFocus",
            "blur #upass"    : "passwordFocus"
        },

        usernameFocus: function () {
            this.$el.find(".icon-login").toggleClass("active");
        },
        passwordFocus: function () {
            this.$el.find(".icon-pass").toggleClass("active");
        },

        login: function (event) {
            event.preventDefault();

            var err = "";
            var currentDb = this.$el.find("#dbs :selected").data("id");
            var $loginForm = this.$el.find("#loginForm");
            var $errorContainer = $loginForm.find('.error');
            var login = this.$("#ulogin").val() || '';
            var pass = this.$("#upass").val() || '';
            var data;

            App.currentDb = currentDb;
            App.weTrack = !!((currentDb === "weTrack") || (currentDb === "production") || (currentDb === "development"));

            $loginForm.removeClass("notRegister");

            data = {
                login: login,
                pass : pass,
                dbId : currentDb
            };

            if (!data.login || !data.pass) {
                $loginForm.addClass("notRegister");
            }

            if (data.login.length < 3) {
                err += 'Login must be longer than 3 characters' + '<br/>';
            }
            if (data.pass.length < 3) {
                err += 'Password must be longer than 3 characters';
            }
            if (err) {
                $errorContainer.html(err);
                $loginForm.addClass("notRegister");

                return;
            }

            $.ajax({
                url : "/login",
                type: "POST",
                data: data,

                success: function () {
                    Custom.runApplication(true);
                },
                error  : function () {
                    $loginForm.addClass("notRegister");
                    $errorContainer.text("Wrong Password or such user doesn't registered");
                }
            });
        },

        render: function (options) {
            $('title').text('Login');

            if (options) {
                this.$el.html(_.template(LoginTemplate, {options: options.dbs}));
            } else {
                this.$el.html(LoginTemplate);
                this.$el.find("#loginForm").addClass("notRegister");
            }

            return this;
        }
    });

    return LoginView;

});