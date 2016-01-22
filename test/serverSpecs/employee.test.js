/**
 * Created by liliy on 22.01.2016.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Employee Specs", function () {
    var id;

    before(function (done) {
        aggent = request.agent(url);

        aggent
            .post('login')
            .send({
                login: 'admin',
                pass : '1q2w3eQWE',
                dbId : 'production'
            })
            .expect(200, done);
    });

    it("should create employee", function (done) {
        var body = {
            "name"       : {
                "first": "test",
                "last" : "test"
            },
            "department" : "55b92ace21e4b7c40f00000f",
            "jobPosition": "55b92acf21e4b7c40f00001d",
            "dateBirth": "28 Dec, 1990"
        };

        aggent
            .post('employee')
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

    it("should not create employee", function (done) {

        var bodyError = {
            "department" : "55b92ace21e4b7c40f00000f",
            "jobPosition": "55b92acf21e4b7c40f00001d",
            "dateBirth": "cccccc"
        };

        aggent
            .post('employee')
            .send(bodyError)
            .expect(500)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body)
                    .to.be.instanceOf(Object);
                expect(body)
                    .to.have.property('error');

                done();
            });
    });

    it("should delete employee", function (done) {
        aggent
            .delete('employee/' + id)
            .expect(200, done);

        aggent
            .delete('employee/' + 'kkk')
            .expect(500, done);
    });

});