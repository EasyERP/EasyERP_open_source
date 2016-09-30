var request = require('supertest');
var expect = require('chai').expect;
var CONSTANTS = require('../../constants/constantsTest');
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

require('../../config/environment/development');

describe('Payment Specs', function () {
    'use strict';

    describe('Payment with admin', function () {
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
                    paidAmount      : 300,
                    workflow        : 'Draft',
                    differenceAmount: 0,
                    month           : 10,
                    year            : 2014,
                    supplier        : {
                        _id            : '55b92ad221e4b7c40f00005e',
                        dateBirth      : '1992-11-21T00:00:00.000Z',
                        ID             : 32,
                        isLead         : 0,
                        fire           : [],
                        hire           : ['2014-01-05T22:00:00.000Z'],
                        social         : {FB: 'null', LI: ''},
                        sequence       : 0,
                        jobType        : 'Full-time',
                        gender         : 'male',
                        marital        : 'unmarried',
                        contractEnd    : {date: '2015-07-29T19:34:42.458Z', reason: ''},
                        attachments    : [],
                        editedBy       : {date: '2016-06-01T14:39:59.318Z', user: '55b8cb7d0ce4affc2a0015cb'},
                        createdBy      : {date: "2015-07-29T19:34:42.458Z", user: '52203e707d4dba8813000003'},
                        creationDate   : '2015-07-29T19:34:42.458Z',
                        color          : '#4d5a75',
                        otherInfo      : '',
                        groups         : {group: [], users: [], owner: '55ba28c8d79a3a3439000016'},
                        whoCanRW       : 'everyOne',
                        workflow       : null,
                        active         : false,
                        referredBy     : '',
                        source         : '',
                        age            : 23,
                        homeAddress    : {country: '', zip: '', state: '', city: '', street: ''},
                        otherId        : '',
                        bankAccountNo  : '',
                        nationality    : '',
                        coach          : null,
                        manager        : '55b92ad221e4b7c40f000072',
                        jobPosition    : '55c32e2a29bd6ccd0b000006',
                        department     : '56e175c4d62294582e10ca68',
                        visibility     : 'Public',
                        relatedUser    : null,
                        officeLocation : '',
                        skype          : 'demonsi3',
                        workPhones     : {phone: '', mobile: '+380932731972'},
                        personalEmail  : 'monsi@bk.ru',
                        workEmail      : 'michael.didenko@thinkmobiles.com',
                        workAddress    : {country: '', zip: '', state: '', city: '', street: ''},
                        tags           : [''],
                        name           : {last: 'Didenko', first: 'Michael'},
                        subject        : '',
                        imageSrc       : 'data:image/jpeg;base64,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',
                        isEmployee     : true,
                        __v            : 0,
                        weeklyScheduler: '57332c3b94ee1140b6bb49e2'
                    },
                    "period"        : '2014-10-01',
                    "paymentRef"    : '57da4fb5a72dc7a8241fc8b2',
                    "paymentMethod" : '565f2e05ab70d49024242e10',
                    "date"          : '2014-10-31T07:17:15.000Z',
                    "name"          : 'PP',
                    "invoice"       : null,
                    "invoiced"      : 0,
                    "currency"      : '565eab29aeb95fa9c0f9df2d',
                    "journal"       : null
                }];

                aggent
                    .post('payments/salary')
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
                    .post('payments/salary')
                    .send(body)
                    .expect(400, done);
            });

            /*it('should patch salary Payout', function (done) {

             var body = [{
             _id     : id,
             date    : new Date(),
             workflow: 'Done',
             month   : 12,
             year    : 2016,
             period  : '2016-12-01'
             }];

             aggent
             .patch('payments/salary')
             .send(body)
             .expect(200, done);
             });*/

            /*it('should fail patch salary payOut', function (done) {

             var body = [{
             _id: '123cba'
             }];

             aggent
             .patch('payments/salary')
             .send(body)
             .expect(400, done);
             });*/

            it('should get salary payOut by id', function (done) {

                aggent
                    .get('payments/')
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
                    .get('payments')
                    .query({id: '123', viewType: 'form'})
                    .expect(500, done);
            });

            it('should get payments by viewType', function (done) {
                var query = {
                    count      : 100,
                    viewType   : 'list',
                    contentType: 'SalaryPayment'
                };

                aggent
                    .get('payments/')
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
                    .delete('payments/' + id)
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
                    .post('payments')
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
                            .and.to.have.deep.property('_id._id', CONSTANTS.DOLLAR);

                        paymentId = body._id;

                        done();
                    });
            });

            it('should fail create payment', function (done) {
                var body = {};

                aggent
                    .post('payments')
                    .send(body)
                    .expect(400, done);

            });

            /*it('should get payments by project', function (done) {

             aggent
             .get('payments/getForProject')
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
                    .delete('payments/' + paymentId)
                    .set('type', 'customers')
                    .expect(200, done);
            });

            it('should delete invoice', function (done) {
                aggent
                    .delete('invoices/' + invoiceBody._id)
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
                    .post('payments/supplier')
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
                    .post('payments/supplier')
                    .send(body)
                    .expect(400, done);
            });

            it('should delete payOut', function (done) {
                aggent
                    .delete('payments/' + payOutId)
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
                    dbId : 'vasyadb'
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
                .post('payments/supplier')
                .send(body)
                .expect(403, done);
        });
    });

    describe('Payment with no authorise', function () {

        it('should fail get payments by viewType', function (done) {

            aggent
                .get('payments/salary/')
                .expect(404, done);
        });

    });

});



