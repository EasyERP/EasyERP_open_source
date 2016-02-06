/**
 * Created by liliy on 04.02.2016.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Department Specs", function () {
    'use strict';
    var id;

    describe('Department with admin', function(){
        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass : '1q2w3eQWE',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function(done){
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should create Department", function (done) {
            var body = {
                departmentName: 'cccc'
            };

            aggent
                .post('departments')
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

                    id = body.id;

                    done();
                });
        });

        it("should not create Department", function (done) {
            var body = {
                departmentName: 'cccc'
            };

            aggent
                .post('departments')
                .send(body)
                .expect(400, done);
        });

        it("should get by id Department", function (done) {
            var query = {
                id: id
            };

            aggent
                .get('departments/form')
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
                        .to.have.property('_id');

                    done();
                });
        });

        it("should get Department", function (done) {
            aggent
                .get('departments/list')
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
                    expect(body.data)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it("should update Department", function (done) {
            var body = {
                "_id"          : "55b92ace21e4b7c40f000015",
                "sequence"             : 1,
                "nestingLevel"         : 0,
                "editedBy"             : {
                    "user": "52203e707d4dba8813000003"
                },
                "createdBy"            : {
                    "date": "2015-07-29T19:34:38.909Z",
                    "user": "52203e707d4dba8813000003"
                },
                "users"                : [],
                "departmentManager"    : null,
                "parentDepartment"     : null,
                "departmentName"       : "HR5",
                "creationDate"         : null,
                "parentDepartmentStart": null,
                "sequenceStart"        : 0
            };
            aggent
                .put('departments/' + id)
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
                        .to.have.property('success');

                    done();
                });
        });

        it("should delete department", function (done) {
            aggent
                .delete('departments/' + id)
                .expect(200, done);
        });
    });

    describe('Department with user without a license', function(){

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'testUser',
                    pass : 'qwerty',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function(done){
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should fail create Department", function (done) {
            var body = {
                departmentName: 'cccc'
            };

            aggent
                .post('departments')
                .send(body)
                .expect(403, done);
        });
    });
});