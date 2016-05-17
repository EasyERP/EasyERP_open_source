define([
    'models/EmployeesModel',
    'chai'
], function (EmployeesModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('EmployeesModel', function () {
        var mainSpy;
        var employee;
        var server;

        before(function () {
            mainSpy = sinon.spy(App, 'render');
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        it('should be a Employee object', function () {
            employee = new EmployeesModel();

            expect(employee).to.be.instanceOf(Object);
        });

        it('should contain main attributes', function () {
            employee.set('dateBirth', '05.04.1991');
            employee.set({
                name: {
                    first: 'Misha',
                    last: 'Vashkeba'
                }
            });

            expect(employee.get('dateBirth')).to.be.equal('05.04.1991');
            expect(employee.get('name')).to.be.an('object');
            expect(employee.get('name').first).to.be.equal('Misha');
            expect(employee.get('name').last).to.be.equal('Vashkeba');
        });


        it('Check validation', function () {
            var spyResponse;

            employee.set({
                workPhones: {
                    phone: '333'
                }
            }, {validate: true});
            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
        });

        it('Change employee value', function (done) {
            server.respondWith('POST', '/employees/', [201, {"Content-Type": "application/json"}, JSON.stringify([{
                id  : '123456'
            }])]);

            employee.set('workEmail', 'test@test.com');

            employee.save(null, {
                editMode   : false,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            done();

            expect(employee.get('workEmail')).to.be.equal('test@test.com');
            //expect(employee.get('id')).to.be.equal('123456');

        });

    });
});
