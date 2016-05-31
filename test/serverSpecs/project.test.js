var request = require('supertest');
var expect = require('chai').expect;
var CONSTANTS = require('../../constants/constantsTest');
var url = 'http://localhost:8089/';
var aggent;

describe('Project Specs', function () {
    'use strict';
    var id;

    describe('Quotation with admin', function () {
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

        it('should get projects for thumbnails', function (done) {
            var query = {
                page    : 1,
                count   : 4,
                viewType: 'thumbnails'
            };

            aggent
                .get('projects/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var firstProject;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('showMore');
                    expect(body)
                        .to.have.property('total');
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    firstProject = body.data[0];

                    expect(firstProject)
                        .and.to.have.property('_id')
                        .and.to.have.lengthOf(24);
                    expect(firstProject)
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('health');
                    expect(firstProject)
                        .and.to.have.property('workflow')
                        .and.not.to.have.property('_id');
                    expect(firstProject)
                        .and.to.have.property('workflow')
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('customer')
                        .and.not.to.have.property('_id');
                    expect(firstProject)
                        .and.to.have.property('customer')
                        .and.to.have.property('name')
                        .and.to.have.property('first')
                        .and.to.be.a('string');
                    expect(Object.keys(firstProject.customer))
                        .to.have.lengthOf(1);

                    if (firstProject.salesManager) {
                        expect(firstProject)
                            .and.to.have.property('salesManager')
                            .and.to.have.property('_id')
                            .and.to.have.lengthOf(24);
                        expect(Object.keys(firstProject.salesManager))
                            .to.have.lengthOf(1);
                    }

                    done();
                });
        });


        it('should get projects for list', function (done) {
            var query = {
                page    : 1,
                count   : 4,
                viewType: 'list'
            };

            aggent
                .get('projects/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var firstProject;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('showMore');
                    expect(body)
                        .to.have.property('total');
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    firstProject = body.data[0];

                    expect(firstProject)
                        .and.to.have.property('_id')
                        .and.to.have.lengthOf(24);
                    expect(firstProject)
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('health');
                    expect(firstProject)
                        .and.to.have.property('progress');
                    expect(firstProject)
                        .and.to.have.property('StartDate');
                    expect(firstProject)
                        .and.to.have.property('EndDate');
                    expect(firstProject)
                        .and.to.have.property('TargetEndDate');
                    expect(firstProject)
                        .and.to.have.property('workflow')
                        .and.to.have.property('_id');
                    expect(firstProject)
                        .and.to.have.property('workflow')
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('customer')
                        .and.not.to.have.property('_id');
                    expect(firstProject)
                        .and.to.have.property('createdBy')
                        .and.to.have.property('date')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('createdBy')
                        .and.to.have.property('user')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('editedBy')
                        .and.to.have.property('date')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('editedBy')
                        .and.to.have.property('user')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .and.to.have.property('customer')
                        .and.to.have.property('name')
                        .and.to.have.property('first')
                        .and.to.be.a('string');
                    expect(Object.keys(firstProject.customer))
                        .to.have.lengthOf(1);

                    if (firstProject.salesManager) {
                        expect(firstProject)
                            .and.to.have.property('salesManager')
                            .and.to.have.property('_id')
                            .and.to.have.lengthOf(24);
                        expect(Object.keys(firstProject.salesManager))
                            .to.have.lengthOf(1);
                    }

                    done();
                });
        });

        /* it("should create quotation", function (done) {
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
         _id : CONSTANTS.EURO,
         name: 'EUR'
         },
         "forSales"         : true,
         "deliverTo"        : CONSTANTS.DELIVERTO,
         "populate"         : true,
         "paymentInfo"      : {
         "total"  : "500.00",
         "unTaxed": "500.00",
         "taxes"  : "0.00"
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
         });*/

        /* it("should get quotations totalCollectionLength", function (done) {

         aggent
         .get('quotation/totalCollectionLength')
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

         it("should get quotations filterValues", function (done) {

         aggent
         .get('quotation/getFilterValues')
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

         it("should get quotation by id", function (done) {
         var query = {
         forSales : true
         }

         aggent
         .get('quotation/form/' + id)
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

         it("should fail get quotation by id", function (done) {

         aggent
         .get('quotation/form/123cba')
         .expect(500, done);
         });

         it("should update quotation", function (done) {
         var body = {
         validate      : false,
         supplier      : CONSTANTS.SUPPLIER,
         project       : CONSTANTS.PROJECT,
         workflow      : CONSTANTS.WORKFLOW,
         orderDate     : '5 Feb, 2016',
         expectedDate  : '2 Feb, 2016',
         name          : 'PO',
         invoiceControl: '',
         invoiceRecived: false,
         paymentTerm   : '',
         fiscalPosition: '',
         destination   : '',
         incoterm      : '',
         "products"    : [
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
         _id           : id,
         "groups"      : {
         "owner": CONSTANTS.OWNER,
         "users": [],
         "group": []
         },
         whoCanRW      : 'everyOne',
         paymentInfo   : {total: '1500', unTaxed: '1500', taxes: '0.00'},
         deliverTo     : CONSTANTS.DELIVERTO,
         isOrder       : false,
         type          : 'Not Ordered',
         forSales      : true,
         currency      : {
         _id: CONSTANTS.DOLLAR,
         name: 'USD'
         }
         };

         aggent
         .put('quotation/' + id)
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
         .to.have.property('result')
         .and.to.have.property('currency')
         .and.to.have.property('_id', CONSTANTS.DOLLAR);

         done();
         });
         });

         it("should fail update quotation", function (done) {
         var body = {};

         aggent
         .put('quotation/123cba')
         .set('type', 'sales')
         .send(body)
         .expect(500, done);
         });

         it("should create order", function (done) {
         var body = {
         isOrder : true,
         type    : 'Not Invoiced',
         workflow: CONSTANTS.WORKFLOW
         };

         aggent
         .patch('quotation/' + id)
         .send(body)
         .set('type', 'salesOrder')
         .expect(200)
         .end(function (err, res) {
         var body = res.body;

         if (err) {
         return done(err);
         }
         expect(body)
         .to.be.instanceOf(Object);
         expect(body)
         .to.have.property('result')
         .and.to.have.property('isOrder', true);

         done();
         });
         });

         it("should fail create order", function (done) {
         var body = {};

         aggent
         .patch('quotation/123cba')
         .set('type', 'salesOrder')
         .send(body)
         .expect(500, done);
         });

         it("should delete quotation", function (done) {
         aggent
         .delete('quotation/' + id)
         .set('type', 'sales')
         .expect(200, done);
         });

         it("should fail delete quotation", function (done) {
         aggent
         .delete('quotation/123cba')
         .set('type', 'sales')
         .expect(500, done);
         });*/

    });

    /*describe('Quotation with user without a license', function () {

     before(function (done) {
     aggent = request.agent(url);

     aggent
     .post('users/login')
     .send({
     login: 'ArturMyhalko',
     pass : 'thinkmobiles2015',
     dbId : 'pavlodb'
     })
     .expect(200, done);
     });

     after(function (done) {
     aggent
     .get('logout')
     .expect(302, done);
     });

     it("should fail create quotation", function (done) {
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
     _id : CONSTANTS.EURO,
     name: 'EUR'
     },
     "forSales"         : true,
     "deliverTo"        : CONSTANTS.DELIVERTO,
     "populate"         : true,
     "paymentInfo"      : {
     "total"  : "500.00",
     "unTaxed": "500.00",
     "taxes"  : "0.00"
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
     .expect(403, done);
     });
     });

     describe('Quotation with no authorise', function () {
     it("should fail get Quotation for View", function (done) {

     aggent
     .get('quotation/list')
     .expect(404, done);
     });

     });*/
});

