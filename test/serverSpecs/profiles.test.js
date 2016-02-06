var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

describe("Profiles Specs", function () {
    'use strict';

    describe("With admin user", function () {

        var id;
        var profileName;

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

        it("should create profile", function (done) {

            profileName = "testTest";
            var body = {
                "profileName": profileName,
                "profileDescription": "",
                "profileAccess": [{
                    "module": {
                        "_id": 1,
                        "__v": 0,
                        "attachments": [],
                        "link": false,
                        "mname": "Settings",
                        "parrent": null,
                        "sequence": 1000,
                        "visible": true,
                        "ancestors": [],
                        "href": "Settings"
                    }, "_id": "52b024f07fa64ad41e000002", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 6,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 3,
                        "sequence": 41,
                        "visible": false,
                        "ancestors": [1, 3],
                        "href": "Groups"
                    }, "_id": "52b024f07fa64ad41e000004", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 7,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Users",
                        "parrent": 1,
                        "sequence": 42,
                        "visible": true,
                        "ancestors": [],
                        "href": "Users"
                    }, "_id": "52b024f07fa64ad41e000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 14,
                        "attachments": [],
                        "link": true,
                        "mname": "Job Positions",
                        "parrent": 9,
                        "sequence": 32,
                        "visible": true,
                        "ancestors": [],
                        "href": "JobPositions"
                    }, "_id": "52b024f07fa64ad41e000007", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 15,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 1,
                        "sequence": 33,
                        "visible": true,
                        "ancestors": [],
                        "href": "Departments"
                    }, "_id": "52b024f07fa64ad41e000008", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 19,
                        "attachments": [],
                        "link": false,
                        "mname": "Sales",
                        "parrent": null,
                        "sequence": 1,
                        "visible": true,
                        "ancestors": [],
                        "href": "Sales"
                    }, "_id": "52b024f07fa64ad41e000009", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 24,
                        "attachments": [],
                        "link": true,
                        "mname": "Leads",
                        "parrent": 19,
                        "sequence": 9,
                        "visible": true,
                        "ancestors": [],
                        "href": "Leads"
                    }, "_id": "52b024f07fa64ad41e00000c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 25,
                        "attachments": [],
                        "link": true,
                        "mname": "Opportunities",
                        "parrent": 19,
                        "sequence": 10,
                        "visible": true,
                        "ancestors": [],
                        "href": "Opportunities"
                    }, "_id": "52b024f07fa64ad41e00000d", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 36,
                        "attachments": [],
                        "link": false,
                        "mname": "Project",
                        "parrent": null,
                        "sequence": 2,
                        "visible": true,
                        "ancestors": [],
                        "href": "Project"
                    }, "_id": "52b024f07fa64ad41e000010", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 39,
                        "attachments": [],
                        "link": true,
                        "mname": "Projects",
                        "parrent": 36,
                        "sequence": 23,
                        "visible": true,
                        "ancestors": [],
                        "href": "Projects"
                    }, "_id": "52b024f07fa64ad41e000011", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 40,
                        "attachments": [],
                        "link": true,
                        "mname": "Tasks",
                        "parrent": 36,
                        "sequence": 24,
                        "visible": true,
                        "ancestors": [],
                        "href": "Tasks"
                    }, "_id": "52b024f07fa64ad41e000012", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 42,
                        "attachments": [],
                        "link": true,
                        "mname": "Employees",
                        "parrent": 9,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Employees"
                    }, "_id": "52b024f07fa64ad41e000013", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 43,
                        "attachments": [],
                        "link": true,
                        "mname": "Applications",
                        "parrent": 9,
                        "sequence": 30,
                        "visible": true,
                        "ancestors": [],
                        "href": "Applications"
                    }, "_id": "52b024f07fa64ad41e000014", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 44,
                        "attachments": [],
                        "link": true,
                        "mname": "Workflows",
                        "parrent": 1,
                        "sequence": 44,
                        "visible": true,
                        "ancestors": [],
                        "href": "Workflows"
                    }, "_id": "52b024f07fa64ad41e000015", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 49,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Persons",
                        "parrent": 19,
                        "sequence": 7,
                        "visible": true,
                        "ancestors": [],
                        "href": "Persons"
                    }, "_id": "52b024f07fa64ad41e000016", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 50,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Companies",
                        "parrent": 19,
                        "sequence": 8,
                        "visible": true,
                        "ancestors": [],
                        "href": "Companies"
                    }, "_id": "52b024f07fa64ad41e000017", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 51,
                        "attachments": [],
                        "link": true,
                        "mname": "Profiles",
                        "parrent": 1,
                        "sequence": 51,
                        "visible": true,
                        "ancestors": [],
                        "href": "Profiles"
                    }, "_id": "52b024f07fa64ad41e000018", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 52,
                        "attachments": [],
                        "link": true,
                        "mname": "Birthdays",
                        "parrent": 9,
                        "sequence": 52,
                        "visible": true,
                        "ancestors": [],
                        "href": "Birthdays"
                    }, "_id": "52b024f07fa64ad41e000019", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 29,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 19,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Dashboard"
                    }, "_id": "55b790eaa5ebea2c2400001f", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 53,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 36,
                        "sequence": 53,
                        "visible": true,
                        "ancestors": [],
                        "href": "projectDashboard"
                    }, "_id": "52ef6d5f9d8a19c819e19f7e", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 54,
                        "mname": "Purchases",
                        "sequence": 54,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Purchases"
                    }, "_id": "55b790eaa5ebea2c2400001e", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 57,
                        "mname": "Order",
                        "sequence": 56,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Order"
                    }, "_id": "55b790eaa5ebea2c2400001d", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 56,
                        "mname": "Invoice",
                        "sequence": 57,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Invoice"
                    }, "_id": "55b790eaa5ebea2c2400001c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 55,
                        "mname": "Quotation",
                        "sequence": 55,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Quotation"
                    }, "_id": "55b790eaa5ebea2c2400001b", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 58,
                        "mname": "Product",
                        "sequence": 58,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Product"
                    }, "_id": "55b790eaa5ebea2c2400001a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 59,
                        "mname": "Accounting",
                        "sequence": 59,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Accounting"
                    }, "_id": "55b790eaa5ebea2c24000019", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 61,
                        "mname": "Customer Payments",
                        "sequence": 61,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "customerPayments"
                    }, "_id": "55b790eaa5ebea2c24000018", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 60,
                        "mname": "Supplier Payments",
                        "sequence": 60,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "supplierPayments"
                    }, "_id": "55b790eaa5ebea2c24000017", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 62,
                        "mname": "Quotation",
                        "sequence": 62,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesQuotation"
                    }, "_id": "55b790eaa5ebea2c24000016", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 63,
                        "mname": "Order",
                        "sequence": 63,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesOrder"
                    }, "_id": "55b790eaa5ebea2c24000015", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 64,
                        "mname": "Invoice",
                        "sequence": 64,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesInvoice"
                    }, "_id": "55b790eaa5ebea2c24000014", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55b790eaa5ebea2c24000013", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 73,
                        "mname": "DashBoardVacation",
                        "sequence": 1001,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "DashBoardVacation"
                    }, "_id": "55b790eaa5ebea2c24000012", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 71,
                        "mname": "Attendance",
                        "sequence": 71,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Attendance"
                    }, "_id": "55b790eaa5ebea2c24000011", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 72,
                        "mname": "BonusType",
                        "sequence": 73,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "bonusType"
                    }, "_id": "55b790eaa5ebea2c24000010", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 68,
                        "mname": "MonthHours",
                        "sequence": 68,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "monthHours"
                    }, "_id": "55b790eaa5ebea2c2400000f", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 67,
                        "mname": "Revenue",
                        "sequence": 67,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Revenue"
                    }, "_id": "55b790eaa5ebea2c2400000e", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55b790eaa5ebea2c2400000d", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 75,
                        "mname": "wTrack",
                        "sequence": 1000,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "wTrack"
                    }, "_id": "55b790eaa5ebea2c2400000c", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 69,
                        "mname": "Holidays",
                        "sequence": 69,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Holiday"
                    }, "_id": "55b790eaa5ebea2c2400000a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 66,
                        "mname": "Payroll Expenses",
                        "sequence": 77,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollExpenses"
                    }, "_id": "55b790eaa5ebea2c24000008", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 70,
                        "mname": "Vacation",
                        "sequence": 70,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Vacation"
                    }, "_id": "55b790eaa5ebea2c24000006", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 74,
                        "mname": "HrDashboard",
                        "sequence": 74,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "HrDashboard"
                    }, "_id": "55b790eaa5ebea2c24000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 9,
                        "attachments": [],
                        "link": false,
                        "mname": "HR",
                        "parrent": null,
                        "sequence": 3,
                        "visible": true,
                        "ancestors": [],
                        "href": "HR"
                    }, "_id": "55b89f3fdf6af7240d000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 76,
                        "mname": "Hours",
                        "sequence": 72,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Hours"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 77,
                        "mname": "Capacity",
                        "sequence": 69,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Capacity"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 80,
                        "mname": "Jobs Dashboard",
                        "sequence": 54,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "jobsDashboard"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 78,
                        "mname": "Payroll",
                        "sequence": 78,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Payroll"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 79,
                        "mname": "Payroll Payments",
                        "sequence": 79,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollPayments"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 82,
                        "mname": "Invoice Aging",
                        "sequence": 82,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceAging"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 83,
                        "mname": "ChartOfAccount",
                        "sequence": 83,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "ChartOfAccount"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 85,
                        "mname": "Journal",
                        "sequence": 85,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journal"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 86,
                        "mname": "Journal Entry",
                        "sequence": 86,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journalEntry"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 87,
                        "mname": "Invoice Charts",
                        "sequence": 87,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceCharts"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }]
            };

            aggent
                .post('profiles')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var body = res.body;

                    id = body.id;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('id');
                    expect(body)
                        .to.have.property('success')
                        .and.to.be.valueOf('Profile Saved');
                    expect(body)
                        .to.have.property('data');

                    var data = body.data;

                    expect(data)
                        .to.have.property('profileName')
                        .and.to.be.valueOf(profileName);
                    expect(data)
                        .to.have.property('profileAccess')
                        .and.instanceof(Array);

                    var accessItem = data.profileAccess['0'];

                    expect(accessItem)
                        .to.have.property('_id');
                    expect(accessItem)
                        .to.have.property('module')
                        .and.above(0);
                    expect(accessItem)
                        .to.have.property('access')
                        .and.instanceOf(Object);

                    var accesses = accessItem.access;

                    expect(accesses)
                        .to.have.property('del')
                        .and.isBoolean;
                    expect(accesses)
                        .to.have.property('editWrite')
                        .and.isBoolean;
                    expect(accesses)
                        .to.have.property('read')
                        .and.isBoolean;

                    done();
                });
        });

        it("should fail create profile with existing name", function (done) {

            var body = {
                "profileName": "testTest",
                "profileDescription": "",
                "profileAccess": []
            };

            aggent
                .post('profiles')
                .send(body)
                .expect(404, done);
        });

        it("should fail create profile with empty name", function (done) {

            var body = {
                "profileName": "",
                "profileDescription": "",
                "profileAccess": []
            };

            aggent
                .post('profiles')
                .send(body)
                .expect(404, done);
        });

        it('should return all profiles with details', function (done) {
            aggent
                .get('profiles/')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    var profile = body.data[0];

                    expect(profile)
                        .to.have.property('profileName')
                        .and.to.be.valueOf(profileName);
                    expect(profile)
                        .to.have.property('profileAccess')
                        .and.instanceof(Array);

                    var accessItem = profile.profileAccess['0'];

                    expect(accessItem)
                        .to.have.property('_id');
                    expect(accessItem)
                        .to.have.property('module')
                        .and.to.have.all.keys([
                        "__v",
                        "_id",
                        "ancestors",
                        "attachments",
                        "href",
                        "link",
                        "mname",
                        "parrent",
                        "sequence",
                        "visible"
                    ]);
                    expect(accessItem)
                        .to.have.property('access')
                        .and.instanceOf(Object);

                    var accesses = accessItem.access;

                    expect(accesses)
                        .to.have.property('del')
                        .and.isBoolean;
                    expect(accesses)
                        .to.have.property('editWrite')
                        .and.isBoolean;
                    expect(accesses)
                        .to.have.property('read')
                        .and.isBoolean;


                    done();
                });

        });

        it('should return all profiles list for Dd menu', function (done) {
            aggent
                .get('profiles/forDd/')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    var profile = body.data[0];

                    expect(profile)
                        .to.have.property('profileName')
                        .and.to.be.valueOf(profileName);
                    expect(profile)
                        .to.have.property('_id');

                    done();
                });

        });

        it("should update profile", function (done) {

            var body = {
                "_id": id,
                "__v": 0,
                "profileAccess": [{
                    "module": {
                        "_id": 1,
                        "__v": 0,
                        "attachments": [],
                        "link": false,
                        "mname": "Settings",
                        "parrent": null,
                        "sequence": 1000,
                        "visible": true,
                        "ancestors": [],
                        "href": "Settings"
                    }, "_id": "52b0254ead08de381e000002", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 6,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 3,
                        "sequence": 41,
                        "visible": false,
                        "ancestors": [1, 3],
                        "href": "Groups"
                    }, "_id": "52b0254ead08de381e000004", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 7,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Users",
                        "parrent": 1,
                        "sequence": 42,
                        "visible": true,
                        "ancestors": [],
                        "href": "Users"
                    }, "_id": "52b0254ead08de381e000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 14,
                        "attachments": [],
                        "link": true,
                        "mname": "Job Positions",
                        "parrent": 9,
                        "sequence": 32,
                        "visible": true,
                        "ancestors": [],
                        "href": "JobPositions"
                    }, "_id": "52b0254ead08de381e000007", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 15,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 1,
                        "sequence": 33,
                        "visible": true,
                        "ancestors": [],
                        "href": "Departments"
                    }, "_id": "52b0254ead08de381e000008", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 19,
                        "attachments": [],
                        "link": false,
                        "mname": "Sales",
                        "parrent": null,
                        "sequence": 1,
                        "visible": true,
                        "ancestors": [],
                        "href": "Sales"
                    }, "_id": "52b0254ead08de381e000009", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 24,
                        "attachments": [],
                        "link": true,
                        "mname": "Leads",
                        "parrent": 19,
                        "sequence": 9,
                        "visible": true,
                        "ancestors": [],
                        "href": "Leads"
                    }, "_id": "52b0254ead08de381e00000c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 25,
                        "attachments": [],
                        "link": true,
                        "mname": "Opportunities",
                        "parrent": 19,
                        "sequence": 10,
                        "visible": true,
                        "ancestors": [],
                        "href": "Opportunities"
                    }, "_id": "52b0254ead08de381e00000d", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 36,
                        "attachments": [],
                        "link": false,
                        "mname": "Project",
                        "parrent": null,
                        "sequence": 2,
                        "visible": true,
                        "ancestors": [],
                        "href": "Project"
                    }, "_id": "52b0254ead08de381e000010", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 39,
                        "attachments": [],
                        "link": true,
                        "mname": "Projects",
                        "parrent": 36,
                        "sequence": 23,
                        "visible": true,
                        "ancestors": [],
                        "href": "Projects"
                    }, "_id": "52b0254ead08de381e000011", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 40,
                        "attachments": [],
                        "link": true,
                        "mname": "Tasks",
                        "parrent": 36,
                        "sequence": 24,
                        "visible": true,
                        "ancestors": [],
                        "href": "Tasks"
                    }, "_id": "52b0254ead08de381e000012", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 42,
                        "attachments": [],
                        "link": true,
                        "mname": "Employees",
                        "parrent": 9,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Employees"
                    }, "_id": "52b0254ead08de381e000013", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 43,
                        "attachments": [],
                        "link": true,
                        "mname": "Applications",
                        "parrent": 9,
                        "sequence": 30,
                        "visible": true,
                        "ancestors": [],
                        "href": "Applications"
                    }, "_id": "52b0254ead08de381e000014", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 44,
                        "attachments": [],
                        "link": true,
                        "mname": "Workflows",
                        "parrent": 1,
                        "sequence": 44,
                        "visible": true,
                        "ancestors": [],
                        "href": "Workflows"
                    }, "_id": "52b0254ead08de381e000015", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 49,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Persons",
                        "parrent": 19,
                        "sequence": 7,
                        "visible": true,
                        "ancestors": [],
                        "href": "Persons"
                    }, "_id": "52b0254ead08de381e000016", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 50,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Companies",
                        "parrent": 19,
                        "sequence": 8,
                        "visible": true,
                        "ancestors": [],
                        "href": "Companies"
                    }, "_id": "52b0254ead08de381e000017", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 51,
                        "attachments": [],
                        "link": true,
                        "mname": "Profiles",
                        "parrent": 1,
                        "sequence": 51,
                        "visible": true,
                        "ancestors": [],
                        "href": "Profiles"
                    }, "_id": "52b0254ead08de381e000018", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 52,
                        "attachments": [],
                        "link": true,
                        "mname": "Birthdays",
                        "parrent": 9,
                        "sequence": 52,
                        "visible": true,
                        "ancestors": [],
                        "href": "Birthdays"
                    }, "_id": "52b0254ead08de381e000019", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 29,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 19,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Dashboard"
                    }, "_id": "55c1de136708490b0b00002c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 53,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 36,
                        "sequence": 53,
                        "visible": true,
                        "ancestors": [],
                        "href": "projectDashboard"
                    }, "_id": "52ef6d5f9d8a19c819e19f7f", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 54,
                        "mname": "Purchases",
                        "sequence": 54,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Purchases"
                    }, "_id": "55c1de136708490b0b00002b", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 57,
                        "mname": "Order",
                        "sequence": 56,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Order"
                    }, "_id": "55c1de136708490b0b00002a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 56,
                        "mname": "Invoice",
                        "sequence": 57,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Invoice"
                    }, "_id": "55c1de136708490b0b000029", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 55,
                        "mname": "Quotation",
                        "sequence": 55,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Quotation"
                    }, "_id": "55c1de136708490b0b000028", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 58,
                        "mname": "Product",
                        "sequence": 58,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Product"
                    }, "_id": "55c1de136708490b0b000027", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 59,
                        "mname": "Accounting",
                        "sequence": 59,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Accounting"
                    }, "_id": "55c1de136708490b0b000026", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 61,
                        "mname": "Customer Payments",
                        "sequence": 61,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "customerPayments"
                    }, "_id": "55c1de136708490b0b000025", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 60,
                        "mname": "Supplier Payments",
                        "sequence": 60,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "supplierPayments"
                    }, "_id": "55c1de136708490b0b000024", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 62,
                        "mname": "Quotation",
                        "sequence": 62,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesQuotation"
                    }, "_id": "55c1de136708490b0b000023", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 63,
                        "mname": "Order",
                        "sequence": 63,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesOrder"
                    }, "_id": "55c1de136708490b0b000022", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 64,
                        "mname": "Invoice",
                        "sequence": 64,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesInvoice"
                    }, "_id": "55c1de136708490b0b000021", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55c1de136708490b0b000020", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 73,
                        "mname": "DashBoardVacation",
                        "sequence": 1001,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "DashBoardVacation"
                    }, "_id": "55c1de136708490b0b00001f", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 71,
                        "mname": "Attendance",
                        "sequence": 71,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Attendance"
                    }, "_id": "55c1de136708490b0b00001e", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 72,
                        "mname": "BonusType",
                        "sequence": 73,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "bonusType"
                    }, "_id": "55c1de136708490b0b00001d", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 68,
                        "mname": "MonthHours",
                        "sequence": 68,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "monthHours"
                    }, "_id": "55c1de136708490b0b00001c", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 67,
                        "mname": "Revenue",
                        "sequence": 67,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Revenue"
                    }, "_id": "55c1de136708490b0b00001b", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55c1de136708490b0b00001a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 75,
                        "mname": "tCard",
                        "sequence": 1000,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "wTrack"
                    }, "_id": "55c1de136708490b0b000019", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 69,
                        "mname": "Holidays",
                        "sequence": 69,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Holiday"
                    }, "_id": "55c1de136708490b0b000018", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 66,
                        "mname": "Payroll Expenses",
                        "sequence": 77,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollExpenses"
                    }, "_id": "55c1de136708490b0b000017", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 70,
                        "mname": "Vacation",
                        "sequence": 70,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Vacation"
                    }, "_id": "55c1de136708490b0b000016", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 74,
                        "mname": "HrDashboard",
                        "sequence": 74,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "HrDashboard"
                    }, "_id": "55c1de136708490b0b000015", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 9,
                        "attachments": [],
                        "link": false,
                        "mname": "HR",
                        "parrent": null,
                        "sequence": 3,
                        "visible": true,
                        "ancestors": [],
                        "href": "HR"
                    }, "_id": "55c1de136708490b0b000014", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 76,
                        "mname": "Efficiency",
                        "sequence": 72,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Efficiency"
                    }, "_id": "56b5b626a8a87b5f503aa10a", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 77,
                        "mname": "Capacity",
                        "sequence": 69,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Capacity"
                    }, "_id": "56b5b626a8a87b5f503aa109", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 80,
                        "mname": "Jobs Dashboard",
                        "sequence": 54,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "jobsDashboard"
                    }, "_id": "56b5b626a8a87b5f503aa108", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 78,
                        "mname": "Payroll",
                        "sequence": 78,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Payroll"
                    }, "_id": "56b5b626a8a87b5f503aa107", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 79,
                        "mname": "Payroll Payments",
                        "sequence": 79,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollPayments"
                    }, "_id": "56b5b626a8a87b5f503aa106", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 80,
                        "mname": "Jobs Dashboard",
                        "sequence": 54,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "jobsDashboard"
                    }, "_id": "56b5b626a8a87b5f503aa105", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 82,
                        "mname": "Invoice Aging",
                        "sequence": 82,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceAging"
                    }, "_id": "56b5b626a8a87b5f503aa104", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 83,
                        "mname": "ChartOfAccount",
                        "sequence": 83,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "ChartOfAccount"
                    }, "_id": "56b5b626a8a87b5f503aa103", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 84,
                        "mname": "Categories",
                        "sequence": 1000,
                        "parrent": 1,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "productSettings"
                    }, "_id": "56b5b626a8a87b5f503aa102", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 85,
                        "mname": "Journal",
                        "sequence": 85,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journal"
                    }, "_id": "56b5b626a8a87b5f503aa101", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 86,
                        "mname": "Journal Entry",
                        "sequence": 86,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journalEntry"
                    }, "_id": "56b5b626a8a87b5f503aa100", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 87,
                        "mname": "Invoice Charts",
                        "sequence": 87,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceCharts"
                    }, "_id": "56b5b626a8a87b5f503aa0ff", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 88,
                        "mname": "Salary Report",
                        "sequence": 69,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salaryReport"
                    }, "_id": "56b5b626a8a87b5f503aa0fe", "access": {"del": true, "editWrite": true, "read": true}
                }],
                "profileDescription": "",
                "profileName": "testTest123"
            };

            aggent
                .put('profiles/' + id)
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('success')
                        .and.to.be.valueOf('Profile updated');

                    done();
                });
        });

        it("should fail update profile", function (done) {

            var body = {
                "_id": 0,
                "__v": 0,
                "profileAccess": [{
                    "module": {
                        "_id": 1,
                        "__v": 0,
                        "attachments": [],
                        "link": false,
                        "mname": "Settings",
                        "parrent": null,
                        "sequence": 1000,
                        "visible": true,
                        "ancestors": [],
                        "href": "Settings"
                    }, "_id": "52b0254ead08de381e000002", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 6,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 3,
                        "sequence": 41,
                        "visible": false,
                        "ancestors": [1, 3],
                        "href": "Groups"
                    }, "_id": "52b0254ead08de381e000004", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 7,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Users",
                        "parrent": 1,
                        "sequence": 42,
                        "visible": true,
                        "ancestors": [],
                        "href": "Users"
                    }, "_id": "52b0254ead08de381e000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 14,
                        "attachments": [],
                        "link": true,
                        "mname": "Job Positions",
                        "parrent": 9,
                        "sequence": 32,
                        "visible": true,
                        "ancestors": [],
                        "href": "JobPositions"
                    }, "_id": "52b0254ead08de381e000007", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 15,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 1,
                        "sequence": 33,
                        "visible": true,
                        "ancestors": [],
                        "href": "Departments"
                    }, "_id": "52b0254ead08de381e000008", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 19,
                        "attachments": [],
                        "link": false,
                        "mname": "Sales",
                        "parrent": null,
                        "sequence": 1,
                        "visible": true,
                        "ancestors": [],
                        "href": "Sales"
                    }, "_id": "52b0254ead08de381e000009", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 24,
                        "attachments": [],
                        "link": true,
                        "mname": "Leads",
                        "parrent": 19,
                        "sequence": 9,
                        "visible": true,
                        "ancestors": [],
                        "href": "Leads"
                    }, "_id": "52b0254ead08de381e00000c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 25,
                        "attachments": [],
                        "link": true,
                        "mname": "Opportunities",
                        "parrent": 19,
                        "sequence": 10,
                        "visible": true,
                        "ancestors": [],
                        "href": "Opportunities"
                    }, "_id": "52b0254ead08de381e00000d", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 36,
                        "attachments": [],
                        "link": false,
                        "mname": "Project",
                        "parrent": null,
                        "sequence": 2,
                        "visible": true,
                        "ancestors": [],
                        "href": "Project"
                    }, "_id": "52b0254ead08de381e000010", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 39,
                        "attachments": [],
                        "link": true,
                        "mname": "Projects",
                        "parrent": 36,
                        "sequence": 23,
                        "visible": true,
                        "ancestors": [],
                        "href": "Projects"
                    }, "_id": "52b0254ead08de381e000011", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 40,
                        "attachments": [],
                        "link": true,
                        "mname": "Tasks",
                        "parrent": 36,
                        "sequence": 24,
                        "visible": true,
                        "ancestors": [],
                        "href": "Tasks"
                    }, "_id": "52b0254ead08de381e000012", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 42,
                        "attachments": [],
                        "link": true,
                        "mname": "Employees",
                        "parrent": 9,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Employees"
                    }, "_id": "52b0254ead08de381e000013", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 43,
                        "attachments": [],
                        "link": true,
                        "mname": "Applications",
                        "parrent": 9,
                        "sequence": 30,
                        "visible": true,
                        "ancestors": [],
                        "href": "Applications"
                    }, "_id": "52b0254ead08de381e000014", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 44,
                        "attachments": [],
                        "link": true,
                        "mname": "Workflows",
                        "parrent": 1,
                        "sequence": 44,
                        "visible": true,
                        "ancestors": [],
                        "href": "Workflows"
                    }, "_id": "52b0254ead08de381e000015", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 49,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Persons",
                        "parrent": 19,
                        "sequence": 7,
                        "visible": true,
                        "ancestors": [],
                        "href": "Persons"
                    }, "_id": "52b0254ead08de381e000016", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 50,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Companies",
                        "parrent": 19,
                        "sequence": 8,
                        "visible": true,
                        "ancestors": [],
                        "href": "Companies"
                    }, "_id": "52b0254ead08de381e000017", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 51,
                        "attachments": [],
                        "link": true,
                        "mname": "Profiles",
                        "parrent": 1,
                        "sequence": 51,
                        "visible": true,
                        "ancestors": [],
                        "href": "Profiles"
                    }, "_id": "52b0254ead08de381e000018", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 52,
                        "attachments": [],
                        "link": true,
                        "mname": "Birthdays",
                        "parrent": 9,
                        "sequence": 52,
                        "visible": true,
                        "ancestors": [],
                        "href": "Birthdays"
                    }, "_id": "52b0254ead08de381e000019", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 29,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 19,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Dashboard"
                    }, "_id": "55c1de136708490b0b00002c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 53,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 36,
                        "sequence": 53,
                        "visible": true,
                        "ancestors": [],
                        "href": "projectDashboard"
                    }, "_id": "52ef6d5f9d8a19c819e19f7f", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 54,
                        "mname": "Purchases",
                        "sequence": 54,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Purchases"
                    }, "_id": "55c1de136708490b0b00002b", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 57,
                        "mname": "Order",
                        "sequence": 56,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Order"
                    }, "_id": "55c1de136708490b0b00002a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 56,
                        "mname": "Invoice",
                        "sequence": 57,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Invoice"
                    }, "_id": "55c1de136708490b0b000029", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 55,
                        "mname": "Quotation",
                        "sequence": 55,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Quotation"
                    }, "_id": "55c1de136708490b0b000028", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 58,
                        "mname": "Product",
                        "sequence": 58,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Product"
                    }, "_id": "55c1de136708490b0b000027", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 59,
                        "mname": "Accounting",
                        "sequence": 59,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Accounting"
                    }, "_id": "55c1de136708490b0b000026", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 61,
                        "mname": "Customer Payments",
                        "sequence": 61,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "customerPayments"
                    }, "_id": "55c1de136708490b0b000025", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 60,
                        "mname": "Supplier Payments",
                        "sequence": 60,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "supplierPayments"
                    }, "_id": "55c1de136708490b0b000024", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 62,
                        "mname": "Quotation",
                        "sequence": 62,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesQuotation"
                    }, "_id": "55c1de136708490b0b000023", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 63,
                        "mname": "Order",
                        "sequence": 63,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesOrder"
                    }, "_id": "55c1de136708490b0b000022", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 64,
                        "mname": "Invoice",
                        "sequence": 64,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesInvoice"
                    }, "_id": "55c1de136708490b0b000021", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55c1de136708490b0b000020", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 73,
                        "mname": "DashBoardVacation",
                        "sequence": 1001,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "DashBoardVacation"
                    }, "_id": "55c1de136708490b0b00001f", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 71,
                        "mname": "Attendance",
                        "sequence": 71,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Attendance"
                    }, "_id": "55c1de136708490b0b00001e", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 72,
                        "mname": "BonusType",
                        "sequence": 73,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "bonusType"
                    }, "_id": "55c1de136708490b0b00001d", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 68,
                        "mname": "MonthHours",
                        "sequence": 68,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "monthHours"
                    }, "_id": "55c1de136708490b0b00001c", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 67,
                        "mname": "Revenue",
                        "sequence": 67,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Revenue"
                    }, "_id": "55c1de136708490b0b00001b", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55c1de136708490b0b00001a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 75,
                        "mname": "tCard",
                        "sequence": 1000,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "wTrack"
                    }, "_id": "55c1de136708490b0b000019", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 69,
                        "mname": "Holidays",
                        "sequence": 69,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Holiday"
                    }, "_id": "55c1de136708490b0b000018", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 66,
                        "mname": "Payroll Expenses",
                        "sequence": 77,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollExpenses"
                    }, "_id": "55c1de136708490b0b000017", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 70,
                        "mname": "Vacation",
                        "sequence": 70,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Vacation"
                    }, "_id": "55c1de136708490b0b000016", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 74,
                        "mname": "HrDashboard",
                        "sequence": 74,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "HrDashboard"
                    }, "_id": "55c1de136708490b0b000015", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 9,
                        "attachments": [],
                        "link": false,
                        "mname": "HR",
                        "parrent": null,
                        "sequence": 3,
                        "visible": true,
                        "ancestors": [],
                        "href": "HR"
                    }, "_id": "55c1de136708490b0b000014", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 76,
                        "mname": "Efficiency",
                        "sequence": 72,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Efficiency"
                    }, "_id": "56b5b626a8a87b5f503aa10a", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 77,
                        "mname": "Capacity",
                        "sequence": 69,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Capacity"
                    }, "_id": "56b5b626a8a87b5f503aa109", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 80,
                        "mname": "Jobs Dashboard",
                        "sequence": 54,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "jobsDashboard"
                    }, "_id": "56b5b626a8a87b5f503aa108", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 78,
                        "mname": "Payroll",
                        "sequence": 78,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Payroll"
                    }, "_id": "56b5b626a8a87b5f503aa107", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 79,
                        "mname": "Payroll Payments",
                        "sequence": 79,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollPayments"
                    }, "_id": "56b5b626a8a87b5f503aa106", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 80,
                        "mname": "Jobs Dashboard",
                        "sequence": 54,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "jobsDashboard"
                    }, "_id": "56b5b626a8a87b5f503aa105", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 82,
                        "mname": "Invoice Aging",
                        "sequence": 82,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceAging"
                    }, "_id": "56b5b626a8a87b5f503aa104", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 83,
                        "mname": "ChartOfAccount",
                        "sequence": 83,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "ChartOfAccount"
                    }, "_id": "56b5b626a8a87b5f503aa103", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 84,
                        "mname": "Categories",
                        "sequence": 1000,
                        "parrent": 1,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "productSettings"
                    }, "_id": "56b5b626a8a87b5f503aa102", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 85,
                        "mname": "Journal",
                        "sequence": 85,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journal"
                    }, "_id": "56b5b626a8a87b5f503aa101", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 86,
                        "mname": "Journal Entry",
                        "sequence": 86,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journalEntry"
                    }, "_id": "56b5b626a8a87b5f503aa100", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 87,
                        "mname": "Invoice Charts",
                        "sequence": 87,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceCharts"
                    }, "_id": "56b5b626a8a87b5f503aa0ff", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 88,
                        "mname": "Salary Report",
                        "sequence": 69,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salaryReport"
                    }, "_id": "56b5b626a8a87b5f503aa0fe", "access": {"del": true, "editWrite": true, "read": true}
                }],
                "profileDescription": "",
                "profileName": "testTest"
            };

            aggent
                .put('profiles/' + id)
                .send(body)
                .expect(404, done);
        });

        it("should remove profile", function (done) {
            aggent
                .delete('profiles/' + id)
                .expect(200)
                .end(function (err, res) {

                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.have.property('success')
                        .and.to.be.valueOf('Profile Saved');

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
        var profileName;

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

        it("should fail create profile", function (done) {

            profileName = "testTest";
            var body = {
                "profileName": profileName,
                "profileDescription": "",
                "profileAccess": [{
                    "module": {
                        "_id": 1,
                        "__v": 0,
                        "attachments": [],
                        "link": false,
                        "mname": "Settings",
                        "parrent": null,
                        "sequence": 1000,
                        "visible": true,
                        "ancestors": [],
                        "href": "Settings"
                    }, "_id": "52b024f07fa64ad41e000002", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 6,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 3,
                        "sequence": 41,
                        "visible": false,
                        "ancestors": [1, 3],
                        "href": "Groups"
                    }, "_id": "52b024f07fa64ad41e000004", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 7,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Users",
                        "parrent": 1,
                        "sequence": 42,
                        "visible": true,
                        "ancestors": [],
                        "href": "Users"
                    }, "_id": "52b024f07fa64ad41e000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 14,
                        "attachments": [],
                        "link": true,
                        "mname": "Job Positions",
                        "parrent": 9,
                        "sequence": 32,
                        "visible": true,
                        "ancestors": [],
                        "href": "JobPositions"
                    }, "_id": "52b024f07fa64ad41e000007", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 15,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 1,
                        "sequence": 33,
                        "visible": true,
                        "ancestors": [],
                        "href": "Departments"
                    }, "_id": "52b024f07fa64ad41e000008", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 19,
                        "attachments": [],
                        "link": false,
                        "mname": "Sales",
                        "parrent": null,
                        "sequence": 1,
                        "visible": true,
                        "ancestors": [],
                        "href": "Sales"
                    }, "_id": "52b024f07fa64ad41e000009", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 24,
                        "attachments": [],
                        "link": true,
                        "mname": "Leads",
                        "parrent": 19,
                        "sequence": 9,
                        "visible": true,
                        "ancestors": [],
                        "href": "Leads"
                    }, "_id": "52b024f07fa64ad41e00000c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 25,
                        "attachments": [],
                        "link": true,
                        "mname": "Opportunities",
                        "parrent": 19,
                        "sequence": 10,
                        "visible": true,
                        "ancestors": [],
                        "href": "Opportunities"
                    }, "_id": "52b024f07fa64ad41e00000d", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 36,
                        "attachments": [],
                        "link": false,
                        "mname": "Project",
                        "parrent": null,
                        "sequence": 2,
                        "visible": true,
                        "ancestors": [],
                        "href": "Project"
                    }, "_id": "52b024f07fa64ad41e000010", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 39,
                        "attachments": [],
                        "link": true,
                        "mname": "Projects",
                        "parrent": 36,
                        "sequence": 23,
                        "visible": true,
                        "ancestors": [],
                        "href": "Projects"
                    }, "_id": "52b024f07fa64ad41e000011", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 40,
                        "attachments": [],
                        "link": true,
                        "mname": "Tasks",
                        "parrent": 36,
                        "sequence": 24,
                        "visible": true,
                        "ancestors": [],
                        "href": "Tasks"
                    }, "_id": "52b024f07fa64ad41e000012", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 42,
                        "attachments": [],
                        "link": true,
                        "mname": "Employees",
                        "parrent": 9,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Employees"
                    }, "_id": "52b024f07fa64ad41e000013", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 43,
                        "attachments": [],
                        "link": true,
                        "mname": "Applications",
                        "parrent": 9,
                        "sequence": 30,
                        "visible": true,
                        "ancestors": [],
                        "href": "Applications"
                    }, "_id": "52b024f07fa64ad41e000014", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 44,
                        "attachments": [],
                        "link": true,
                        "mname": "Workflows",
                        "parrent": 1,
                        "sequence": 44,
                        "visible": true,
                        "ancestors": [],
                        "href": "Workflows"
                    }, "_id": "52b024f07fa64ad41e000015", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 49,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Persons",
                        "parrent": 19,
                        "sequence": 7,
                        "visible": true,
                        "ancestors": [],
                        "href": "Persons"
                    }, "_id": "52b024f07fa64ad41e000016", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 50,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Companies",
                        "parrent": 19,
                        "sequence": 8,
                        "visible": true,
                        "ancestors": [],
                        "href": "Companies"
                    }, "_id": "52b024f07fa64ad41e000017", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 51,
                        "attachments": [],
                        "link": true,
                        "mname": "Profiles",
                        "parrent": 1,
                        "sequence": 51,
                        "visible": true,
                        "ancestors": [],
                        "href": "Profiles"
                    }, "_id": "52b024f07fa64ad41e000018", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 52,
                        "attachments": [],
                        "link": true,
                        "mname": "Birthdays",
                        "parrent": 9,
                        "sequence": 52,
                        "visible": true,
                        "ancestors": [],
                        "href": "Birthdays"
                    }, "_id": "52b024f07fa64ad41e000019", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 29,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 19,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Dashboard"
                    }, "_id": "55b790eaa5ebea2c2400001f", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 53,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 36,
                        "sequence": 53,
                        "visible": true,
                        "ancestors": [],
                        "href": "projectDashboard"
                    }, "_id": "52ef6d5f9d8a19c819e19f7e", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 54,
                        "mname": "Purchases",
                        "sequence": 54,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Purchases"
                    }, "_id": "55b790eaa5ebea2c2400001e", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 57,
                        "mname": "Order",
                        "sequence": 56,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Order"
                    }, "_id": "55b790eaa5ebea2c2400001d", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 56,
                        "mname": "Invoice",
                        "sequence": 57,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Invoice"
                    }, "_id": "55b790eaa5ebea2c2400001c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 55,
                        "mname": "Quotation",
                        "sequence": 55,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Quotation"
                    }, "_id": "55b790eaa5ebea2c2400001b", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 58,
                        "mname": "Product",
                        "sequence": 58,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Product"
                    }, "_id": "55b790eaa5ebea2c2400001a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 59,
                        "mname": "Accounting",
                        "sequence": 59,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Accounting"
                    }, "_id": "55b790eaa5ebea2c24000019", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 61,
                        "mname": "Customer Payments",
                        "sequence": 61,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "customerPayments"
                    }, "_id": "55b790eaa5ebea2c24000018", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 60,
                        "mname": "Supplier Payments",
                        "sequence": 60,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "supplierPayments"
                    }, "_id": "55b790eaa5ebea2c24000017", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 62,
                        "mname": "Quotation",
                        "sequence": 62,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesQuotation"
                    }, "_id": "55b790eaa5ebea2c24000016", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 63,
                        "mname": "Order",
                        "sequence": 63,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesOrder"
                    }, "_id": "55b790eaa5ebea2c24000015", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 64,
                        "mname": "Invoice",
                        "sequence": 64,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesInvoice"
                    }, "_id": "55b790eaa5ebea2c24000014", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55b790eaa5ebea2c24000013", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 73,
                        "mname": "DashBoardVacation",
                        "sequence": 1001,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "DashBoardVacation"
                    }, "_id": "55b790eaa5ebea2c24000012", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 71,
                        "mname": "Attendance",
                        "sequence": 71,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Attendance"
                    }, "_id": "55b790eaa5ebea2c24000011", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 72,
                        "mname": "BonusType",
                        "sequence": 73,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "bonusType"
                    }, "_id": "55b790eaa5ebea2c24000010", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 68,
                        "mname": "MonthHours",
                        "sequence": 68,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "monthHours"
                    }, "_id": "55b790eaa5ebea2c2400000f", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 67,
                        "mname": "Revenue",
                        "sequence": 67,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Revenue"
                    }, "_id": "55b790eaa5ebea2c2400000e", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55b790eaa5ebea2c2400000d", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 75,
                        "mname": "wTrack",
                        "sequence": 1000,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "wTrack"
                    }, "_id": "55b790eaa5ebea2c2400000c", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 69,
                        "mname": "Holidays",
                        "sequence": 69,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Holiday"
                    }, "_id": "55b790eaa5ebea2c2400000a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 66,
                        "mname": "Payroll Expenses",
                        "sequence": 77,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollExpenses"
                    }, "_id": "55b790eaa5ebea2c24000008", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 70,
                        "mname": "Vacation",
                        "sequence": 70,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Vacation"
                    }, "_id": "55b790eaa5ebea2c24000006", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 74,
                        "mname": "HrDashboard",
                        "sequence": 74,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "HrDashboard"
                    }, "_id": "55b790eaa5ebea2c24000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 9,
                        "attachments": [],
                        "link": false,
                        "mname": "HR",
                        "parrent": null,
                        "sequence": 3,
                        "visible": true,
                        "ancestors": [],
                        "href": "HR"
                    }, "_id": "55b89f3fdf6af7240d000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 76,
                        "mname": "Hours",
                        "sequence": 72,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Hours"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 77,
                        "mname": "Capacity",
                        "sequence": 69,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Capacity"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 80,
                        "mname": "Jobs Dashboard",
                        "sequence": 54,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "jobsDashboard"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 78,
                        "mname": "Payroll",
                        "sequence": 78,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Payroll"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 79,
                        "mname": "Payroll Payments",
                        "sequence": 79,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollPayments"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 82,
                        "mname": "Invoice Aging",
                        "sequence": 82,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceAging"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 83,
                        "mname": "ChartOfAccount",
                        "sequence": 83,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "ChartOfAccount"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 85,
                        "mname": "Journal",
                        "sequence": 85,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journal"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 86,
                        "mname": "Journal Entry",
                        "sequence": 86,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journalEntry"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 87,
                        "mname": "Invoice Charts",
                        "sequence": 87,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceCharts"
                    }, "access": {"del": true, "editWrite": true, "read": true}
                }]
            };

            aggent
                .post('profiles')
                .send(body)
                .expect(403, done);

        });


        it('should fail return all profiles with details', function (done) {
            aggent
                .get('profiles/')
                .expect(403, done);

        });

        it('should fail return all profiles list for Dd menu', function (done) {
            aggent
                .get('profiles/forDd/')
                .expect(403, done);

        });

        it("should fail update profile", function (done) {

            var body = {
                "_id": id,
                "__v": 0,
                "profileAccess": [{
                    "module": {
                        "_id": 1,
                        "__v": 0,
                        "attachments": [],
                        "link": false,
                        "mname": "Settings",
                        "parrent": null,
                        "sequence": 1000,
                        "visible": true,
                        "ancestors": [],
                        "href": "Settings"
                    }, "_id": "52b0254ead08de381e000002", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 6,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 3,
                        "sequence": 41,
                        "visible": false,
                        "ancestors": [1, 3],
                        "href": "Groups"
                    }, "_id": "52b0254ead08de381e000004", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 7,
                        "__v": 0,
                        "attachments": [],
                        "link": true,
                        "mname": "Users",
                        "parrent": 1,
                        "sequence": 42,
                        "visible": true,
                        "ancestors": [],
                        "href": "Users"
                    }, "_id": "52b0254ead08de381e000005", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 14,
                        "attachments": [],
                        "link": true,
                        "mname": "Job Positions",
                        "parrent": 9,
                        "sequence": 32,
                        "visible": true,
                        "ancestors": [],
                        "href": "JobPositions"
                    }, "_id": "52b0254ead08de381e000007", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 15,
                        "attachments": [],
                        "link": true,
                        "mname": "Groups",
                        "parrent": 1,
                        "sequence": 33,
                        "visible": true,
                        "ancestors": [],
                        "href": "Departments"
                    }, "_id": "52b0254ead08de381e000008", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 19,
                        "attachments": [],
                        "link": false,
                        "mname": "Sales",
                        "parrent": null,
                        "sequence": 1,
                        "visible": true,
                        "ancestors": [],
                        "href": "Sales"
                    }, "_id": "52b0254ead08de381e000009", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 24,
                        "attachments": [],
                        "link": true,
                        "mname": "Leads",
                        "parrent": 19,
                        "sequence": 9,
                        "visible": true,
                        "ancestors": [],
                        "href": "Leads"
                    }, "_id": "52b0254ead08de381e00000c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 25,
                        "attachments": [],
                        "link": true,
                        "mname": "Opportunities",
                        "parrent": 19,
                        "sequence": 10,
                        "visible": true,
                        "ancestors": [],
                        "href": "Opportunities"
                    }, "_id": "52b0254ead08de381e00000d", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 36,
                        "attachments": [],
                        "link": false,
                        "mname": "Project",
                        "parrent": null,
                        "sequence": 2,
                        "visible": true,
                        "ancestors": [],
                        "href": "Project"
                    }, "_id": "52b0254ead08de381e000010", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 39,
                        "attachments": [],
                        "link": true,
                        "mname": "Projects",
                        "parrent": 36,
                        "sequence": 23,
                        "visible": true,
                        "ancestors": [],
                        "href": "Projects"
                    }, "_id": "52b0254ead08de381e000011", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 40,
                        "attachments": [],
                        "link": true,
                        "mname": "Tasks",
                        "parrent": 36,
                        "sequence": 24,
                        "visible": true,
                        "ancestors": [],
                        "href": "Tasks"
                    }, "_id": "52b0254ead08de381e000012", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 42,
                        "attachments": [],
                        "link": true,
                        "mname": "Employees",
                        "parrent": 9,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Employees"
                    }, "_id": "52b0254ead08de381e000013", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 43,
                        "attachments": [],
                        "link": true,
                        "mname": "Applications",
                        "parrent": 9,
                        "sequence": 30,
                        "visible": true,
                        "ancestors": [],
                        "href": "Applications"
                    }, "_id": "52b0254ead08de381e000014", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 44,
                        "attachments": [],
                        "link": true,
                        "mname": "Workflows",
                        "parrent": 1,
                        "sequence": 44,
                        "visible": true,
                        "ancestors": [],
                        "href": "Workflows"
                    }, "_id": "52b0254ead08de381e000015", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 49,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Persons",
                        "parrent": 19,
                        "sequence": 7,
                        "visible": true,
                        "ancestors": [],
                        "href": "Persons"
                    }, "_id": "52b0254ead08de381e000016", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 50,
                        "attachments": [],
                        "htref": "persons",
                        "link": true,
                        "mname": "Companies",
                        "parrent": 19,
                        "sequence": 8,
                        "visible": true,
                        "ancestors": [],
                        "href": "Companies"
                    }, "_id": "52b0254ead08de381e000017", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 51,
                        "attachments": [],
                        "link": true,
                        "mname": "Profiles",
                        "parrent": 1,
                        "sequence": 51,
                        "visible": true,
                        "ancestors": [],
                        "href": "Profiles"
                    }, "_id": "52b0254ead08de381e000018", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 52,
                        "attachments": [],
                        "link": true,
                        "mname": "Birthdays",
                        "parrent": 9,
                        "sequence": 52,
                        "visible": true,
                        "ancestors": [],
                        "href": "Birthdays"
                    }, "_id": "52b0254ead08de381e000019", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 29,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 19,
                        "sequence": 29,
                        "visible": true,
                        "ancestors": [],
                        "href": "Dashboard"
                    }, "_id": "55c1de136708490b0b00002c", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 53,
                        "attachments": [],
                        "link": true,
                        "mname": "Dashboard",
                        "parrent": 36,
                        "sequence": 53,
                        "visible": true,
                        "ancestors": [],
                        "href": "projectDashboard"
                    }, "_id": "52ef6d5f9d8a19c819e19f7f", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 54,
                        "mname": "Purchases",
                        "sequence": 54,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Purchases"
                    }, "_id": "55c1de136708490b0b00002b", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 57,
                        "mname": "Order",
                        "sequence": 56,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Order"
                    }, "_id": "55c1de136708490b0b00002a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 56,
                        "mname": "Invoice",
                        "sequence": 57,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Invoice"
                    }, "_id": "55c1de136708490b0b000029", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 55,
                        "mname": "Quotation",
                        "sequence": 55,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Quotation"
                    }, "_id": "55c1de136708490b0b000028", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 58,
                        "mname": "Product",
                        "sequence": 58,
                        "parrent": 54,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Product"
                    }, "_id": "55c1de136708490b0b000027", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 59,
                        "mname": "Accounting",
                        "sequence": 59,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Accounting"
                    }, "_id": "55c1de136708490b0b000026", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 61,
                        "mname": "Customer Payments",
                        "sequence": 61,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "customerPayments"
                    }, "_id": "55c1de136708490b0b000025", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 60,
                        "mname": "Supplier Payments",
                        "sequence": 60,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "supplierPayments"
                    }, "_id": "55c1de136708490b0b000024", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 62,
                        "mname": "Quotation",
                        "sequence": 62,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesQuotation"
                    }, "_id": "55c1de136708490b0b000023", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 63,
                        "mname": "Order",
                        "sequence": 63,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesOrder"
                    }, "_id": "55c1de136708490b0b000022", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 64,
                        "mname": "Invoice",
                        "sequence": 64,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salesInvoice"
                    }, "_id": "55c1de136708490b0b000021", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55c1de136708490b0b000020", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 73,
                        "mname": "DashBoardVacation",
                        "sequence": 1001,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "DashBoardVacation"
                    }, "_id": "55c1de136708490b0b00001f", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 71,
                        "mname": "Attendance",
                        "sequence": 71,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Attendance"
                    }, "_id": "55c1de136708490b0b00001e", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 72,
                        "mname": "BonusType",
                        "sequence": 73,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "bonusType"
                    }, "_id": "55c1de136708490b0b00001d", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 68,
                        "mname": "MonthHours",
                        "sequence": 68,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "monthHours"
                    }, "_id": "55c1de136708490b0b00001c", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 67,
                        "mname": "Revenue",
                        "sequence": 67,
                        "parrent": 19,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Revenue"
                    }, "_id": "55c1de136708490b0b00001b", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 65,
                        "mname": "Product",
                        "sequence": 65,
                        "parrent": 19,
                        "link": true,
                        "visible": false,
                        "ancestors": [],
                        "href": "salesProduct"
                    }, "_id": "55c1de136708490b0b00001a", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 75,
                        "mname": "tCard",
                        "sequence": 1000,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "wTrack"
                    }, "_id": "55c1de136708490b0b000019", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 69,
                        "mname": "Holidays",
                        "sequence": 69,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Holiday"
                    }, "_id": "55c1de136708490b0b000018", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 66,
                        "mname": "Payroll Expenses",
                        "sequence": 77,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollExpenses"
                    }, "_id": "55c1de136708490b0b000017", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 70,
                        "mname": "Vacation",
                        "sequence": 70,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Vacation"
                    }, "_id": "55c1de136708490b0b000016", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 74,
                        "mname": "HrDashboard",
                        "sequence": 74,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "HrDashboard"
                    }, "_id": "55c1de136708490b0b000015", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 9,
                        "attachments": [],
                        "link": false,
                        "mname": "HR",
                        "parrent": null,
                        "sequence": 3,
                        "visible": true,
                        "ancestors": [],
                        "href": "HR"
                    }, "_id": "55c1de136708490b0b000014", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 76,
                        "mname": "Efficiency",
                        "sequence": 72,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Efficiency"
                    }, "_id": "56b5b626a8a87b5f503aa10a", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 77,
                        "mname": "Capacity",
                        "sequence": 69,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "Capacity"
                    }, "_id": "56b5b626a8a87b5f503aa109", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 80,
                        "mname": "Jobs Dashboard",
                        "sequence": 54,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "jobsDashboard"
                    }, "_id": "56b5b626a8a87b5f503aa108", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 78,
                        "mname": "Payroll",
                        "sequence": 78,
                        "parrent": null,
                        "link": false,
                        "visible": true,
                        "ancestors": [],
                        "href": "Payroll"
                    }, "_id": "56b5b626a8a87b5f503aa107", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 79,
                        "mname": "Payroll Payments",
                        "sequence": 79,
                        "parrent": 78,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "PayrollPayments"
                    }, "_id": "56b5b626a8a87b5f503aa106", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 80,
                        "mname": "Jobs Dashboard",
                        "sequence": 54,
                        "parrent": 36,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "jobsDashboard"
                    }, "_id": "56b5b626a8a87b5f503aa105", "access": {"del": false, "editWrite": false, "read": false}
                }, {
                    "module": {
                        "_id": 82,
                        "mname": "Invoice Aging",
                        "sequence": 82,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceAging"
                    }, "_id": "56b5b626a8a87b5f503aa104", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 83,
                        "mname": "ChartOfAccount",
                        "sequence": 83,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "ChartOfAccount"
                    }, "_id": "56b5b626a8a87b5f503aa103", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 84,
                        "mname": "Categories",
                        "sequence": 1000,
                        "parrent": 1,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "productSettings"
                    }, "_id": "56b5b626a8a87b5f503aa102", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 85,
                        "mname": "Journal",
                        "sequence": 85,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journal"
                    }, "_id": "56b5b626a8a87b5f503aa101", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 86,
                        "mname": "Journal Entry",
                        "sequence": 86,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "journalEntry"
                    }, "_id": "56b5b626a8a87b5f503aa100", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 87,
                        "mname": "Invoice Charts",
                        "sequence": 87,
                        "parrent": 59,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "invoiceCharts"
                    }, "_id": "56b5b626a8a87b5f503aa0ff", "access": {"del": true, "editWrite": true, "read": true}
                }, {
                    "module": {
                        "_id": 88,
                        "mname": "Salary Report",
                        "sequence": 69,
                        "parrent": 9,
                        "link": true,
                        "visible": true,
                        "ancestors": [],
                        "href": "salaryReport"
                    }, "_id": "56b5b626a8a87b5f503aa0fe", "access": {"del": true, "editWrite": true, "read": true}
                }],
                "profileDescription": "",
                "profileName": "testTest123"
            };

            aggent
                .put('profiles/' + id)
                .send(body)
                .expect(403, done);
        });


        it("should fail remove profile", function (done) {
            aggent
                .delete('profiles/' + id)
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

