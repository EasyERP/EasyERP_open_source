define([
    'models/CompaniesModel',
    'chai'
], function (CompaniesModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('CompaniesModel', function () {
        var mainSpy;
        var company;
        var server;

        before(function () {
            mainSpy = sinon.spy(App, 'render');
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        it('should be a Company object', function () {
            company = new CompaniesModel();

            expect(company).to.be.instanceOf(Object);
        });

        it('should contain main attributes', function () {
            company.set({
                name: {
                    first: 'Test',
                    last: 'Test'
                }
            });

            expect(company.get('name')).to.be.an('object');
            expect(company.get('name').first).to.be.equal('Test');
            expect(company.get('name').last).to.be.equal('Test');
        });


        it('Check validation', function () {
            var spyResponse;

            company.set({
                phones: {
                    phone: '333'
                }
            }, {validate: true});
            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
        });

        it('POST model', function (done) {
            server.respondWith('POST', '/companies/', [201, {"Content-Type": "application/json"},  JSON.stringify([{
                id  : '123456'
            }])]);

            company.set('email', 'test@test.com');

            company.save(null, {
                editMode   : false,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(company.get('email')).to.be.equals('test@test.com');
            expect(company.get('id')).to.be.equals('123456');

        });

        it('PUT model', function (done) {
            server.respondWith('PUT', '/companies/123456', [200, {"Content-Type": "application/json"},  JSON.stringify([{
                email: 'test1@test.ua'
            }])]);

            company.set('email', 'test1@test.ua');

            company.save(null, {
                editMode   : true,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(company.get('email')).to.be.equals('test1@test.ua');
            expect(company.get('id')).to.be.equals('123456');

        });

        it('PATCH model', function (done) {
            server.respondWith('PATCH', '/companies/123456', [200, {"Content-Type": "application/json"},  JSON.stringify([{
                website: 'test.com'
            }])]);

            company.set('website', 'test.com');

            company.save(null, {
                patch: true,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(company.get('email')).to.be.equals('test1@test.ua');
            expect(company.get('website')).to.be.equals('test.co,');
            expect(company.get('id')).to.be.equals('123456');

        });

    });
});
