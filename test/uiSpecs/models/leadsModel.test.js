define([
    'models/LeadsModel',
    'chai'
], function (LeadsModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('LeadsModel', function () {
        var mainSpy;
        var lead;
        var server;

        before(function () {
            mainSpy = sinon.spy(App, 'render');
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        it('should be a Leads object', function () {
            lead = new LeadsModel();

            expect(lead).to.be.instanceOf(Object);
            expect(lead.get('name')).to.be.equals('New Lead');
            expect(lead.get('priority')).to.be.equals('Trivial');
        });

        it('should contain main attributes', function () {
            lead.set({
                company: {
                    id: '123',
                    name: 'Test'
                }
            });

            expect(lead.get('company')).to.be.an('object');
            expect(lead.get('company').id).to.be.equal('123');
            expect(lead.get('company').name).to.be.equal('Test');
        });


        it('Check validation', function () {
            var spyResponse;

            lead.set({
                phones: {
                    phone: '<<,Edsdfdg3'
                }
            }, {validate: true});
            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
        });

        it('POST model', function (done) {
            server.respondWith('POST', '/leads/', [201, {"Content-Type": "application/json"},  JSON.stringify([{
                id  : '123456'
            }])]);

            lead.set('email', 'test@test.com');

            lead.save(null, {
                editMode   : false,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(lead.get('email')).to.be.equals('test@test.com');
            expect(lead.get('id')).to.be.equals('123456');

        });

       it('PUT model', function (done) {
            server.respondWith('PUT', '/leads/123456', [200, {"Content-Type": "application/json"},  JSON.stringify([{
                email: 'test1@test.ua'
            }])]);

            lead.set('email', 'test1@test.ua');

            lead.save(null, {
                editMode   : true,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(lead.get('email')).to.be.equals('test1@test.ua');
            expect(lead.get('id')).to.be.equals('123456');

        });

        it('PATCH model', function (done) {
            server.respondWith('PATCH', '/leads/123456', [200, {"Content-Type": "application/json"},  JSON.stringify([{
                func: 'lead'
            }])]);

            lead.set('func', 'lead');

            lead.save(null, {
                patch: true,
                success: function () {
                    done();
                },
                error: function (model, xhr) {
                    done(xhr);
                }
            });

            server.respond();

            expect(lead.get('email')).to.be.equals('test1@test.ua');
            expect(lead.get('func')).to.be.equals('lead');
            expect(lead.get('id')).to.be.equals('123456');

        });

    });
});
