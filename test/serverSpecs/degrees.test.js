/**
 * Created by liliy on 04.02.2016.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Degrees Specs", function () {
    'use strict';
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

    it("should create Degree", function (done) {
        var body = {
            name: 'Professor1www'
        };

        aggent
            .post('degrees')
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

    it("should get degrees", function (done) {
        aggent
            .get('degrees')
            .expect(200)
            .end(function(err, res){
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

    it("should update degrees", function (done) {
        var body = {
            name: 'Proff'
        };

        aggent
            .put('degrees/' + id)
            .send(body)
            .expect(200)
            .end(function(err, res){
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

    it("should delete degree", function (done) {
        aggent
            .delete('degrees/' + id)
            .expect(200, done);
    });

});