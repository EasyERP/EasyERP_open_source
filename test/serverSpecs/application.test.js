/**
 * Created by liliy on 27.01.2016.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Application Specs", function () {
    'use strict';
    var id;

    describe('Application with admin', function () {
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

        it("should create application", function (done) {
            var body = {
                "name"     : {
                    "first": "test",
                    "last" : "test"
                },
                "dateBirth": "28 Dec, 1990"
            };

            aggent
                .post('applications')
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
                    expect(body)
                        .to.have.property('result');
                    expect(body)
                        .to.have.property('id');
                    expect(body.result)
                        .to.have.property('_id');

                    id = body.id;

                    done();
                });
        });

        it("should getById application", function (done) {
            var query = {
                id: id
            };
            aggent
                .get('applications/' + id)
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
                        .to.have.property('_id');

                    done();
                });
        });

        it("should get by viewType list application", function (done) {
            var query = {
                viewType     : "list",
                contentType  : 'Applications'
            };
            aggent
                .get('applications/list')
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

                    done();
                });
        });

        it("should get by viewType kanban application", function (done) {
            var query = {
                workflowId: '528ce5e3f3f67bc40b000018',
                viewType     : "kanban"
            };
            aggent
                .get('applications/kanban')
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
                        .to.have.property('time');
                    expect(body)
                        .to.have.property('workflowId');

                    done();
                });
        });

        it("should get applications length by workflows", function(done){
            aggent
                .get('applications/getApplicationsLengthByWorkflows')
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('showMore');
                    expect(body)
                        .to.have.property('arrayOfObjects')
                        .and.to.be.instanceOf(Array);

                    done();
                });
        });

        it("should get total collection length",function(done){
            var body = {
                contentType: 'Applications'
            };

            aggent
                .get('applications/totalCollectionLength')
                .query(body)
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('showMore');
                    expect(body)
                        .to.have.property('count');

                    done();
                });
        });

        it("should update application", function (done) {
            var body = {
                'social': {
                    LI: 'test'
                }
            };
            aggent
                .patch('applications/' + id)
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
                        .to.have.property('_id');

                    done();
                });
        });

        it("should delete application", function (done) {
            aggent
                .delete('applications/' + id)
                .expect(200, done);
        });

    });

    describe('Application with user without a license', function () {
        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass : 'thinkmobiles2015',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should fail create application", function (done) {
            var body = {
                "name"     : {
                    "first": "test",
                    "last" : "test"
                },
                "dateBirth": "28 Dec, 1990"
            };

            aggent
                .post('applications')
                .send(body)
                .expect(403, done);
        });
    });
});