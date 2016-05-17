var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;


describe("Tasks Specs", function () {
    'use strict';

    describe("With admin user", function () {

        var id;
        var assignedTo = "55b92ad221e4b7c40f000030";
        var workflow = "528ce0cdf3f67bc40b00000c";
        var workflowChanged = "528ce35af3f67bc40b000010";
        var project = "55cdc96d9b42266a4f000006";
        var startDate = Date.now();
        var summary = "testTest";
        var estimated = 170;
        var logged = 12;
        var progress = Math.round((logged / estimated) * 100);
        var adminId = "52203e707d4dba8813000003";

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass: '1q2w3eQWE',
                    dbId: 'production'
                })
                .expect(200, done);
        });

        it("should create task", function (done) {

            var body = {
                "type": "Task",
                "summary": summary,
                "assignedTo": assignedTo,
                "workflow": workflow,
                "project": project,
                "tags": [""],
                "deadline": "",
                "description": "someDescription",
                "priority": "P3",
                "sequence": "",
                "StartDate": startDate,
                "estimated": estimated,
                "logged": logged
            };


            aggent
                .post('tasks')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var body = res.body;

                    expect(body)
                        .to.have.property('id');

                    id = body.id;

                    expect(body)
                        .to.have.property('success')
                        .and.to.be.valueOf('An new Task crate success');

                    if (err) {
                        return done(err);
                    }


                    done();
                });
        });

        it("should fail create task with empty summary", function (done) {

            var body = {
                "type": "Task",
                "summary": "",
                "assignedTo": "55b92ad221e4b7c40f000030",
                "workflow": "528ce0cdf3f67bc40b00000c",
                "project": "55cdc96d9b42266a4f000006",
                "tags": [""],
                "deadline": "",
                "description": "lkmjiomlkm",
                "priority": "P3",
                "sequence": "",
                "StartDate": "28 Feb, 2016",
                "estimated": "17",
                "logged": "7"
            };

            aggent
                .post('tasks')
                .send(body)
                .expect(404, done);
        });

        it("should fail create task with empty project", function (done) {

            var body = {
                "type": "Task",
                "summary": "123",
                "assignedTo": "55b92ad221e4b7c40f000030",
                "workflow": "528ce0cdf3f67bc40b00000c",
                "project": "",
                "tags": [""],
                "deadline": "",
                "description": "lkmjiomlkm",
                "priority": "P3",
                "sequence": "",
                "StartDate": "28 Feb, 2016",
                "estimated": "17",
                "logged": "7"
            };

            aggent
                .post('tasks')
                .send(body)
                .expect(404, done);
        });

        it('should return all tasks with details', function (done) {
            aggent
                .get('tasks/list')
                .query({count: 100})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    var task = body.data[0];

                    expect(task)
                        .to.have.property('EndDate');
                    expect(task)
                        .to.have.property('StartDate');
                    expect(Date(task.startDate)).to.be.equal(Date(startDate));
                    expect(task)
                        .to.have.property('_id')
                        .and.to.be.equal(id);
                    expect(task)
                        .to.have.property('assignedTo')
                        .and.to.have.property('_id')
                        .and.to.be.equal(assignedTo);
                    expect(task)
                        .to.have.property('createdBy')
                        .and.to.have.property('user')
                        .and.to.have.property('_id')
                        .and.to.equal(adminId);
                    expect(task)
                        .to.have.property('estimated')
                        .and.to.equal(estimated);
                    expect(task)
                        .to.have.property('logged')
                        .and.to.equal(logged);
                    expect(task)
                        .to.have.property('progress')
                        .and.to.equal(progress);

                    expect(task)
                        .to.have.property('project')
                        .and.to.have.property('_id')
                        .and.to.equal(project);
                    expect(task)
                        .to.have.property('sequence')
                        .and.to.be.above(-1);
                    expect(task)
                        .to.have.property('summary')
                        .and.to.equal(summary);
                    expect(task)
                        .to.have.property('tags')
                        .and.to.be.instanceOf(Array);
                    expect(task)
                        .to.have.property('taskCount')
                        .and.to.be.above(0);
                    expect(task)
                        .to.have.property('type')
                        .and.to.be.equal('Task');
                    expect(task)
                        .to.have.property('workflow')
                        .to.have.property('_id')
                        .and.to.be.equal(workflow);

                    done();
                });

        });

        it('should return one task with details', function (done) {
            aggent
                .get('tasks/form')
                .query({id: id})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }


                    var task = body;

                    expect(task)
                        .to.have.property('EndDate');
                    expect(task)
                        .to.have.property('StartDate');
                    expect(Date(task.startDate)).to.be.equal(Date(startDate));
                    expect(task)
                        .to.have.property('_id')
                        .and.to.be.equal(id);
                    expect(task)
                        .to.have.property('assignedTo')
                        .and.to.have.property('_id')
                        .and.to.be.equal(assignedTo);
                    expect(task)
                        .to.have.property('createdBy')
                        .and.to.have.property('user')
                        .and.to.have.property('_id')
                        .and.to.equal(adminId);
                    expect(task)
                        .to.have.property('estimated')
                        .and.to.equal(estimated);
                    expect(task)
                        .to.have.property('logged')
                        .and.to.equal(logged);
                    expect(task)
                        .to.have.property('progress')
                        .and.to.equal(progress);

                    expect(task)
                        .to.have.property('project')
                        .and.to.have.property('_id')
                        .and.to.equal(project);
                    expect(task)
                        .to.have.property('sequence')
                        .and.to.be.above(-1);
                    expect(task)
                        .to.have.property('summary')
                        .and.to.equal(summary);
                    expect(task)
                        .to.have.property('tags')
                        .and.to.be.instanceOf(Array);
                    expect(task)
                        .to.have.property('taskCount')
                        .and.to.be.above(0);
                    expect(task)
                        .to.have.property('type')
                        .and.to.be.equal('Task');
                    expect(task)
                        .to.have.property('workflow')
                        .to.have.property('_id')
                        .and.to.be.equal(workflow);

                    done();
                });

        });

        it('should return workflows list with task count and hours remain', function (done) {
            aggent
                .get('tasks/getLengthByWorkflows')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('arrayOfObjects')
                        .and.to.be.instanceOf(Array);

                    var workflowNew = body.arrayOfObjects[0];

                    expect(workflowNew)
                        .to.have.property('_id')
                        .and.to.be.equal(workflow);
                    expect(workflowNew)
                        .to.have.property('count')
                        .and.to.be.above(0);
                    expect(workflowNew)
                        .to.have.property('totalRemaining')
                        .and.to.be.above(0);

                    done();
                });

        });

        it('should return tasks for kanban', function (done) {
            aggent
                .get('tasks/kanban')
                .query({workflowId: workflow})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    expect(body)
                        .to.have.property('workflowId')
                        .and.to.be.equal(workflow);

                    var task;

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
                        .to.have.property('project')
                        .and.to.have.property('_id')
                        .and.to.equal(project);
                    expect(task)
                        .to.have.property('sequence')
                        .and.to.be.above(-1);
                    expect(task)
                        .to.have.property('summary')
                        .and.to.equal(summary);
                    expect(task)
                        .to.have.property('taskCount')
                        .and.to.be.above(0);
                    expect(task)
                        .to.have.property('type')
                        .and.to.be.equal('Task');
                    expect(task)
                        .to.have.property('workflow')
                        .and.to.be.equal(workflow);

                    done();
                });

        });

        it("should change workflow of task", function (done) {

            var body = {
                "workflow": workflowChanged,
                "sequenceStart": 0,
                "sequence": 0,
                "workflowStart": workflow
            };

            aggent
                .patch('tasks/' + id)
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
                .get('tasks/form')
                .query({id: id})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }


                    var task = body;

                    expect(task)
                        .to.have.property('EndDate');
                    expect(task)
                        .to.have.property('StartDate');
                    expect(Date(task.startDate)).to.be.equal(Date(startDate));
                    expect(task)
                        .to.have.property('_id')
                        .and.to.be.equal(id);
                    expect(task)
                        .to.have.property('assignedTo')
                        .and.to.have.property('_id')
                        .and.to.be.equal(assignedTo);
                    expect(task)
                        .to.have.property('createdBy')
                        .and.to.have.property('user')
                        .and.to.have.property('_id')
                        .and.to.equal(adminId);
                    expect(task)
                        .to.have.property('estimated')
                        .and.to.equal(estimated);
                    expect(task)
                        .to.have.property('logged')
                        .and.to.equal(logged);
                    expect(task)
                        .to.have.property('progress')
                        .and.to.equal(progress);

                    expect(task)
                        .to.have.property('project')
                        .and.to.have.property('_id')
                        .and.to.equal(project);
                    expect(task)
                        .to.have.property('sequence')
                        .and.to.be.above(-1);
                    expect(task)
                        .to.have.property('summary')
                        .and.to.equal(summary);
                    expect(task)
                        .to.have.property('tags')
                        .and.to.be.instanceOf(Array);
                    expect(task)
                        .to.have.property('taskCount')
                        .and.to.be.above(0);
                    expect(task)
                        .to.have.property('type')
                        .and.to.be.equal('Task');
                    expect(task)
                        .to.have.property('workflow')
                        .to.have.property('_id')
                        .and.to.be.equal(workflowChanged);

                    done();
                });

        });

        it("should update task", function (done) {

            var body = {
                "type": "Task",
                "summary": "testTestModified",
                "assignedTo": "55b92ad221e4b7c40f000030",
                "tags": [""],
                "description": "lkmjiomlkm",
                "priority": "P3",
                "StartDate": "28 Feb, 2016",
                "estimated": 17,
                "logged": 7,
                "sequenceStart": 0
            };

            aggent
                .patch('tasks/' + id)
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
                "type": "Task",
                "summary": "testTestModified",
                "assignedTo": "55b92ad221e4b7c40f000030",
                "tags": [""],
                "description": "lkmjiomlkm",
                "priority": "P3",
                "StartDate": "28 Feb, 2016",
                "estimated": 17,
                "logged": 7,
                "sequenceStart": 0
            };

            aggent
                .patch('tasks/' + id + '123')
                .send(body)
                .expect(500, done);
        });

        it("should remove task", function (done) {
            aggent
                .delete('tasks/' + id)
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
                .get('tasks/form')
                .query({id: id})
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

        it('should return priorities list', function (done) {
            aggent
                .get('tasks/priority')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    expect(body.data[0])
                        .to.have.property('priority');

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

    describe("With baned user", function () {

        var id;
        var assignedTo = "55b92ad221e4b7c40f000030";
        var workflow = "528ce0cdf3f67bc40b00000c";
        var workflowChanged = "528ce35af3f67bc40b000010";
        var project = "55cdc96d9b42266a4f000006";
        var startDate = Date.now();
        var summary = "testTest";
        var estimated = 170;
        var logged = 12;
        var progress = Number(((logged / estimated) * 100).toFixed(0));
        var adminId = "52203e707d4dba8813000003";

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass: 'thinkmobiles2015',
                    dbId: 'production'
                })
                .expect(200, done);
        });

        it("should fail create task", function (done) {

            var body = {
                "type": "Task",
                "summary": summary,
                "assignedTo": assignedTo,
                "workflow": workflow,
                "project": project,
                "tags": [""],
                "deadline": "",
                "description": "someDescription",
                "priority": "P3",
                "sequence": "",
                "StartDate": startDate,
                "estimated": estimated,
                "logged": logged
            };


            aggent
                .post('tasks')
                .send(body)
                .expect(403, done);

        });

        it('should fail return all tasks with details', function (done) {
            aggent
                .get('tasks/list')
                .query({count: 100})
                .expect(403, done);

        });

        it('should fail return one task with details', function (done) {
            aggent
                .get('tasks/form')
                .query({id: id})
                .expect(403, done);

        });

        it('should fail return workflows list', function (done) {
            aggent
                .get('tasks/getLengthByWorkflows')
                .expect(403, done);

        });

        it('should fail return tasks for kanban', function (done) {
            aggent
                .get('tasks/kanban')
                .query({workflowId: workflow})
                .expect(403, done);

        });

        it("should fail change workflow of task", function (done) {

            var body = {
                "workflow": workflowChanged,
                "sequenceStart": 0,
                "sequence": 0,
                "workflowStart": workflow
            };

            aggent
                .patch('tasks/' + id)
                .send(body)
                .expect(403, done);
        });

        it("should fail update task", function (done) {

            var body = {
                "type": "Task",
                "summary": "testTestModified",
                "assignedTo": "55b92ad221e4b7c40f000030",
                "tags": [""],
                "description": "lkmjiomlkm",
                "priority": "P3",
                "StartDate": "28 Feb, 2016",
                "estimated": 17,
                "logged": 7,
                "sequenceStart": 0
            };

            aggent
                .patch('tasks/' + id)
                .send(body)
                .expect(403, done);
        });

        it("should fail remove task", function (done) {
            aggent
                .delete('tasks/' + id)
                .expect(403, done);
        });

        it('should fail return priorities list', function (done) {
            aggent
                .get('tasks/priority')
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

