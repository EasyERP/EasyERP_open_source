/**
 * Created by den on 10.02.16.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Vacation Specs", function () {
    'use strict';
    var id;

    describe("Vacation with admin", function () {

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

        it("should create vacation", function (done) {
            var body = {
                month   : 2,
                year    : 2016,
                vacArray: [null, null, null, null, null, "V", null, null, "V", null, null, "V", null, null, null
                    , null, null, null, null, null, null, null, null, null, null, null, null, null, null]
            };

            aggent
                .post('vacation')
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
                    //expect(body.success)
                    //    .to.have.property('_id');
console.log(body.success._id);
                    id = body.success._id;
console.log(id);
                    done();
                });
        });

        it("should get For list View of vacation", function (done) {
            var body = {
                month   : 2,
                viewType: "list",
                year    : 2016
            };

            aggent
                .get('vacation/list')
                .expect(200)
                .query(body)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it("should get For attendance View of vacation", function (done) {
            var body = {
                month   : 2,
                viewType: "list",
                year    : 2016
            };

            aggent
                .get('vacation/attendance')
                .expect(200)
                .query(body)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it("should update vacation", function (done) {
            var body = {
                _id     : id,
                month   : 2,
                year    : 2016,
                vacArray: [null, null, null, null, null, "V", "V", null, "V", null, null, null, "P", null, null, null, "S", null, null
                    , null, null, null, null, null, null, null, null, null, null]
            };

            aggent
                .patch('vacation')
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

        it("should delete vacation", function (done) {
            aggent
                .delete('vacation/' + id)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    if (err) {
                        done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('success');
                    console.log(body.success);

                    done();
                });
        });
    });

    describe("Vacation with user without a license", function () {

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

        it("should fail create vacation", function (done) {
            var body = {
                month   : 2,
                year    : 2016,
                vacArray: [null, null, null, null, null, "V", null, null, "V", null, null, null, null, null, null
                    , null, null, null, null, null, null, null, null, null, null, null, null, null, null]
            };

            aggent
                .post('vacation')
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
                    expect(body.success)
                        .to.have.property('_id');

                    id = body.success._id;

                    done();
                });
        });
    });
});