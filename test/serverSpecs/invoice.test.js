var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var CONSTANTS = require('../../constants/constantsTest');
var aggent;

describe("Invoice Specs", function () {
    'use strict';

    describe('Invoice with admin', function () {

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

        describe('Invoice receiving', function () {
            var quotationBody;
            var invoiceId;


            it("should create quotation", function (done) {
                var body = {
                    "supplier"         : CONSTANTS.SUPPLIER,
                    "project"          : CONSTANTS.PROJECT,
                    "workflow"         : CONSTANTS.WORKFLOW,
                    "supplierReference": null,
                    "orderDate"        : "28 Dec, 2015",
                    "expectedDate"     : "Mon Dec 28 2015 00:00:00 GMT+0200 (Фінляндія (зима))",
                    "name"             : "PO",
                    "invoiceControl"   : null,
                    "invoiceRecived"   : false,
                    "paymentTerm"      : null,
                    "fiscalPosition"   : null,
                    "destination"      : null,
                    "incoterm"         : null,
                    "products"         : [
                        {
                            "product"      : CONSTANTS.PRODUCT,
                            "unitPrice"    : "500",
                            "quantity"     : "1",
                            "scheduledDate": "28 Dec, 2015",
                            "taxes"        : "0.00",
                            "description"  : "",
                            "subTotal"     : "500",
                            "jobs"         : CONSTANTS.JOB
                        }
                    ],
                    "currency"         : {
                        _id : CONSTANTS.DOLLAR,
                        name: 'USD'
                    },
                    "forSales"         : "true",
                    "deliverTo"        : CONSTANTS.DELIVERTO,
                    "populate"         : true,
                    "paymentInfo"      : {
                        "total"  : 500,
                        "unTaxed": 500,
                        "taxes"  : 0
                    },
                    "groups"           : {
                        "owner": CONSTANTS.OWNER,
                        "users": [],
                        "group": []
                    },
                    "whoCanRW"         : "everyOne"
                };

                aggent
                    .post('quotation')
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

            it("should create order", function (done) {
                var body = {
                    isOrder : true,
                    type    : 'Not Invoiced',
                    workflow: quotationBody.workflow
                };

                aggent
                    .patch('quotation/' + quotationBody._id)
                    .send(body)
                    .set('type', 'sales')
                    .expect(200, done);
            });

            it("should receive  invoice", function (done) {
                var body = {
                    forSales: "true",  // in quotationBody boolean
                    orderId : quotationBody._id
                };

                aggent
                    .post('invoice/receive')
                    .send(body)
                    .expect(201)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.have.property('_id');
                        expect(body)
                            .to.have.property('products')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0]')
                            .and.to.have.property('jobs', CONSTANTS.JOB);
                        expect(body.products[0])
                            .to.have.property('product',CONSTANTS.PRODUCT);
                        expect(body)
                            .to.have.property('groups')
                            .and.to.have.property('owner', CONSTANTS.OWNER);
                        expect(body)
                            .to.have.property('paymentInfo')
                            .and.to.have.property('total', 500);
                        expect(body)
                            .to.have.property('currency')
                            .and.to.have.property( "_id", CONSTANTS.DOLLAR);
                        expect(body)
                            .to.have.property('editedBy')
                            .and.to.have.property( "date");
                        expect(body)
                            .to.have.property('createdBy')
                            .and.to.have.property( "date");

                        invoiceId = body._id;

                        it("should approve invoice", function (done) {
                            var body = {
                                invoiceId: invoiceId,
                                invoiceDate: '1 Feb, 2016'
                            };

                            aggent
                                .patch('invoice/approve')
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

                                    done();
                                });

                        });


                        done();
                    });
            });

            it("should fail receive  invoice", function (done) {
                var body = {
                    forSales: "true",
                    orderId : "123cba"
                };

                aggent
                    .post('invoice/receive')
                    .send(body)
                    .expect(400, done);

            });

            it("should get all invoices", function (done) {

                aggent
                    .get('invoice')
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

                        done();
                    });
            });

            it("should get invoices filterValues", function (done) {

                aggent
                    .get('invoice/getFilterValues')
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
                            .and.to.have.property('Due date');

                        done();
                    });
            });

            it("should generate Name", function (done) { // increment seq for project in settings
                var query = {
                    projectId: CONSTANTS.PROJECT
                };

                aggent
                    .get('invoice/generateName')
                    .query(query)
                    .expect(200, done);
            });

            it("should get invoices totalCollectionLength", function (done) { // long query

                aggent
                    .get('invoice/totalCollectionLength')
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

            it("should get invoices stats", function (done) {

                aggent
                    .get('invoice/stats')
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

                        done();
                    });
            });

            it("should get invoices stats by project", function (done) {  // long query
                var query = {
                    filter: {
                        project: {
                            key  : "project._id"
                        }
                    }
                };

                aggent
                    .get('invoice/stats/project')
                    .query(query)
                    .query({"filter[project][value][0]": CONSTANTS.PROJECT})
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Object)
                            .and.to.have.property('success')
                            .and.to.have.property('invoices')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0]');

                        done();
                    });
            });

            it("should get invoices chart", function (done) {
                var query = {
                    startDate: "28 Dec, 2015",
                    endDate  : "30 Dec, 2015"
                };

                aggent
                    .get('invoice/chart')
                    .query(query)
                    .expect(200)
                    .end(function (err, res) {
                        var body = res.body;

                        if (err) {
                            return done(err);
                        }

                        expect(body)
                            .to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0]')
                            .and.to.have.property('dueDate');

                        done();
                    });
            });

            it("should patch invoice", function (done) {
                var body = {
                    dueDate : "10 Feb, 2016",
                    currency: {
                        _id : CONSTANTS.EURO,
                        name: "EUR"
                    }
                };

                aggent
                    .patch('invoice/' + invoiceId)
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

            it("should fail patch invoice", function (done) {
                var body = { };

                aggent
                    .patch('invoice/123cba')
                    .send(body)
                    .set('type', 'sales')
                    .expect(400, done);

            });

            it("should update invoice", function (done) {
                var body = {
                    "supplier"         : CONSTANTS.SUPPLIER,
                    "project"          : CONSTANTS.PROJECT,
                    "workflow"         : CONSTANTS.WORKFLOW,
                    "supplierReference": null,
                    "orderDate"        : "28 Dec, 2015",
                    "expectedDate"     : "Mon Dec 28 2015 00:00:00 GMT+0200 (Фінляндія (зима))",
                    "name"             : "PO",
                    "invoiceControl"   : null,
                    "invoiceRecived"   : false,
                    "paymentTerm"      : null,
                    "fiscalPosition"   : null,
                    "destination"      : null,
                    "incoterm"         : null,
                    "products"         : [
                        {
                            "product"      : CONSTANTS.PRODUCT,
                            "unitPrice"    : "500",
                            "quantity"     : "1",
                            "scheduledDate": "28 Dec, 2015",
                            "taxes"        : "0.00",
                            "description"  : "",
                            "subTotal"     : "500",
                            "jobs"         : CONSTANTS.JOB
                        }
                    ],
                    "currency"         : {
                        _id : CONSTANTS.DOLLAR,
                        name: 'USD'
                    },
                    "forSales"         : "true",
                    "deliverTo"        : CONSTANTS.DELIVERTO,
                    "populate"         : true,
                    "paymentInfo"      : {
                        "total"  : 500,
                        "unTaxed": 500,
                        "taxes"  : 0
                    },
                    "groups"           : {
                        "owner": CONSTANTS.OWNER,
                        "users": [],
                        "group": []
                    },
                    "dueDate" : "11 Feb, 2016",
                    "whoCanRW"         : "everyOne"
                };

                aggent
                    .put('invoice/' + invoiceId)
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
                        expect(body)
                            .to.have.property('currency')
                            .and.to.have.property( "_id", CONSTANTS.DOLLAR);

                        done();
                    });
            });

            it("should get invoice by id", function (done) {
                var query = {
                    id: invoiceId,
                    forSales : true
                };

                aggent
                    .get('invoice/form')
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
                            .to.have.property("_id", invoiceId);
                        expect(body)
                            .to.have.property('currency')
                            .and.to.have.property( "_id")
                            .and.to.have.property( "_id", CONSTANTS.DOLLAR);
                        expect(body)
                            .to.have.property('dueDate');
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
                            .and.to.have.property('_id',  CONSTANTS.OWNER);

                        done();
                    });
            });

            it("should fail get invoice by id", function (done) {
                var query = {
                    id: "123cba",
                    forSales : true
                };

                aggent
                    .get('invoice/form')
                    .query(query)
                    .expect(400, done);
            });

            it("should get invoices for View", function (done) {
                var query = {
                    count : 100,
                    filter: {
                        project: {
                            key  : "project._id"
                        }
                    },
                    forSales : true
                };

                aggent
                    .get('invoice/list')
                    .query(query)
                    .query({"filter[project][value][0]": CONSTANTS.PROJECT})
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
                            .and.to.have.property('project')
                            .and.to.have.property('_id', CONSTANTS.PROJECT);
                        expect(body.length)
                            .to.be.lte(100);

                        done();
                    });
            });

            it("should delete invoice", function (done) {
                aggent
                    .delete('invoice/' + invoiceId)
                    .set('type', 'sales')
                    .expect(200, done);
            });

            it("should fail delete invoice", function (done) {
                aggent
                    .delete('invoice/123cba')
                    .set('type', 'sales')
                    .expect(400, done);
            });

            it("should delete quotation", function (done) {
                aggent
                    .delete('quotation/' + quotationBody._id)
                    .set('type', 'sales')
                    .expect(200, done);
            });
        });

        describe('Invoice creating', function () {
            var id;

            it("should create Invoice", function (done) {

                var body = {
                    account              : null,
                    dueDate              : "10 Feb, 2016",
                    fiscalPosition       : null,
                    forSales             : false,
                    invoiceDate          : "11 Feb, 2016",
                    journal              : null,
                    salesPerson          : null,
                    sourceDepartment     : null,
                    supplier             : CONSTANTS.TESTSUPPLIER, // testSupplier
                    supplierInvoiceNumber: "dad",
                    whoCanRW             : "everyOne",
                    workflow             :  CONSTANTS.DRAFT, // Draft
                    paymentInfo          : {
                        balance: 5000,
                        total  : 5000,
                        unTaxed: 5000
                    },
                    products             : [{
                        "product"    : CONSTANTS.BANKEXPENSES,  // Bank expenses
                        "unitPrice"  : "500",
                        "quantity"   : "10",
                        "taxes"      : "0.00",
                        "description": "test",
                        "subTotal"   : "5000"
                    }],
                    groups               : {
                        group: [],
                        owner: CONSTANTS.OWNER,
                        users: []
                    },
                    currency             : {
                        name: "USD",
                        _id : CONSTANTS.DOLLAR
                    }
                };

                aggent
                    .post('invoice')
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
                            .to.have.property("_id");
                        expect(body)
                            .to.have.property('currency')
                            .and.to.have.property( "_id", CONSTANTS.DOLLAR);
                        expect(body)
                            .to.have.property('products')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0]')
                            .to.have.property('product',CONSTANTS.BANKEXPENSES);
                        expect(body)
                            .to.have.property('groups')
                            .and.to.have.property('owner', CONSTANTS.OWNER);
                        expect(body)
                            .to.have.property('paymentInfo')
                            .and.to.have.property('total', 5000);


                        id = body._id;

                        done();
                    });
            });

            it("should patch invoice", function (done) {
                var body = {
                    dueDate : "10 Feb, 2016",
                    currency: {
                        _id : CONSTANTS.EURO,
                        name: "EUR"
                    }
                };

                aggent
                    .patch('invoice/' + id)
                    .send(body)
                    .set('type', 'purchase')
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
                        expect(body)
                            .to.have.property('currency')
                            .and.to.have.property( "_id", CONSTANTS.EURO);

                        done();
                    });
            });

            it("should update invoice", function (done) {
                var body = {
                    account              : null,
                    fiscalPosition       : null,
                    forSales             : false,
                    groups               : {
                        group: [],
                        owner: CONSTANTS.OWNER,
                        users: []
                    },
                    dueDate              : "10 Feb, 2016",
                    currency             : {
                        _id : CONSTANTS.DOLLAR,
                        name: "EUR"
                    },
                    paymentInfo          : {
                        balance: 5000,
                        total  : 5000,
                        unTaxed: 5000
                    },
                    products             : [{
                        "product"    : CONSTANTS.BANKEXPENSES, // Bank expenses
                        "unitPrice"  : "500",
                        "quantity"   : "10",
                        "taxes"      : "0.00",
                        "description": "test",
                        "subTotal"   : "5000"
                    }],
                    salesPerson          : null,
                    sourceDepartment     : null,
                    supplier             : CONSTANTS.TESTSUPPLIER,
                    supplierInvoiceNumber: "dad",
                    whoCanRW             : "everyOne",
                    workflow             : CONSTANTS.DRAFT
                };

                aggent
                    .put('invoice/' + id)
                    .send(body)
                    .set('type', 'purchase')
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
                        expect(body)
                            .to.have.property('currency')
                            .and.to.have.property( "_id", CONSTANTS.DOLLAR);

                        done();
                    });
            });

            it("should fail update invoice", function (done) {
                var body = {};

                aggent
                    .put('invoice/123cba')
                    .send(body)
                    .set('type', 'purchase')
                    .expect(400, done);
            });


            it("should delete invoice", function (done) {
                aggent
                    .delete('invoice/' + id)
                    .set('type', 'purchase')
                    .expect(200, done);
            });
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
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should fail create Invoice", function (done) {

            var body = {
                account              : null,
                currency             : {
                    name: "USD",
                    _id : CONSTANTS.DOLLAR
                },
                dueDate              : "10 Feb, 2016",
                fiscalPosition       : null,
                forSales             : false,
                groups               : {
                    group: [],
                    owner: CONSTANTS.OWNER,
                    users: []
                },
                invoiceDate          : "11 Feb, 2016",
                journal              : null,
                paymentInfo          : {
                    balance: 5000,
                    total  : 5000,
                    unTaxed: 5000
                },
                products             : [{
                    "product"    : CONSTANTS.BANKEXPENSES,
                    "unitPrice"  : "500",
                    "quantity"   : "10",
                    "taxes"      : "0.00",
                    "description": "test",
                    "subTotal"   : "5000"
                }],
                salesPerson          : null,
                sourceDepartment     : null,
                supplier             : CONSTANTS.TESTSUPPLIER,
                supplierInvoiceNumber: "dad",
                whoCanRW             : "everyOne",
                workflow             : CONSTANTS.DRAFT
            };

            aggent
                .post('invoice')
                .send(body)
                .expect(403, done);
        });
    });

    describe('Invoice with no authorise', function () {

        it("should fail get Invoices for View", function (done) {

            aggent
                .get('invoice/list')
                .expect(404, done);
        });

    });
});

