define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/login/LoginTemplate.html',
    'custom',
    'dataService'
], function (Backbone, _, $, LoginTemplate, Custom, dataService) {
    'use strict';

    var passReqExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
    var WEAK_PASS_MESSAGE = 'Weak password. Password should be 8 symbols minimum and contain at least 1 upper case letter, 1 ' +
        'lower case letter, 1 digit and one special symbol';

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
            'click #loginTrigger'   : 'login',
            'click #signUpTrigger'  : 'signUp',
            'submit #forgotPassword': 'forgotPassword',
            'click .submitButton'   : 'forgotPassword',
            'focus .ulogin'         : 'usernameFocus',
            'focus #upass'          : 'passwordFocus',
            'blur #ulogin'          : 'usernameFocus',
            'blur #upass'           : 'passwordFocus',
            'click #forgotPass'     : 'goForgotPass',
            'click #backToLogin'    : 'goForgotPass',
            'click .selectDd'       : 'showHideDbs',
            'click #dbs li'         : 'selectDb',
            click                   : 'hideSelect',
            'click .tabs'           : 'changeTab',
            'click #facebookLogin'  : 'facebookLogin',
            'click #linkedInLogin'  : 'linkedInLogin',
            'click #gmailLogin'     : 'gmailLogin',
            'keyup .login'          : 'checkEmail'
        },

        linkedInLogin: function () {
            var currentDb = this.$el.find('#selectedDb').attr('data-id');
            var $checkedEl = this.$el.find('#switchElement');
            var checked = $checkedEl.prop('checked');

            var getProfileData = function () {
                IN.API.Profile("me").fields("id,firstName,lastName,email-address,picture-urls::(original),public-profile-url,location:(name)").result(function (me) {
                    var profile = me.values[0];
                    var id = profile.id;
                    var firstName = profile.firstName;
                    var lastName = profile.lastName;
                    var emailAddress = profile.emailAddress;
                    var profileUrl = profile.publicProfileUrl;
                    var country = profile.location.name;

                    dataService.postData('/users/login/social', {
                        userId    : id,
                        email     : emailAddress,
                        login     : emailAddress || id,
                        first     : firstName,
                        last      : lastName,
                        country   : country,
                        profileUrl: profileUrl,
                        flag      : 'linkedin',
                        dbId      : currentDb
                    }, function (err) {
                        if (err) {
                            return App.render({
                                type   : 'error',
                                message: 'Error'
                            });
                        }

                        App.currentDb = currentDb;

                        Custom.runApplication(true);

                        $(document).trigger('loginSocial', [{
                            userId    : id,
                            email     : emailAddress,
                            login     : emailAddress || id,
                            first     : firstName,
                            last      : lastName,
                            country   : country,
                            profileUrl: profileUrl,
                            flag      : 'linkedin',
                            dbId      : currentDb,
                            rememberMe: checked
                        }]);

                        App.storage.save('currentDb', currentDb);
                    });
                });
            };

            IN.UI.Authorize().params({"scope": ["r_basicprofile", "r_emailaddress"]}).place();
            IN.Event.on(IN, 'auth', getProfileData);
        },

        gmailLogin: function () {
            var currentDb = this.$el.find('#selectedDb').attr('data-id');
            var $checkedEl = this.$el.find('#switchElement');
            var checked = $checkedEl.prop('checked');

            if (!gapi) {
                alert('Google+ API error');
                return;
            }

            gapi.auth.authorize({
                client_id: '34449104416-ks7ifq1re2kgoapmeklqvoc6s19tv8tn.apps.googleusercontent.com',
                scope    : 'profile email',
                immediate: false
            }, function (rez) {
                var accessToken;

                if (rez.status.signed_in === true) {
                    accessToken = rez.access_token;

                    dataService.getData('https://www.googleapis.com/oauth2/v1/userinfo', {
                        access_token: accessToken,
                        alt         : 'json'
                    }, function (res) {
                        dataService.postData('/users/login/social', {
                            userId     : res.id,
                            accessToken: accessToken,
                            email      : res.email,
                            login      : res.email || res.id,
                            first      : res.given_name,
                            last       : res.family_name,
                            flag       : 'google',
                            dbId       : currentDb,
                            picture    : res.picture,
                            rememberMe : checked
                        }, function (err) {
                            if (err) {
                                return App.render({
                                    type   : 'error',
                                    message: 'Error'
                                });
                            }

                            App.currentDb = currentDb;

                            Custom.runApplication(true);

                            $(document).trigger('loginSocial', [{
                                userId     : res.id,
                                accessToken: accessToken,
                                email      : res.email,
                                login      : res.email || res.id,
                                first      : res.given_name,
                                last       : res.family_name,
                                flag       : 'google',
                                dbId       : currentDb,
                                picture    : res.picture,
                                profileUrl : res.link
                            }]);

                            App.storage.save('currentDb', currentDb);
                        });
                    });
                }
            });
        },

        facebookLogin: function () {
            var currentDb = this.$el.find('#selectedDb').attr('data-id');
            var $checkedEl = this.$el.find('#switchElement');
            var checked = $checkedEl.prop('checked');

            FB.login(function (response) {
                if (response.status === 'connected') {
                    FB.api('/me', {fields: 'name, email'}, function (resp) {
                            var nameArray = resp.name.split(' ');
                            var first = nameArray && nameArray.length ? nameArray[0] : '';
                            var last = nameArray && nameArray.length && nameArray.length > 1 ? nameArray[1] : '';

                            dataService.postData('/users/login/social', {
                                userId     : response.authResponse.userID,
                                accessToken: response.authResponse.accessToken,
                                email      : resp.email,
                                login      : resp.email || response.authResponse.userID,
                                first      : first,
                                last       : last,
                                flag       : 'facebook',
                                dbId       : currentDb,
                                rememberMe : checked
                            }, function (err) {
                                if (err) {
                                    return App.render({
                                        type   : 'error',
                                        message: 'Error'
                                    });
                                }

                                App.currentDb = currentDb;

                                Custom.runApplication(true);

                                $(document).trigger('loginSocial', [{
                                    userId     : response.authResponse.userID,
                                    accessToken: response.authResponse.accessToken,
                                    email      : resp.email,
                                    login      : resp.email || response.authResponse.userID,
                                    first      : first,
                                    last       : last,
                                    flag       : 'facebook',
                                    dbId       : currentDb,
                                    profileUrl : resp.link
                                }]);

                                App.storage.save('currentDb', currentDb);
                            });
                        }
                    );
                } else {
                    if (err) {
                        return App.render({
                            type   : 'error',
                            message: 'Error'
                        });
                    }
                }
            }, {scope: 'email'});
        },

        changeTab: function (e) {
            var $target = $(e.target).closest('li');
            var currentTab = this.$el.find('.tabs').find('.active');
            var idHide = currentTab.attr('id');
            var idShow = $target.attr('id');
            var formShow = this.$el.find('#' + idShow + 'Form');
            var formHide = this.$el.find('#' + idHide + 'Form');
            var forgotForm = this.$el.find('#forgotPassword');
            var $title = this.$el.find('#titleForm');
            var title = 'Login to your account';

            e.preventDefault();

            $title.text(title);

            if (!forgotForm.hasClass('hidden') || !$target.hasClass('active')) {
                currentTab.removeClass('active');
                $target.addClass('active');

                formHide.addClass('hidden');
                formShow.removeClass('hidden');
                forgotForm.addClass('hidden');
                $title.removeClass('green');
            }

        },

        hideSelect: function () {
            var $thisEl = this.$el;
            var $ul = $thisEl.find('#dbs');

            $ul.removeClass('openDd');
        },

        showHideDbs: function (e) {
            var $thisEl = this.$el;
            var $ul = $thisEl.find('#dbs');

            e.preventDefault();
            e.stopPropagation();

            $ul.toggleClass('openDd');
        },

        selectDb: function (e) {
            var $thisEl = this.$el;
            var $targetEl = $(e.target);
            var $li = $targetEl.closest('li');
            var $selectedDb = $thisEl.find('#selectedDb');
            var dbName = $li.attr('data-id');
            var fullText = $li.text();

            this.showHideDbs(e);

            $selectedDb.attr('data-id', dbName);
            $selectedDb.text(fullText);
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
            $title.toggleClass('green');
        },

        usernameFocus: function () {
            this.$el.find('.icon-login').toggleClass('active');
        },

        passwordFocus: function () {
            this.$el.find('.icon-pass').toggleClass('active');
        },

        checkEmail: function () {
            var $loginForm = this.$el.find('#signUpForm');
            var login = $loginForm.find('.login');
            var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!emailRegExp.test($.trim(login.val()))) {
                login.addClass('errorContent');

                return false;
            } else {
                login.removeClass('errorContent');
                return true;

            }

        },

        signUp: function (event) {
            var $thisEl = this.$el;
            var currentDb = $thisEl.find('#selectedDb').attr('data-id');
            var $loginForm = $thisEl.find('#signUpForm');
            var $errorContainer = $thisEl.find('.error');
            var login = $.trim($loginForm.find('.login').val()) || '';
            var nameFirst = $.trim($loginForm.find('.firstName').val()) || '';
            var nameLast = $.trim($loginForm.find('.lastName').val()) || '';
            var mobilePhone = $.trim($loginForm.find('#mobilePhone').val()) || '';
            var pass = $.trim($thisEl.find('#pass').val()) || '';
            var $checkedEl = $thisEl.find('#switchElement');
            var checked = $checkedEl.prop('checked');
            var err = '';
            var data;

            if (!this.checkEmail()) {
                return App.render({type: 'error', message: 'Please, enter valid email address'});
            }

            if (mobilePhone.length && (mobilePhone.length < 12 || isNaN(Number(mobilePhone)))) {
                return App.render({type: 'error', message: 'Please, enter valid Mobile Phone'});
            }

            event.preventDefault();

            App.currentDb = currentDb;
            App.weTrack = true;

            $loginForm.removeClass('notRegister');

            data = {
                login      : login,
                email      : login,
                first      : nameFirst,
                last       : nameLast,
                pass       : pass,
                mobilePhone: '+' + mobilePhone,
                dbId       : currentDb
            };

            if (!data.login || !data.pass) {
                $loginForm.addClass('notRegister');
            }

            if (!passReqExp.test(data.pass)) {
                err += WEAK_PASS_MESSAGE;
            }

            if (err) {
                App.render({type: 'error', message: err});
                $loginForm.addClass('notRegister');

                return;
            }

            $.ajax({
                url : '/users/signUp',
                type: 'POST',
                data: data,

                success: function () {
                    App.render({type: 'notify', message: 'Please, check your email and confirm registration'});

                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#login', {trigger: true});

                },

                error: function (error) {
                    $loginForm.addClass('notRegister');
                    App.render({
                        type   : 'error',
                        message: error.responseJSON.error
                    });
                }
            });
        },

        login: function (event) {
            var $thisEl = this.$el;
            var currentDb = $thisEl.find('#selectedDb').attr('data-id');
            var $loginForm = $thisEl.find('#loginForm');
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

            // if (!passReqExp.test(data.pass)) {
            //     err += 'Invalid password';
            //     $loginForm.addClass('notRegister');
            // }

            if (err) {
                App.render({type: 'error', message: err});
                $loginForm.addClass('notRegister');

                return;
            }

            $.ajax({
                url : '/users/login',
                type: 'POST',
                data: data,

                success: function () {
                    Custom.runApplication(true);

                    App.storage.save('currentDb', currentDb);
                },

                error: function (error) {
                    $loginForm.addClass('notRegister');
                    App.render({
                        type   : 'error',
                        message: error.responseJSON.error
                    });
                }
            });
        },

        forgotPassword: function (event) {
            var $thisEl = this.$el;
            var currentDb = $thisEl.find('#selectedDb').attr('data-id');
            var $backToLogin = $thisEl.find('#backToLogin');
            var $forgotForm = $thisEl.find('#forgotPassword');
            var $errorContainer = $thisEl.find('.error');
            var login = $.trim($forgotForm.find('.ulogin').val()) || '';
            var err = '';
            var data;
            var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            event.preventDefault();
            App.currentDb = currentDb;
            App.weTrack = true;

            data = {
                email: login,
                dbId : currentDb
            };

            if (!emailRegExp.test(login)) {
                return App.render({type: 'error', message: 'Please, enter valid email address'});
            }

            $.ajax({
                url : '/users/forgotPassword',
                type: 'POST',
                data: data,

                success: function () {
                    $backToLogin.click();
                    setTimeout(function () {
                        App.render({
                            type   : 'notify',
                            message: 'The new password was sent to your email. Please check it'
                        });
                    }, 1000);
                },

                error: function (error) {
                    $forgotForm.addClass('notRegister');
                    App.render({
                        type   : 'error',
                        message: error.responseJSON.error
                    });
                }
            });
        },

        render: function (options) {
            var $thisEl = this.$el;
            var $backStratch;
            var self = this;

            $('title').text('Login');

            if (options) {
                $thisEl.html(_.template(LoginTemplate, options));
            } else {
                $thisEl.html(LoginTemplate);
                $thisEl.find('#loginForm').addClass('notRegister');
            }

            $backStratch = $thisEl.find('#backstretch');
            $backStratch.backstretch([
                'images/imgs/dashboard_1.png',
                'images/imgs/opportunities.png',
                'images/imgs/dashboard_2.png',
                'images/imgs/companies.png'
            ], {
                duration : 3000,
                fade     : 750,
                centeredX: false
            });

            $(document).on('keydown', function (e) {

                switch (e.which) {
                    case 13:
                        self.login(e);
                        break;
                    default:
                        break;
                }
            });

            return this;
        }
    });

    return LoginView;

});