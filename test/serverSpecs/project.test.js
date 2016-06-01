var request = require('supertest');
var expect = require('chai').expect;
var CONSTANTS = require('../../constants/constantsTest');
var url = 'http://localhost:8089/';
var aggent;

describe('Project Specs', function () {
    'use strict';
    var id;

    describe('Project with admin', function () {
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

        it('should create Project', function (done) {
            var body = {
                "projectName"     : "testProject",
                "projectShortDesc": "esttest",
                "task"            : [],
                "privacy"         : "All Users",
                "customer"        : "55b92ad621e4b7c40f000635",
                "projectmanager"  : {"_id": "", "name": ""},
                "teams"           : {"users": [], "Teams": []},
                "info"            : {
                    "StartDate": null,
                    "duration" : 0,
                    "EndDate"  : null,
                    "sequence" : 0,
                    "parent"   : null
                },
                "estimated"       : 0,
                "logged"          : 0,
                "remaining"       : 0,
                "progress"        : 0,
                "notes"           : [],
                "bonus"           : [],
                "budget"          : {"bonus": [], "projectTeam": []},
                "workflow"        : "528ce7d0f3f67bc40b000021",
                "projecttype"     : "mixed",
                "paymentMethod"   : "565f2e05ab70d49024242e07",
                "paymentTerms"    : "55536e52475b7be475f335f6",
                "description"     : "",
                "groups"          : {"owner": "560c099da5d4a2e20ba5068b", "users": [], "group": []},
                "whoCanRW"        : "everyOne",
                "health"          : 1,
                "StartDate"       : "",
                "TargetEndDate"   : ""
            };

            aggent
                .post('projects/')
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
                        .to.have.property('success');
                    expect(body)
                        .to.have.property('result');
                    expect(body)
                        .to.have.property('id');

                    id = body.id;

                    done();
                });

        });

        it('should update Project', function (done) {
            var body = {"workflow": "528ce82df3f67bc40b000025"};

            aggent
                .patch('projects/' + id)
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
                        .to.have.property('workflow')
                        .and.to.be.equal('528ce82df3f67bc40b000025');

                    done();
                });
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
                    
                    console.log(firstProject);
                    
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
                        .and.to.have.property('notRemovable');
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

        it('should delete Project', function (done) {
            aggent
                .delete('projects/' + id)
                .expect(200, done);
        });

        it('should not delete Project', function (done) {
            aggent
                .delete('projects/' + 'kkk')
                .expect(500, done);
        });

    });

    describe('Project with user without a license', function () {

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

        /* it("should fail create quotation", function (done) {
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
         });*/
    });

    describe('Project with no authorise', function () {
        it("should fail get Project for list", function (done) {
            var query = {
                page    : 1,
                count   : 4,
                viewType: 'list'
            };

            aggent
                .get('projects/')
                .query(query)
                .expect(404, done);
        });

    });
});
