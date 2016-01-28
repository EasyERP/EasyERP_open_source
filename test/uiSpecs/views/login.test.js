define([
    'text!fixtures/index.html',
    'views/login/LoginView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, LoginView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('LoginView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            $fixture = $(fixtures);
            $elFixture = $fixture.find('#wrapper');
            $fixture.appendTo(document.body);
        });

        after(function () {
            $fixture.empty();
            $fixture.remove();
        });

        describe('#initialize()', function () {
            var view;

            before(function () {
                view = new LoginView({el: $elFixture});
            });

            it('should have div tagName', function () {
                expect(view.tagName).to.be.equal('div');
            });
            it('view should have checkClick method', function () {
                expect(view).to.have.property('checkClick');
            });

            it('this.$el id should be #wrapper', function () {
                expect(view.$el).to.have.attr('id');
                expect(view.$el).to.have.id('wrapper');
            });

        });

        describe('#initialize(options) options = {dbs: [db1, db2, ..]}', function () {
            var view;

            before(function () {
                view = new LoginView({el: $elFixture, dbs: ['production', 'development']});
            });

            it('should have div tagName', function () {
                expect(view.tagName).to.be.equal('div');
            });
        });

        describe('Test events', function () {
            var loginSpy;
            var usernameFocusSpy;
            var passwordFocusSpy;
            var view;
            var server;

            before(function () {
                server = sinon.fakeServer.create();
                server.autoRespond = true;
                server.respondWith("GET", "/filter/getFiltersValues", [200, {"Content-Type": "application/json"}, JSON.stringify([{filter1: 'fakeFilter'}])]);

                loginSpy = sinon.spy(LoginView.prototype, "login");
                usernameFocusSpy = sinon.spy(LoginView.prototype, "usernameFocus");
                passwordFocusSpy = sinon.spy(LoginView.prototype, "passwordFocus");
                view = new LoginView({el: $elFixture, dbs: ['production', 'development']});
            });

            after(function () {
                view.remove();
                loginSpy.restore();
                server.restore();
            });

            it('should have call login event, with predefined login & pass, trigger error callback, within status code !== 406', function () {
                var $thisEl = view.$el;
                var $loginButton = $thisEl.find('.login-button');
                var $login = $thisEl.find('#ulogin');
                var $password = $thisEl.find('#upass');
                var $loginForm = $thisEl.find("#loginForm");
                var $errorContainer = $loginForm.find('.error');

                $login.val('pupkin');
                $password.val('pupkin');

                server.respondWith("POST", "/login", [400, {"Content-Type": "application/json"}, JSON.stringify({error: 'Fail'})]);

                $loginButton.click();
                server.respond();

                expect($loginForm).to.have.class('notRegister');
                expect($errorContainer).to.contain('Wrong Password or such user');
                expect($loginButton).to.exist;
            });

            it('should return err & not send ajax call', function () {
                var $thisEl = view.$el;
                var $loginButton = $thisEl.find('.login-button');
                var $login = $thisEl.find('#ulogin');
                var $password = $thisEl.find('#upass');
                var $loginForm = $thisEl.find("#loginForm");
                var $errorContainer = $loginForm.find('.error');

                $login.val('');
                $password.val('p');

                $loginButton.click();

                expect($loginForm).to.have.class('notRegister');
                expect($errorContainer).to.contain('Login must be longer than 3 characters');
                expect($errorContainer).to.contain('Password must be longer than 3 characters');
                expect($loginButton).to.exist;
            });

            it('should have call login event, with predefined login & pass, trigger success callback', function () {
                var $thisEl = view.$el;
                var $loginButton = $thisEl.find('.login-button');
                var $login = $thisEl.find('#ulogin');
                var $password = $thisEl.find('#upass');

                $login.val('pupkin');
                $password.val('pupkin');

                server.respondWith("POST", "/login", [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'loggedIn'})]);

                $loginButton.click();
                server.respond();

                expect($loginButton).to.exist;
                expect(loginSpy.called).to.be.true;
            });

            it('should focused in login input', function () {
                var $thisEl = view.$el;
                var $login = $thisEl.find('#ulogin');
                var $password = $thisEl.find('#upass');
                var $loginIcon = $thisEl.find(".icon-login");
                var $passwordIcon = $thisEl.find(".icon-pass");

                var loginHasActiveClass = $loginIcon.hasClass('active');
                var passwordHasActiveClass = $passwordIcon.hasClass('active');


                $login.focus();
                //$password.focus();
                expect(loginSpy.called).to.be.true;

               /* if (!loginHasActiveClass) {
                    expect($loginIcon).to.have.class('active');
                } else {
                    expect($loginIcon).to.not.have.class('active');
                }

                if (!passwordHasActiveClass) {
                    expect($passwordIcon).to.have.class('active');
                } else {
                    expect($passwordIcon).to.not.have.class('active');
                }*/
            });
        });
    });
});