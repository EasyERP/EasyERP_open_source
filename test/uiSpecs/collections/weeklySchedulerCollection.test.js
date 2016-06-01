define([
    'Backbone',
    'collections/weeklyScheduler/filterCollection',
    'chai'
], function (Backbone, WeeklySchedulerCollection, chai) {
    'use strict';
    var expect = chai.expect;

    describe('WeeklySchedulerCollection', function () {
        var fakeWeeklySchedule = [
            {
                1         : 8,
                2         : 8,
                3         : 8,
                4         : 8,
                5         : 8,
                6         : 0,
                7         : 0,
                _id       : '57332c3b94ee1140b6bb49e2',
                totalHours: 40,
                name      : 'UA-40'
            },
            {
                1         : 4,
                2         : 4,
                3         : 4,
                4         : 4,
                5         : 4,
                6         : 0,
                7         : 0,
                _id       : '573add0245310a4662c8005b',
                totalHours: 20,
                name      : 'UA-20'
            },
            {
                1         : 8,
                2         : 8,
                3         : 8,
                4         : 8,
                5         : 4,
                6         : 0,
                7         : 0,
                _id       : '573add2c0ed334e3619d2c2b',
                totalHours: 36,
                name      : 'Ger-36'
            }
        ];
        var mainSpy;
        var server;
        var weeklySchedulerCollection;
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
            var weeklyScheduleUrl = new RegExp('\/weeklyScheduler\/list\/', 'i');

            server.respondWith('GET', weeklyScheduleUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            weeklySchedulerCollection = new WeeklySchedulerCollection({});
            server.respond();

            expect(historyNavigateSpy.calledOnce).to.be.true;
        });

        it('Try to create collection with 403 error status response', function () {
            var weeklyScheduleUrl = new RegExp('\/weeklyScheduler\/list\/', 'i');
            var spyResponse;

            server.respondWith('GET', weeklyScheduleUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            weeklySchedulerCollection = new WeeklySchedulerCollection({});
            server.respond();

            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
            expect(spyResponse).to.have.property('message', 'No access');
        });

        it('Try to create collection with 200 status response', function () {
            var weeklyScheduleUrl = new RegExp('\/weeklyScheduler\/list\/', 'i');

            server.respondWith('GET', weeklyScheduleUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWeeklySchedule)]);
            weeklySchedulerCollection = new WeeklySchedulerCollection({});
            server.respond();

            expect(weeklySchedulerCollection).to.be.an('object');
            expect(weeklySchedulerCollection.models).to.be.instanceof(Array);
            expect(weeklySchedulerCollection.models.length).to.be.equals(3);
        });
    });
});
