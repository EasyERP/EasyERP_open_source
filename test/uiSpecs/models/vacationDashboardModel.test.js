define([
    'models/VacationDashboardModel',
    'chai'
], function (VacationDashboardModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('VacationDashboardModel', function () {
        var vacationDashboard;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Customer object', function () {
            vacationDashboard = new VacationDashboardModel();

            expect(vacationDashboard).to.be.instanceOf(Object);
        });

    });
});
