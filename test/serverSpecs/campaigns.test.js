var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('Campaigns Specs', function () {
    'use strict';
    before(function (done) {
        aggent = request.agent(url);

        aggent
            .post('users/login')
            .send({
                login: 'superAdmin',
                pass : '111111',
                dbId : 'vasyadb'
            })
            .expect(200, done);
    });

    it('should get campaigns for dropDown', function (done) {
        aggent
            .get('campaigns')
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
});