define([
    'models/ProfilesModel',
    'chai'
], function (ProfilesModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('ProfileModel', function () {
        var mainSpy;
        var profile;
        var server;

        before(function () {
            mainSpy = sinon.spy(App, 'render');
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        it('should be a Profile object', function () {
            profile = new ProfilesModel();

            expect(profile).to.be.instanceOf(Object);
        });

        it('Try set paramenters', function(){
            profile.set('profileName', 'Finance');

            expect(profile.get('profileName')).to.be.equals('Finance');
        });

        it ('Try set paramenters with validation error', function(){
            var spyResponse;

            profile.set({
                profileName: '<>dsdsada'
            }, {
                validate: true
            });

            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
        });

        it('Try to save model', function(done){
            profile.set({
                profileName: 'Finance'
            }, {
                validate: true
            });

            server.respondWith('POST', '/profiles/', [200, {"Content-Type": "application/json"}, JSON.stringify([{
                profileName  : 'Finance'
            }])]);

            profile.save(null, {
                editMode   : false,
                success    : function () {
                    done();
                },
                error: function(model, xhr){
                    done(xhr);
                }
            });

            server.respond();

            expect(profile.profileName).to.be.equal('Finance');

        });

    });
});
