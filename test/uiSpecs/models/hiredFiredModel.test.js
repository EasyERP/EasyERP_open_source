define([
    'models/hiredFired',
    'chai'
], function (HiredFired, chai) {
    'use strict';
    var expect = chai.expect;

    describe('HiredFired', function () {
        var hiredFired;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Customer object', function () {
            hiredFired = new HiredFired();

            expect(hiredFired).to.be.instanceOf(Object);
        });
    });
});
