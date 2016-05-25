require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Filter Specs", function () {
    'use strict';

    describe('Filter with admin', function () {

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass : 'tm2016',
                    dbId : 'pavlodb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should get Filter Values", function (done) {
            var query ={
                filter: {
                    startDate: 201605,
                    endDate: 201607
                }
            };

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
                        .and.to.be.instanceOf(Array);// todo test other properties if its need

                    done();
                });
        });

    });

    describe('Filter with no authorise', function () {

        it("should fail get Filter Values", function (done) {

            aggent
                .get('filter/getFiltersValues')
                .expect(404, done);
        });

    });


});

