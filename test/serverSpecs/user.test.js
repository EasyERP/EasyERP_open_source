var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

describe("User Specs", function () {
    'use strict';
    describe("Create User block", function () {
        var id;

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

        it("should create user", function (done) {
            var body = {
                "login"  : "super.duper",
                "pass"   : "superpass",
                "email"  : "super.user@valid.com",
                "profile": 123456789
            };

            aggent
                .post('users')
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
                        .to.have.property('id');

                    id = body.id;

                    done();
                });
        });

        it("should fail create user", function (done) {
            var body = {
                "login"  : "super.duper",
                "pass"   : "superpass",
                "profile": 123456789
            };

            aggent
                .post('users')
                .send(body)
                .expect(404, done);
        });

        it('should return all users with provided profile', function (done) {
            aggent
                .get('users/profiles/1387275598000')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if(err){
                        return done(err);
                    }

                    expect(body).to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('count')
                        .and.to.be.at.least(0);
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);
                });

        });

        it("should remove user", function (done) {
            aggent
                .delete('users/' + id)
                .expect(200, done);
        });
    });

    describe("User login methods", function () {
        before(function () {
            aggent = request.agent(url);
        });

        it("should login success", function (done) {
            var body = {
                "login": "admin",
                "pass" : "1q2w3eQWE",
                "dbId" : "production"
            };

            aggent
                .post('users/login')
                .send(body)
                .expect(200, done);
        });

        it("should fail login, empty pass field", function (done) {
            var body = {
                "login" : "admin",
                "sfshdf": "1q2w3eQWE",
                "dbId"  : "production"
            };

            aggent
                .post('users/login')
                .send(body)
                .expect(400, done);
        });

        it("should fail login, wrong pass", function (done) {
            var body = {
                "login": "admin",
                "pass" : "jdgfdfjkgbdjgbjhfdbgdfbg",
                "dbId" : "production"
            };

            aggent
                .post('users/login')
                .send(body)
                .expect(400, done);
        });
    });
});

