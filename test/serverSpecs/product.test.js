var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/development');

describe('Product Specs', function () {
    'use strict';

    describe('Product with admin', function () {
        var id;

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass : 'tm2016',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create Product', function (done) {
            var body = {
                'accounting'    : {
                    'category': {
                        'name': 'All',
                        '_id' : '564591f9624e48551dfe3b23'
                    }
                },
                'canBeExpensed' : true,
                'canBePurchased': true,
                'canBeSold'     : false,
                'groups'        : {
                    'group': [],
                    'owner': '560c099da5d4a2e20ba5068b',
                    'users': []
                },
                'info'          : {
                    'barcode'    : '543345',
                    'description': 'New testProduct',
                    'isActive'   : true,
                    'productType': 'Service',
                    'salePrice'  : '123'
                },
                'name'          : 'TestProduct',
                'whoCanRW'      : 'everyOne'
            };

            aggent
                .post('product')
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

        it('should fail create Product', function (done) {
            var body = {};

            aggent
                .post('product')
                .send(body)
                .expect(400, done);
        });

        it('should patch Product', function (done) {
            var body = {
                'canBeExpensed' : false,
                'canBePurchased': false,
                'canBeSold'     : true,
                'name'          : 'TestProduct1',
                'info'          : {
                    'barcode'    : '543345',
                    'description': 'New testProduct1',
                    'isActive'   : true,
                    'productType': 'Product',
                    'salePrice'  : '123'
                }
            };

            aggent
                .patch('product/' + id)
                .send(body)
                .expect(200, done);
        });

        it('should fail patch product', function (done) {
            var body = {};

            aggent
                .patch('product/123cba')
                .send(body)
                .expect(500, done);

        });

        it('should get products Alphabet', function (done) {

            aggent
                .get('product/getProductsAlphabet')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    done();
                });
        });

        it('should get products all', function (done) {
            var query = {
                canBeSold: true
            };

            aggent
                .get('product')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('success')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('canBeSold', true);

                    done();
                });
        });

        it('should get products images', function (done) {

            aggent
                .get('product/getProductsImages')
                .query({'ids[0]': id})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('imageSrc');

                    done();
                });
        });

        // todo exportToXlsx test

        // todo exportToCsv test

        it('should get productsType for Dd', function (done) {

            aggent
                .get('product/getProductsTypeForDd')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('_id');

                    done();
                });
        });

        it('should get products totalCollectionLength', function (done) {
            var query = {
                filter: {
                    canBeSold: {
                        key: 'canBeSold'
                    }
                }
            };

            aggent
                .get('product/totalCollectionLength')
                .query(query)
                .query({'filter[canBeSold][value][0]': true})
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

        it('should get product by id', function (done) {
            var query = {
                id: id
            };

            aggent
                .get('product/')
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
                        .to.have.property('_id')
                        .and.to.be.equal(id);

                    done();
                });
        });

        it('should fail get product by id', function (done) {
            var query = {
                id: '123cba'
            };

            aggent
                .get('product/')
                .query(query)
                .expect(400, done);

        });

        it('should get products for list', function (done) {
            var query = {
                contentType: 'Product',
                count      : '1',

                filter: {
                    productType: {
                        key  : 'info.productType',
                        value: ['Product', '']

                    },

                    canBeSold: {
                        key  : 'canBeSold',
                        value: ['true', '']
                    }
                },

                page    : '1',
                viewType: 'list'
            };

            aggent
                .get('product/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]');
                    expect(body.data.length)
                        .to.be.equal(1);
                    expect(body.data[0])
                        .to.have.property('canBeSold', true);
                    expect(body.data[0])
                        .to.have.property('info')
                        .and.to.have.property('productType', 'Product');
                    expect(body)
                        .and.to.have.property('total');

                    done();
                });
        });

        it('should delete product', function (done) {
            aggent
                .delete('product/' + id)
                .expect(200, done);
        });

        it('should fail delete product', function (done) {
            aggent
                .delete('product/123cba')
                .expect(500, done);
        });

    });

    describe('Product with user without a license', function () {

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

        it('should fail create Product', function (done) {

            var body = {
                'accounting'    : {
                    'category': {
                        'name': 'All',
                        '_id' : '564591f9624e48551dfe3b23'
                    }
                },
                'canBeExpensed' : true,
                'canBePurchased': true,
                'canBeSold'     : true,
                'groups'        : {
                    'group': [],
                    'owner': '560c099da5d4a2e20ba5068b',
                    'users': []
                },
                'info'          : {
                    'barcode'    : '543345',
                    'description': 'New testProduct',
                    'isActive'   : true,
                    'productType': 'Stock',
                    'salePrice'  : '123'
                },
                'name'          : 'TestProduct',
                'whoCanRW'      : 'everyOne'
            };

            aggent
                .post('product')
                .send(body)
                .expect(403, done);
        });
    });

    describe('Product with no authorise', function () {

        it('should fail get Product for View', function (done) {

            aggent
                .get('product/')
                .expect(404, done);
        });

    });

});

