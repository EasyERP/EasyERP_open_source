require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("MonthHours Specs", function () {
    describe('MonthHours with admin', function () {
        var id;
        var month;
        var year;

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass : 'tm2016',
                    dbId : 'pavlodb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should create monthHours", function (done) {
            var body = {
                "fixedExpense"      : 30,
                "expenseCoefficient": 5,
                "year"              : 2015,
                "hours"             : 172,
                "month"             : 8
            };

            aggent
                .post('monthHours')
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
                        .to.have.property('month');
                    expect(body)
                        .to.have.property('year');

                    id = body._id;
                    month = body.month;
                    year = body.year;

                    done();
                });
        });

        it("should fail create monthHours", function (done) {
            var body = "";

            aggent
                .post('monthHours')
                .send(body)
                .expect(404, done);
        });

        it("should patch monthHours", function (done) {
            var body = [{
                "_id"               : id,
                "fixedExpense"      : 40,
                "expenseCoefficient": 2.5
            }];

            aggent
                .patch('monthHours')
                .send(body)
                .expect(200, done);

        });

        it("should fail patch monthHours", function (done) {
            var body = [{
                "_id": "123cba"
            }];

            aggent
                .patch('monthHours')
                .send(body)
                .expect(500, done);
        });

        it("should get monthHours", function (done) {

            aggent
                .get('monthHours/list')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body.length)
                        .to.be.gte(1);

                    done();
                });
        });

        it("should get monthHours length", function (done) {

            aggent
                .get('monthHours/list/totalCollectionLength')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('count')
                        .and.to.be.gte(1);

                    done();
                });
        });

        it("should get monthHours by month&year", function (done) {
            var query = {
                month: month,
                year : year
            };

            aggent
                .get('monthHours/list')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('month', month);
                    expect(body[0])
                        .to.have.property('year', year);

                    done();
                });
        });

        it("should fail get monthHours by month&year", function (done) {
            var query = {
                month: 13
            };

            aggent
                .get('monthHours/list')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array);
                    expect(body.length)
                        .to.be.equal(0);

                    done();
                });
        });

        it("should delete monthHours", function (done) {
            aggent
                .delete('monthHours/' + id)
                .expect(200, done);
        });

        it("should fail delete monthHours", function (done) {
            aggent
                .delete('monthHours/123cba')
                .expect(500, done);
        });
    });

    describe('MonthHours with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass : 'thinkmobiles2015',
                    dbId : 'pavlodb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should fail create MonthHours", function (done) {

            var body = {
                "fixedExpense"      : 30,
                "expenseCoefficient": 5,
                "year"              : 2015,
                "hours"             : 172,
                "month"             : 8
            };

            aggent
                .post('monthHours')
                .send(body)
                .expect(403, done);
        });
    });


    describe('MonthHours with no authorise', function () {

        it("should fail get MonthHours for View", function (done) {

            aggent
                .get('monthHours/list')
                .expect(404, done);
        });

    });
});



