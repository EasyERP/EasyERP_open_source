/**
 * Created by den on 09.02.16.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("jobs Specs", function () {
    'use strict';
    var id;
    var projectId;

    describe("Jobs with admin", function () {

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

        it("should create jobs", function (done) {
            aggent
                .post('jobs')
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
                    expect(body.success)
                        .to.have.property('_id');

                    id = body.success._id;
                    projectId = body.success.projectId;

                    done();
                });
        });

        it("should get jobs", function (done) {
            var body = {
                page : 1,
                count: 1
            };

            aggent
                .get('jobs')
                .query(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);

                    done();
                });
        });

        it("should get jobs ForDD", function (done) {
            var body = {
                projectId: projectId
            };

            aggent
                .get('jobs/getForDD')
                .query(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);

                    done();
                });
        });

        it("should get totalCollectionLength for jobs", function (done) {
            var body = {
                filter: {
                    projectManager: {
                        key  : "projectmanager._id",
                        value: ["55b92ad221e4b7c40f00004f",""]
                    }
               }
            };

            aggent
                .get('jobs/totalCollectionLength')
                .query(body)
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

                    done();
                });
        });

        it("should update jobs", function (done) {
            var body = {
                _id : id,
                name: "testJobsName"
            };

            aggent
                .post('jobs/update')
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
                    expect(body)
                        .to.have.property('project');

                    done();
                });
        });

        it("should delete jobs", function (done) {
            var body = {
                _id: id
            };

            aggent
                .post('jobs/remove')
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
                    expect(body)
                        .to.have.property('project');

                    done();
                });
        });
    });

    describe("Jobs with user without a license ", function () {

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

        it("should fail create jobs", function (done) {
            aggent
                .post('jobs')
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
                    //expect(body)
                    //    .to.have.property('id');

                    id = body.success._id;

                    done();
                });
        });
    });

});