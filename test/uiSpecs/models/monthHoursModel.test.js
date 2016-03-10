define([
    'models/MonthHoursModel',
    'chai'
], function (MonthHoursModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('MonthHoursModel', function () {
        var mainSpy;
        var monthHours;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Department object', function () {
            monthHours = new MonthHoursModel({});

            expect(monthHours).to.be.instanceOf(Object);
        });

        it('Try to save model', function (done) {
            monthHours.set({
                fixedExpense: 45
            });

            server.respondWith('POST', '/monthHours/', [200, {"Content-Type": "application/json"}, JSON.stringify([{
                fixedExpense  : 45
            }])]);

            monthHours.save(null, {
                editMode: false,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(monthHours.get('fixedExpense')).to.be.equals(45)
        });


    });
});
