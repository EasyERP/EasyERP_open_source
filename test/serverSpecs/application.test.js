/**
 * Created by liliy on 27.01.2016.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Application Specs", function () {
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
            "dateBirth"  : "28 Dec, 1990",
            hire         : [{
                department : "55b92ace21e4b7c40f00000f",
                jobPosition: "55b92acf21e4b7c40f00001d",
                manager    : "56938d2cd87c9004552b639e",
                jobType    : 'Full-time',
                info       : "Hired",
                date       : new Date()
            }]
        };

        aggent
            .post('application')
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
                expect(body.result)
                    .to.have.property('_id');

                id = body.id;

                done();
            });
    });

    it("should getById application", function (done) {
        var query = {
            id: "55b92ad221e4b7c40f000032"
        };
        aggent
            .get('application/form')
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

    it("should get by viewType application", function (done) {
        var query = {
            viewType   : "list",
            contentType: "Applications",
            page       : 1,
            count      : 100
        };
        aggent
            .get('application/list')
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
                    .to.have.property('data');

                done();
            });
    });

    it("should get by viewType application", function (done) {
        var query = {
            workflowId: '528ce5e3f3f67bc40b000018'
        };
        aggent
            .get('application/kanban')
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
                    .to.have.property('data');
                expect(body)
                    .to.have.property('time');
                expect(body)
                    .to.have.property('workflowId');
                expect(body)
                    .to.have.property('fold');

                done();
            });
    });

    it("should update application", function (done) {
        var body = {
            'social': {
                LI: 'test'
            }
        };
        aggent
            .patch('application/56938d2cd87c9004552b639e')
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

    //it("should delete application", function (done) {
    //    aggent
    //        .delete('application/' + id)
    //        .expect(200, done);
    //});
});