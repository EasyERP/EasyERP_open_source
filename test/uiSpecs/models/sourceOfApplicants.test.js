define([
    'models/SourceOfApplicantsModel',
    'chai'
], function (SourceOfApplicantsModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('SourceOfApplicantsModel', function () {
        var source;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Customer object', function () {
            source = new SourceOfApplicantsModel();

            expect(source).to.be.instanceOf(Object);
            expect(source.get('name')).to.be.equals('New');
        });

        it('Try to get models url', function(){
            expect(source.urlRoot()).to.be.equals('/SourcesOfApplicants/');
        });

    });
});
