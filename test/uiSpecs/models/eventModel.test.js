define([
    'models/EventModel',
    'chai'
], function (EventModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('EventModel', function () {
        var event;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Degre object', function () {
            event = new EventModel();

            expect(event).to.be.instanceOf(Object);
            expect(event.get('color')).to.be.equals('');
            expect(event.get('assignedTo')).to.be.equals('Nobody');
            expect(event.get('description')).to.be.equals('');
            expect(event.get('eventType')).to.be.equals('call');
        });

        it('Try to get url', function(){
            expect(event.url()).to.be.equals('/Events/');
        });
    });
});