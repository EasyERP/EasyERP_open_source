require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Opportunity Specs", function () {
    'use strict';
    var id;

    describe('Opportunity with admin', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass : '1q2w3eQWE',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create opportunity', function (done) {
            var body = {
                name: "Subject"
            };

            aggent
                .post('opportunities')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('success');

                    id = body.id;

                    done();
                });
        });

        it('should fail create opportunity', function (done) {
            var body = {};

            aggent
                .post('opportunities')
                .send(body)
                .expect(404, done);
        });

        it('should get opportunity totalCount', function (done) {
            aggent
                .get('opportunities/totalCollectionLength')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('count');
                    expect(body)
                        .to.have.property('showMore');
                    done();
                });
        });

        it('should get opportunity FilterValues', function (done) {
            aggent
                .get('opportunities/getFilterValues')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array)
                        .and.to.be.not.empty;

                    done();
                });
        });

        it('should get opportunity ForMiniView', function (done) {
            aggent
                .get('opportunities/OpportunitiesForMiniView')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('listLength');
                    done();
                });
        });

        it('should get opportunity LengthByWorkflows', function (done) {
            aggent
                .get('opportunities/getLengthByWorkflows')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('arrayOfObjects');
                    expect(body.arrayOfObjects)
                        .to.be.instanceOf(Array);
                    expect(body)
                        .to.have.property('showMore');
                    done();
                });
        });

        it('should get opportunity for viewType list', function (done) {
            var query = {
                viewType   : 'list',
                contentType: 'Opportunities'
            };

            aggent
                .get('opportunities/list')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }
                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body.data)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it('should get opportunity for viewType form', function (done) {
            var query = {
                id: id
            };

            aggent
                .get('opportunities/form')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('_id');

                    done();
                });
        });

        it('should get opportunity for viewType kanban', function (done) {

            var query = {
                workflowId: '528ce5e3f3f67bc40b000018'
            };

            aggent
                .get('opportunities/kanban')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body)
                        .to.have.property('workflowId');

                    done();
                });
        });

        it('should opportunity updateOnlySelectedFields', function (done) {
            var body = {
                name: 'test'
            };
            aggent
                .patch('opportunities/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('success');

                    done();
                });
        });

        it('should opportunity update', function (done) {
            var body = {
                _id: id
            };
            aggent
                .put('opportunities/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('success');
                    expect(body)
                        .to.have.property('result');

                    done();
                });
        });

        it("should remove opportunity", function (done) {
            aggent
                .delete('opportunities/' + id)
                .expect(200, done);
        });

        it('should create opportunity createLeadFromSite', function (done) {
            var body = {
                email: "test@example.com"
            };

            aggent
                .post('opportunities/createLeadFromSite')
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('success');

                    done();
                });
        });

        it('should fai create opportunity createLeadFromSite', function (done) {
            var body = {};

            aggent
                .post('opportunities/createLeadFromSite')
                .send(body)
                .expect(400, done);
        });
    });

    describe('Opportunity with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'testUser',
                    pass : 'qwerty',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create Opportunity', function (done) {
            var body = {
                name: "Subject"
            };

            aggent
                .post('opportunities')
                .send(body)
                .expect(403, done);
        });
    });
});
