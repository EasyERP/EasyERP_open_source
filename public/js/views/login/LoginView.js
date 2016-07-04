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

        events: {
            'submit #loginForm'     : 'login',
            'click .login-button'   : 'login',
            'submit #forgotPassword': 'forgotPassword',
            'click .submitButton'   : 'forgotPassword',
            'focus .ulogin'         : 'usernameFocus',
            'focus #upass'          : 'passwordFocus',
            'blur #ulogin'          : 'usernameFocus',
            'blur #upass'           : 'passwordFocus',
            'click #forgotPass'     : 'goForgotPass',
            'click #backToLogin'    : 'goForgotPass'
        },

        goForgotPass: function (e) {
            var $currentEl = $(e.target);
            var id = $currentEl.attr('id');
            var $thisEl = this.$el;
            var $title = $thisEl.find('#titleForm');
            var $loginForm = $thisEl.find('#loginForm');
            var $forgotForm = $thisEl.find('#forgotPassword');

            var title = id === 'forgotPass' ? 'Forgot Your password?' : 'Login to your account';

            e.preventDefault();

            $title.text(title);

            $loginForm.toggleClass('hidden');
            $forgotForm.toggleClass('hidden');
        },

        usernameFocus: function () {
            this.$el.find('.icon-login').toggleClass('active');
        },

        passwordFocus: function () {
            this.$el.find('.icon-pass').toggleClass('active');
        },

        login: function (event) {
            var $thisEl = this.$el;
            var currentDb = $thisEl.find('#dbs :selected').data('id');
            var $loginForm = $thisEl.find('#loginForm');
            var $errorContainer = $thisEl.find('.error');
            var login = $loginForm.find('.ulogin').val() || '';
            var pass = $thisEl.find('#upass').val() || '';
            var $checkedEl = $thisEl.find('#switchElement');
            var checked = $checkedEl.prop('checked');
            var err = '';
            var data;

            event.preventDefault();
            App.currentDb = currentDb;
            App.weTrack = true;

            $loginForm.removeClass('notRegister');

            data = {
                login     : login,
                pass      : pass,
                dbId      : currentDb,
                rememberMe: checked
            };

            if (!data.login || !data.pass) {
                $loginForm.addClass('notRegister');
            }

            if (data.login.length < 3) {
                err += 'Login must be longer than 3 characters' + '<br/>';
            }
            if (data.pass.length < 3) {
                err += 'Password must be longer than 3 characters';
            }
            if (err) {
                $errorContainer.html(err);
                $loginForm.addClass('notRegister');

                return;
            }

            $.ajax({
                url : '/users/login',
                type: 'POST',
                data: data,

                success: function () {
                    Custom.runApplication(true);
                },

                error: function () {
                    $loginForm.addClass('notRegister');
                    $errorContainer.text("Wrong Password or such user doesn't registered");
                }
            });
        },

        forgotPassword: function (event) {
            var $thisEl = this.$el;
            var currentDb = $thisEl.find('#dbs :selected').data('id');
            var $forgotForm = $thisEl.find('#forgotPassword');
            var $errorContainer = $thisEl.find('.error');
            var login = $forgotForm.find('.ulogin').val() || '';
            var err = '';
            var data;

            event.preventDefault();
            App.currentDb = currentDb;
            App.weTrack = true;

            data = {
                login: login,
                dbId : currentDb
            };

            if (data.login.length < 3) {
                err += 'Login must be longer than 3 characters' + '<br/>';
            }

            if (err) {
                $errorContainer.html(err);
                $forgotForm.addClass('notRegister');
                return;
            }

            $.ajax({
                url : '/users/login',
                type: 'POST',
                data: data,

                success: function () {
                    Custom.runApplication(true);
                },

                error: function () {
                    $forgotForm.addClass('notRegister');
                    $errorContainer.text('Please try again');
                }
            });
        },

        render: function (options) {
            var $thisEl = this.$el;
            var $backStratch;

            $('title').text('Login');

            if (options) {
                $thisEl.html(_.template(LoginTemplate, {options: options.dbs}));
            } else {
                $thisEl.html(LoginTemplate);
                $thisEl.find('#loginForm').addClass('notRegister');
            }

            $backStratch = $thisEl.find('#backstretch');
            $backStratch.backstretch([
                'http://dl.dropbox.com/u/515046/www/outside.jpg',
                'http://dl.dropbox.com/u/515046/www/garfield-interior.jpg',
                'http://dl.dropbox.com/u/515046/www/cheers.jpg'
            ], {duration: 3000, fade: 750});

            return this;
        }
    });

    return LoginView;

});
