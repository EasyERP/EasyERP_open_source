define([
    'models/PersonsModel',
    'chai'
], function (PersonsModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('PersonsModel', function () {
        var mainSpy;
        var person;
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
            person = new PersonsModel();

            expect(person).to.be.instanceOf(Object);
        });

        it('should contain main attributes', function () {
            person.set('dateBirth', '05.04.1991');
            person.set({
                name: {
                    first: 'Misha',
                    last: 'Vashkeba'
                }
            });

            expect(person.get('dateBirth')).to.be.equal('05.04.1991');
            expect(person.get('name')).to.be.an('object');
            expect(person.get('name').first).to.be.equal('Misha');
            expect(person.get('name').last).to.be.equal('Vashkeba');
        });


        it('Check validation', function () {
            var spyResponse;

            person.set({
                phones: {
                    phone: '<><sd333'
                }
            }, {validate: true});
            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
        });

        it('POST model', function (done) {
            server.respondWith('POST', '/persons/', [201, {"Content-Type": "application/json"},  JSON.stringify([{
                id  : '123456'
            }])]);

            person.set('email', 'test@test.com');

            person.save(null, {
                editMode   : false,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(person.get('email')).to.be.equal('test@test.com');
            expect(person.get('id')).to.be.equals('123456');

        });

        it('PUT model', function (done) {
            server.respondWith('PUT', '/persons/123456', [200, {"Content-Type": "application/json"},  JSON.stringify([{
                email: 'test1@test.ua'
            }])]);

            person.set('email', 'test1@test.ua');

            person.save(null, {
                editMode   : true,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(person.get('email')).to.be.equal('test1@test.ua');
            expect(person.get('id')).to.be.equals('123456');

        });

        it('PATCH model', function (done) {
            server.respondWith('PATCH', '/persons/123456', [200, {"Content-Type": "application/json"},  JSON.stringify([{
                dateBirth: '05.04.1991'
            }])]);

            person.set('dateBirth', '05.04.1991');

            person.save(null, {
                editMode   : true,
                patch: true,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(person.get('email')).to.be.equal('test1@test.ua');
            expect(person.get('dateBirth')).to.be.equal('05.04.1991');
            expect(person.get('id')).to.be.equals('123456');

        });

    });
});
