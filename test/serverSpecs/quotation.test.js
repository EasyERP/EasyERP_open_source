var request = require('supertest');
var expect = require('chai').expect;
var CONSTANTS = require('../../constants/constantsTest');
var url = 'http://localhost:8089/';
var aggent;
var db = 'vasyadb';
require('../../config/environment/development');

describe('Quotation Specs', function () {
    'use strict';
    var id;

    describe('Quotation with admin', function () {
        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'superAdmin',
                    pass : '111111',
                    dbId : db
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create quotation', function (done) {
            var body = {
                supplier         : CONSTANTS.SUPPLIER,
                project          : CONSTANTS.PROJECT,
                workflow         : CONSTANTS.WORKFLOW,
                supplierReference: null,
                orderDate        : '28 Dec, 2015',
                expectedDate     : 'Mon Dec 28 2015 00:00:00 GMT+0200 (Фінляндія (зима))',
                name             : 'PO',
                invoiceControl   : null,
                invoiceRecived   : false,
                paymentTerm      : null,
                fiscalPosition   : null,
                destination      : null,
                incoterm         : null,

                products: [
                    {
                        product      : CONSTANTS.PRODUCT,
                        unitPrice    : '500',
                        quantity     : '1',
                        scheduledDate: '28 Dec, 2015',
                        taxes        : '0.00',
                        description  : '',
                        subTotal     : '500',
                        jobs         : CONSTANTS.JOB
                    }
                ],

                currency: {
                    _id : CONSTANTS.EURO,
                    name: 'EUR'
                },

                forSales : true,
                deliverTo: CONSTANTS.DELIVERTO,
                populate : true,

                paymentInfo: {
                    total  : '500.00',
                    unTaxed: '500.00',
                    taxes  : '0.00'
                },

                groups: {
                    owner: CONSTANTS.OWNER,
                    users: [],
                    group: []
                },

                whoCanRW: 'everyOne'
            };

            aggent
                .post('quotations')
                .set('type', 'sales')
                .send(body)
                .expect(201)
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
                        .to.have.property('currency')
                        .and.to.be.instanceOf(Object)
                        .and.have.property('rate')
                        .and.to.be.below(1);
                    expect(body)
                        .to.have.property('products');
                    expect(body.products)
                        .to.be.instanceOf(Array);
                    expect(body.products.length)
                        .not.to.be.equal(0);

                    id = body._id;

                    done();
                });
        });

        it('should get quotations by viewType', function (done) {
            var query = {
                page       : 1,
                count      : 4,
                viewType   : 'list',
                contentType: 'salesQuotations',
                forSales   : true
            };

            aggent
                .get('quotations')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var first;

                    if (err) {
                        return done(err);
                    }
                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body.data.length)
                        .to.be.lte(4);
                    expect(body)
                        .to.have.property('total');

                    first = body.data[0];

                    expect(first)
                        .and.to.have.property('_id')
                        .and.to.have.lengthOf(24);
                    expect(first)
                        .and.to.have.property('project');
                    expect(first.project)
                        .to.have.property('name');
                    expect(first)
                        .to.have.property('currency');
                    expect(first)
                        .to.have.property('paymentInfo')
                        .and.to.have.property('total');
                    expect(first)
                        .and.to.have.property('orderDate');
                    expect(first)
                        .and.to.have.property('workflow')
                        .and.to.have.property('_id');
                    expect(first)
                        .and.to.have.property('workflow')
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(first.workflow)
                        .to.have.property('status')
                        .and.to.be.a('string');
                    expect(first)
                        .to.have.property('supplier')
                        .and.to.have.property('name')
                        .and.to.have.property('first')
                        .and.to.be.a('string');
                    if (first.salesManager) {
                        expect(first)
                            .to.have.property('salesManager')
                            .and.to.have.property('name')
                            .and.to.have.property('first')
                            .and.to.be.a('string');
                        expect(Object.keys(first.salesManager).length).to.be.equal(1);
                    }

                    expect(Object.keys(first).length).to.be.lte(11);
                    expect(Object.keys(first.workflow).length).to.be.equal(3);
                    expect(Object.keys(first.paymentInfo).length).to.be.equal(2);
                    expect(Object.keys(first.currency).length).to.be.equal(1);
                    expect(Object.keys(first.project).length).to.be.equal(2);

                    done();
                });
        });

        it('should get quotations filterValues', function (done) {

            aggent
                .get('quotations/getFilterValues')
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
                        .and.to.have.property('Order date');

                    done();
                });
        });

        it('should get quotation by id', function (done) {
            var query = {
                forSales: true,
                viewType: 'form',
                id      : id
            };

            aggent
                .get('quotations/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('_id', id);
                    expect(body)
                        .to.have.property('supplier')
                        .and.to.be.instanceOf(Object)
                        .and.to.have.property('_id', CONSTANTS.SUPPLIER);
                    expect(body)
                        .to.have.property('project')
                        .and.to.be.instanceOf(Object)
                        .and.to.have.property('_id', CONSTANTS.PROJECT);
                    expect(body)
                        .to.have.property('deliverTo')
                        .and.to.be.instanceOf(Object)
                        .and.to.have.property('_id', CONSTANTS.DELIVERTO);
                    expect(body)
                        .to.have.property('groups')
                        .and.to.be.instanceOf(Object)
                        .and.to.have.property('owner')
                        .and.to.have.property('_id', CONSTANTS.OWNER);
                    expect(body)
                        .to.have.property('workflow')
                        .and.to.be.instanceOf(Object)
                        .and.to.have.property('_id', CONSTANTS.WORKFLOW);
                    expect(body)
                        .to.have.property('products')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('product')
                        .and.to.have.property('_id', CONSTANTS.PRODUCT);
                    expect(body.products[0])
                        .to.have.property('jobs')
                        .and.to.have.property('_id', CONSTANTS.JOB);

                    done();
                });
        });

        it('should fail get quotation by id', function (done) {

            aggent
                .get('quotations')
                .query({id: '111', viewType: 'form'})
                .expect(400, done);
        });

        it('should update quotation', function (done) {
            var body = {
                currency: {
                    _id : '565eab29aeb95fa9c0f9df2d',
                    name: 'USD'
                },

                supplier    : '5717873cc6efb4847a5bc78c',
                products    : [{
                    product  : '5540d528dacb551c24000003',
                    unitPrice: 10000,
                    quantity : '1',
                    taxes    : null,
                    subTotal : 10000,
                    jobs     : '57e3bef6c3f192452b44a699'
                }],
                project     : '5747f6df5c66305667bff462',
                expectedDate: '1 Sep, 2016',
                paymentInfo : {
                    total   : 10000,
                    unTaxed : 10000,
                    taxes   : 0,
                    discount: 0
                }
            };

            aggent
                .put('quotations/' + id)
                .send(body)
                .set('type', 'sales')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }
                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('currency')
                        .and.to.have.deep.property('_id._id', CONSTANTS.DOLLAR);

                    done();
                });
        });

        it('should fail update quotation', function (done) {
            var body = {};

            aggent
                .put('quotations/123cba')
                .set('type', 'sales')
                .send(body)
                .expect(500, done);
        });

        it('should create order', function (done) {
            var body = {
                isOrder : true,
                type    : 'Not Invoiced',
                workflow: CONSTANTS.WORKFLOW
            };

            aggent
                .patch('quotations/' + id)
                .send(body)
                .set('type', 'salesOrders')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }
                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('isOrder', true);

                    done();
                });
        });

        it('should fail create order', function (done) {
            var body = {};

            aggent
                .patch('quotations/123cba')
                .set('type', 'salesOrders')
                .send(body)
                .expect(500, done);
        });

        it('should delete quotation', function (done) {
            aggent
                .delete('quotations/' + id)
                .set('type', 'sales')
                .expect(200, done);
        });

        it('should fail delete quotation', function (done) {
            aggent
                .delete('quotations/123cba')
                .set('type', 'sales')
                .expect(500, done);
        });

    });

    describe('Quotation with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass : 'thinkmobiles2015',
                    dbId : db
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create quotation', function (done) {
            var body = {
                supplier         : CONSTANTS.SUPPLIER,
                project          : CONSTANTS.PROJECT,
                workflow         : CONSTANTS.WORKFLOW,
                supplierReference: null,
                orderDate        : '28 Dec, 2015',
                expectedDate     : 'Mon Dec 28 2015 00:00:00 GMT+0200 (Фінляндія (зима))',
                name             : 'PO',
                invoiceControl   : null,
                invoiceRecived   : false,
                paymentTerm      : null,
                fiscalPosition   : null,
                destination      : null,
                incoterm         : null,
                products         : [
                    {
                        product      : CONSTANTS.PRODUCT,
                        unitPrice    : '500',
                        quantity     : '1',
                        scheduledDate: '28 Dec, 2015',
                        taxes        : '0.00',
                        description  : '',
                        subTotal     : '500',
                        jobs         : CONSTANTS.JOB
                    }
                ],

                currency: {
                    _id : CONSTANTS.EURO,
                    name: 'EUR'
                },

                forSales : true,
                deliverTo: CONSTANTS.DELIVERTO,
                populate : true,

                paymentInfo: {
                    total  : '500.00',
                    unTaxed: '500.00',
                    taxes  : '0.00'
                },

                groups: {
                    owner: CONSTANTS.OWNER,
                    users: [],
                    group: []
                },

                whoCanRW: 'everyOne'
            };

            aggent
                .post('quotations')
                .set('type', 'sales')
                .send(body)
                .expect(403, done);
        });
    });

    describe('Quotation with no authorise', function () {

        it('should fail get Quotation for View', function (done) {
            var query = {
                viewType: 'list'
            };

            aggent
                .get('quotations')
                .query(query)
                .expect(404, done);
        });

    });
});

