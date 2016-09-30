var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

require('../../config/environment/development');

describe('BonusType Specs', function () {
    'use strict';

    describe('chartOfAccount with admin', function () {
        var id;

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

        it('should create chartOfAccount', function (done) {
            var body = {
                account: 'TestBank',
                code   : 100001,
                type   : '57da4d62713d3fe825f074b3'
            };

            aggent
                .post('chartOfAccount')
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
                        .to.have.property('success')
                        .and.to.have.property('_id');

                    id = body.success._id;

                    done();
                });
        });

        it('should fail create chartOfAccount', function (done) {
            var body = {};

            aggent
                .post('chartOfAccount')
                .send(body)
                .expect(400, done);
        });

        it("should patch chartOfAccount's", function (done) {
            var body = [{
                _id    : id,
                account: 'BankTest',
                code   : 100002,
                type   : '57da4d62713d3fe825f074b5'
            }];

            aggent
                .patch('chartOfAccount')
                .send(body)
                .expect(200, done);
        });

        it('should fail patch chartOfAccount', function (done) {
            var body = [{
                '_id': '123cba'
            }];

            aggent
                .patch('chartOfAccount')
                .send(body)
                .expect(500, done);

        });

        it('should get chartOfAccount with options', function (done) {
            var query = {
                sort: {
                    account: -1
                }
            };

            aggent
                .get('chartOfAccount')
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
                        .to.have.property('total');

                    done();
                });
        });

        it('should get chartOfAccount for Dd', function (done) {

            aggent
                .get('chartOfAccount/getForDd')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]');

                    done();
                });
        });

        it('should delete chartOfAccount', function (done) {
            aggent
                .delete('chartOfAccount/' + id)
                .expect(200, done);
        });

        it('should fail delete chartOfAccount', function (done) {
            aggent
                .delete('chartOfAccount/123cba')
                .expect(500, done);
        });

    });

    describe('chartOfAccount with user without a license', function () {

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

        it('should fail create chartOfAccount', function (done) {

            var body = {
                'account': 'TestBank',
                'code'   : 100001,
                'type'   : 'Bank and Cash'
            };

            aggent
                .post('chartOfAccount')
                .send(body)
                .expect(403, done);
        });
    });

    describe('chartOfAccount with no authorise', function () {

        it('should fail get chartOfAccount for Dd', function (done) {

            aggent
                .get('chartOfAccount/getForDD')
                .expect(404, done);
        });

    });

});

