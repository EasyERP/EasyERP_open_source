define([
    'models/Priority',
    'chai'
], function (PriorityModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('PriorityModel', function () {
        var priorityModel;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Customer object', function () {
            priorityModel = new PriorityModel();

            expect(priorityModel).to.be.instanceOf(Object);
            expect(priorityModel.get('_id')).to.be.equals(null);
            expect(priorityModel.get('priority')).to.be.equals('');
        });

        it('Try to get models url', function(){
            expect(priorityModel.urlRoot()).to.be.equals('/Priority');
        });

    });
});
