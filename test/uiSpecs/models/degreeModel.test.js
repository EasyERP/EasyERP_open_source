define([
    'models/DegreeModel',
    'chai'
], function (DegreeModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('DegreeModel', function () {
        var degree;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Degree object', function () {
            degree = new DegreeModel();

            expect(degree).to.be.instanceOf(Object);
            expect(degree.get('name')).to.be.equals('');
        });

        it('Try to get url', function(){
            expect(degree.url()).to.be.equals('/companies/');
        });
    });
});
