define([
    'models/integrationChannel',
    'chai'
], function (IntegrationModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('IntegrationModel', function () {
        var integration;
        var server;
        var appRenderSpy;

        before(function () {
            server = sinon.fakeServer.create();
            appRenderSpy = sinon.spy(App, 'render');
        });

        after(function () {
            server.restore();
            appRenderSpy.restore();
        });

        it('should be a IntegrationChannel object', function () {
            integration = new IntegrationModel();

            expect(integration).to.be.instanceOf(Object);
        });

        it('Try to set invalid value. Should generate error', function () {
            appRenderSpy.reset();

            integration.set({baseUrl: '^&*)ddsd', channelName: '12'}, {validate: true});

            expect(appRenderSpy.calledOnce).to.be.true;
        });
    });
});
