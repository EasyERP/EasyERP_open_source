var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

describe("User Specs", function () {
    'use strict';

    before(function () {
        aggent = request.agent(url);
    });

    it("should login success", function (done) {
        var body = {
            "login"  : "admin",
            "pass": "1q2w3eQWE",
            "dbId"   : "production"
        };

        aggent
            .post('users/login')
            .send(body)
            .expect(200, done);
    });

    it("should fail login, empty pass field", function (done) {
        var body = {
            "login"  : "admin",
            "sfshdf": "1q2w3eQWE",
            "dbId"   : "production"
        };

        aggent
            .post('users/login')
            .send(body)
            .expect(500, done);
    });

    it("should fail login, wrong pass", function (done) {
        var body = {
            "login"  : "admin",
            "pass": "jdgfdfjkgbdjgbjhfdbgdfbg",
            "dbId"   : "production"
        };

        aggent
            .post('users/login')
            .send(body)
            .expect(400, done);
    });
});

