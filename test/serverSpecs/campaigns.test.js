/**
 * Created by liliy on 04.02.2016.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Campaigns Specs", function () {
    'use strict';
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

    it("should get campaigns for dropDown", function (done) {
        aggent
            .get('campaigns/getForDD')
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
});