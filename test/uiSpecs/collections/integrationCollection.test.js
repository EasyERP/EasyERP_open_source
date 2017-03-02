define([
    'collections/integrations/filterCollection',
    'testConstants/fakeChannels',
    'chai'
], function (IntegrationCollection, fakeIntegrations, chai) {
    'use strict';
    var expect = chai.expect;

    describe('IntegrationCollection', function () {
        var channelsUrl = '/channels';
        var integrationCollection;
        var mainSpy;
        var server;
        var initSpy;

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
            initSpy = sinon.spy(IntegrationCollection.prototype, 'initialize');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
            initSpy.restore();
        });

        it ('Try to create collection with error server response', function(){
            server.respondWith('GET', channelsUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeIntegrations)]);
            integrationCollection = new IntegrationCollection({});
            server.respond();

            expect(initSpy.calledOnce).to.be.true;
            expect(mainSpy.calledOnce).to.be.true;
            expect(mainSpy.args[0][0]).to.have.property('message').to.equals('Bad Request');

            initSpy.reset();
        });

        it ('Try to create collection with 200 server response', function () {
            server.respondWith('GET', channelsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeIntegrations)]);
            integrationCollection = new IntegrationCollection({});
            server.respond();

            expect(initSpy.calledOnce).to.be.true;
            expect(integrationCollection.length).to.be.equals(2);
            expect(integrationCollection).to.have.property('stats');
        });
    });
});