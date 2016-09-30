require('../../config/environment/development');

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
var failUser = {
    login: 'ArturMyhalko',
    pass : 'thinkmobiles2015',
    dbId : dbId
};

describe('Opportunity Specs', function () {
    'use strict';
    var id;

    describe('Opportunity with admin', function () {
        this.timeout(10000);

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

        it('should create opportunity', function (done) {
            var body = {
                name: 'Subject',
                workflow: '528cdf1cf3f67bc40b00000b'
            };

            aggent
                .post('opportunities')
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

        it('should fail create opportunity', function (done) {
            var body = {};

            aggent
                .post('opportunities')
                .send(body)
                .expect(404, done);
        });

        it('should get opportunity Priority', function (done) {
            aggent
                .get('opportunities/priority')
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

        it('should get opportunity FilterValues', function (done) {
            aggent
                .get('opportunities/getFilterValues')
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

        it('should get opportunity ForMiniView', function (done) {
            aggent
                .get('opportunities/OpportunitiesForMiniView')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('listLength');
                    done();
                });
        });

        it('should get opportunity LengthByWorkflows', function (done) {
            aggent
                .get('opportunities/getLengthByWorkflows')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('arrayOfObjects');
                    expect(body.arrayOfObjects)
                        .to.be.instanceOf(Array);
                    expect(body)
                        .to.have.property('showMore');
                    done();
                });
        });

        it('should get opportunity for viewType list', function (done) {
            var query = {
                viewType     : 'list',
                contentType  : 'Opportunities',
                page         : 1,
                count        : 100
            };

            aggent
                .get('opportunities/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var first;

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

                    first = body.data[3];

                    expect(first)
                        .and.to.have.property('_id')
                        .and.to.have.lengthOf(24);
                    expect(first)
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(first)
                        .to.have.property('workflow')
                        .and.to.have.property('_id');
                    expect(first)
                        .to.have.property('workflow');
                    expect(first.workflow)
                        .to.have.property('name');
                    expect(first.workflow)
                        .to.have.property('status');
                    expect(first.workflow.name)
                        .to.be.a('string');
                    expect(first)
                        .and.to.have.property('editedBy')
                        .and.to.have.property('date');
                    expect(first)
                        .and.to.have.property('editedBy')
                        .and.to.have.property('user');
                    expect(first)
                        .to.have.property('expectedRevenue');
                    expect(first)
                        .to.have.property('nextAction');
                    expect(first)
                        .to.have.property('sequence');
                    expect(first)
                        .to.have.property('creationDate');
                    expect(first)
                        .to.have.property('expectedRevenue');

                    if (first.salesPerson) {
                        expect(first)
                            .and.to.have.property('salesPerson')
                            .and.to.have.property('name')
                            .and.to.have.property('first')
                            .and.to.be.a('string');
                    }

                    expect(Object.keys(first.editedBy).length).to.be.equal(2);
                    expect(Object.keys(first).length).to.be.lte(12);

                    done();
                });
        });

        it('should get opportunity for viewType form', function (done) {
            var query = {
                id      : id,
                viewType: 'form'
            };

            aggent
                .get('opportunities/')
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

                    done();
                });
        });

        it('should get opportunity for viewType kanban', function (done) {

            var query = {
                workflowId: '528cdf1cf3f67bc40b00000b',
                viewType  : 'kanban'
            };

            aggent
                .get('opportunities/')
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
        });

        it('should opportunity updateOnlySelectedFields', function (done) {
            var body = {
                name: 'test'
            };
            aggent
                .patch('opportunities/' + id)
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
                        .to.have.property('success');

                    done();
                });
        });

        it('should opportunity update', function (done) {
            var body = {
                _id: id
            };
            aggent
                .put('opportunities/' + id)
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
                        .to.have.property('success');
                    expect(bodyRes)
                        .to.have.property('result');

                    done();
                });
        });

        it('should remove opportunity', function (done) {
            aggent
                .delete('opportunities/' + id)
                .query({deleteHistory : true})
                .expect(200, done);
        });

        it('should create opportunity createLeadFromSite', function (done) {
            var body = {
                email  : 'test@example.com',
                name   : 'testName',
                company: 'testCompany'
            };

            aggent
                .post('opportunities/createLeadFromSite')
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var bodyRes = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(bodyRes)
                        .to.have.property('success');

                    id = bodyRes.id;

                    done();
                });
        });

        it('should fail create opportunity createLeadFromSite', function (done) {
            var body = {};

            aggent
                .post('opportunities/createLeadFromSite')
                .send(body)
                .expect(400, done);
        });

        it('should remove opportunity after createLeadFromSite', function (done) {
            aggent
                .delete('opportunities/' + id)
                .query({deleteHistory : true})
                .expect(200, done);
        });
    });

    describe('Opportunity with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send(failUser)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create Opportunity', function (done) {
            var body = {
                name: 'Subject'
            };

            aggent
                .post('opportunities')
                .send(body)
                .expect(403, done);
        });
    });
});
