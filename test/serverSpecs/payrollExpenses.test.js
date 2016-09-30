var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('PayrollExpenses Specs', function () {
    'use strict';
    var year = 2016;
    var month = 5;

    describe('PayrollExpenses with admin', function () {
        var id;
        var dateKey;

        this.timeout(10000);

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

        it('should generate PayrollExpenses', function (done) { // long query
            var body = {
                month: month,
                year : year
            };

            dateKey = (year * 100 + month).toString();

            aggent
                .post('payroll/generate')
                .send(body)
                .expect(200, done);
        });

        it('should fail generate PayrollExpenses', function (done) {
            var body = {};

            aggent
                .post('payroll/generate')
                .send(body)
                .expect(400, done);
        });

        it('should get PayrollExpenses', function (done) {
            var query = {
                viewType: 'list'
            };

            aggent
                .get('payroll/')
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
                        .to.have.property('total')
                        .to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]');

                    done();
                });
        });

        it('should create Payroll', function (done) {

            var body = {
                dataKey: dateKey,
                type   : {
                    _id : '5645920f624e48551dfe3b25',
                    name: ''
                },

                month   : month,
                year    : year,
                diff    : -200,
                paid    : 0,
                calc    : 200,
                employee: {
                    name: '',
                    _id : '55b92ad221e4b7c40f000031'
                }
            };

            aggent
                .post('payroll')
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

                    id = body._id;

                    done();
                });
        });

        it('should fail create Payroll', function (done) {
            var body = {};

            aggent
                .post('payroll')
                .send(body)
                .expect(400, done);
        });

        it('should patch PayrollExpenses', function (done) {
            var body = {};
            body[dateKey] = {
                date  : 'Sat Feb 20 2016 00:00:00 GMT+0200 (EET)',
                status: true
            };

            aggent
                .patch('payroll/byDataKey')
                .send(body)
                .expect(200, done);
        });

        it('should fail patch PayrollExpenses', function (done) {
            var body = ['123cba'];

            aggent
                .patch('payroll/byDataKey')
                .send(body)
                .expect(500, done);
        });

        it('should get Payrolls by dateKey', function (done) {

            aggent
                .get('payroll/')
                .query({id: dateKey})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array);
                    expect(body)
                        .to.have.deep.property('[0]')
                        .and.to.have.property('_id');

                    done();
                });
        });

        it('should fail get Payrolls by dateKey', function (done) {

            aggent
                .get('payroll')
                .query({id: '12345'})
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

        it('should get Payrolls sorted', function (done) {
            var query = {
                sort: {
                    calc: -1
                },

                id: dateKey
            };

            aggent
                .get('payroll')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array);

                    /* expect(body[0].calc) // test sorting
                     .to.be.gte(body[1].calc);*/

                    done();
                });
        });

        it('should patch Payrolls', function (done) {
            var body = [{
                _id : id,
                diff: -300,
                paid: 0,
                calc: 300
            }];

            aggent
                .patch('payroll')
                .send(body)
                .expect(200, done);
        });

        it('should fail patch Payrolls', function (done) {
            var body = [{
                _id: '123cba'
            }];

            aggent
                .patch('payroll')
                .send(body)
                .expect(500, done);
        });

        it('should patch Payroll', function (done) {
            var body = {
                diff: -500,
                paid: 0,
                calc: 500,
                type: '564592fbabb1c35728ad7d0f'
            };

            aggent
                .patch('payroll/' + id)
                .send(body)
                .expect(200, done);
        });

        it('should fail patch Payroll', function (done) {
            var body = {};

            aggent
                .patch('payroll/123cba')
                .send(body)
                .expect(500, done);
        });

        it('should delete Payroll', function (done) {
            aggent
                .delete('payroll/' + id)
                .expect(200, done);
        });

        it('should fail delete Payroll', function (done) {
            aggent
                .delete('payroll/123cba')
                .expect(500, done);
        });

        it('should delete PayrollExpenses', function (done) {
            var body = {
                dataKeys: [dateKey]
            };
            aggent
                .delete('payroll/byDataKey')
                .send(body)
                .expect(200, done);
        });

        it('should fail delete PayrollExpenses', function (done) {
            var body = {};
            aggent
                .delete('payroll/byDataKey')
                .send(body)
                .expect(400, done);
        });
    });

    describe('PayrollExpenses with user without a license', function () {

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

        it('should fail create Payroll', function (done) {

            var body = {
                dataKey: '201605',
                type   : {
                    _id : '5645920f624e48551dfe3b25',
                    name: ''
                },

                month   : year,
                year    : month,
                diff    : -200,
                paid    : 0,
                calc    : 200,
                employee: {
                    name: '',
                    _id : '55b92ad221e4b7c40f000031'
                }
            };

            aggent
                .post('payroll')
                .send(body)
                .expect(403, done);
        });
    });

    describe('PayrollExpenses with no authorise', function () {

        it('should fail get PayrollExpenses', function (done) {

            aggent
                .get('payroll/')
                .expect(404, done);
        });

    });
});

