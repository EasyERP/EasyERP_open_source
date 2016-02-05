require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Opportunity Specs", function () {
    'use strict';
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

    it('should create Opportunity', function(done){
        var body = {
            name: "Subject"
            //customer : 1
        };

        aggent
            .post('opportunities')
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

    it('should fail create Opportunity', function(done){
        var body = {

        };

        aggent
            .post('opportunities')
            .send(body)
            .expect(404, done);
    });

    it("should remove opportunity", function (done) {
        aggent
            .delete('opportunities/' + id)
            .expect(200, done);
    });
});
