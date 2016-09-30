// require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;
var dbId = 'vasyadb';
var admin = {
    login: 'superAdmin',
    pass : '111111',
    dbId : dbId
};
var bannedUser = {
    login: 'ArturMyhalko',
    pass : 'thinkmobiles2015',
    dbId : dbId
};

require('../../config/environment/development');

describe('Leads Specs', function () {
    'use strict';
    var id;

    this.timeout(10000);

    describe('Leads with admin', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send(admin)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create lead', function (done) {
            var body = {
                name    : 'Subject',
                workflow: "528ce74ef3f67bc40b00001e"
            };

            aggent
                .post('leads')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var bodyRes = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(bodyRes)
                        .to.be.instanceOf(Object);
                    expect(bodyRes)
                        .to.have.property('success');

                    id = bodyRes.id;

                    done();
                });
        });

        it('should fail create Lead', function (done) {
            var body = {};

            aggent
                .post('leads')
                .send(body)
                .expect(404, done);
        });

        it('should get Leads Priority', function (done) {
            aggent
                .get('leads/priority')
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

        it('should get Lead For Chart', function (done) {
            aggent
                .get('leads/getLeadsForChart')
                .query({type: 'sale'})
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

        it('should get Leads for viewType list', function (done) {

            var query = {
                viewType   : 'list',
                contentType: 'Leads',
                page       : 1,
                count      : 100
            };

            aggent
                .get('leads/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var firstProject;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body)
                        .to.have.property('total');
                    expect(body.data)
                        .to.be.instanceOf(Array);

                    firstProject = body.data[0];

                    expect(firstProject)
                        .and.to.have.property('_id')
                        .and.to.have.lengthOf(24);
                    expect(firstProject)
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(firstProject)
                        .to.have.property('workflow')
                        .and.to.have.property('_id');
                    expect(firstProject.workflow)
                        .to.have.property('name')
                        .and.to.be.a('string');
                    expect(firstProject.workflow)
                        .to.have.property('status');

                    expect(firstProject)
                        .to.have.property('source');
                    /*expect(firstProject)
                     .and.to.have.property('createdBy')
                     .and.to.have.property('date');*/
                    if (firstProject.salesPerson) {
                        expect(firstProject.salesPerson)
                            .to.have.property('name')
                            .and.to.have.property('first')
                            .and.to.be.a('string');
                        expect(Object.keys(firstProject.salesPerson).length).to.be.equal(2);
                    }
                    if (firstProject.skype) {
                        expect(firstProject.skype)
                            .to.be.a('string');
                    }

                    //expect(Object.keys(firstProject.createdBy).length).to.be.equal(2);
                    expect(Object.keys(firstProject.workflow).length).to.be.equal(3);
                    expect(Object.keys(firstProject).length).to.be.lte(9);
                    done();
                });
        });

        it('should get Lead for viewType form', function (done) {
            var query = {
                id      : id,
                viewType: 'form'
            };

            aggent
                .get('leads')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('_id');
                    expect(body)
                        .to.have.property('notes')
                        .and.to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('name')
                        .and.to.be.a('string');
                    expect(body)
                        .to.have.property('workflow')
                        .and.to.be.instanceOf(Object)
                        .and.to.have.property('_id', '528ce74ef3f67bc40b00001e');
                    expect(body)
                        .and.to.have.property('createdBy')
                        .and.to.have.property('date');
                    expect(body)
                        .and.to.have.property('createdBy')
                        .and.to.have.property('user');
                    expect(body)
                        .and.to.have.property('editedBy')
                        .and.to.have.property('date');
                    expect(body)
                        .and.to.have.property('editedBy')
                        .and.to.have.property('user');

                    done();
                });
        });

        /*        it('should get Lead for viewType kanban', function (done) {

         var query = {
         workflowId: '528ce5e3f3f67bc40b000018'
         };

         aggent
         .get('leads/kanban')
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
         .to.have.property('workflowId');
         done();
         });
         });*/

        it('should partially update Lead', function (done) {
            var body = {
                name: 'test'
            };
            aggent
                .patch('leads/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var bodyRes = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(bodyRes)
                        .to.be.instanceOf(Object);
                    expect(bodyRes)
                        .to.have.property('_id');

                    done();
                });
        });

        it('should Lead update', function (done) {
            var body = {
                _id: id
            };
            aggent
                .put('leads/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var bodyRes = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(bodyRes)
                        .to.be.instanceOf(Object);
                    expect(bodyRes)
                        .to.have.property('_id');

                    done();
                });
        });

        it('should remove Lead', function (done) {
            aggent
                .delete('leads/' + id)
                .expect(200, done);
        });

    });

    describe('Leads with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send(bannedUser)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create Leads', function (done) {
            var body = {
                name: 'Subject'
            };

            aggent
                .post('leads')
                .send(body)
                .expect(403, done);
        });
    });
});
