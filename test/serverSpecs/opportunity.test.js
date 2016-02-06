require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Opportunity Specs", function () {
    'use strict';
    var id;

    describe('Opportunity with admin', function(){

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

        it('should create Opportunity', function(done){
            var body = {
                name: "Subject"
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

        it('should get Opportunity totalCount', function (done) {
            aggent
                .get('opportunities/totalCollectionLength')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('count');
                    expect(body)
                        .to.have.property('showMore');
                    done();
                });
        });

        it('', function(){

        });

        it("should remove opportunity", function (done) {
            aggent
                .delete('opportunities/' + id)
                .expect(200, done);
        });
    });

    describe('Opportunity with user without a license', function(){
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

        it('should fail create Opportunity', function(done){
            var body = {
                name: "Subject"
            };

            aggent
                .post('opportunities')
                .send(body)
                .expect(403, done);
        });
    });
});
