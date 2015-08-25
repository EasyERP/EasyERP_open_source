/**
 * Created by Roman on 24.08.2015.
 */
require('../config/development');

var request = require('supertest');
var expect = require('chai').expect;

var host = process.env.HOST;
var url;
var aggent;
var queryString = '?week=29&year=2015';

describe("BDD for revenue", function () {  // Runs once before all tests start.
    before(function (done) {
        aggent = request.agent(host);

        aggent
            .post('login')
            .send({
                login: 'admin',
                pass: '1q2w3eQWE',
                dbId: 'weTrack'
            })
            .expect(200, done);
    });

    after(function () {
        url = null;
        agent = null;
    });

    it("bySales should return array result", function (done) {
        aggent
            .get('revenue/bySales')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("byDepartment should return array result", function (done) {
        aggent
            .get('revenue/byDepartment')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("paidwtrack should return array result", function (done) {
        aggent
            .get('revenue/paidwtrack')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("unpaidwtrack should return array result", function (done) {
        aggent
            .get('revenue/unpaidwtrack')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("cancelledWtrack should return array result", function (done) {
        aggent
            .get('revenue/cancelledWtrack')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("projectBySales should return array result", function (done) {
        aggent
            .get('revenue/projectBySales')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("employeeBySales should return array result", function (done) {
        aggent
            .get('revenue/employeeBySales')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("hoursByDep should return array result", function (done) {
        aggent
            .get('revenue/hoursByDep')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("allBonus should return array result", function (done) {
        aggent
            .get('revenue/allBonus')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                done();
            });

    });

    it("totalHours should return array result", function (done) {
        aggent
            .get('revenue/totalHours' + queryString)
            .send()
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Array);
                expect(body.length).to.be.least(1);
                done();
            });

    });


});
