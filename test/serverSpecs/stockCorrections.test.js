var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;
var CONSTANTS = require('../../constants/constantsTest');

require('../../config/environment/development');

describe('stockCorrections Specs', function () {
    'use strict';

    describe('stockCorrections with admin', function () {
        var id;

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

        it('should get stockCorrections', function (done) {
            var query = {
                viewType   : 'list',
                page       : 1,
                count      : 50,
                contentType: 'stockCorrections'
            };

            aggent
                .get('warehouse/stockCorrection/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body;

                    if (err) {
                        return done(err);
                    }

                    body = res.body;

                    expect(body)
                        .to.be.instanceOf(Object)
                        .to.have.property('data')
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it('should create stockCorrections', function (done) {
            var body = {
                warehouse  : '57dfb16b391780672759a97c',
                location   : '57dfb181391780672759a97e',
                products   : [{
                    product : '57f1f9919d3291200b4d9bd6',
                    adjusted: 10,
                    onHand  : 10
                }, {
                    productAvailable: '',
                    product         : '57ee53a5d156e4323ac631aa',
                    adjusted        : 100,
                    onHand          : 100
                }],
                description: ''
            };

            aggent
                .post('warehouse/stockCorrection/')
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body;

                    if (err) {
                        return done(err);
                    }

                    body = res.body;

                    expect(body)
                        .to.be.instanceOf(Object)
                        .to.have.property('result')
                        .to.be.instanceOf(Object)
                        .to.have.property('_id');

                    id = body.result._id;

                    done();
                });
        });

        it('should get Availability', function (done) {
            var query = {
                location: '57dfb181391780672759a97e',
                product : '57f1f9919d3291200b4d9bd6'
            };

            aggent
                .get('warehouse/getAvailability')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body;

                    if (err) {
                        return done(err);
                    }

                    body = res.body;

                    expect(body)
                        .to.be.instanceOf(Object);

                    done();
                });
        });

        it('should bulk delete stockCorrections', function (done) {
            var body = {
                contentType: 'stockCorrections',
                ids        : [id]
            };

            aggent
                .delete('warehouse/stockCorrection/')
                .send(body)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

    });

    describe('stockCorrections with user without a license', function () {

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

        it('should fail create stockCorrection', function (done) {
            var body = {
                warehouse  : '57dfb16b391780672759a97c',
                location   : '57dfb181391780672759a97e',
                products   : [{
                    product : '57f1f9919d3291200b4d9bd6',
                    adjusted: 10,
                    onHand  : 10
                }, {
                    productAvailable: '',
                    product         : '57ee53a5d156e4323ac631aa',
                    adjusted        : 100,
                    onHand          : 100
                }],
                description: ''
            };

            aggent
                .post('warehouse/stockCorrection/')
                .send(body)
                .expect(403, done);
        });

    });

    describe('stockCorrection with no authorise', function () {
        aggent = request.agent(url);

        it('should fail get stockCorrection for View', function (done) {
            var query = {
                viewType   : 'list',
                page       : 1,
                count      : 50,
                contentType: 'stockCorrections'
            };

            aggent
                .get('warehouse/stockCorrection/')
                .query(query)
                .expect(404, done);
        });

    });

});