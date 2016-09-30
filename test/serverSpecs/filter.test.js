var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent = request.agent(url);

require('../../config/environment/development');

describe('Filter Specs', function () {
    'use strict';

    describe('Filter with admin', function () {
        this.timeout(10000);

        before(function (done) {

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

        it('should get Filters for Employees', function (done) {

            aggent
                .get('filter/Employees')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('department')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('jobPosition')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('manager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Employees : Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for contractJobs', function (done) {

            aggent
                .get('filter/contractJobs')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('customer')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('projectManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('contractJobs: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for projectsDashboard', function (done) {

            aggent
                .get('filter/projectsDashboard')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('customer')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('type')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('projectsDashboard: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Persons', function (done) {

            aggent
                .get('filter/Persons')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('country')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('services')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Persons: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Companies', function (done) {

            aggent
                .get('filter/Companies')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('country')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('services')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Companies: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Applications', function (done) {

            aggent
                .get('filter/Applications')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('department')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('jobPosition')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Applications: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Projects', function (done) {

            aggent
                .get('filter/Projects')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('customer')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('projectManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Projects: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Tasks', function (done) {

            aggent
                .get('filter/Tasks')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('assignedTo')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('summary')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('type')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Tasks: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Invoices', function (done) {

            aggent
                .get('filter/Invoices')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Invoices: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for salesInvoices', function (done) {

            aggent
                .get('filter/salesInvoices')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesPerson')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('salesInvoices: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for salesProforma', function (done) {

            aggent
                .get('filter/salesProforma')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesPerson')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('salesProforma: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for customerPayments', function (done) {

            aggent
                .get('filter/customerPayments')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('assigned')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('paymentMethod')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('customerPayments: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for supplierPayments', function (done) {

            aggent
                .get('filter/supplierPayments')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('month')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('paymentRef')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('year')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('supplierPayments: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Products', function (done) {

            aggent
                .get('filter/Products')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('canBeExpensed')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('canBePurchased')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('canBeSold')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Products: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Quotations', function (done) {

            aggent
                .get('filter/Quotations')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Quotations: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for salesQuotations', function (done) {

            aggent
                .get('filter/salesQuotations')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0]._id')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('salesQuotations: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for salesOrders', function (done) {

            aggent
                .get('filter/salesOrders')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('salesOrders: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Orders', function (done) {

            aggent
                .get('filter/Orders')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('country')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('services')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Orders: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for DealTasks', function (done) {

            aggent
                .get('filter/DealTasks')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('assignedTo')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('category')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('deal')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('DealTasks: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Leads', function (done) {

            aggent
                .get('filter/Leads')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('contactName')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('createdBy')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesPerson')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('source')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Leads: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for Opportunities', function (done) {

            aggent
                .get('filter/Opportunities')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('customer')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesPerson')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('Opportunities: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for salaryReport', function (done) {

            aggent
                .get('filter/salaryReport')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('department')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('employee')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('onlyEmployees')
                            .and.to.be.instanceOf(Object)
                            .and.to.have.property('name')
                            .and.to.exist;
                    } else {
                        console.log('salaryReport: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for wTrack', function (done) {

            aggent
                .get('filter/wTrack')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('customer')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('department')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('employee')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        /*expect(body)
                         .and.to.have.property('isPaid')
                         .and.to.be.instanceOf(Array)
                         .and.to.have.deep.property('[0].name')
                         .and.to.exist;

                         ToDo : Is jobs field topicality ?
                         expect(body)
                         .to.have.property('jobs')
                         .and.to.be.instanceOf(Array)
                         .and.to.have.deep.property('[0].name')
                         .and.to.exist;
                         */

                        expect(body)
                            .to.have.property('month')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .and.to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('week')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('year')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('_type')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('wTrack: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for ExpensesInvoice', function (done) {

            aggent
                .get('filter/ExpensesInvoice')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('supplier')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('ExpensesInvoice: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for WriteOff', function (done) {

            aggent
                .get('filter/WriteOff')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('country')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('services')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('WriteOff: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for DividendInvoice', function (done) {

            aggent
                .get('filter/DividendInvoice')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('DividendInvoice: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for DashVacation', function (done) {

            aggent
                .get('filter/DashVacation')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('department')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('projecttype')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('DashVacation: Body object is empty, so in this case filters is empty too on UI\n');
                    }



                    done();
                });
        });

        it('should get Filters for jobsDashboard', function (done) {

            aggent
                .get('filter/jobsDashboard')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('paymentsCount')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('type')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('workflow')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('jobsDashboard: Body object is empty, so in this case filters is empty too on UI\n');
                    }

                    done();
                });
        });

        it('should get Filters for journalEntry', function (done) {

            aggent
                .get('filter/journalEntry')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('creditAccount')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('debitAccount')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('journal')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('name')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                    } else {
                        console.log('journalEntry: Body object is empty, so in this case filters is empty too on UI\n');
                    }


                    done();
                });
        });

        it('should get Filters for inventoryReport', function (done) {

            aggent
                .get('filter/inventoryReport')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    if (Object.keys(body).length) {
                        expect(body).to.be.instanceOf(Object)
                            .and.to.have.property('project')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('salesManager')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;

                        expect(body)
                            .to.have.property('type')
                            .and.to.be.instanceOf(Array)
                            .and.to.have.deep.property('[0].name')
                            .and.to.exist;
                    } else {
                        console.log('inventoryReport: Body object is empty, so in this case filters is empty too on UI\n');
                    }


                    done();
                });
        });
    });

    describe('Filter with no authorise', function () {

        it('should fail get Filter Values', function (done) {

            aggent
                .get('filter/getFiltersValues')
                .expect(404, done);
        });

    });

});

/*
 ToDo It is commented becouse it isn't showing on UI

 it('should get Filters for ExpensesPayments', function (done) {

 aggent
 .get('filter/ExpensesPayments')
 .expect(200)
 .end(function (err, res) {
 var body = res.body;

 if (err) {
 return done(err);
 }

 expect(body).to.be.instanceOf(Object)
 .and.to.have.property('month')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('paymentRef')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('year')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 done();
 });
 });

 it('should get Filters for DividendPayments', function (done) {

 aggent
 .get('filter/DividendPayments')
 .expect(200)
 .end(function (err, res) {
 var body = res.body;

 if (err) {
 return done(err);
 }

 expect(body).to.be.instanceOf(Object)
 .and.to.have.property('month')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('paymentRef')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('year')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 done();
 });
 });

 it('should get Filters for PayrollExpenses', function (done) {

 aggent
 .get('filter/PayrollExpenses')
 .expect(200)
 .end(function (err, res) {
 var body = res.body;

 if (err) {
 return done(err);
 }

 expect(body).to.be.instanceOf(Object)
 .and.to.have.property('dataKey')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('employee')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('month')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('type')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(body)
 .to.have.property('year')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 done();
 });
 });*/

/*
 describe('Filter Specs', function () {
 'use strict';

 describe('Filter with admin', function () {
 this.timeout(10000);

 before(function (done) {

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

 it('should get Filter Values', function (done) {
 var query = {
 filter: {
 startDate: 201605,
 endDate  : 201607
 }
 };
 var typeFilter;

 aggent
 .get('filter/getFiltersValues')
 .expect(200)
 .query(query)
 .end(function (err, res) {
 var body = res.body;

 if (err) {
 return done(err);
 }

 expect(body)
 .to.be.instanceOf(Object);
 expect(body)
 .to.have.property('Persons')
 .and.to.be.instanceOf(Object)
 .and.to.have.property('name')
 .and.to.be.instanceOf(Array);

 // ------------------------ Leads  ----------------

 typeFilter = body.Leads;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('contactName')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesPerson')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[1].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('source')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Opportunities  ----------------

 typeFilter = body.Opportunities;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('customer')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesPerson')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Persons  ----------------

 typeFilter = body.Persons;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('country')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('name')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('services')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Companies  ----------------

 typeFilter = body.Companies;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('country')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('name')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('services')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Sales Quotation  ----------------

 typeFilter = body.salesQuotations;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('project')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesManager')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[1].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Sales Order  ----------------

 typeFilter = body.salesOrders;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('project')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesManager')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[1].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Sales Invoice  ----------------

 typeFilter = body.salesInvoices;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('project')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesPerson')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[1].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Sales Proforma ----------------

 typeFilter = body.salesProforma;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('project')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesPerson')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[1].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ PROJECT -------------------
 // ------------------------ Projects -------------------

 typeFilter = body.Projects;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('name')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('customer')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('projectManager')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesManager')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Tasks -------------------

 typeFilter = body.Tasks;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('project')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('assignedTo')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('project')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('summary')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('type')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ tCard -------------------

 typeFilter = body.wTrack;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('customer')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('department')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('employee')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('isPaid')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('month')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('project')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('week')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('year')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('_type')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ---------------------------  HR  ------------------------
 // --------------------------- Employee  ----------------

 typeFilter = body.Employees;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('department')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('jobPosition')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('manager')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('name')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // --------------------------- Application  ----------------

 typeFilter = body.Applications;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('department')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('jobPosition')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('name')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 done();

 // ------------------------ ACCOUNTING -------------------
 // ------------------------ Sales Payments -------------------

 typeFilter = body.customerPayments;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('assigned')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('name')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('paymentMethod')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesManager')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 //------------------------ Inventory Report -------------------

 typeFilter = body.inventoryReport;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('project')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('type')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('salesManager')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 //------------------------ Journal Entries -------------------

 typeFilter = body.journalEntry;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('creditAccount')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('journalName')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('sourceDocument')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ PAYROLL -------------------
 // ------------------------ Supplier Payments -------------------

 typeFilter = body.supplierPayments;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('month')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('paymentRef')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('year')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Salary Report -------------------

 typeFilter = body.salaryReport;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('department')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('employee')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('onlyEmployees')
 .and.to.be.instanceOf(Object)
 .and.to.have.deep.property('name')
 .and.to.exist;

 // ------------------------ Dividend declaration -------------------

 typeFilter = body.DividendInvoice;

 expect(typeFilter).to.exist;

 expect(typeFilter).to.be.instanceOf(Object)
 .and.to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Dividend Payments -------------------
 /!*
 typeFilter = body.DividendPayments;

 expect(typeFilter).to.exist;*!/

 // not added on view

 // ------------------------ EXPENSES -------------------
 // ------------------------ Invoice -------------------

 typeFilter = body.ExpensesInvoice;

 expect(typeFilter).to.exist;

 expect(typeFilter)
 .to.have.property('supplier')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 expect(typeFilter)
 .to.have.property('workflow')
 .and.to.be.instanceOf(Array)
 .and.to.have.deep.property('[0].name')
 .and.to.exist;

 // ------------------------ Expenses Payments -------------------

 /!*  typeFilter = body.ExpensesPayments;

 expect(typeFilter).to.exist;*!/

 // not added on view

 // todo test other properties if its need
 done();
 });
 });
 });

 describe('Filter with no authorise', function () {

 it('should fail get Filter Values', function (done) {

 aggent
 .get('filter/getFiltersValues')
 .expect(404, done);
 });

 });

 });

 */
