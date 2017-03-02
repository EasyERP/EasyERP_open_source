var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;
var CONSTANTS = require('../../constants/constantsTest');

require('../../config/environment/development');

describe('Goods-out notes Specs', function () {
    'use strict';

    describe('Goods-out notes with admin', function () {
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

        it('should get Goods-out notes', function (done) {
            var query = {
                viewType   : 'list',
                page       : 1,
                count      : 50,
                contentType: 'goodsOutNotes'
            };

            aggent
                .get('goodsOutNotes')
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

                    expect(body)
                        .to.have.property('total', body.data.length);

                    done();
                });
        });

        it('should create Goods-out note', function (done) {
            var body = {
                name     : 'SO_228',
                order    : CONSTANTS.ORDER,
                orderRows: [{orderRowId: CONSTANTS.ORDER_ROW, quantity: 1}],
                warehouse: CONSTANTS.WAREHAUSE
            };

            aggent
                .post('goodsOutNotes')
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
                        .to.have.property('success')
                        .to.be.instanceOf(Object)
                        .to.have.property('_id');

                    id = body.success._id;

                    done();
                });
        });

        it('should get Goods-out note', function (done) {

            aggent
                .get('goodsOutNotes/' + id)
                .expect(200)
                .end(function (err, res) {
                    var body;

                    if (err) {
                        return done(err);
                    }

                    body = res.body;

                    expect(body)
                        .to.be.instanceOf(Object)
                        .to.have.property('_id', id);

                    done();
                });
        });

        it('should update Goods-out note', function (done) {
            var body = {
                reference      : 'New',
                'status.packed': true
            };

            aggent
                .patch('goodsOutNotes/' + id)
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
                        .to.have.property('status')
                        .to.be.instanceOf(Object);

                    done();
                });
        });

        it('should bulk delete Goods-out notes', function (done) {
            var body = {
                contentType: 'goodsOutNotes',
                ids        : [id]
            };

            aggent
                .delete('goodsOutNotes')
                .send(body)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

    });

});