var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;
var CONSTANTS = require('../../constants/constantsTest');

require('../../config/environment/development');

describe('Warehouses Specs', function () {
    'use strict';

    describe('Warehouses with admin', function () {
        var id;
        var locationId;
        var zoneId;

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

        it('should create Warehouse', function (done) {
            var body = {
                address: {
                    street : '',
                    city   : '',
                    state  : '',
                    zip    : '',
                    country: 'Afghanistan'
                },

                name : 'New warehouse',
                isOwn: true,
                main : false
            };

            aggent
                .post('warehouse')
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
                        .to.have.property('_id');
                    expect(body)
                        .to.have.property('name');

                    id = body._id;

                    done();
                });
        });

        it('should create Zone', function (done) {
            var body = {
                name     : 'New zone',
                warehouse: id
            };

            aggent
                .post('warehouse/zone')
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
                        .to.have.property('_id');
                    expect(body)
                        .to.have.property('name');

                    zoneId = body._id;

                    done();
                });
        });

        it('should create Location', function (done) {
            var body = {
                warehouse: id,
                zone     : zoneId,
                name     : 'a.b.c',
                groupingA: 'a',
                groupingB: 'b',
                groupingC: 'c',
                groupingD: null
            };

            aggent
                .post('warehouse/location')
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
                        .to.have.property('_id');
                    expect(body)
                        .to.have.property('name');

                    locationId = body._id;

                    done();
                });
        });

        it('should update Warehouse', function (done) {
            var body = {
                'address.city': 'Chop'
            };

            aggent
                .patch('warehouse/' + id)
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
                        .to.have.property('data')
                        .to.be.instanceOf(Object);
                    expect(body.data)
                        .to.have.property('_id');

                    done();
                });
        });

        it('should update Zone', function (done) {
            var body = {
                name: 'Zone(updated)'
            };

            aggent
                .patch('warehouse/zone/' + zoneId)
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
                        .to.have.property('data')
                        .to.be.instanceOf(Object);
                    expect(body.data)
                        .to.have.property('_id');

                    done();
                });
        });

        it('should update Location', function (done) {
            var body = {
                zone: zoneId
            };

            aggent
                .patch('warehouse/location/' + locationId)
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
                        .to.have.property('data')
                        .to.be.instanceOf(Object);
                    expect(body.data)
                        .to.have.property('_id');

                    done();
                });
        });

        it('should get Warehouses', function (done) {
            var query = {
                page : 1,
                count: 50
            };

            aggent
                .get('warehouse')
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

        it('should get getHierarchyWarehouse', function (done) {

            aggent
                .get('warehouse/getHierarchyWarehouse')
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

        it('should get warehouses forDd', function (done) {

            aggent
                .get('warehouse/getForDD')
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

        it('should get warehouseZones forDd', function (done) {

            aggent
                .get('warehouse/zone/getForDD')
                .query({warehouse: id})
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

        it('should get warehouseLocations forDd', function (done) {

            aggent
                .get('warehouse/location/getForDD')
                .query({warehouse: id})
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

        it('should delete Warehouse', function (done) {

            aggent
                .delete('warehouse/' + id)
                .expect(200, done);
        });

        it('should delete Location', function (done) {

            aggent
                .delete('warehouse/location/' + locationId)
                .expect(200, done);
        });

        it('should delete Zone', function (done) {

            aggent
                .delete('warehouse/zone/' + zoneId)
                .expect(200, done);
        });

    });

    describe('Warehouses with user without a license', function () {

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

        it('should fail create Warehouse', function (done) {
            var body = {
                address: {
                    street : '',
                    city   : '',
                    state  : '',
                    zip    : '',
                    country: 'Afghanistan'
                },

                name : 'New warehouse',
                isOwn: true,
                main : false
            };

            aggent
                .post('warehouse')
                .send(body)
                .expect(403, done);
        });

    });

    describe('Warehouses with no authorise', function () {
        aggent = request.agent(url);

        it('should fail create Warehouses', function (done) {
            var body = {
                address: {
                    street : '',
                    city   : '',
                    state  : '',
                    zip    : '',
                    country: 'Afghanistan'
                },

                name : 'New warehouse',
                isOwn: true,
                main : false
            };

            aggent
                .post('warehouse')
                .send(body)
                .expect(404, done);
        });

    });

});