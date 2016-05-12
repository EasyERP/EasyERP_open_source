define([
    'models/GenerateWtrack',
    'chai'
], function (GenerateWtrack, chai) {
    'use strict';
    var expect = chai.expect;

    describe('GenerateWtrack', function () {
        var generate;
        var server;
        var mainSpy;

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        it('should be a Customer object', function () {
            generate = new GenerateWtrack();

            expect(generate).to.be.instanceOf(Object);
            expect(generate.get('endDate')).to.be.equals('');
            expect(generate.get('hours')).to.be.equals('');
            expect(generate.get('project')).to.be.instanceOf(Object);
            expect(generate.get('employee')).to.be.instanceOf(Object);
            expect(generate.get('department')).to.be.instanceOf(Object);
            expect(generate.get('1')).to.be.equals(8);
            expect(generate.get('2')).to.be.equals(8);
            expect(generate.get('3')).to.be.equals(8);
            expect(generate.get('4')).to.be.equals(8);
            expect(generate.get('5')).to.be.equals(8);
            expect(generate.get('6')).to.be.equals(0);
            expect(generate.get('7')).to.be.equals(0);
            expect(generate.get('revenue')).to.be.equals(120);
        });

        it('Try to set attrs with error validate', function () {
            var spyResponse;

            generate.set({
                weekDefault: {
                    1: '',
                    2: 'dsf',
                    3: 'dsf',
                    4: 'dsf',
                    5: 'dsf',
                    6: 'dsf',
                    7: 'dsf'
                },
                revenue: 'sdas'
            }, {validate: true});
        });
    });
});