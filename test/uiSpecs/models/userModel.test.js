define([
    'models/UsersModel',
    'chai'
], function (UserModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('UserModel', function () {
        var mainSpy;
        var user;
        var server;

        before(function () {
            mainSpy = sinon.spy(App, 'render');
            server = sinon.fakeServer.create();
        });

        after(function () {
            mainSpy.restore();
        });

        it('should be a user object', function () {
            user = new UserModel({});

            expect(user).to.be.instanceOf(Object);
        });
        it('should contain login attribute', function () {
            user.set('login', 'pupkin');

            expect(user.get('login')).to.be.equal('pupkin');
        });
        it('Set within validation, should fail', function () {
            var spyResponse;

            user.set({login: 234234234234234}, {validate: true});
            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
        });

        it('should change password', function (done) {
            server.respondWith('POST', '/users/', [200, {"Content-Type": "application/json"}, JSON.stringify([{
                _id  : 123456,
                login: 'pupkin'
            }])]);

            user.set({login: 'pupkin', pass: '12345', oldpass: '1234'});
            user.save(null, {
                editMode   : false,
                confirmPass: '12345',
                success    : function () {
                    done();
                },
                error: function(model, xhr){
                    done(xhr);
                }
            });

            server.respond();

            expect(user.id).to.be.equal(123456);
        });

        it('Quick edit, should be valid email & login', function (done) {
            server.respondWith('PUT', '/users/123456', [200, {"Content-Type": "application/json"}, JSON.stringify([{
                _id  : 123456,
                login: 'pupkin'
            }])]);

            user.set({email: 'puplin@mail.ru'});
            user.save(null, {
                editMode   : true,
                success    : function () {
                    done();
                },
                error: function(model, xhr){
                    done(xhr);
                }
            });

            server.respond();

            expect(user.id).to.be.equal(123456);
        });
    });
});