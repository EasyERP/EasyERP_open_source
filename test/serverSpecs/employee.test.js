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
            "dateBirth"  : "cccccc"
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

    it("should getById employee", function (done) {
        var query = {
            id: "55b92ad221e4b7c40f000032"
        };
        aggent
            .get('employee/form')
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

    it("should get by viewType employee", function (done) {
        var query = {
            viewType   : "list",
            contentType: "Employees",
            page       : 1,
            count      : 100
        };
        aggent
            .get('employee/thumbnails')
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

    it("should get employee for project details", function (done) {
        var ids = [
            "55b92ad221e4b7c40f000032",
            "55b92ad221e4b7c40f000033"
        ];
        aggent
            .get('employee/getForProjectDetails')
            .query({data: ids})
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body)
                    .to.be.instanceOf(Array);

                done();
            });
    });

    it("should not get employee for project details", function (done) {
        var ids = 'dddd';
        aggent
            .get('employee/getForProjectDetails')
            .query({data: ids})
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

    it("should get employees forDD", function (done) {
        aggent
            .get('employee/getForDD')
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

    it("should get only employees forDD", function (done) {
        aggent
            .get('employee/getForDD')
            .query({isEmployee: true})
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

    it("should get employees for salesManager", function (done) {
        aggent
            .get('employee/bySales')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body)
                    .to.be.instanceOf(Array);

                done();
            });
    });

    it("should get employees grouped by department", function (done) {
        aggent
            .get('employee/byDepartment')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body)
                    .to.be.instanceOf(Array)
                    .and.to.be.not.empty;

                done();
            });
    });

    it("should get employees grouped by department", function (done) {
        aggent
            .get('employee/byDepartment')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body)
                    .to.be.instanceOf(Array)
                    .and.to.be.not.empty;

                done();
            });
    });

    it("should get employees min hire date of employees", function (done) {
        aggent
            .get('employee/getMinHireDate')
            .expect(200)
            .end(function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body)
                    .to.be.instanceOf(Object);
                expect(body)
                    .to.have.property('min');

                done();
            });
    });

    it("should get employee for related user", function (done) {
        aggent
            .get('employee/getForDdByRelatedUser')
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

    it("should get employee as salesPerson for dropDown", function (done) {
        aggent
            .get('employee/getSalesPerson')
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

    it("should get first letters of last name of employee", function (done) {
        aggent
            .get('employee/getEmployeesAlphabet')
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

    it("should update employee", function (done) {
        var body = {
            source: 'testSource'
        };
        aggent
            .patch('employee/56938d2cd87c9004552b639e')
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

    //it("should delete employee", function (done) {
    //    aggent
    //        .delete('employee/' + id)
    //        .expect(200, done);
    //});
    //
    //it("should not delete employee", function (done) {
    //    aggent
    //        .delete('employee/' + 'kkk')
    //        .expect(500, done);
    //});

});