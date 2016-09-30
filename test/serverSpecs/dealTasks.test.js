var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;
var CONSTANTS = require('../../constants/constantsTest');

require('../../config/environment/development');

describe("Tasks Specs", function () {
    'use strict';

    describe("With admin user", function () {

        var id;
        var assignedTo = CONSTANTS.EMPLOYEE;
        var workflow = "5783b351df8b918c31af24a8";
        var workflowChanged = "5783b351df8b918c31af24a9";
        var company = CONSTANTS.SUPPLIER;
        var opportunity = CONSTANTS.OPPORTUNITY;
        var dueDate = Date.now();

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

        it("should create task", function (done) {

            var body = {
                "type"       : "Task",
                "assignedTo" : assignedTo,
                "workflow"   : workflow,
                "description": "someDescription",
                "sequence"   : "",
                "dueDate"    : dueDate,
                "company"    : company,
                "deal"       : opportunity
            };

            aggent
                .post('dealTasks')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var body = res.body;

                    expect(body)
                        .to.have.property('id');

                    id = body.id;

                    expect(body)
                        .to.have.property('success')
                        .and.to.be.valueOf('New Task created success');

                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return all tasks with details', function (done) {
            aggent
                .get('dealTasks/')
                .query({count: 100, viewType: 'list'})
                .expect(200)
                .end(function (err, res) {
                    var task;
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    body.data.forEach(function (el) {
                        if (el._id === id) {
                            task = el;
                        }
                    });

                    expect(task)
                        .to.have.property('dueDate');
                    expect(Date(task.dueDate)).to.be.equal(Date(dueDate));
                    expect(task)
                        .to.have.property('_id')
                        .and.to.be.equal(id);
                    expect(task)
                        .to.have.property('assignedTo')
                        .and.to.have.property('_id')
                        .and.to.be.equal(assignedTo);
                    expect(task)
                        .to.have.property('description')
                        .and.to.equal('someDescription');
                    expect(task)
                        .to.have.property('company')
                        .and.to.have.property('_id')
                        .and.to.be.equal(company);
                    expect(task)
                        .to.have.property('deal')
                        .and.to.have.property('_id')
                        .and.to.be.equal(opportunity);
                    expect(task)
                        .to.have.property('workflow')
                        .to.have.property('_id')
                        .and.to.be.equal(workflow);

                    done();
                });

        });

        it('should return one task with details', function (done) {
            aggent
                .get('dealTasks')
                .query({id: id, viewType: 'form'})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    var task = body;

                    expect(task)
                        .to.have.property('dueDate');
                    expect(Date(task.dueDate)).to.be.equal(Date(dueDate));
                    expect(task)
                        .to.have.property('_id')
                        .and.to.be.equal(id);
                    expect(task)
                        .to.have.property('assignedTo')
                        .and.to.have.property('_id')
                        .and.to.be.equal(assignedTo);
                    expect(task)
                        .to.have.property('editedBy')
                        .and.to.have.property('user')
                    expect(task)
                        .to.have.property('sequence')
                        .and.to.be.above(-1);
                    expect(task)
                        .to.have.property('description')
                        .and.to.equal('someDescription');
                    expect(task)
                        .to.have.property('company')
                        .and.to.have.property('_id')
                        .and.to.be.equal(company);
                    expect(task)
                        .to.have.property('deal')
                        .and.to.have.property('_id')
                        .and.to.be.equal(opportunity);
                    expect(task)
                        .to.have.property('workflow')
                        .to.have.property('_id')
                        .and.to.be.equal(workflow);

                    done();
                });
        });

        it('should return workflows list with task count and hours remain', function (done) {
            aggent
                .get('dealTasks/getLengthByWorkflows')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var workflowNew;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('arrayOfObjects')
                        .and.to.be.instanceOf(Array);

                    body.arrayOfObjects.forEach(function (el) {
                        if (el._id === workflow) {
                            workflowNew = el;
                        }
                    });

                    expect(workflowNew)
                        .to.have.property('_id')
                        .and.to.be.equal(workflow);
                    expect(workflowNew)
                        .to.have.property('count')
                    expect(workflowNew)
                        .to.have.property('totalRemaining')

                    done();
                });

        });

        it('should return tasks for kanban', function (done) {
            aggent
                .get('dealTasks')
                .query({workflowId: workflow})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var task;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    expect(body)
                        .to.have.property('workflowId')
                        .and.to.be.equal(workflow);

                    body.data.forEach(function (el) {
                        if (el._id === id) {
                            task = el;
                        }
                    })

                    expect(task)
                        .to.have.property('_id')
                        .and.to.be.equal(id);
                    expect(task)
                        .to.have.property('assignedTo')
                        .and.to.have.property('_id')
                        .and.to.be.equal(assignedTo);
                    expect(task)
                        .to.have.property('sequence')
                        .and.to.be.above(-1);
                    expect(task)
                        .to.have.property('description')
                        .and.to.equal('someDescription');
                    expect(task)
                        .to.have.property('company')
                        .and.to.have.property('_id')
                        .and.to.be.equal(company);
                    expect(task)
                        .to.have.property('deal')
                        .and.to.have.property('_id')
                        .and.to.be.equal(opportunity);
                    expect(task)
                        .to.have.property('workflow')
                        .and.to.have.property('_id')
                        .and.to.be.equal(workflow);

                    done();
                });

        });

        it("should change workflow of task", function (done) {

            var body = {
                "workflow"     : workflowChanged,
                "sequenceStart": 0,
                "sequence"     : 0,
                "workflowStart": workflow
            };

            aggent
                .patch('dealTasks/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property("success")
                        .and.to.be.valueOf("Tasks updated");

                    done();
                });
        });

        it('check if workflow changed', function (done) {
            aggent
                .get('dealTasks')
                .query({id: id, viewType: 'form'})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    var task = body;

                    expect(task)
                        .to.have.property('dueDate');
                    expect(Date(task.dueDate)).to.be.equal(Date(dueDate));
                    expect(task)
                        .to.have.property('_id')
                        .and.to.be.equal(id);
                    expect(task)
                        .to.have.property('assignedTo')
                        .and.to.have.property('_id')
                        .and.to.be.equal(assignedTo);
                    expect(task)
                        .to.have.property('editedBy')
                        .and.to.have.property('user')
                    expect(task)
                        .to.have.property('sequence')
                        .and.to.be.above(-1);
                    expect(task)
                        .to.have.property('description')
                        .and.to.equal('someDescription');
                    expect(task)
                        .to.have.property('workflow')
                        .to.have.property('_id')
                        .and.to.be.equal(workflowChanged);

                    done();
                });

        });

        it("should update task", function (done) {

            var body = {
                "assignedTo"   : "55b92ad221e4b7c40f000030",
                "description"  : "lkmjiomlkm",
                "dueDate"      : "28 Feb, 2016",
                "sequenceStart": 0
            };

            aggent
                .patch('dealTasks/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property("success")
                        .and.to.be.valueOf("Tasks updated");

                    done();
                });
        });

        it("should fail update task with wrong id", function (done) {

            var body = {
                "type"         : "Task",
                "summary"      : "testTestModified",
                "assignedTo"   : "55b92ad221e4b7c40f000030",
                "tags"         : [""],
                "description"  : "lkmjiomlkm",
                "priority"     : "P3",
                "StartDate"    : "28 Feb, 2016",
                "estimated"    : 17,
                "logged"       : 7,
                "sequenceStart": 0
            };

            aggent
                .patch('dealTasks/' + id + '123')
                .send(body)
                .expect(500, done);
        });

        it("should remove task", function (done) {
            aggent
                .delete('dealTasks/' + id)
                .expect(200)
                .end(function (err, res) {

                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('success')
                        .and.to.be.valueOf('Success removed');

                    done();

                });
        });

        it('should return empty object when querying deleted task', function (done) {
            aggent
                .get('dealTasks')
                .query({id: id, viewType: 'form'})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body).to.be.eql({});

                    done();
                });

        });

        after(function (done) {
            aggent = request.agent(url);
            aggent
                .get('logout')
                .send()
                .expect(302, done);
        });

    });

    describe("With banned user", function () {

        var id;
        var assignedTo = CONSTANTS.EMPLOYEE;
        var workflow = "5783b351df8b918c31af24a8";
        var workflowChanged = "5783b351df8b918c31af24a9";
        var dueDate = Date.now();

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass : 'thinkmobiles2015',
                    dbId : 'pavlodb'
                })
                .expect(200, done);
        });

        it("should fail create task", function (done) {

            var body = {
                "type"       : "Task",
                "assignedTo" : assignedTo,
                "workflow"   : workflow,
                "description": "someDescription",
                "sequence"   : "",
                "dueDate"    : dueDate
            };

            aggent
                .post('dealTasks')
                .send(body)
                .expect(403, done);

        });

        it('should fail return all tasks with details', function (done) {
            aggent
                .get('dealTasks/')
                .query({count: 100, viewType: 'list'})
                .expect(403, done);

        });

        it('should fail return one task with details', function (done) {
            aggent
                .get('dealTasks/form')
                .query({id: id})
                .expect(403, done);

        });

        it('should fail return workflows list', function (done) {
            aggent
                .get('dealTasks/getLengthByWorkflows')
                .expect(403, done);

        });

        it('should fail return tasks for kanban', function (done) {
            aggent
                .get('dealTasks/kanban')
                .query({workflowId: workflow})
                .expect(403, done);

        });

        it("should fail change workflow of task", function (done) {

            var body = {
                "workflow"     : workflowChanged,
                "sequenceStart": 0,
                "sequence"     : 0,
                "workflowStart": workflow
            };

            aggent
                .patch('dealTasks/' + id)
                .send(body)
                .expect(403, done);
        });

        it("should fail update task", function (done) {

            var body = {
                "type"         : "Task",
                "summary"      : "testTestModified",
                "assignedTo"   : "55b92ad221e4b7c40f000030",
                "tags"         : [""],
                "description"  : "lkmjiomlkm",
                "priority"     : "P3",
                "StartDate"    : "28 Feb, 2016",
                "estimated"    : 17,
                "logged"       : 7,
                "sequenceStart": 0
            };

            aggent
                .patch('dealTasks/' + id)
                .send(body)
                .expect(403, done);
        });

        it("should fail remove task", function (done) {
            aggent
                .delete('dealTasks/' + id)
                .expect(403, done);
        });

        after(function (done) {
            aggent = request.agent(url);
            aggent
                .get('logout')
                .send()
                .expect(302, done);
        });

    });

});

