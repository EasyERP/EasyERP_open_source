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

