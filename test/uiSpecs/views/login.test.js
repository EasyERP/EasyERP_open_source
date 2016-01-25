define([
    'views/login/LoginView'
], function(LoginView) {
    'use strict';

    describe('LoginView', function () {
        var user;

        describe('#initialize()', function () {
            it('should be a user object', function () {
                user = {};

                expect(user).to.be.instanceOf(Object);
            });
        });
       /* describe('Set without validating', function () {
            it('should contain login attribute', function () {
                user.set('login', 'pupkin'/!*, {validate: true}*!/);

                expect(user.get('login')).to.be.equal('pupkin');
            });
        });
        describe('Validating', function () {
            it('Set within validation, should fail', function () {
                user.set({login: 234234234234234}, {validate: true});

                expect(user.get('login')).to.be.equal('pupkin');
            });
        });*/
    });
});