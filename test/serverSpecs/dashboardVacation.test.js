var request = require('supertest');
var expect = require('chai').expect;
var moment = require('../../public/js/libs/moment/moment');

var url = 'http://localhost:8089/';
var CONSTANTS = require('../../constants/mainConstants');
var aggent;

require('../../config/environment/development');

describe('Dashboard Vacation Specs', function () {
    'use strict';

    describe('With admin user', function () {

        var startTime;
        var endTime;

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

        it('should return dashboard using startDate == now', function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/vacation')
                .query({'filter[startDate]': startTime.toString()})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var dateByWeekStart = moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'weeks');
                    var dateByWeekEnd = moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'weeks');
                    var duration = dateByWeekEnd.diff(dateByWeekStart, 'weeks');
                    var departmentDashboard;
                    var employee;
                    var department;
                    var departmentId;
                    var employeeId;
                    var hired;
                    var hireDate;
                    var hireWeekDate;
                    var now;
                    var weekData;
                    var project;

                    if (err) {
                        return done(err);
                    }

                    dateByWeekStart = dateByWeekStart.isoWeek() + 100 * dateByWeekStart.isoWeekYear();
                    dateByWeekEnd = dateByWeekEnd.isoWeek() + 100 * dateByWeekEnd.isoWeekYear();

                    expect(body)
                        .to.be.instanceOf(Object);

                    departmentDashboard = body.sortDepartments[0];

                    expect(departmentDashboard)
                        .to.have.property('employees')
                        .and.to.be.instanceOf(Array);

                    employee = departmentDashboard.employees[0];

                    expect(departmentDashboard)
                        .to.have.property('department');

                    department = departmentDashboard.department;

                    expect(department)
                        .to.have.property('_id');
                    expect(department)
                        .to.have.property('name');

                    departmentId = department._id;

                    expect(employee)
                        .to.have.property('_id');
                    expect(employee)
                        .to.have.property('_lastTransferDate')
                        .and.to.be.a('number');
                    expect(employee)
                        .to.have.property('_firstTransferDate')
                        .and.to.be.a('number');
                    expect(employee)
                        .to.have.property('isLead');
                    expect(employee)
                        .to.have.property('isTransfer');
                    expect(employee)
                        .to.have.property('maxProjects')
                        .and.to.be.least(0);
                    expect(employee)
                        .to.have.property('name');
                    expect(employee)
                        .to.have.property('weekData')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.length(duration + 1);

                    employeeId = employee._id;
                    /*hired = employee.hired.reduce(function (previous, current) {
                     return previous.date > current.date ? previous : current;
                     });

                     expect(hired)
                     .to.have.property('date');

                     hireDate = moment(hired.date);
                     hireWeekDate = hireDate.isoWeek() - 1 + 100 * hireDate.isoWeekYear();
                     hireDate = hireDate.valueOf();
                     now = moment().valueOf();

                     expect(employee.lastHire)
                     .to.be.equal(hireWeekDate);

                     expect(hireDate).to.be.below(now);
                     expect(hired)
                     .to.have.property('info');
                     expect(hired)
                     .to.have.property('salary')
                     .and.to.be.least(0);
                     expect(hired)
                     .to.have.property('jobType');
                     expect(hired)
                     .to.have.property('manager');
                     expect(hired)
                     .to.have.property('jobPosition');
                     expect(hired)
                     .to.have.property('department')
                     .and.to.be.equal(departmentId);*/

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek < current.dateByWeek ? previous : current;
                    });

                    expect(weekData)
                        .to.have.property('projectRoot')
                        .and.to.be.instanceOf(Array);
                    expect(weekData)
                        .to.have.property('hours')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);
                    expect(weekData)
                        .to.have.property('employee')
                        .and.to.be.equal(employeeId);
                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                    expect(weekData)
                        .to.have.property('projects');
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    project = weekData.projectRoot[0];

                    expect(project)
                        .to.have.property('hours')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(project)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);
                    expect(project)
                        .to.have.property('employee')
                        .and.to.be.equal(employeeId);
                    expect(project)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                    expect(project)
                        .to.have.property('project');

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek > current.dateByWeek ? previous : current;
                    });

                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekEnd);
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    done();
                });
        });

        it('should return dashboard using startDate == 01.01.2016, endDate == 05.05.2016', function (done) {

            startTime = new Date(2016, 1, 1);
            endTime = new Date(2016, 5, 5);

            aggent
                .get('dashboard/vacation')
                .query({'filter[startDate]': startTime.toString()})
                .query({'filter[endDate]': endTime.toString()})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var dateByWeekStart = moment(startTime);
                    var dateByWeekEnd = moment(endTime);
                    var duration = dateByWeekEnd.diff(dateByWeekStart, 'weeks');
                    var departmentDashboard;
                    var employee;
                    var department;
                    var departmentId;
                    var employeeId;
                    var hired;
                    var hireDate;
                    var hireWeekDate;
                    var now;
                    var weekData;
                    var project;

                    if (err) {
                        return done(err);
                    }

                    dateByWeekStart = dateByWeekStart.isoWeek() + 100 * dateByWeekStart.isoWeekYear();
                    dateByWeekEnd = dateByWeekEnd.isoWeek() + 100 * dateByWeekEnd.isoWeekYear();

                    expect(body)
                        .to.be.instanceOf(Object);

                    departmentDashboard = body.sortDepartments[0];

                    expect(departmentDashboard)
                        .to.have.property('employees')
                        .and.to.be.instanceOf(Array);

                    employee = departmentDashboard.employees[0];

                    expect(departmentDashboard)
                        .to.have.property('department');

                    department = departmentDashboard.department;

                    expect(department)
                        .to.have.property('_id');
                    expect(department)
                        .to.have.property('name');

                    departmentId = department._id;

                    expect(employee)
                        .to.have.property('_id');
                    /*expect(employee)
                     .to.have.property('fired')
                     .and.to.be.instanceOf(Array);
                     expect(employee)
                     .to.have.property('hired')
                     .and.to.be.instanceOf(Array);
                     expect(employee)
                     .to.have.property('isLead')
                     .and.to.be.least(0);
                     expect(employee)
                     .to.have.property('lastHire');*/
                    expect(employee)
                        .to.have.property('maxProjects')
                        .and.to.be.least(0);
                    expect(employee)
                        .to.have.property('name');
                    expect(employee)
                        .to.have.property('weekData')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.length(duration + 1);

                    employeeId = employee._id;
                    /*hired = employee.hired.reduce(function (previous, current) {
                     return previous.date > current.date ? previous : current;
                     });

                     expect(hired)
                     .to.have.property('date');

                     hireDate = moment(hired.date);
                     hireWeekDate = hireDate.isoWeek() - 1 + 100 * hireDate.isoWeekYear();
                     hireDate = hireDate.valueOf();
                     now = moment().valueOf();

                     expect(employee.lastHire)
                     .to.be.equal(hireWeekDate);

                     expect(hireDate).to.be.below(now);
                     expect(hired)
                     .to.have.property('info');
                     expect(hired)
                     .to.have.property('salary')
                     .and.to.be.least(0);
                     expect(hired)
                     .to.have.property('jobType');
                     expect(hired)
                     .to.have.property('manager');
                     expect(hired)
                     .to.have.property('jobPosition');
                     expect(hired)
                     .to.have.property('department')
                     .and.to.be.equal(departmentId);*/

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek < current.dateByWeek ? previous : current;
                    });

                    /*expect(weekData)
                     .to.have.property('projectRoot')
                     .and.to.be.instanceOf(Array);
                     expect(weekData)
                     .to.have.property('hours')
                     .and.to.be.least(0)
                     .and.to.be.most(168);
                     expect(weekData)
                     .to.have.property('department')
                     .and.to.be.equal(departmentId);
                     expect(weekData)
                     .to.have.property('employee')
                     .and.to.be.equal(employeeId);*/
                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                    /*expect(weekData)
                     .to.have.property('projects');*/
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    /*project = weekData.projectRoot[0];

                     expect(project)
                     .to.have.property('hours')
                     .and.to.be.least(0)
                     .and.to.be.most(168);
                     expect(project)
                     .to.have.property('department')
                     .and.to.be.equal(departmentId);
                     expect(project)
                     .to.have.property('employee')
                     .and.to.be.equal(employeeId);
                     expect(project)
                     .to.have.property('dateByWeek')
                     .and.to.be.equal(dateByWeekStart);
                     expect(project)
                     .to.have.property('project');*/

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek > current.dateByWeek ? previous : current;
                    });

                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekEnd);
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    done();
                });
        });

        it('should fail return dashboard using startDate == 03.03.2016, endDate == 01.01.2016', function (done) {

            startTime = new Date(2016, 2, 3);
            endTime = new Date(2016, 0, 1);

            aggent
                .get('dashboard/vacation')
                .query({'filter[startDate]': startTime.toString()})
                .query({'filter[endDate]': endTime.toString()})
                .expect(500, done);
        });

        it('should return dashboard using startDate == now', function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/vacation')
                .query({
                    'filter[startDate]': startTime.toString()
                })
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var dateByWeekStart = moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'weeks');
                    var dateByWeekEnd = moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'weeks');
                    var duration = dateByWeekEnd.diff(dateByWeekStart, 'weeks');
                    var departmentDashboard;
                    var employee;
                    var department;
                    var departmentId;
                    var employeeId;
                    var hired;
                    var hireDate;
                    var hireWeekDate;
                    var now;
                    var weekData;
                    var project;

                    if (err) {
                        return done(err);
                    }

                    dateByWeekStart = dateByWeekStart.isoWeek() + 100 * dateByWeekStart.isoWeekYear();
                    dateByWeekEnd = dateByWeekEnd.isoWeek() + 100 * dateByWeekEnd.isoWeekYear();

                    expect(body.sortDepartments)
                        .to.be.instanceOf(Array);

                    departmentDashboard = body.sortDepartments[0];

                    expect(departmentDashboard)
                        .to.have.property('employees')
                        .and.to.be.instanceOf(Array);

                    employee = departmentDashboard.employees[0];

                    expect(departmentDashboard)
                        .to.have.property('department');

                    department = departmentDashboard.department;

                    expect(department)
                        .to.have.property('_id');
                    expect(department)
                        .to.have.property('name');

                    departmentId = department._id;

                    expect(employee)
                        .to.have.property('_id');
                    /*expect(employee)
                        .to.have.property('fired')
                        .and.to.be.instanceOf(Array);
                    expect(employee)
                        .to.have.property('hired')
                        .and.to.be.instanceOf(Array);*/
                    expect(employee)
                        .to.have.property('isLead')
                        .and.to.be.least(0);
                    /*expect(employee)
                        .to.have.property('lastHire');*/
                    expect(employee)
                        .to.have.property('maxProjects')
                        .and.to.be.least(0);
                    expect(employee)
                        .to.have.property('name');
                    expect(employee)
                        .to.have.property('weekData')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.length(duration + 1);

                    employeeId = employee._id;
                    /*hired = employee.hired.reduce(function (previous, current) {
                        return previous.date > current.date ? previous : current;
                    });

                    expect(hired)
                        .to.have.property('date');

                    hireDate = moment(hired.date);
                    hireWeekDate = hireDate.isoWeek() - 1 + 100 * hireDate.isoWeekYear();
                    hireDate = hireDate.valueOf();
                    now = moment().valueOf();

                    expect(employee.lastHire)
                        .to.be.equal(hireWeekDate);

                    expect(hireDate).to.be.below(now);
                    expect(hired)
                        .to.have.property('info');
                    expect(hired)
                        .to.have.property('salary')
                        .and.to.be.least(0);
                    expect(hired)
                        .to.have.property('jobType');
                    expect(hired)
                        .to.have.property('manager');
                    expect(hired)
                        .to.have.property('jobPosition');
                    expect(hired)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);*/

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek < current.dateByWeek ? previous : current;
                    });

                    expect(weekData)
                        .to.have.property('projectRoot')
                        .and.to.be.instanceOf(Array);
                    expect(weekData)
                        .to.have.property('hours')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);
                    expect(weekData)
                        .to.have.property('employee')
                        .and.to.be.equal(employeeId);
                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                    expect(weekData)
                        .to.have.property('projects');
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    project = weekData.projectRoot[0];

                    expect(project)
                        .to.have.property('hours')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(project)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);
                    expect(project)
                        .to.have.property('employee')
                        .and.to.be.equal(employeeId);
                    expect(project)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                    expect(project)
                        .to.have.property('project');

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek > current.dateByWeek ? previous : current;
                    });

                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekEnd);
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    done();
                });
        });

        it('should return empty response using startDate == now and employee == 55b92ad221e4b7c40faa0031', function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/vacation')
                .query({'filter[startDate]': startTime.toString()})
                .query({'filter[name][key]': 'employee'})
                .query({'filter[name][value][]': '55b92ad221e4b7c40faa0031'})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var dateByWeekStart = moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'weeks');
                    var dateByWeekEnd = moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'weeks');

                    if (err) {
                        return done(err);
                    }

                    expect(body.sortDepartments)
                        .to.be.instanceOf(Array)
                        .and.to.have.length(0);

                    done();
                });
        });

        it('should return dashboard using startDate == now and department._id == 55b92ace21e4b7c40f000010', function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/vacation')
                .query({'filter[department][key]': 'department._id'})
                .query({'filter[department][value][]': '55b92ace21e4b7c40f000010'})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var dateByWeekStart = moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'weeks');
                    var dateByWeekEnd = moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'weeks');
                    var duration = dateByWeekEnd.diff(dateByWeekStart, 'weeks');
                    var departmentDashboard;
                    var employee;
                    var department;
                    var departmentId;
                    var employeeId;
                    var hired;
                    var hireDate;
                    var hireWeekDate;
                    var now;
                    var weekData;
                    var project;

                    if (err) {
                        return done(err);
                    }

                    dateByWeekStart = dateByWeekStart.isoWeek() + 100 * dateByWeekStart.isoWeekYear();
                    dateByWeekEnd = dateByWeekEnd.isoWeek() + 100 * dateByWeekEnd.isoWeekYear();

                    expect(body.sortDepartments)
                        .to.be.instanceOf(Array);

                    departmentDashboard = body.sortDepartments[0];

                    expect(departmentDashboard)
                        .to.have.property('employees')
                        .and.to.be.instanceOf(Array);

                    employee = departmentDashboard.employees[0];

                    expect(departmentDashboard)
                        .to.have.property('department');

                    department = departmentDashboard.department;

                    expect(department)
                        .to.have.property('_id');
                    expect(department)
                        .to.have.property('name');

                    departmentId = department._id;

                    expect(employee)
                        .to.have.property('_id');
                    /*expect(employee)
                        .to.have.property('fired')
                        .and.to.be.instanceOf(Array);
                    expect(employee)
                        .to.have.property('hired')
                        .and.to.be.instanceOf(Array);
                    expect(employee)
                        .to.have.property('isLead')
                        .and.to.be.least(0);
                    expect(employee)
                        .to.have.property('lastHire');*/
                    expect(employee)
                        .to.have.property('maxProjects')
                        .and.to.be.least(0);
                    expect(employee)
                        .to.have.property('name');
                    expect(employee)
                        .to.have.property('weekData')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.length(duration + 1);

                    employeeId = employee._id;
                    /*hired = employee.hired.reduce(function (previous, current) {
                        return previous.date > current.date ? previous : current;
                    });

                    expect(hired)
                        .to.have.property('date');

                    hireDate = moment(hired.date);
                    hireWeekDate = hireDate.isoWeek() - 1 + 100 * hireDate.isoWeekYear();
                    hireDate = hireDate.valueOf();
                    now = moment().valueOf();

                    expect(employee.lastHire)
                        .to.be.equal(hireWeekDate);

                    expect(hireDate).to.be.below(now);
                    expect(hired)
                        .to.have.property('info');
                    expect(hired)
                        .to.have.property('salary')
                        .and.to.be.least(0);
                    expect(hired)
                        .to.have.property('jobType');
                    expect(hired)
                        .to.have.property('manager');
                    expect(hired)
                        .to.have.property('jobPosition');
                    expect(hired)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);*/

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek < current.dateByWeek ? previous : current;
                    });

                    /*expect(weekData)
                        .to.have.property('projectRoot')
                        .and.to.be.instanceOf(Array);
                    expect(weekData)
                        .to.have.property('hours')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);
                    expect(weekData)
                        .to.have.property('employee')
                        .and.to.be.equal(employeeId);*/
                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                   /* expect(weekData)
                        .to.have.property('projects');*/
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    /*project = weekData.projectRoot[0];

                    expect(project)
                        .to.have.property('hours')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(project)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);
                    expect(project)
                        .to.have.property('employee')
                        .and.to.be.equal(employeeId);
                    expect(project)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                    expect(project)
                        .to.have.property('project');*/

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek > current.dateByWeek ? previous : current;
                    });

                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekEnd);
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    done();
                });
        });

        it('should return dashboard using startDate == now and employee == 55b92ad221e4b7c40f00009e and department._id == 55b92ace21e4b7c40f000010', function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/vacation')
                .query({'filter[startDate]': startTime.toString()})
                .query({'filter[name][key]': 'employee'})
                .query({'filter[name][value][]': '55b92ad221e4b7c40f00009e'})
                .query({'filter[department][key]': 'department._id'})
                .query({'filter[department][value][]': '55b92ace21e4b7c40f000010'})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var dateByWeekStart = moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'weeks');
                    var dateByWeekEnd = moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'weeks');
                    var duration = dateByWeekEnd.diff(dateByWeekStart, 'weeks');
                    var departmentDashboard;
                    var employee;
                    var department;
                    var departmentId;
                    var employeeId;
                    var hired;
                    var hireDate;
                    var hireWeekDate;
                    var now;
                    var weekData;
                    var project;

                    if (err) {
                        return done(err);
                    }

                    dateByWeekStart = dateByWeekStart.isoWeek() + 100 * dateByWeekStart.isoWeekYear();
                    dateByWeekEnd = dateByWeekEnd.isoWeek() + 100 * dateByWeekEnd.isoWeekYear();

                    expect(body.sortDepartments)
                        .to.be.instanceOf(Array);

                    departmentDashboard = body.sortDepartments[0];

                    expect(departmentDashboard)
                        .to.have.property('employees')
                        .and.to.be.instanceOf(Array);

                    employee = departmentDashboard.employees[0];

                    expect(departmentDashboard)
                        .to.have.property('department');

                    department = departmentDashboard.department;

                    expect(department)
                        .to.have.property('_id');
                    expect(department)
                        .to.have.property('name');

                    departmentId = department._id;

                    expect(employee)
                        .to.have.property('_id');
                    /*expect(employee)
                        .to.have.property('fired')
                        .and.to.be.instanceOf(Array);
                    expect(employee)
                        .to.have.property('hired')
                        .and.to.be.instanceOf(Array);*/
                    expect(employee)
                        .to.have.property('isLead')
                        .and.to.be.least(0);
                    /*expect(employee)
                        .to.have.property('lastHire');*/
                    expect(employee)
                        .to.have.property('maxProjects')
                        .and.to.be.least(0);
                    expect(employee)
                        .to.have.property('name');
                    expect(employee)
                        .to.have.property('weekData')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.length(duration + 1);

                    employeeId = employee._id;
                    /*hired = employee.hired.reduce(function (previous, current) {
                        return previous.date > current.date ? previous : current;
                    });

                    expect(hired)
                        .to.have.property('date');

                    hireDate = moment(hired.date);
                    hireWeekDate = hireDate.isoWeek() - 1 + 100 * hireDate.isoWeekYear();
                    hireDate = hireDate.valueOf();
                    now = moment().valueOf();

                    expect(employee.lastHire)
                        .to.be.equal(hireWeekDate);

                    expect(hireDate).to.be.below(now);
                    expect(hired)
                        .to.have.property('info');
                    expect(hired)
                        .to.have.property('salary')
                        .and.to.be.least(0);
                    expect(hired)
                        .to.have.property('jobType');
                    expect(hired)
                        .to.have.property('manager');
                    expect(hired)
                        .to.have.property('jobPosition');
                    expect(hired)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);*/

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek < current.dateByWeek ? previous : current;
                    });

                    expect(weekData)
                        .to.have.property('projectRoot')
                        .and.to.be.instanceOf(Array);
                    expect(weekData)
                        .to.have.property('hours')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);
                    expect(weekData)
                        .to.have.property('employee')
                        .and.to.be.equal(employeeId);
                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                    expect(weekData)
                        .to.have.property('projects');
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

                    project = weekData.projectRoot[0];

                    expect(project)
                        .to.have.property('hours')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(project)
                        .to.have.property('department')
                        .and.to.be.equal(departmentId);
                    expect(project)
                        .to.have.property('employee')
                        .and.to.be.equal(employeeId);
                    expect(project)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekStart);
                    expect(project)
                        .to.have.property('project');

                    weekData = employee.weekData.reduce(function (previous, current) {
                        return previous.dateByWeek > current.dateByWeek ? previous : current;
                    });

                    expect(weekData)
                        .to.have.property('dateByWeek')
                        .and.to.be.equal(dateByWeekEnd);
                    expect(weekData)
                        .to.have.property('holidays')
                        .and.to.be.least(0)
                        .and.to.be.most(168);
                    expect(weekData)
                        .to.have.property('vacations')
                        .and.to.be.least(0)
                        .and.to.be.most(168);

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

    describe('With baned user', function () {

        var startTime;

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass : 'thinkmobiles2015',
                    dbId : 'vasyadb'
                })
                .expect(200, done);
        });

        it('should fail return dashboard using startDate == now', function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/vacation')
                .query({'filter[startDate]': startTime.toString()})
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