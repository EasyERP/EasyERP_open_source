var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('MonthHours Specs', function () {
    describe('MonthHours with admin', function () {
        var id;
        var month;
        var year;

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'superAdmin',
                    pass : '111111',
                    dbId : 'vasyadb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create monthHours', function (done) {
            var body = {
                actualHours       : 4937,
                adminBudget       : 8435,
                adminSalaryBudget : 2200,
                dateByMonth       : 201410,
                estimatedHours    : 0,
                expenseCoefficient: 1.2,
                fixedExpense      : 40,
                hours             : 184,
                idleBudget        : 17439.67,
                month             : 10,
                overheadRate      : 5.992615652878442,
                vacationBudget    : 1510.87,
                year              : 2014
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

        it('should fail create monthHours', function (done) {
            var body = {};

            aggent
                .post('monthHours')
                .send(body)
                .expect(404, done);
        });

        it('should patch monthHours', function (done) {
            var body = [{
                _id               : id,
                fixedExpense      : 40,
                expenseCoefficient: 2.5
            }];

            aggent
                .patch('monthHours')
                .send(body)
                .expect(200, done);

        });

        it('should fail patch monthHours', function (done) {
            var body = [{
                _id: '123cba'
            }];

            aggent
                .patch('monthHours')
                .send(body)
                .expect(500, done);
        });

        it('should get monthHours', function (done) {

            aggent
                .get('monthHours/')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('data');
                    expect(body)
                        .to.have.property('total');

                    done();
                });
        });

        it('should get monthHours by month&year', function (done) {
            var query = {
                month: month,
                year : year
            };

            aggent
                .get('monthHours/')
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

        it('should fail get monthHours by month&year', function (done) {
            var query = {
                month: 13
            };

            aggent
                .get('monthHours/')
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

        it('should delete monthHours', function (done) {
            aggent
                .delete('monthHours/' + id)
                .expect(200, done);
        });

        it('should fail delete monthHours', function (done) {
            aggent
                .delete('monthHours/123cba')
                .expect(404, done);
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
                    dbId : 'vasyadb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create MonthHours', function (done) {

            var body = {
                fixedExpense      : 30,
                expenseCoefficient: 5,
                year              : 2015,
                hours             : 172,
                month             : 8
            };

            aggent
                .post('monthHours')
                .send(body)
                .expect(403, done);
        });
    });

    describe('MonthHours with no authorise', function () {

        it('should fail get MonthHours for View', function (done) {

            aggent
                .get('monthHours/')
                .expect(404, done);
        });

    });
});



