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
        });

        after(function () {
            $fixture.empty();
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
            var view;

            before(function () {
                loginSpy = sinon.spy(LoginView.prototype, "login");
                view = new LoginView({el: $elFixture, dbs: ['production', 'development']});
            });

            beforeEach(function () {
                this.server = sinon.fakeServer.create();
                this.server.autoRespond = true;
            });
            afterEach(function () {
                this.server.restore();
            });

            after(function () {
                view.remove();
                loginSpy.restore();
            });

            it('should have call login event, with predefined login & pass, trigger success callback', function () {
                var $loginButton = view.$el.find('.login-button');
                var $login = view.$el.find('#ulogin');
                var $password = view.$el.find('#upass');

                $login.val('pupkin');
                $password.val('pupkin');

                this.server.respondWith("POST", "/login", [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'loggedIn'})]);

                $loginButton.click();

                expect($loginButton).to.exist;
                expect(loginSpy.called).to.be.true;
            });

            it('should have call login event, with predefined login & pass, trigger error callback, within status code !== 406', function () {
                var $thisEl = view.$el;
                var $loginButton = $thisEl.find('.login-button');
                var $login = $thisEl.find('#ulogin');
                var $password = $thisEl.find('#upass');
                var $loginForm = $thisEl.find("#loginForm");

                $login.val('pupkin');
                $password.val('pupkin');

                this.server.respondWith("POST", "/login", [400, {"Content-Type": "application/json"}, JSON.stringify({error: 'Fail'})]);

                $loginButton.click();
                console.log($loginForm.hasClass('notRegister'));

                expect($loginForm).to.have.class('notRegister');
            });
        });
    });
});