define([
    'models/HolidayModel',
    'chai'
], function (HolidayModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('HolidayModel', function () {
        var mainSpy;
        var holiday;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Holiday object', function () {
            holiday = new HolidayModel();

            expect(holiday).to.be.instanceOf(Object);
        });

        it('Try to save model', function (done) {
            holiday.set({
                fixedExpense: 45
            });

            server.respondWith('POST', '/Holiday/', [200, {"Content-Type": "application/json"}, JSON.stringify([{
                comment  : 'Defender of Ukraine Day'
            }])]);

            holiday.save(null, {
                editMode: false,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(holiday.get('comment')).to.be.equals('Defender of Ukraine Day');
        });


    });
});
