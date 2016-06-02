require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent = request.agent(url);

describe('Filter Specs', function () {
    'use strict';

    describe('Filter with admin', function () {
        this.timeout(5000);

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

        it("should get Filter Values", function (done) {
            var query = {
                filter: {
                    startDate: 201605,
                    endDate  : 201607
                }
            };
            var project;
            var lead;
            var opportunity;
            var person;
            var company;
            var quotation;

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

                    project = body.Projects;

                    expect(project).to.exist;

                    expect(project).to.be.instanceOf(Object)
                        .and.to.have.property('name')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(project)
                        .to.have.property('workflow')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(project)
                        .to.have.property('customer')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(project)
                        .to.have.property('projectManager')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(project)
                        .to.have.property('salesManager')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

//------------------------ Leads  ----------------

                    lead = body.Leads;

                    expect(lead).to.exist;

                    expect(lead).to.be.instanceOf(Object)
                        .and.to.have.property('contactName')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(lead)
                        .to.have.property('salesPerson')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(lead)
                        .to.have.property('source')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(lead)
                        .to.have.property('workflow')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;


//------------------------ Opportunities  ----------------

                    opportunity = body.Opportunities;

                    expect(opportunity).to.exist;

                    expect(opportunity).to.be.instanceOf(Object)
                        .and.to.have.property('customer')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(opportunity)
                        .to.have.property('salesPerson')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(opportunity)
                        .to.have.property('workflow')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;
                    done();

//------------------------ Persons  ----------------

                    person = body.Persons;

                    expect(person).to.exist;

                    expect(person).to.be.instanceOf(Object)
                        .and.to.have.property('country')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(person)
                        .to.have.property('name')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(person)
                        .to.have.property('services')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;
                    done();

//------------------------ Companies  ----------------

                    company = body.Companies;

                    expect(company).to.exist;

                    expect(company).to.be.instanceOf(Object)
                        .and.to.have.property('country')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(company)
                        .to.have.property('name')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(company)
                        .to.have.property('services')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;


/*//------------------------ Quotation  ----------------

                    quotation = body.Quotation;

                    expect(quotation).to.exist;

                    expect(quotation).to.be.instanceOf(Object)
                        .and.to.have.property('project')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(quotation)
                        .to.have.property('name')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;

                    expect(quotation)
                        .to.have.property('services')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0].name')
                        .and.to.exist;*/



                    done();
                    // todo test other properties if its need
                });
        });
    });

    describe('Filter with no authorise', function () {

        it("should fail get Filter Values", function (done) {

            aggent
                .get('filter/getFiltersValues')
                .expect(500, done);
        });

    });


});

