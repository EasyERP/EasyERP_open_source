var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var CONSTANTS = require('../../constants/constantsTest');
var aggent;
var db = 'vasyadb';

require('../../config/environment/development');

describe('Invoice Specs', function () {
    'use strict';
    this.timeout(10000);

    describe('Proforma with admin', function () {

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

        var quotationBody;
        var proformaId;

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
                    _id : CONSTANTS.DOLLAR,
                    name: 'USD'
                },

                forSales : 'true',
                deliverTo: CONSTANTS.DELIVERTO,
                populate : true,

                paymentInfo: {
                    total  : 500,
                    unTaxed: 500,
                    taxes  : 0
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
                    quotationBody = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(quotationBody)
                        .to.have.property('_id');

                    done();
                });
        });

        it('should create proforma', function (done) {

            var body = {
                forSales   : 'true',
                quotationId: quotationBody._id,
                currency   : quotationBody.currency,
                journal    : CONSTANTS.PROFORMA_JOURNAL
            };

            aggent
                .post('proforma')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('_id');

                    proformaId = body._id;

                    expect(body)
                        .to.have.property('products')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('jobs', CONSTANTS.JOB);
                    expect(body.products[0])
                        .to.have.property('product', CONSTANTS.PRODUCT);
                    expect(body)
                        .to.have.property('groups')
                        .and.to.have.property('owner', CONSTANTS.OWNER);
                    expect(body)
                        .to.have.property('paymentInfo')
                        .and.to.have.property('total', 500);
                    expect(body)
                        .to.have.property('currency')
                        .and.to.have.property('_id', CONSTANTS.DOLLAR);
                    expect(body)
                        .to.have.property('editedBy')
                        .and.to.have.property('date');
                    expect(body)
                        .to.have.property('createdBy')
                        .and.to.have.property('date');

                    done();
                });
        });

        it('should patch proforma', function (done) {
            var body = {
                dueDate : '10 Feb, 2016',
                currency: {
                    _id : CONSTANTS.EURO,
                    name: 'EUR'
                }
            };

            aggent
                .patch('invoices/' + proformaId)
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
                        .to.have.property('dueDate');

                    done();
                });
        });

        it('should fail patch invoice', function (done) {
            var body = {};

            aggent
                .patch('invoices/123cba')
                .send(body)
                .set('type', 'sales')
                .expect(400, done);

        });

        it('should get proforma by id', function (done) {
            var query = {
                id      : proformaId,
                viewType: 'form'
            };

            aggent
                .get('invoices/')
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
                        .to.have.property('_id', proformaId);
                    expect(body)
                        .to.have.property('currency')
                        .and.to.have.property('_id')
                        .and.to.have.property('_id', CONSTANTS.EURO);
                    expect(body)
                        .to.have.property('creationDate');
                    expect(body)
                        .to.have.property('_type', 'Proforma');

                    expect(body)
                        .to.have.property('products')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('jobs')
                        .and.to.have.property('_id', CONSTANTS.JOB);
                    expect(body.products[0])
                        .to.have.property('subTotal', 500);
                    expect(body)
                        .to.have.property('groups')
                        .and.to.have.property('owner')
                        .and.to.have.property('_id', CONSTANTS.OWNER);
                    expect(body)
                        .to.have.property('currency')
                        .and.to.have.property('_id')
                        .and.to.have.property('_id', CONSTANTS.EURO);

                    done();
                });
        });

        it('should approve proforma', function (done) {
            var body = {
                invoiceId  : proformaId,
                invoiceDate: '4 Jul, 2016'
            };

            aggent
                .patch('invoices/approve')
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
                        .to.have.property('approved', true);

                    done();
                });

        });

        it('should get invoices for List', function (done) {
            var query = {
                count   : 100,
                forSales: true,
                viewType: 'list'
            };

            aggent
                .get('proforma/')
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
                    expect(body)
                        .to.have.property('total');

                    first = body.data[0];

                    expect(first)
                        .and.to.have.property('_id')
                        .and.to.have.lengthOf(24);
                    expect(first)
                        .to.have.property('currency');
                    expect(first)
                        .to.have.property('name')
                        .and.to.be.a('string');
                    expect(first)
                        .to.have.property('invoiceDate')
                        .and.to.be.a('string');
                    expect(Date.parse(first.invoiceDate)).to.be.a('number');
                    expect(first)
                        .to.have.property('approved');
                    expect(first)
                        .to.have.property('paymentInfo');
                    expect(first)
                        .to.have.property('removable');
                    expect(first)
                        .to.have.property('workflow')
                        .and.to.have.property('_id');
                    expect(first.workflow)
                        .to.have.property('name')
                        .and.to.be.a('string');
                    expect(first.workflow)
                        .to.have.property('status')
                        .and.to.be.a('string');
                    expect(first)
                        .to.have.property('supplier')
                        .and.to.have.property('name')
                        .and.to.have.property('first')
                        .and.to.be.a('string');
                    if (first.salesPerson) {
                        expect(first)
                            .to.have.property('salesPerson')
                            .and.to.have.property('name')
                            .and.to.have.property('first')
                            .and.to.be.a('string');
                        expect(Object.keys(first.salesPerson).length).to.be.equal(2);
                    }

                    if (first.dueDate) {
                        expect(Date.parse(first.dueDate)).to.be.a('number');
                    }
                    if (first.paymentDate) {
                        expect(Date.parse(first.paymentDate)).to.be.a('number');
                    }

                    expect(Object.keys(first.workflow).length).to.be.equal(3);
                    expect(Object.keys(first).length).to.be.lte(16);

                    done();
                });
        });

        it('should delete proforma bulk', function (done) {
            var body = {
                ids: [proformaId]
            }
            aggent
                .delete('proforma/')
                .send(body)
                .set('type', 'sales')
                .expect(200, done);
        });

        it('should delete quotation', function (done) {
            aggent
                .delete('quotations/' + quotationBody._id)
                .set('type', 'sales')
                .expect(200, done);
        });

    });

    describe('Invoice with user without a license', function () {

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

        it('should fail get Proforma', function (done) {

            aggent
                .get('proforma')
                .expect(403, done);
        });
    });

    describe('Proforma with no authorise', function () {

        it('should fail get Proforma for View', function (done) {

            aggent
                .get('proforma/')
                .expect(404, done);
        });

    });
});
