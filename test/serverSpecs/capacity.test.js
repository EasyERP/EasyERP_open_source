var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var CONSTANTS = require('../../constants/constantsTest');
var aggent;


require('../../config/environment/development');

describe('Capacity Specs', function () {
    'use strict';

    describe('Capacity with admin', function () {
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

        describe('Creating capacity', function () {
            var id;

            it('should create Capacity', function (done) {
                var capacityArray = [null, 8, 8, 8, 8, 8, null, null, 8, 8, 8, 8, 8, null, null, 8, 8, 8, 8, 8, null, null, 8, 8, 8, 8, 8, null];
                var body = {
                    capacityArray     : capacityArray,
                    capacityMonthTotal: 160,
                    daysCount         : 28,
                    department        : {
                        name: 'iOS',
                        _id : CONSTANTS.DEPARTMENT
                    },

                    employee: {
                        name: 'Alex Gleba',
                        _id : CONSTANTS.EMPLOYEE
                    },

                    month: '2',
                    year : '2016'
                };

                aggent
                    .post('capacity')
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

            it('should patch Capacity bulk', function (done) {
                var capacityArray = [null, 5, 2, 12, 8, 8, null, null, 8, 8, 8, 8, 8, null, null, 8, 8, 8, 8, 8, null, null, 8, 8, 7, 3, 8, null];
                var body = [{
                    _id               : id,
                    capacityArray     : capacityArray,
                    capacityMonthTotal: 149,
                    month             : '3',
                    year              : '2017'
                }];

                aggent
                    .patch('capacity')
                    .send(body)
                    .expect(200, done);
            });

            it('should patch Capacity bulk', function (done) {
                var capacityArray = [null, 5, 2, 12, 8, 8, null, null, 8, 8, 8, 8, 8, null, null, 8, 8, 8, 8, 8, null, null, 8, 8, 7, 3, 8, null];
                var body = [{
                    _id               : '123cba',
                    capacityArray     : capacityArray,
                    capacityMonthTotal: 149,
                    month             : '3',
                    year              : '2017'
                }];

                aggent
                    .patch('capacity')
                    .send(body)
                    .expect(500, done);
            });

            it('should patch Capacity', function (done) {
                var capacityArray = [null, 5, 2, 8, 8, 8, null, null, 7, 8, 8, 8, 8, null, null, 7, 8, 8, 8, 8, null, null, 7, 8, 7, 3, 8, null];
                var body = {
                    capacityArray     : capacityArray,
                    capacityMonthTotal: 142,
                    month             : '4',
                    year              : '2017'
                };

                aggent
                    .patch('capacity/' + id)
                    .send(body)
                    .expect(200, done);
            });

            it('should patch Capacity', function (done) {
                var capacityArray = [null, 5, 2, 8, 8, 8, null, null, 7, 8, 8, 8, 8, null, null, 7, 8, 8, 8, 8, null, null, 7, 8, 7, 3, 8, null];
                var body = {
                    capacityArray     : capacityArray,
                    capacityMonthTotal: 142,
                    month             : '4',
                    year              : '2017'
                };

                aggent
                    .patch('capacity/123cba')
                    .send(body)
                    .expect(500, done);
            });

            it('should get Capacity Expenses', function (done) {
                var query = {
                    month   : '4',
                    year    : '2017',
                    viewType: 'list'
                };

                aggent
                    .get('capacity/')
                    .query(query)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('capacityObject')
                            .and.to.have.property('iOS')
                            .and.to.have.deep.property('0')
                            .and.to.have.property('_id');

                        done();
                    });
            });

            it('should delete Capacity', function (done) {
                aggent
                    .delete('capacity/' + id)
                    .expect(200, done);
            });

            it('should fail delete Capacity', function (done) {
                aggent
                    .delete('category/123cba')
                    .expect(500, done);
            });
        });

        /*  describe('Generating Capacities', function () {

         it('should generate Capacities for 2014, 2015', function (done) {
         aggent
         .post('capacity/create')
         .expect(200, done);
         });
         });*/

    });

    describe('Capacity with user without a license', function () {

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

        it('should fail get Capacities', function (done) {

            aggent
                .get('capacity/')
                .expect(403, done);
        });
    });

    describe('Capacity with no authorise', function () {

        it('should fail get Capacities', function (done) {

            aggent
                .get('capacity/')
                .expect(404, done);
        });

    });

});

