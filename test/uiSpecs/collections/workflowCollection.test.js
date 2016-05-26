define([
    'collections/Workflows/WorkflowsCollection',
    'chai'
], function (WorkflowsCollection, chai) {
    'use strict';
    var expect = chai.expect;

    describe('WorkflowsCollection', function () {
        var mainSpy;
        var server;
        var workflowsCollection;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        var fakeWorkflows = {
            data: [
                {
                    _id: "528ce51cf3f67bc40b000015",
                    __v: 0,
                    attachments: [],
                    name: "Initial Qualification",
                    sequence: 6,
                    status: "New",
                    wId: "Applications",
                    wName: "application",
                    source: "application",
                    targetSource: [
                        "application"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "52fa5108a7bec22c19000018",
                    __v: 0,
                    attachments: [],
                    name: "Ready to teach",
                    sequence: 6,
                    status: "Pending",
                    wId: "Applications",
                    wName: "application",
                    source: "application",
                    targetSource: [
                        "application"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce0cdf3f67bc40b00000c",
                    __v: 0,
                    attachments: [],
                    name: "New",
                    sequence: 5,
                    status: "New",
                    wId: "Tasks",
                    wName: "task",
                    source: "task",
                    targetSource: [
                        "task"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce53bf3f67bc40b000016",
                    __v: 0,
                    attachments: [],
                    name: "First Interview",
                    sequence: 5,
                    status: "In Progress",
                    wId: "Applications",
                    wName: "application",
                    source: "application",
                    targetSource: [
                        "application"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528cdcb4f3f67bc40b000006",
                    __v: 0,
                    attachments: [],
                    name: "New",
                    sequence: 4,
                    status: "New",
                    wId: "Opportunities",
                    wName: "opportunity",
                    source: "opportunity",
                    targetSource: [
                        "opportunity"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce131f3f67bc40b00000d",
                    __v: 0,
                    attachments: [],
                    name: "In Progress",
                    sequence: 4,
                    status: "In Progress",
                    wId: "Tasks",
                    wName: "task",
                    source: "task",
                    targetSource: [
                        "task"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce553f3f67bc40b000017",
                    __v: 0,
                    attachments: [],
                    name: "Second Interview",
                    sequence: 4,
                    status: "In Progress",
                    wId: "Applications",
                    wName: "application",
                    source: "application",
                    targetSource: [
                        "application"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce74ef3f67bc40b00001e",
                    __v: 0,
                    attachments: [],
                    name: "Draft",
                    sequence: 4,
                    status: "New",
                    wId: "Leads",
                    wName: "lead",
                    source: "lead",
                    targetSource: [
                        "lead"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce7d0f3f67bc40b000021",
                    __v: 0,
                    attachments: [],
                    name: "New",
                    sequence: 4,
                    status: "New",
                    wId: "Projects",
                    wName: "project",
                    source: "project",
                    targetSource: [
                        "project"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "5555e54c6a3f01acae0b5564",
                    name: "Draft",
                    sequence: 4,
                    status: "New",
                    wId: "Purchase Invoice",
                    wName: "invoice",
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "55647d932e4aa3804a765ec9",
                    name: "Unpaid",
                    sequence: 4,
                    status: "New",
                    wId: "Sales Invoice",
                    wName: "invoice",
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528cdd2af3f67bc40b000007",
                    __v: 0,
                    attachments: [],
                    name: "Qualification",
                    sequence: 3,
                    status: "In Progress",
                    wId: "Opportunities",
                    wName: "opportunity",
                    source: "opportunity",
                    targetSource: [
                        "opportunity"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce30cf3f67bc40b00000f",
                    __v: 0,
                    attachments: [],
                    name: "Fixed",
                    sequence: 3,
                    status: "In Progress",
                    wId: "Tasks",
                    wName: "task",
                    source: "task",
                    targetSource: [
                        "task"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce5e3f3f67bc40b000018",
                    __v: 0,
                    attachments: [],
                    name: "Internship",
                    sequence: 3,
                    status: "Pending",
                    wId: "Applications",
                    wName: "application",
                    source: "application",
                    targetSource: [
                        "application"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce7e3f3f67bc40b000022",
                    __v: 0,
                    attachments: [],
                    name: "Pending",
                    sequence: 3,
                    status: "Pending",
                    wId: "Projects",
                    wName: "project",
                    source: "project",
                    targetSource: [
                        "project"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "52b4265cc033b7e25ac4f91c",
                    attachments: [],
                    name: "Open",
                    sequence: 3,
                    status: "New",
                    wId: "Leads",
                    wName: "lead",
                    source: "lead",
                    targetSource: [
                        "lead"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "5555bf276a3f01acae0b5560",
                    name: "Not Ordered",
                    sequence: 3,
                    status: "New",
                    wId: "Purchase Order",
                    wName: "order",
                    source: "purchase",
                    targetSource: [
                        "quotation"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "5555e570671a8b6800000003",
                    sequence: 3,
                    status: "In Progress",
                    name: "Partially Paid",
                    wId: "Purchase Invoice",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "55647b932e4aa3804a765ec5",
                    name: "Not Invoiced",
                    sequence: 3,
                    status: "New",
                    wId: "Sales Order",
                    wName: "order",
                    source: "purchase",
                    targetSource: [
                        "quotation"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "55647d952e4aa3804a765eca",
                    sequence: 3,
                    status: "In Progress",
                    name: "Partially Paid",
                    wId: "Sales Invoice",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528cde9ef3f67bc40b000008",
                    __v: 0,
                    attachments: [],
                    name: "Proposition",
                    sequence: 2,
                    status: "In Progress",
                    wId: "Opportunities",
                    wName: "opportunity",
                    source: "opportunity",
                    targetSource: [
                        "opportunity"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce35af3f67bc40b000010",
                    __v: 0,
                    attachments: [],
                    name: "Testing",
                    sequence: 2,
                    status: "In Progress",
                    wId: "Tasks",
                    wName: "task",
                    source: "task",
                    targetSource: [
                        "task"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce61bf3f67bc40b000019",
                    __v: 0,
                    attachments: [],
                    name: "Contract Signed",
                    sequence: 2,
                    status: "Hired",
                    wId: "Applications",
                    wName: "application",
                    source: "application",
                    targetSource: [
                        "application"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce779f3f67bc40b00001f",
                    __v: 0,
                    attachments: [],
                    name: "In Progress",
                    sequence: 2,
                    status: "In Progress",
                    wId: "Leads",
                    wName: "lead",
                    source: "lead",
                    targetSource: [
                        "lead"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce7f2f3f67bc40b000023",
                    __v: 0,
                    attachments: [],
                    name: "In Progress",
                    sequence: 2,
                    status: "In Progress",
                    wId: "Projects",
                    wName: "project",
                    source: "project",
                    targetSource: [
                        "project"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "5555bf276a3f01acae0b5561",
                    name: "Invoiced",
                    sequence: 2,
                    status: "Done",
                    wId: "Purchase Order",
                    wName: "order",
                    source: "purchase",
                    targetSource: [
                        "order"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "5555e5b9671a8b6800000004",
                    sequence: 2,
                    status: "Done",
                    name: "Paid",
                    wId: "Purchase Invoice",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "55647d982e4aa3804a765ecb",
                    sequence: 2,
                    status: "Done",
                    name: "Paid",
                    wId: "Sales Invoice",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528cdef4f3f67bc40b00000a",
                    __v: 0,
                    attachments: [],
                    name: "Won",
                    sequence: 1,
                    status: "Done",
                    wId: "Opportunities",
                    wName: "opportunity",
                    source: "opportunity",
                    targetSource: [
                        "opportunity"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce3acf3f67bc40b000012",
                    __v: 0,
                    attachments: [],
                    name: "Done",
                    sequence: 1,
                    status: "Done",
                    wId: "Tasks",
                    wName: "task",
                    source: "task",
                    targetSource: [
                        "task"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce700f3f67bc40b00001c",
                    __v: 0,
                    attachments: [],
                    name: "No Recruitment",
                    sequence: 1,
                    status: "New",
                    wId: "Job positions",
                    wName: "jobposition",
                    source: "jobposition",
                    targetSource: [
                        "jobposition"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce82df3f67bc40b000025",
                    __v: 0,
                    attachments: [],
                    name: "Closed",
                    sequence: 1,
                    status: "Done",
                    wId: "Projects",
                    wName: "project",
                    source: "project",
                    targetSource: [
                        "project"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "52b426b7c033b7e25ac4f91d",
                    attachments: [],
                    name: "Closed",
                    sequence: 1,
                    status: "Done",
                    wId: "Leads",
                    wName: "lead",
                    source: "lead",
                    targetSource: [
                        "lead"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "52d2c1369b57890814000005",
                    __v: 0,
                    attachments: [],
                    name: "Contract End",
                    sequence: 1,
                    status: "Cancelled",
                    wId: "Applications",
                    wName: "",
                    source: "",
                    targetSource: [
                        ""
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "55647b962e4aa3804a765ec6",
                    name: "Invoiced",
                    sequence: 1,
                    status: "Done",
                    wId: "Sales Order",
                    wName: "order",
                    source: "purchase",
                    targetSource: [
                        "order"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "56599347bfd103f108eb4caa",
                    sequence: 1,
                    status: "In Progress",
                    name: "Not Invoiced",
                    wId: "Purchase Order",
                    __v: 0,
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528cdf1cf3f67bc40b00000b",
                    __v: 0,
                    attachments: [],
                    name: "Lost",
                    sequence: 0,
                    status: "Cancelled",
                    wId: "Opportunities",
                    wName: "opportunity",
                    source: "opportunity",
                    targetSource: [
                        "opportunity"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce3caf3f67bc40b000013",
                    __v: 0,
                    attachments: [],
                    name: "Cancelled",
                    sequence: 0,
                    status: "Cancelled",
                    wId: "Tasks",
                    wName: "task",
                    source: "task",
                    targetSource: [
                        "task"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce682f3f67bc40b00001a",
                    __v: 0,
                    attachments: [],
                    name: "Refused",
                    sequence: 0,
                    status: "Cancelled",
                    wId: "Applications",
                    wName: "application",
                    source: "application",
                    targetSource: [
                        "application"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce79bf3f67bc40b000020",
                    __v: 0,
                    attachments: [],
                    name: "Cancelled",
                    sequence: 0,
                    status: "Cancelled",
                    wId: "Leads",
                    wName: "lead",
                    source: "lead",
                    targetSource: [
                        "lead"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce80ef3f67bc40b000024",
                    __v: 0,
                    attachments: [],
                    name: "Cancelled",
                    sequence: 0,
                    status: "Cancelled",
                    wId: "Projects",
                    wName: "project",
                    source: "project",
                    targetSource: [
                        "project"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "555b09686ba860c41b000003",
                    sequence: 0,
                    status: "Cancelled",
                    name: "Cancelled",
                    wId: "Purchase Invoice",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "528ce71ef3f67bc40b00001d",
                    __v: 0,
                    attachments: [],
                    name: "Recruitement in Progress",
                    sequence: -1,
                    status: "In Progress",
                    wId: "Job positions",
                    wName: "jobposition",
                    source: "jobposition",
                    targetSource: [
                        "jobposition"
                    ],
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "56337c675d49d8d6537832ea",
                    wId: "Jobs",
                    name: "Finished",
                    status: "Done",
                    source: "jobs",
                    visible: true,
                    color: "#2C3E50"
                },
                {
                    _id: "56337c705d49d8d6537832eb",
                    wId: "Jobs",
                    name: "In Progress",
                    status: "In Progress",
                    source: "jobs",
                    visible: true,
                    color: "#2C3E50"
                }
            ]
        };

        it('Try to create collection without options', function () {

            server.respondWith('GET', '/Workflows?mid=39&id=', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflows)]);

            workflowsCollection = new WorkflowsCollection();

            server.respond();

            expect(workflowsCollection.url()).to.be.equals('/Workflows?mid=39&id=');
            expect(workflowsCollection.models).to.be.instanceof(Array);
            expect(workflowsCollection.models.length).to.be.equals(45);
        });

        it('Try to create collection without options', function () {

            server.respondWith('GET', '/Workflows?mid=39&id=Applications', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflows)]);

            workflowsCollection = new WorkflowsCollection({
                id: 'Applications'
            });

            server.respond();

            expect(workflowsCollection.url()).to.be.equals('/Workflows?mid=39&id=Applications');
            expect(workflowsCollection.models).to.be.instanceof(Array);
            expect(workflowsCollection.models.length).to.be.equals(45);
        });


    });
});
