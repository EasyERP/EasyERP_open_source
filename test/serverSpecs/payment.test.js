require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var CONSTANTS = require('../../constants/constantsTest');
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe('Payment Specs', function () {
    'use strict';

    describe('Payment with admin', function () {

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

        describe('Salary payOut Specs', function () {
            var id;
            var payrollBody;

            it('should create payroll', function (done) {
                var dateKey = '201605';
                var body = {
                    dataKey : dateKey,
                    type    : {
                        _id : CONSTANTS.PAYMENTTYPE,
                        name: ''
                    },
                    month   : 5,
                    year    : 2016,
                    diff    : -200,
                    paid    : 0,
                    calc    : 200,
                    employee: {
                        name: '',
                        _id : CONSTANTS.EMPLOYEE
                    }
                };

                aggent
                    .post('payroll')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        payrollBody = res.body;

                        if (err) {
                            return done(err);
                        }
                        done();
                    });
            });

            it('should create salary payOut', function (done) {

                var body = [{
                    date            : new Date(),
                    invoice         : null,
                    invoiced        : 0,
                    paidAmount      : payrollBody.diff * (-1),
                    workflow        : 'Draft',
                    differenceAmount: 0,
                    month           : payrollBody.month,
                    year            : payrollBody.year,
                    supplier        : {_id: payrollBody.employee},
                    paymentMethod   : {_id: payrollBody.type},
                    period          : payrollBody.year + '-' + payrollBody.month + '-01',
                    paymentRef      : payrollBody._id
                }];

                aggent
                    .post('payment/salary')
                    .send(body)
                    .expect(201)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('success');
                        /* .and.to.have.property('supplier')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('paidAmount', payrollBody.calc);
                    expect(body.success.supplier[0])
                        .to.have.property('_id', CONSTANTS.EMPLOYEE);

                    expect(body.success)
                        .to.have.property('currency')
                        .and.to.have.property('rate');
*/
                    id = body.success._id;

                        done();
                    });
            });

            it('should fail create salary payOut', function (done) {
                var body = {};

                aggent
                    .post('payment/salary')
                    .send(body)
                    .expect(400, done);
            });

            it('should patch salary Payout', function (done) {

                var body = [{
                    _id     : id,
                    date    : new Date(),
                    workflow: 'Done',
                    month   : 12,
                    year    : 2016,
                    period  : '2016-12-01'
                }];

                aggent
                    .patch('payment/salary')
                    .send(body)
                    .expect(200, done);
            });

            it('should fail patch salary payOut', function (done) {

                var body = [{
                    _id: '123cba'
                }];

                aggent
                    .patch('payment/salary')
                    .send(body)
                    .expect(400, done);
            });

            it('should get salary payOut by id', function (done) {

                aggent
                    .get('payment/')
                    .query({id: id, viewType: 'form'})
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('success');
                           // .and.to.have.property('_id', id);
                        expect(body.success)
                            .to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0]')
                            .and.to.have.property('_id', CONSTANTS.EMPLOYEE);

                        done();
                    });
            });

            it('should fail get payment by id', function (done) {

                aggent
                    .get('payment')
                    .query({id: '123', viewType: 'form'})
                    .expect(500, done);
            });

            it('should get payments by viewType', function (done) {
                var query = {
                    count   : 100,
                    viewType: 'list',
                    contentType: 'SalaryPayment'
                };

                aggent
                    .get('payment/')
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

            it('should delete salary payment', function (done) {
                aggent
                    .delete('payment/' + id)
                    .set('type', 'salary')
                    .expect(200, done);
            });

            it('should delete Payroll', function (done) {
                aggent
                    .delete('payroll/' + payrollBody._id)
                    .expect(200, done);
            });

        });

        describe('Sales Payment Specs', function () {
            var paymentId;
            var quotationBody;
            var invoiceBody;

            it('should create quotation', function (done) {
                var body = {
                    'supplier'         : CONSTANTS.SUPPLIER,
                    'project'          : CONSTANTS.PROJECT,
                    'workflow'         : CONSTANTS.WORKFLOW,
                    'supplierReference': null,
                    'orderDate'        : '28 Dec, 2015',
                    'expectedDate'     : 'Mon Dec 28 2015 00:00:00 GMT+0200 (Фінляндія (зима))',
                    'name'             : 'PO',
                    'invoiceControl'   : null,
                    'invoiceRecived'   : false,
                    'paymentTerm'      : null,
                    'fiscalPosition'   : null,
                    'destination'      : null,
                    'incoterm'         : null,
                    'products'         : [
                        {
                            'product'      : CONSTANTS.PRODUCT,
                            'unitPrice'    : '500',
                            'quantity'     : '1',
                            'scheduledDate': '28 Dec, 2015',
                            'taxes'        : '0.00',
                            'description'  : '',
                            'subTotal'     : '500',
                            'jobs'         : CONSTANTS.JOB
                        }
                    ],
                    'currency'         : {
                        _id : CONSTANTS.DOLLAR,
                        name: 'USD'
                    },
                    'forSales'         : 'true',
                    'deliverTo'        : CONSTANTS.DELIVERTO,
                    'populate'         : true,
                    'paymentInfo'      : {
                        'total'  : '500',
                        'unTaxed': '500',
                        'taxes'  : '0'
                    },
                    'groups'           : {
                        'owner': CONSTANTS.OWNER,
                        'users': [],
                        'group': []
                    },
                    'whoCanRW'         : 'everyOne'
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

            it('should create order', function (done) {
                var body = {
                    isOrder : true,
                    type    : 'Not Invoiced',
                    workflow: quotationBody.workflow
                };

                aggent
                    .patch('quotations/' + quotationBody._id)
                    .set('type', 'sales')
                    .send(body)
                    .set('mid', '63')
                    .expect(200, done);
            });

            it('should create  invoice', function (done) {
                var body = {
                    forSales: 'true',  // in quotationBody boolean
                    orderId : quotationBody._id
                };

                aggent
                    .post('invoices/receive')
                    .send(body)
                    .expect(201)
                    .end(function (err, res) {
                        invoiceBody = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(invoiceBody)
                            .to.have.property('_id');

                        done();
                    });
            });

            it('should create payment', function (done) {

                var body = {
                    date            : new Date(),
                    forSale         : invoiceBody.forSales,
                    invoice         : invoiceBody._id,
                    mid             : 56,
                    paidAmount      : invoiceBody.paymentInfo.balance,
                    paymentMethod   : CONSTANTS.PAYMENTMETHOD,
                    paymentRef      : invoiceBody.paymentReference,
                    period          : null,
                    differenceAmount: 0,
                    supplier        : invoiceBody.supplier,
                    currency        : invoiceBody.currency
                };

                aggent
                    .post('payment')
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
                            .to.have.property('groups')
                            .and.to.have.property('owner', CONSTANTS.OWNER);
                        expect(body)
                            .to.have.property('invoice', invoiceBody._id);
                        expect(body)
                            .to.have.property('currency')
                            .and.to.have.property('_id', CONSTANTS.DOLLAR);

                        paymentId = body._id;

                        done();
                    });
            });

            it('should fail create payment', function (done) {
                var body = {};

                aggent
                    .post('payment')
                    .send(body)
                    .expect(400, done);

            });

            /*it('should get payments by project', function (done) {

                aggent
                    .get('payment/getForProject')
                    .query({'data[0]': paymentId})
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
                        expect(body[0])
                            .to.have.property('currency')
                            .and.to.be.instanceOf(Object)
                            .and.to.have.property('_id', CONSTANTS.DOLLAR);
                        expect(body[0])
                            .to.have.property('groups')
                            .and.to.be.instanceOf(Object)
                            .and.to.have.property('owner', CONSTANTS.OWNER);

                        done();
                    });
            });*/

            it('should delete Payment', function (done) {
                aggent
                    .delete('payment/' + paymentId)
                    .set('type', 'customers')
                    .expect(200, done);
            });

            it('should delete invoice', function (done) {
                aggent
                    .delete('invoice/' + invoiceBody._id)
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

        describe('PayOut Specs', function () {
            var payOutId;

            it('should create payOut', function (done) {

                var body = {
                    date            : '11 Feb, 2016',
                    invoice         : null,
                    invoiced        : 0,
                    paidAmount      : 33,
                    workflow        : 'Draft',
                    differenceAmount: -189,
                    month           : 2,
                    year            : 2016,
                    supplier        : CONSTANTS.SUPPLIER,
                    paymentMethod   : null,
                    period          : null,
                    paymentRef      : 'Sales/Head 8%',
                    name            : 'PP',
                    paid            : 222
                };

                aggent
                    .post('payment/supplier')
                    .send(body)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object);

                        payOutId = body._id;

                        done();
                    });
            });

            it('should fail create payOut', function (done) {
                var body = {};

                aggent
                    .post('payment/supplier')
                    .send(body)
                    .expect(400, done);
            });

            it('should delete payOut', function (done) {
                aggent
                    .delete('payment/' + payOutId)
                    .set('type', 'supplier')
                    .expect(200, done);
            });
        });
    });

    describe('Payment with user without a license', function () {

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

        it('should fail create payOut', function (done) {

            var body = {
                date            : '11 Feb, 2016',
                invoice         : null,
                invoiced        : 0,
                paidAmount      : 33,
                workflow        : 'Draft',
                differenceAmount: -189,
                month           : 2,
                year            : 2016,
                supplier        : CONSTANTS.SUPPLIER,
                paymentMethod   : null,
                period          : null,
                paymentRef      : 'Sales/Head 8%',
                name            : 'PP',
                paid            : 222
            };

            aggent
                .post('payment/supplier')
                .send(body)
                .expect(403, done);
        });
    });

    describe('Payment with no authorise', function () {

        it('should fail get payments by viewType', function (done) {

            aggent
                .get('payment/salary/')
                .expect(404, done);
        });

    });

});



