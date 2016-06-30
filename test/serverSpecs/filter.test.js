var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent = request.agent(url);

require('../../config/development');

describe('Filter Specs', function () {
    'use strict';

    describe('Filter with admin', function () {
        this.timeout(10000);

        before(function (done) {

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
/*
                    typeFilter = body.DividendPayments;

                    expect(typeFilter).to.exist;*/

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

                  /*  typeFilter = body.ExpensesPayments;

                    expect(typeFilter).to.exist;*/

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

