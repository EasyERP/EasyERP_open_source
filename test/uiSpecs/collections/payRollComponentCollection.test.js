define([
    'Backbone',
    'collections/payrollComponentTypes/filterCollection',
    'chai'
], function (Backbone, PayrollComponentTypesCollection, chai) {
    'use strict';
    var expect = chai.expect;

    describe('PayrollComponentTypesCollection', function () {
        var fakePayrollComponents = [
            {
                _id: "573edafcf9281fb40d5db50a",
                __v: 0,
                description: "fff",
                type: "earnings",
                name: "Test"
            },
            {
                _id: "5742ebcf7afe352f10c11c39",
                __v: 0,
                description: "sdsd",
                type: "earnings",
                name: "ds"
            },
            {
                _id: "5742ecdf7afe352f10c11c3a",
                __v: 0,
                description: "Test test",
                type: "earnings",
                name: "TestName"
            }
        ];
        var mainSpy;
        var server;
        var payrollComponentCollection;
        var historyNavigateSpy;

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
            historyNavigateSpy.restore();
        });

        it('Try to create collection with 401 error status response', function () {
            var payrollComponent = new RegExp('\/payrollComponentTypes\/list\/', 'i');

            server.respondWith('GET', payrollComponent, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            payrollComponentCollection = new PayrollComponentTypesCollection({});
            server.respond();

            expect(historyNavigateSpy.calledOnce).to.be.true;
        });

        it('Try to create collection with 403 error status response', function () {
            var payrollComponent = new RegExp('\/payrollComponentTypes\/list\/', 'i');
            var spyResponse;

            server.respondWith('GET', payrollComponent, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            payrollComponentCollection = new PayrollComponentTypesCollection({});
            server.respond();

            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
            expect(spyResponse).to.have.property('message', 'No access');
        });

        it('Try to create collection with 200 status response', function () {
            var payrollComponent = new RegExp('\/payrollComponentTypes\/list\/', 'i');

            server.respondWith('GET', payrollComponent, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakePayrollComponents)]);
            payrollComponentCollection = new PayrollComponentTypesCollection({});
            server.respond();

            expect(payrollComponentCollection).to.be.an('object');
            expect(payrollComponentCollection.models).to.be.instanceof(Array);
            expect(payrollComponentCollection.models.length).to.be.equals(3);
        });
    });
});
