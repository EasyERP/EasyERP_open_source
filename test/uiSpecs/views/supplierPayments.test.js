/*
define([
    'text!fixtures/index.html',
    'collections/supplierPayments/filterCollection',
    'views/main/MainView',
    'views/supplierPayments/list/ListView',
    'views/supplierPayments/TopBarView',
    'views/supplierPayments/CreateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, SupplierPaymentsCollection, MainView, ListView, TopBarView, CreateView, $, chai, chaiJquery, sinonChai, Custom, async) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [{
        "_id": 19,
        "attachments": [],
        "link": false,
        "mname": "Sales",
        "parrent": null,
        "sequence": 1,
        "visible": true,
        "ancestors": [],
        "href": "Sales"
    }, {
        "_id": 36,
        "attachments": [],
        "link": false,
        "mname": "Project",
        "parrent": null,
        "sequence": 2,
        "visible": true,
        "ancestors": [],
        "href": "Project"
    }, {
        "_id": 9,
        "attachments": [],
        "link": false,
        "mname": "HR",
        "parrent": null,
        "sequence": 3,
        "visible": true,
        "ancestors": [],
        "href": "HR"
    }, {
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
    }, {
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
    }, {
        "_id": 24,
        "attachments": [],
        "link": true,
        "mname": "Leads",
        "parrent": 19,
        "sequence": 9,
        "visible": true,
        "ancestors": [],
        "href": "Leads"
    }, {
        "_id": 25,
        "attachments": [],
        "link": true,
        "mname": "Opportunities",
        "parrent": 19,
        "sequence": 10,
        "visible": true,
        "ancestors": [],
        "href": "Opportunities"
    }, {
        "_id": 39,
        "attachments": [],
        "link": true,
        "mname": "Projects",
        "parrent": 36,
        "sequence": 23,
        "visible": true,
        "ancestors": [],
        "href": "Projects"
    }, {
        "_id": 40,
        "attachments": [],
        "link": true,
        "mname": "Tasks",
        "parrent": 36,
        "sequence": 24,
        "visible": true,
        "ancestors": [],
        "href": "Tasks"
    }, {
        "_id": 29,
        "attachments": [],
        "link": true,
        "mname": "Dashboard",
        "parrent": 19,
        "sequence": 29,
        "visible": true,
        "ancestors": [],
        "href": "Dashboard"
    }, {
        "_id": 42,
        "attachments": [],
        "link": true,
        "mname": "Employees",
        "parrent": 9,
        "sequence": 29,
        "visible": true,
        "ancestors": [],
        "href": "Employees"
    }, {
        "_id": 43,
        "attachments": [],
        "link": true,
        "mname": "Applications",
        "parrent": 9,
        "sequence": 30,
        "visible": true,
        "ancestors": [],
        "href": "Applications"
    }, {
        "_id": 14,
        "attachments": [],
        "link": true,
        "mname": "Job Positions",
        "parrent": 9,
        "sequence": 32,
        "visible": true,
        "ancestors": [],
        "href": "JobPositions"
    }, {
        "_id": 15,
        "attachments": [],
        "link": true,
        "mname": "Groups",
        "parrent": 1,
        "sequence": 33,
        "visible": true,
        "ancestors": [],
        "href": "Departments"
    }, {
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
    }, {
        "_id": 44,
        "attachments": [],
        "link": true,
        "mname": "Workflows",
        "parrent": 1,
        "sequence": 44,
        "visible": true,
        "ancestors": [],
        "href": "Workflows"
    }, {
        "_id": 51,
        "attachments": [],
        "link": true,
        "mname": "Profiles",
        "parrent": 1,
        "sequence": 51,
        "visible": true,
        "ancestors": [],
        "href": "Profiles"
    }, {
        "_id": 52,
        "attachments": [],
        "link": true,
        "mname": "Birthdays",
        "parrent": 9,
        "sequence": 52,
        "visible": true,
        "ancestors": [],
        "href": "Birthdays"
    }, {
        "_id": 53,
        "attachments": [],
        "link": true,
        "mname": "Dashboard",
        "parrent": 36,
        "sequence": 53,
        "visible": true,
        "ancestors": [],
        "href": "projectDashboard"
    }, {
        "_id": 54,
        "mname": "Purchases",
        "sequence": 54,
        "parrent": null,
        "link": false,
        "visible": true,
        "ancestors": [],
        "href": "Purchases"
    }, {
        "_id": 80,
        "mname": "Jobs Dashboard",
        "sequence": 54,
        "parrent": 36,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "jobsDashboard"
    }, {
        "_id": 55,
        "mname": "Quotation",
        "sequence": 55,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Quotation"
    }, {
        "_id": 57,
        "mname": "Order",
        "sequence": 56,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Order"
    }, {
        "_id": 56,
        "mname": "Invoice",
        "sequence": 57,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Invoice"
    }, {
        "_id": 58,
        "mname": "Product",
        "sequence": 58,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Product"
    }, {
        "_id": 59,
        "mname": "Accounting",
        "sequence": 59,
        "parrent": null,
        "link": false,
        "visible": true,
        "ancestors": [],
        "href": "Accounting"
    }, {
        "_id": 60,
        "mname": "Supplier Payments",
        "sequence": 60,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "supplierPayments"
    }, {
        "_id": 61,
        "mname": "Customer Payments",
        "sequence": 61,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "customerPayments"
    }, {
        "_id": 62,
        "mname": "Quotation",
        "sequence": 62,
        "parrent": 19,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salesQuotation"
    }, {
        "_id": 63,
        "mname": "Order",
        "sequence": 63,
        "parrent": 19,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salesOrder"
    }, {
        "_id": 64,
        "mname": "Invoice",
        "sequence": 64,
        "parrent": 19,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salesInvoice"
    }, {
        "_id": 68,
        "mname": "MonthHours",
        "sequence": 68,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "monthHours"
    }, {
        "_id": 69,
        "mname": "Holidays",
        "sequence": 69,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Holiday"
    }, {
        "_id": 77,
        "mname": "Capacity",
        "sequence": 69,
        "parrent": 9,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Capacity"
    }, {
        "_id": 88,
        "mname": "Salary Report",
        "sequence": 69,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salaryReport"
    }, {
        "_id": 70,
        "mname": "Vacation",
        "sequence": 70,
        "parrent": 9,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Vacation"
    }, {
        "_id": 71,
        "mname": "Attendance",
        "sequence": 71,
        "parrent": 9,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Attendance"
    }, {
        "_id": 76,
        "mname": "Efficiency",
        "sequence": 72,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Efficiency"
    }, {
        "_id": 72,
        "mname": "BonusType",
        "sequence": 73,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "bonusType"
    }, {
        "_id": 74,
        "mname": "HrDashboard",
        "sequence": 74,
        "parrent": 9,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "HrDashboard"
    }, {
        "_id": 66,
        "mname": "Payroll Expenses",
        "sequence": 77,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "PayrollExpenses"
    }, {
        "_id": 78,
        "mname": "Payroll",
        "sequence": 78,
        "parrent": null,
        "link": false,
        "visible": true,
        "ancestors": [],
        "href": "Payroll"
    }, {
        "_id": 79,
        "mname": "Payroll Payments",
        "sequence": 79,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "PayrollPayments"
    }, {
        "_id": 82,
        "mname": "Invoice Aging",
        "sequence": 82,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "invoiceAging"
    }, {
        "_id": 83,
        "mname": "ChartOfAccount",
        "sequence": 83,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "ChartOfAccount"
    }, {
        "_id": 85,
        "mname": "Journal",
        "sequence": 85,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "journal"
    }, {
        "_id": 86,
        "mname": "Journal Entry",
        "sequence": 86,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "journalEntry"
    }, {
        "_id": 87,
        "mname": "Invoice Charts",
        "sequence": 87,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "invoiceCharts"
    }, {
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
    }, {
        "_id": 75,
        "mname": "tCard",
        "sequence": 1000,
        "parrent": 36,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "wTrack"
    }, {
        "_id": 84,
        "mname": "Categories",
        "sequence": 1000,
        "parrent": 1,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "productSettings"
    }, {
        "_id": 73,
        "mname": "DashBoardVacation",
        "sequence": 1001,
        "parrent": 36,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "DashBoardVacation"
    }];

    var fakeSupplierPayments = [
        {
            _id: "55b92ae421e4b7c40f0014d0",
            year: 2014,
            month: 8,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: null,
            paidAmount: 20000,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d1",
            year: 2014,
            month: 11,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/QA 16%",
            period: null,
            date: "2014-12-04T22:00:00.000Z",
            paidAmount: 9000,
            supplier: {
                _id: "55b92ad221e4b7c40f000063",
                dateBirth: "1990-07-30T00:00:00.000Z",
                ID: 57,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-11-17T22:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "5644388770bbc2b740ce8a18",
                        department: "55b92ace21e4b7c40f000011"
                    }
                ],
                social: {
                    FB: "",
                    LI: "https://ua.linkedin.com/pub/yana"
                },
                sequence: 0,
                jobType: "fullTime",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.464Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-02-08T08:41:58.734Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.464Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.464Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "5644388770bbc2b740ce8a18",
                department: "55b92ace21e4b7c40f000011",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "yanochka_3007",
                workPhones: {
                    phone: "",
                    mobile: "+380508754761"
                },
                personalEmail: "yana.gusti@gmail.com",
                workEmail: "yana.gusti@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Gusti",
                    first: "Yana"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDuFdW6GnVSzTllZe+frTsZXLdFQrMD97ipAwI4OaB3FIFMYYpxNZ+p6glrEx3AYHJPagRHqV/DaRF3bp2Fcdf63NcyMsb7E9AcE/U1S1bVHv5yAxEa+vU+9ZZfJz0AqHqXGJu2d7gqH3NzhYx1P0rcutXjt1kjKhRyqKO/Xn9OnPXrXERTESb8kntz0qzd3KSbQo24A4z3pco2jROtSmCdJPnaQHBJ6H1+orON4dhjz05H19aqs3ymoGYhs1dgsWvtcgJ+bHPSlNwXUjJzVMtzmk3EcgkH2pgWY7lkPB6VfttXuITmNyPUetY5bJz3pVfBqXFMaOiOowXnDsY3PbGRmqf2me0kLxyN+eayi/OR1qZZy4wSSf51PLYZ1Gl+KFLBLjKds9RXU29ykygqwOenPWvKiVByOtbGj6tJaSKCxKE8j/CrTM5R7HowanA1StLlZ4ldTkEZq0DVGZJmikozQA6ikooAYRikrOtfEWm3YAMpgY9peB+fT860wAyhlIZT0KnINUK43NIWI5BpTxUMr7R70WC4XOoGCPLYP1rhte1Vryby4j8g6n+9Wh4gvyjNEDlsYrmgdxOep61LRpFdSGRgMKKaFYjp1qaOEzSAL/EcD6Vee1H2kRr0UVNjUzlgcsMDmpmt8kVrrZ+Wm4ryajNsc5IpXK5TKZMDGKqyDDEfiK1JoipORxVCZMH6VSJaKp4pfelI5pvtQIXofrSd6KM0CFzQGwaSkoGSsc4Ip8L4bHrUKnIxRnBpAdb4f1FoJVhdjsb7uex9K7KNgVBB4rzOzl5DA8jkfXvXc6LeC5tFOeR1oTM5rqbANLTAadmqIHZoptFAHkasynKsfxq7Z6veWTZhleP12Hg/UVRzRmpubWOusfGT8LdxJL23J8rf4H9K0JPEFhJEZI5DuAJ8txg+3tXBYBOakRii9SapSIcET31w0sxdzkk5/GoY/wDVA92qvI5Zqnj5YKKDRI09MiBkLYyVXC/WtW0sybjey5AfB/75/wDr0zw5bCWSRiMqnNbkUGxWOOrZ+nakUilJDubpwKhmgwhOMVq7M9RVe5TK1Fi0c/PFljxWXdQ4JxXQTxYbpWbdR9TimgaMFwQeaYas3MeDkVWNUZtCdqaaXNIaBBnmlNNpc0AOBxStTaXtSAntpdjg++a6/QJ/LkAJ+Vvl/wAP61xSHBrotIkLoABkgcfXt+oFJ6EyWh3yHIp9QWzb4kYHIIBqeqMgooopgeRUUUCoNxwpHbqaOgqNz2poBF+9mtHTIDPeRRj+I4rPiI3Guy8Haf5sb3jAHD4XPt3/AF/SmPY0tEgFv59vg7twP4FRWsYhgj1FJFbbLxpscFduPapXYfSmK5WZMLn86qzKCDVuWTH0qjLIDkZqWaIpXKDsM1m3Mec1quc1VljBzmkWc7cRcms6RCrEdq6O4t8g4FZdzDng0yJIyyKaamZD37VER60yBtHaiigQo6UoOaQdKF60gFHBxW7opG+If7WD/SsE/erY0knHGM5GPrUyA9E0tcWcS5ztUD+lXdtVdHAayjIPUH/0I1obfaqWxiQ7aKlK0UxHjVLRigVJ0AeKgc1I54qBzmqEPh+ZwPWvVNAhFpolshGfk3YA5OTn+teY6dGZbqJF+8zBQPcmvXQnlwqqjAAwBTQmVLkXkysTKkCY4Uc/meK5q/n1GF8pchlH1Fa+tan9lUKcDdxubgCuWu7xpFL/AL1hnGRHgfmTRuWrLcnXWbteJQD9Kkj1MytyCPWsI3Afo7A+4qe3uWRwHAIqWaKx0iS78Ukp45pdNh+1JuTt2pl3lGI54qSiCRhis6cKcmluZ+CM4rOldm6OapESCSPJbHrVV4sMfenhZT/H+tL5MhP3qZmU3XaaSrE0EgXLDPuKgA4oAF70n8VKveg9aBCHrWjp0jLIm3ruGPrWcat2LYkTPZx/OpYHqPh47tOTnPJ5/GtcVyfhq4kSwTDHBJ4NdFFdg/fGPcU0Y9S1gGimq6t90g0UxnjPSkJwKUmo3akbDGbmoj1pSaSmI0vDqF9csl/6ag4/GvXSMrXlfg8A+JbQEZ5Y/kpNerjpVCZnXNnaybi8EZYjlto3fnXLazay+V5ayFolOVBHI9s9xXX3K8GsK+tvMJ6j6Glc0jFPc4v7L5ZIzgZyRjrUkFqzSDkYPat3+yXkf5Qx+ta+m6AsbB5uvpU7l6Ik0K1NtaM7L1GBWfqYyWOK6WbbHDtUYAHFYN6oYH3pPQI66nJXUZOSKokjPJJ+lbN3CRuGKzHjwemKaJaZB5kadQw+hqVZB2bOOoPBpptWc9O9P+xyN165+93pk2ZKpDrVWa32sSg4NXYLKUZJINTtakLzSuOxgldrEU09auX0XllWx14qmfWmSN71PaHDjPGGB/WoD1pyNt6d6TEejaBAyaZCx/iBP61rqMCud0LxTYpZw2t1G8RjULvXkH6iumt5bW9Tdazxyj/ZPNWkjnd09RAxHQ0U54mWiiwrnkxPFQMeTUrHg1EetSdJGaBSkc0CgDb8GjPiW19t5H/fJr1VeRXmPguHGtwynsGH/jpr0xW+WmAyVciqMqKKuyN8uazrmTHSkzSKHQAFxn1rUGNoxWHauZbhUHAzya2/MjCkZ6CmgmtSneH5TWNcnOa0Lq5TJGazp2DDOaiRpFaFGSENzVOWwDHjv2q3MxjGR0p0bhgMVJVjOXTmB4JFW4NP/vc1oRqpFWY0A7UCaKcdmqjoKiubUbTgVqFRUFxjaTSJOO1hAqqO+c1jHpWxrcmXI/ujFYvetFsZS3A8ilXmk7UqD5qZJYAqaGeaBw8MrKw6EHFQilzUhY6Kx8Y6hbALPtnQcfOOcfWiuezRT5mTyIZKeKiHOallHFRqPlqigYdDTo0BlAOcc9KRhwKfC+yRHwCAeaAN7w3KItbtVBwNpz9dpr0RX+WvJtPuNmpxyjoGr061mEsSkHIIzmhlJaE8r5GKozRtK2BVw4JpyqF+pqS07ENvaiNfc96JrRUzOrPvxgjccH8KudsVWunwh5qkCk7nM38zxyn0P6VmyTTswKNx6EVfu0Lyk+tMSAelQze5EWkkUBugpsDlX296ubABVeWPDbhUgaNu+cVcRhWVBIBVtJR2NMll0sMVQvZAsZ5qR5az74mZDGCeQckAnAxyeKkh6HIXtwbi4dv4c8VVp7H5icY5ptamIlOj+9TakiHJoYiUUUUtSMSiiigB0oytRAYH4VMxAGTUJbJJq0IQ9MU1clT7U7GTj1NNOQcUwHwvskVvQ13vh++3wiMtyv8AKvP629DvTFIuT93g+4qWaR7HogYECoLyedGAghMnsDio7aXfGGHIIrRhVevekh7FRb6VUG61k3Y5AGcflWdeavjIkTZ9eK35CvXHNYGp+VIx3DrVFQs3sZsl9CBnBJqNb2Jsk8VHLb23oM+3FR/ZIT0U/nUs2sWzMhXIYUwOHB71V/s8EcO4HoDUkEfknbkke9SySdKkDkGowQopjPxSFcnaT3rntavj5jQxkjj5iPT0/lWlcXKxQs5PSuWmkMsrO3VjmnFGc30Gk0lFFWZBUsQ4qMVOoxx7UmA6iiikAUUUUANmODUXt6U6Vstn0pEXK59TVAPiG6VV9TilvgFuWA6cGkjfy5kc/wAJzTtQkjlvZZIc+WxyMjFV0F1IM1JBKYZQ4zgdaiFKOaQz0Hw9diWIITn0rpIs4rzLQtQa0mQMflP6V6RYzrNCrg5yKSLbuLcuQpxWBfMzNzXRzBSD3rKu44+cgUMuDOebG7pT0I7CrMsILHFQlNtQaNjt+BUDvk0rkg1BJIBUktjmlqKScAHmq806qCSeKybq9aXKoSF7n1qkjNyHahd+c2xT8gPJ9apdaKBVmd7hRRSjqKBD41yc1KBTU6U8VLGFFLRQAhooooAnntVa4fBCKG7mq4CqxTfx2bHWrtyFaRyTj096oXGQ4BNKLudFWCjsRyfeIByPWmnoKXrxSdqs5xKd0plKp7UAWYeeK6PQdbazYQzkmMnhvSuahODV1RuFBSZ38uooYyykEEetY89+XY1z8c8sa7Q52+maGnk9aTZomkbn2rnrTZLkYzmsX7Q/cUx53PfFSDkaE90o71nT3nXFV3fPJPNVpHzTSIbCeZpDyagoNFUQFLRRQIKUdaSngcUgJE6VJTE6U+kMKKKKAEooooAvzpkZ96zLkkzt7cVtumRj1rHvIyJn+tZ02ehioWVyNFyM1FVmIDyye9Vz1rVHDJWEPrSUtJTIJkbDVdhbgVnqelXLc9KTKRcx6Uw5qVelIy0hohNRtUzDFQycCgZBI3pUDVK3WonoIZHRRRVCDNGaSlpAKKmUcColFWFHFIYKMU6jFGKACkpTSUAGaKKKAOgePms64tzKZWHaiiuWLsz3qsU1qQmAGFXUc45rOcYaiiumDueXiIpWsJTaKKs5By1agoopMaNGLpTjzRRUljGWq84wKKKQFcjjpVeTrRRVIlkdJRRVEhSiiikBLGuSO2a07XSrm5VjCA2OCM4OaKKyqScVodVCnGbsxk1nPbnEsZX3I4P41CVNFFEXdEVIKMrIaRSYooqzISiiimI//9k=",
                isEmployee: true,
                __v: 0,
                transferred: [
                    {
                        date: "2015-11-12T07:01:22.647Z",
                        department: " BusinessDev"
                    }
                ]
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d2",
            year: 2014,
            month: 12,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-01-07T22:00:00.000Z",
            paidAmount: 40000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004b",
                dateBirth: "1992-07-11T00:00:00.000Z",
                ID: 39,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-05-19T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.434Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2015-11-03T13:24:56.462Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 23,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "roland.katona7000",
                workPhones: {
                    phone: "",
                    mobile: "+380956937000"
                },
                personalEmail: "roland.katona@thinkmobiles.com",
                workEmail: "roland.katona@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDogKWgUtAgFKKKKACloooAKKWigAopKX8KACiqF/q9pYAiSTfIP+Wact/9b8axpvFUpbEFqid/3jEkj9KAOoorjT4ovg2WVAO2E47+v+eKltvFF3kGWKJ0HB/hJ/H/AOtRcDraKzIdespMB2aJsZ+ccfmK0kdZFDIwZTyCDmgBTQaWkoAQ0lOpKAGkUhFOpD70AR4pjCpDTGoEQtRStRSAtgUtAopjAUtFLQAlLRRQAUUUjsEUsxAVRkk9BQBHcTxW0JlmcIi9Sa4zU/EFzeSMsTtHDnhF4JHuf6VDreryajOeqwKcRp/U+9ZJOaQDy5zy2T7Umc9eajz6UZPqRTAmJZsKMkZ4A6U47hgEY74PFQjJ+tSI/PJOc0AX1USIuWAHBz2FXrS9lsnPkzMDk5VgSh6YJ9B9Kyg7KM7efVRyP15qYSowHLcHP3cgn+nf8qVgO50+/iv4d8fyuvDoeqmrVcNZ3xtZxPG2CpzjOQwOciu0tbiO6t0mibKOMimBLSUtFACU3FOIpDQAwioyOtSkVG1AELc0UrCikItY4paBRTGLRR3ooAWkpRRQAlYPivUDa2a20Zw8+dx9F/8Ar/41vVxXi9wdVUZztjAPt1NAGE7f/WqPNKxyeKsQWE84yoCj1Y4pXS3HZvYq0oPtWjHo8rN8zrj1Xmr1voSsRuYkd8UudFKEjBGT6mpVjJPArpo/D1uRglh796uW2jW1ueBuPq3NLnQezZzsFlcSLhY3x2+Xg+9XrfQp3XBATgFf/r11ENvGE2gDBGDgYyKuKoA4GPwoux8qRwuqaZNYAb8sh/i/z2rR8KX4WR7JujEshz+ldFqFulzZyRuuflOMdc1w2mqYdUgycbZAPxzTTJkj0CkopaokbSGnGkNADDUbVKajagRC1FK1FAFqlHFJS0DClpKWgAooooASuC8UH/ieT/8AAf8A0EV3tcN4tjCayxH8aKf6f0oAxFGXFdDaECJQONvHNc+v3ulb1lkR5b8vSsqmxrT3LqLjH+PWrlucEdz6VUXBHt9OlWIDtxz+lZI3NOMe30oPFJBJjgmpHxjIHWtDMWJiOnFWl5HIPNV4cL3qfzFBxkVSJZJj5fwrh7+18rWkK8qZBwPrXcKQRkEEVzl9Bu11I2OVLIyg+mef5VSIlsdBRRRVECUhp3SmmgBppjVIajagREwooeigCzSik70tAxaKSloAKKKKAErkfGaxtcQun31G1/5j+tdfXFamv2i9vBJkjfgDPT/IqZSsXCPNcx7GMPdIp6c1tySLCm4jJHAUCsvTkK3jA4+XNa5XcBjPqKzm9S4LQzm+3XJJB8tcZAPFPA1G1OFmjk743AmluLeeZxk7Uz931p1jprxzlp1fySCG2nn/AD3ppoGmW7XULtVHnDn+8R2rdtJTOnBz6Vx7o8chAIx2wc10vh6Qqu1u1LqV0JbsXShgr7FwfnLYx71mWgilk/e6vuYHBQMBz04J7Vra7A8qqFwUbkqQfm/I1U0bTFtZpW+UrIMEEf0P+eaa7CabVzRsbYwn9xOzAN9x/fnnvmi+h/4nVlJwMhgfwGf61dtrSK2UJDkKBgAnP86ZfxFzC6rlkfP6H/61Vdk2TdiekpaSrMgpDS0lADTTGqQ0xqBEL0UrUUAT0tJS0DFoopKAFooooAK5LXl8u8n2jjcGz9RzXW1j69a52XKgcfK/0qJrQ0puzMCwgXYZcZZjzzV1MbvaoIyEZwpxnnH4U/cVb1rJmyNGKNHUbh+dJNApHAHHrUULnpVk8rQhsxpYlWQkKD71d0xiJxt+6Kq3mVkVMkA9zS2N3HHd+Urbm6ED/PNCA7BQs0QDDIx3qPyRG3y/rUcF1HhYd3zFcnAPFSRTbyVPDCtbmVmWE6UMBSrwKbJ2pksbRRSVZmFJS0hoEIaYcU80xqQET0UPRQBPS0lFAxaWkooAWiiigBagvYDc2rxKQCehNTUtAJ2OOu7G4tnV50CjOFO4HJpm7cB1GPSt/wAQhGs0VupbgfhXOhyV54/nWMlY2jK+rLlvnOFzjqD+NXtwWP5sjFULRvm2kY7DPNXpF3oTgHA6etQa3M25xMdu0nNT2Gn5/eMM7Txms8z3AkwI1685OK0rRb44KqFyM/f6/pVJDSudHAcwqdvGKjddsm9euaht1vCoJdVx170oNyLhhMEKHkFf/r1b2M7WZoRNuXNDnkCmx8L6UZySapGUgoopKszCkpaQ0AIaY1PNMakMiaih+lFAiegUCigYUtJRQAtLSUtABSkgAk4A9abVC8vB9r+yKQCI/MYexOB/KgCvqmbtDs4ZeU/z71zbFhJswQQejDoa6U4xWdqNiJ0LqNso6H1qWrjTsUoJCGz1bpWityM4OcVhB2il2ONjDrU5Lq248r7Vk4mykaLwLK+VxnPWrttBJwFY5HuazrS7UAB/vZ5wOK14pBGhfIwMCkkXc0LZWUAMelTNgnmobe4DqD3p3mh5SsZy2efatDJsk6fKKdUSSqLh4iemMn0OKlPBwa0jsZyEooopkhSUUUAIaYaeaY1ICJ+lFDUUATUUUUDFoFJRQAtLTaiubqC0iMtxKsaDue/09aBErMFUsxAVRkk9hXnl3qkj6zNfxNjc2FHYqOAD+Aq3r+uvqD+Tbl0tl4I6Fz6n29qw6YHbWd7FewCWI/7w7g1NuGRnHpXF2N49nOHQnaeGX1FdVFcpPGsinOf1pDHXNlHOMqAGHQgUyGxCnJyp9jwatRv054q5HJEIj5xAUDOSf5etS432LjK25nHT14LKDj04yacbdSm0rJjOcA9K1I41aMOjBkbofWnC3JPSo1NNCra2jA4BcDPG41pxosKYXgCkjj2jk1Ff3K29rI5P3VJpk7soWE32ia8l7GcgfgAP6Vrqd8QbuODXO+GyTpauxyXdmPvya3YJQkbl8kY5Aq4kyH0Vif8ACSW8VzJBdRvGUdk3qMqcHGfWtG31C0useRcRucdA3P5VRmWqSiigApjU6kOKQyJqKGooESUtJRQMKWoLq6gs4vNuJAiep7/SuS1bxHNeBorbMMJ6nPzN+Pb6UxG3q/iG3sQ0UGJrjpgfdU+5/p/KuPvb64vZjLcSF2PQdlHoB2quzGmk0AIaKKKBiVe068MDeWx+UnjPaqP0ooEdnbyhkUg8EflT5HZbxhwyIAh98cnn65rM8NXJnbyTktEN4+nb9SK6FYI36g89800MZA0kWfLbg87TyD/nFaME6y8AEMM/LVb7Gu35HIAGORmoUjaN/vMGU8HP60NXGnY02kAFYWuzeZA0YOMjmtR23RB8EHoeMc1lzRefIqkcE9qwa1sbRtuTaND5WnQR4525x9eamhv4Zrt7SMksg3E44f6H0q3bhZWZSOScn6Vi6vaPZXLz2zbJIzvU+oPUV0RRjJnNT75XZ3JZn+Yk9z3quDzkdqtO275jjOc8DFVZRtc9PXihkItwapfW5/dXUo+rbh+RrTt/Fd0mBNHHKO+PlNc/1pcetIZ21n4jsbnCyMYHPZ+n51qhldQyEMD0I5rzTBq/p+p3Vi2IpPl7q33TRYDumFFZ+matDqK4UeXMBlkJ/lRSA06x9X1+CwzFDiafpgdFPv8A4Vk6x4maUGDTyyJyGl6Mfp6fz+lc4TzQBYvL6e+mM1w5Zv0A9BVcsaSigAzg/wCFHFGKX3oAbS0YpR60ANpSKUigHjHbNABFLJBKskTFHU5BHauw0HWVv18mchLlR+Dj1+tciU9OlLDI8EqyxsUdTuBHamB6UMqeetNlUMMjrVTRNSXUrQMwCyLxIoPQ+o74NaTQEjKnIpjuUwQQVfjPcdqhiX9+wIGRViWIrkEdahtc+Y5cj5fkA9R1z+uPwqXG7uVGVk0WrRSbgY7DJqj4uJjgiYZ/eDYT9Oa3Le3MUZLfebt6Vj+MMf2VD6+cP5GqRDOMcgoRjr71BPyQ3qKmfA/wqB/9WtNiQzHA96fjmkUZApxwD1NIBBTsYPHOKUDg+1PAHBoAfEzwyrLGxRhyCKKF6AelFOwjO/CkooHSoLCl/Sk60ooEKuDx6Up4po+9T26Z9aYDTS44o/lS4A6cigBMEe3egmnYIBzxRyzHJyTQAIQueCQe1OKcgAg9KZjuakjbaCGGQR64wfWgCaxu5rG5E9u5Vh69CO4I9K9B0jUYdRtRLF8rg4dD1U/57153sbbvwQM4z2/zmrWk6hLpt4JosHjaynow9P0/SmI9Em2leQCKz7CPzdRcfwod2T19v1qW3v7fUbbzLZ85A3IThl9iKdpUYGoXWeoRR+ZP+FAzVPNcv4zlxFaQ/wB4s35YH9a6VTyQa5DxnNuv4IccRx7s57k//WFC3BnNueKib/VLT2PBPXrxTGyFUE9BTEKvCgdKKQdBT+emMUgBVyDUi8Y/OkTPPNOQZYY7imIa2VYjPWikuTj5vWihjKBoPSiioKHquUyTxTelFFAhG6VL1iHNFFMBv1p3Tn9aKKAFyCeOP6Unyn8KKKAFzxgZo+v4UUUALuYKR/D/AC+lTvt8wlSCuNwJH+c//roopiH2V5NYXKzwNhx19GHcH2/z2Fdx4e1OHUHkdcJMYxvjz0wTyPbkfnRRQBrP8sgOOtcD4jmWfXLplbKqwX/vkAEfmDRRQgZjueAMUrnBx7UUUAA57YqRRkjjB+lFFMB6cD0PqBTwPmGKKKYiO5BMZGOnNFFFSxo//9k=",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d5",
            year: 2014,
            month: 8,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 10%",
            period: null,
            date: null,
            paidAmount: 55000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d6",
            year: 2014,
            month: 10,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2014-12-02T22:00:00.000Z",
            paidAmount: 40000,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d7",
            year: 2014,
            month: 11,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2014-12-14T22:00:00.000Z",
            paidAmount: 40000,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d8",
            year: 2014,
            month: 12,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 10%",
            period: null,
            date: "2015-01-21T22:00:00.000Z",
            paidAmount: 60000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014db",
            year: 2014,
            month: 9,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: null,
            paidAmount: 15000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004b",
                dateBirth: "1992-07-11T00:00:00.000Z",
                ID: 39,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-05-19T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.434Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2015-11-03T13:24:56.462Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 23,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "roland.katona7000",
                workPhones: {
                    phone: "",
                    mobile: "+380956937000"
                },
                personalEmail: "roland.katona@thinkmobiles.com",
                workEmail: "roland.katona@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014dc",
            year: 2014,
            month: 8,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 10%",
            period: null,
            date: "2014-11-30T22:00:00.000Z",
            paidAmount: 55000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014dd",
            year: 2014,
            month: 11,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2014-12-04T22:00:00.000Z",
            paidAmount: 11000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004b",
                dateBirth: "1992-07-11T00:00:00.000Z",
                ID: 39,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-05-19T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.434Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2015-11-03T13:24:56.462Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 23,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "roland.katona7000",
                workPhones: {
                    phone: "",
                    mobile: "+380956937000"
                },
                personalEmail: "roland.katona@thinkmobiles.com",
                workEmail: "roland.katona@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014de",
            year: 2014,
            month: 12,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/QA 16%",
            period: null,
            date: "2015-01-04T22:00:00.000Z",
            paidAmount: 22000,
            supplier: {
                _id: "55b92ad221e4b7c40f000063",
                dateBirth: "1990-07-30T00:00:00.000Z",
                ID: 57,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-11-17T22:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "5644388770bbc2b740ce8a18",
                        department: "55b92ace21e4b7c40f000011"
                    }
                ],
                social: {
                    FB: "",
                    LI: "https://ua.linkedin.com/pub/yana"
                },
                sequence: 0,
                jobType: "fullTime",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.464Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-02-08T08:41:58.734Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.464Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.464Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "5644388770bbc2b740ce8a18",
                department: "55b92ace21e4b7c40f000011",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "yanochka_3007",
                workPhones: {
                    phone: "",
                    mobile: "+380508754761"
                },
                personalEmail: "yana.gusti@gmail.com",
                workEmail: "yana.gusti@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Gusti",
                    first: "Yana"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0,
                transferred: [
                    {
                        date: "2015-11-12T07:01:22.647Z",
                        department: " BusinessDev"
                    }
                ]
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e1",
            year: 2014,
            month: 9,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 10%",
            period: null,
            date: null,
            paidAmount: 215000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDlo5ypBB5rRguhKCGH41hAnNWraVlbvWcolxmatzCrLuUisu4iPPy1a+1yMpAWmKjPy2SamKaKm09iglqzHJ6Vajt1U1ZVP5059sZAwWYnoOTVOVzNRGpCewGDUUmxH2k5Pp3q15U7ryRAn5tSw2PmXK2yMpYjJbrg1NyrEKW7shdmSFc8Bzyaljslbny2kbs0nyj8utaTWyWFyB/rZGXktyVpC4TAyc5ycCk5DSK8MBHBwQOxHAq/awMmSCq5/vfzp019Bb2vmN8qDsepNc/d+ILiU4gURKT16k0knIbaW50f2bzGw/f+In+VMW0SSXcrlFJ5BGTj+nQVxslxLK26SR5G7FiTTobiWBt0TMh9RVezfcn2i7HcGzihzszlu5NJFpjSAFlKLuyfUmubtvEd5EAo2EhcAsMn8zXT6P4jtblRFdDZPj7zEYbp+XPaocWty1JPY0LewjXhY9o6fKev1NW1hjiXkhfbuaDM54AC/SmgkryM+tZc66F8r6iPcEDESgf73X8KzZ0edyZWZgM4yelaBQN04zTHiYE5HWspOe5pHlRiz6asgOOncGs59MeB90TFMHp2rqdi9+9NMCv93HPrVRqPYUorcw4LsxEJOnzHp6H8alkvJhxHGE9+tXJrINw6AelZ11HLZMuPmjb+E9qtJMTbAyySACdiRRVy4028Fkk8cLNuAJUDJX8KK05WTzLucTHCTVtIABnFSRwIp+Z6srCx4A47GtXIxUSr5eeKlVcKNo3EdhV5NOUgbi2e1WksUiICqWPr6VLkOxmfZzIpaZ8D+6tTw6eylWgi3jA75rQWxeQYI2p3OOSK1I3hSHbGMAccdanmHYy20c/K0sqqM9KnFlDbOGdQcj7ynGKfPIrkc/MOmKlMUkoG5cDFTcditlF5hGQeCSOTVWa3WOF7lwQg5YngVsW9gwAOML1561z/AIyuZVMNlnCFd5A788D+dOKbdgbSRzmoXr3kuSNqDhVzmqyj3pSPXn61PbReZKPQV07Iw1bGrbv6H6UrRMgyRWyI8J0yB1qOa0eZRsBz7Vnzm3s9DNtovMcKFJP+zyfWrsUDdI1KzBgARwB/n8e9Nis5kclkOQPWrUdpITzH1PUZ59hTbJUWdBoWotcQm2kzujHBJ5x7/wCNaqth8ZyD3rmLcS2F3DORtUECQdsYHXt0J9e1dFFcQXJDwNtf+41ck463RvGS2ZZ3BRkjP0p8Z8zPIIqv84zuQjHPHepNpKhkVs4zlaSY2gmUE/IBketQM8sePk785q0q3G35o1x+tSGI7QDwp5xjNPlvqLmtoZ6Tuod3jJH8IUd6t21vDeSqXQPGBuGfWpxbhgUBJB6jFT2toLdiyk4IwAe1b046mM5FnAUDHT0ope+KK6DE83sbSKe6bf6ZrVeJYtqxpux3pLmwksWVwm0E4PNWmdIYxuYFj2rkdzo9CPyFLAscbakiAGe2e5qrLcGVgiDCjvU8MbdWz9TSuNImZ3YBY1JHc01bVmJwevUVMsscY5Iohv45GMcS4bPGRQO1h0NgI/ncj8aJdStbbKqTI4/u9KqXpmclZHP0qj5YOc80uYrkvuPutauZFZYmEB6Y6muUvmuZ53mmDkFtu9s9q3NRhKrHsXLEgAUhVZbd0lGQwCjnnHQH+VaQlbUmUObQ5jHrV2xUbxjP1qCaExTtHtPy8c1q2duEQHqcdh0raT0MYRdy0i7m49KuQQncCKih24B5BrQtTuI4J+lc0jqRbhtldQWQE+pFWksYQx+XJqaBTtBPPtVxIwWojG5EpmZrFgkulSbYxuXkDpnnpUfl2kRRlwyjg47Vs3sYNjKrDIK44qtf6XCbYCKPDD+71NbqJyzbZMkVvOg2OyknOAasfZ1HQmudgmntpQq5ADD7wretrhpchx0700ovoJTY82/o3H0oFuM5Zif0qaiq5IlczEA2jA4FFH9aMVRIcUUGigDnvEsxGnKVxlmB5rkv7UJky65rV8U3LraQq3Vuw+lc3EpJBI61i7S1NIXSN+KbCeYFyKtxXLSghjtHpWZBN5VuyMOD0qeDdIN3v0rFo6Ey26HYSpyR3PNO0xDHco5/WkziEr6mrSo0MIcdhSi7MU9jQubdbo9MHpmqE+nPGvH6VHZanK11sI4B5rohtkj5wc1vKClqc0Kko6dDklSQXQ3IdicisoKyTBWVthYIw6lSOK7i40+OQE4wK5rU7FYLxhGCCyhyc8Hr/hWaTjudKnFmX5ayzNuUNzxkVbEB8s7ccDNVYsqxzzV+2jZjgdMU2OJjt9tMxMO2TnlV61raRqSNL5F0hgkHUMCKZPYGJpCrbN2MMBkryOf51DcXt0821p3ZB/CUCj8qejRNmmdzGo8sbCG989as24PJJ6VkWk3laOtwwZztwFBAxx71W0+4vrqR0iuVAVtojmTafwYdeM9sURaJlF2bOhnZRsUnqc8e3P8APFILuFtw3dO1c5qt9NDdpBJIWeJeWA7nk/piqs1zIzoQeQPzrTmOdm5Pbh2LhgAeadaFw2FbJqjbTgwsZXyT/KrVhMjIHBwcnNWrGRrxE4wetPqvGecrzmp+lM0TFpKNwzigdOaBhRRzRQB5LPPNf3ADkuc/KPStFLTy3jUjouTUum2qW9xLvHKnAzV0rulaQjOBgE1zSlrZHRGOlynLGHXCDGKt2Y9R7VXO4ZYkYJxzWhZRYjUk8mpZQ9E/eAepq9cR4tSM9qhjTNwOnFaRjVo1DdDSirimyhpunIv71uSa2RhVAzVeNQpwM49qWRnxmt1oc5YJG01zut7PtgPrEBj2ya2GDKuWJAIrm9XuFlun2kFVO0djx1/XNE3pYdNXkZjZBz+HWrlqxJG3PHBqlnLg/r6Vc09gXDFSQOcVm9jpRpt/qS8mFUDvWFPJFJKWRt3tVy/u7icGPy9i9AMVTtrSQqrtbycHAcAkGhIq52mlwK+jxKwyCM4q3BDHBGR5aog5Ofbv+g/Ko7FGhsoV5yAMiq+vXv2e2ESn5pOvsv8An+tapJK5zzerOfeJru6ecqEV2LHPbJzUscMIbZvL5GenSqn2oGRoznaR1p8dyv2RioCsTtPtUq5k7F+OKOWPKnO04GO9WIIVDgocZ4K5rGtrlkbZ09Perw3x4kRsljzjtVbGZvK4iwGyMdDUguAyE/xdqwk1GSSUI/zL3OK0Uf8Au8VSd9guTi8J+9gZ6kdqljuxv8t8sR3AqAoGjO4DFRIrJHM4bkjavtT1Gmy02oJ9pWKPkdSf8KKxrQsskchYCQHGM4BoouO5T1NEhv2KDhuv1qMEEHjGateIUC3hK9sCqNsDIW578VzSWrOqD91ErWoZQ2ehq5bx7duDwKie1b7OADznNWYdsUOZGCKvJZjgCkhslt0PnsxFW7pvLh3elYx1/TbYvmYyMOiopOfoen61n3/i4SoY7a24zw0h6j6D/GqitBOLZ1tjskTcXz7VT1PXNOsA6ecJZlH+rXnn0J6DmuFl1W8lVkM7Ihz8qHAIPUH1H1qoGGME8+ta30CNDudZc+K5LyNo4LVYz03s279MVmksyd+grGhlaCQMCMenrWvbTRTxgI3zAcjvUSuUoKOxCzFG7jNWLK88nzBjBI+XFI8DSISAQVGfrUX2SU4wCCO/NLRjSfQtm2aZlnEhTPU7v85rp9Kg2RhBMkijBwVxg++OtZejxqsQa4Qgop7ZBHNdFA0IiDRhBxnI4AoirsJysrWHNOsSNJKRgEKNo+8TwP1NclqV7JeSO8hIJPyr6D0rQ1LUGe48uLJIP7senq39B/8AXodIZY1jmy0qruLjnA/rUuprYp4SXIpdTD2sD8uM+hoCOGAQHB5PvW1b6eFk3Ha46j8q2LW0gGH8sDHtWkXc5JQcXqcluCsCEPHUVcs7kszjoDwAa09Ts7QgvGVV/asuG2ZySpAxzRfWxm0W4fLVgvmKGPODV0ylflBGO+KzPKCyAg8jrg1YgYyznjgcYNWrk2LLl/XC59etSn540jztzzUFw4zgHb2qMMzTBkb5RxR1DoOeDYBuHOaKkkUkDeDjOAe1FWSU9fI+0Off+lVtMQshOO9T6ywkuJApzzVOS9/s7TmcH94QQg4znHX8K5pbndC9hNc1tbV/s9ttaVRhmPIU+n1rmLiee6YvNIzt7np/gKUZnchiWduQT1J/z/OkReM8Zxz7j1q0kjeMAjQyQK3GVYj+VN2Yz9ataeQHWE9HbAJH5GnyW2H2gcZODS5rOx0KlzRTRnZPIP0pevWrD222ZgePwqOSF4xkiqujF05IAOOaVchgRnjpircNr5tuHQAnP9amW1V4+vPYiockdEaLYlpfyIcsEcZ/i61pR6m4fiKJc+p61mi1kRiQFcYwexFPCSbx8uB157VDszSOHh1RsQ6i+EYiJSp5ATrS3GpyGMh5AcH7vGB6ZrKLuFwqZc8VMyiAebMQ8pzsQj5V46gVDuaqlTjsie3AeYAhgcb5i3XHYH6/yqwrsbYyN1lbP4dqplTBa7MkzXDDee/vV2YbPssXIAGfyqWV1H+eVkYKeV9K0rTUzyHwwrnzNtnkbOewxVlCQdgPzBdx9qabjsRUpRmrNF/Uo5XV5oBvXqQDyPwrLSRzH3BHUVoWlyQhYZxuwMHrV37PDeruIVZf7w7/AFrWM77nlV8K4axMFHfJBz9au27EMxPU0TxJEXjbIdeCtMVwwHOCvStrnDYsgvk4QN+tT20O3dv+X8azraeaJny+MngGpJrlsjO7OemKaXUll+Vs4A4UUVUjm81tr429z6UVTGivqa28MoW0bdHgHrmud1WYvcKitlUXGM988/59q1dQk8lEycH/AD+f/wBauekZpJGfOSxJ496wW9zvpqyGhSDx1HNTliR5ijJJzx/e7j8f5/SmRSKMLJyOzDqv+fSpmiKDcfusMnjP/Ah/WmzqhHTQbafLqMHJwXBB9sDFXp/+P4gD7pNZtof9OgxxiTHPatK5OL+TGBkgj2qZbm1F3i/UGUNOAe4/lUV5F/o7MB6jFWUUPPGQOinJx3xT2TzbIjg7ic/mam9jdxumiPSMS2zKT0HSliGJ3jyAp5GDTNAyXYE9OMj/AD9Kfd5gvl64yM47DI/pSfxNEwl7iZZddpwOPU/571DIpOBggHsKtyx7o1fgjGevc1Ei+YoVe/Q+g+nrUpmoRII0JH4n0qOBDNPvYYROgp0hOQsZOfapggSLGMj+dADAjXF4kYBbHHHeta5sLpiGW3cgDjipvC9rw906jc3T2rojW0aKauzzq2McJ2itjhodMunvh5trMqKSd2wjNElvefaZWS1l+aPAzGeucdfpXcUtV7FGP1+XY5COKWO4ZRFKsNuuxcqfmb1/nWla7lClgVyM4rdopew8yZYxyVmjFvbI3qiSI4cDBUdW9Knt9HhiUFhufb39a080VrGNjkk1J3Odm0aVdpRhjcOtT38cafJCoLbea2zTTGh6op/CnYixySK4YoePeiurEMQOfKQH/dFFFgseda8RFdJArZVMg898cfz/AFrF5U46Y4qxdtJK4nlyXkJY/j/SolcA4YBh3zWSPRiraEkRMnBQSY69jj/P1q2sYEJ2OWjzkBuNpqGGDEg2k8n5SOv5d60MZiLDA45FRJndShpqYtgT9tjz0VuB61o3Tg33U4PXHas+wOL0fXjNWJpCbpiBgnPB7VUlqY0Xan8y/CwZJmyBuGAfT/P9KsxY+xpwQSOTVOM7bdj24JAq0rZiiVfvY6Ef571kzsiQaOmzU5Ux/D/UVPrceYfNPYjP+fxpbRAurMy8Arg/XP8A9arepx+ZYygcnaccZx/nFJv3kzO1k0Ms2WfTlZgTgc880ziOMyE8dB+f/wCumaAfM0+RSeMkH6cUmouV0+M8jd2x3NFtbFRlpcS1jeWQsBks2FA559vzxVkwyTSoq7VQuEDMcD15/I/5IpdMc27POmcRABWK5VCT1b2wc+uRWxbQpc3MLbt4Ch3Cj5RJwc9Bgnc3HsCa0jBS1MK1d09EjW0+3FvaJGOMDn1NWO1C8DFL7V0nit3d2J2paKKBCUvSgHn2ooAKKKO1ABRRRQAUUUUAeU3is23YMpj5cc8VVjiIOGX861LuRfP2ochQFBPXAqa2jWQjcob8KwvZHcp3dypbptAA4B7HBB/wrQwPLb6d/StKDSIpEHlu0ZP/AAIe9Vrqzms8rIuM8hhkqc+hxWck9z0aNaEvdW5yln8lyzZ6Z6etSbyZtxz16VBFkNJ7HipF+/Wz3OKD91I0Fb9zIcduh7f54q/EPuc5wo/Q1nR/6gDrk/ktXkk4B55TAHTuaxkehAsQfLfBvXPb0q7cLut5c9Bn86pQuWmgA5bHHPXir143l2s57YJ/TNQ9xvczfDI3wTp2purkbIkBI5PH8v5VJ4W+5Lmo9bTbJgk8An9TVfbMo/DYtW8ptLL7VDKFmYhAoPbHXHcdOOh/Sui8PRyGzWWU7mOcEjnGSevfkmuWdpne0toZHUsQFAY4XkHpn1GfwrvLWIQwIi8AACt6fc4sbK3u9SWkzS0grU84KWkooAPpQKX+dHSgBKKX3ooAT+tFHeloAKKSimB5aDul3dc81q2KkkDv6CsdTmQZP4V0GnmKOPdIVRfXpXMzribNmvA96n1LabCUOAV2EnNVLfU7MYAY8dwDUesahbyadMkUmXZSFHOauOiM2nzXPPo/4v8AeqVCvmZbGKcLGZMrxnk55FSC0OeW5/Shm8Z2SFilwSAOvHvVlrgGdVU4Cn1+tRJZndyx49BUwiERJUAYHWpaRqsQ0tB8NyUuo327lXAq81416/kHCLJwdvJrMkBx/OpY5VgGVPzY4PpRyoiWJmzp7PTrWw2iLOO+WP8A+qn3WmWV6VLGRcZ+4f8AEGuYGozkgqx29efWrlpq9zGw8wA5qrLsY+0n0Zuafo8UWoxzJKZFQHCleQT3z+fauiHAFUNJVmtlmddrSDOPSr/tWkVZGE5ynK8mFJ1pelIxCjJpkC8UVFb3EVyC0TbgDg1KR+dAw6CikpaBBRSUtAB1pDS5oFAB3opO1FAHlABD7lzkU7eQcls45GalbheOtMERYjtisTpJBO5AUcH61Irkjbk0kdufX9Ktx2/QOOPSk2ikmVljLcZ5qaO2JPIIq8luqqc9AKlXAY4FTzDsUHi2rkD8qrSleg7VoTxF1IxVU2MjHODjuce1UmS0Z0r4+vbFJDG0vUfjV46c5JPT3zikNqzgRxyhAOvlgu5/LpVrXYjRbsq3LxRFFRmZ+jDsP/r1oadZyXdxCm5SjNhhnnHelttEOFC25b3mbH6Cum062itCkjmNCqkDtRbzKc4WskbMaBEAA6CnHgZqA3sO3IYMMdjVVdXje3eZ45I4l6sRn+VXzIw5X2Fh1F2v5Ld0GwdGBqxevtgPNc+9zb3N+JLSYOQPnCmr+t6nBZQx/aC4MqkrtXPT/wDWKlS3RTjomiv4fncy7B9w8muirm9CkAMZIwSo4xWjca5YQO8bzjerFSByQRxSpvQqqnzbGnR24rGfUpEdZdpSHuZOM/QdavWmoQXjERE5AzyKvmRnyStexb96KZ5i0hlUDPP4DNMkkFFNjcOu4BgP9oYP60v40AHail6UUwPN1h3HJp4i45UgUUVynYkWkRVXOM1JFkyHjp29aKKkosgbl4PTrSxruHGAPeiikA5wIm2kKeM5NNb94MBiue69R70UVtHRGLV2NFnb53TEyHr87ZH5dKto9vEMKFA9AMUUUnJlxpxHfbIgMZAqvPLbTlDK7BF/u0UVLZtGCGPY294pa2vXD4xjef5Vf0+J/JNlefOpTb04INFFNbmU9LoyYdHn0jUneNA0Dcbh1Azxmt66t49R0wxygb05UjsaKKL+9Yj7KZFpMJV1RgPlFS6rYRPFI0aKrn5iff1oopx+EUm+cw7DTzJIIypLetdJY2cNtkRrh+57miiimr6jrSexc2Lnpn604DHAxiiitzmE70vaiigBBRRRQB//2Q==",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e2",
            year: 2014,
            month: 10,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/QA 16%",
            period: null,
            date: null,
            paidAmount: 22200,
            supplier: {
                _id: "55b92ad221e4b7c40f000063",
                dateBirth: "1990-07-30T00:00:00.000Z",
                ID: 57,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-11-17T22:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "5644388770bbc2b740ce8a18",
                        department: "55b92ace21e4b7c40f000011"
                    }
                ],
                social: {
                    FB: "",
                    LI: "https://ua.linkedin.com/pub/yana"
                },
                sequence: 0,
                jobType: "fullTime",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.464Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-02-08T08:41:58.734Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.464Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.464Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "5644388770bbc2b740ce8a18",
                department: "55b92ace21e4b7c40f000011",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "yanochka_3007",
                workPhones: {
                    phone: "",
                    mobile: "+380508754761"
                },
                personalEmail: "yana.gusti@gmail.com",
                workEmail: "yana.gusti@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Gusti",
                    first: "Yana"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0,
                transferred: [
                    {
                        date: "2015-11-12T07:01:22.647Z",
                        department: " BusinessDev"
                    }
                ]
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e3",
            year: 2014,
            month: 11,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/QA 16%",
            period: null,
            date: "2014-12-02T22:00:00.000Z",
            paidAmount: 28000,
            supplier: {
                _id: "55b92ad221e4b7c40f000063",
                dateBirth: "1990-07-30T00:00:00.000Z",
                ID: 57,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-11-17T22:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "5644388770bbc2b740ce8a18",
                        department: "55b92ace21e4b7c40f000011"
                    }
                ],
                social: {
                    FB: "",
                    LI: "https://ua.linkedin.com/pub/yana"
                },
                sequence: 0,
                jobType: "fullTime",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.464Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-02-08T08:41:58.734Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.464Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.464Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "5644388770bbc2b740ce8a18",
                department: "55b92ace21e4b7c40f000011",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "yanochka_3007",
                workPhones: {
                    phone: "",
                    mobile: "+380508754761"
                },
                personalEmail: "yana.gusti@gmail.com",
                workEmail: "yana.gusti@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Gusti",
                    first: "Yana"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0,
                transferred: [
                    {
                        date: "2015-11-12T07:01:22.647Z",
                        department: " BusinessDev"
                    }
                ]
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e4",
            year: 2014,
            month: 10,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 10%",
            period: null,
            date: "2014-12-02T22:00:00.000Z",
            paidAmount: 10000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e5",
            year: 2014,
            month: 10,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 10%",
            period: null,
            date: "2014-12-04T22:00:00.000Z",
            paidAmount: 50000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e6",
            year: 2014,
            month: 12,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 10%",
            period: null,
            date: "2015-01-07T22:00:00.000Z",
            paidAmount: 60000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e7",
            year: 2014,
            month: 12,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-01-21T22:00:00.000Z",
            paidAmount: 40000,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014cf",
            year: 2015,
            month: 1,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 10%",
            period: null,
            date: "2015-01-31T22:00:00.000Z",
            paidAmount: 200000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d3",
            year: 2015,
            month: 1,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-01-31T22:00:00.000Z",
            paidAmount: 20000,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d4",
            year: 2015,
            month: 2,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 8%",
            period: null,
            date: "2015-04-22T21:00:00.000Z",
            paidAmount: 130000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014d9",
            year: 2015,
            month: 2,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-04-05T21:00:00.000Z",
            paidAmount: 37500,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDs6Qmk3UwtSJsONNzRmgDNAxwp1IBilpITHDrS0g6ZoJqiRc0haqF/qsFlEWb527KDXMXmuXV45XzRHGf4Iwc/nUuRSi2dRc6ta2+QXMjf3Yxn9elc/qfiacqVt0EPPJ3BmI/pWFdTIw2qkskh/wBo4/z+dVhaSsfmKoT2x0/Kp33KtYLnUXlkLld5POXbNVvtE8rbUwPpVhrJgpbzEZQATtzUQDIxKt09O1PQNSVI2Q/Ow3fXpUyhOvmYqpn1Y+5FP81VXAl/MYpNDTLYU5yMNznjmrNrqE9rJuhJRjx8p6/geD+NZRuV6ZBPZlOKntrkXA2SDOOjjqPTNKwXTO20vVzex5V0eRR86MNjA/yrTinWQ7RlXHVG4P8An6V57loZ1Mcmx15WRP8AP6V1mlXy6lB5dxhLqHqUP6ihNiaNrNC81DEznKS43r3HRh61KprRGTJkFTKKhSplFMpDqKKKCigTTCeaRmqLzKi5ViYGpFqupy1WE6UXBqw+k70hNAIGSe1UjJjycVgavrRj3JA2MH7/AGp2u6qtnGE3fvG/hHYe/vXJ3BecbpWZYs5JPVj7VDd9C4x6slaQ3LtI7tJzyznaPy5JppvktkxGqljwNq5z+J61VVrm7YR2seEHHsKv22mJC2ZGEsxHO4/070bFryKkUlzKS8SNk/xv0/CknF4MhnCn/fGP0q5c3MUfyvchz/ciAAH1NZM0xLFhGMZ4+fJoQMUyyF/3hAkHRwOT/jVaXGS6jGeoFOM+8YKg89DxUieVIMkheeVboPxqidyvHmQ4UEADk9qXMajBYu3oOlPuzsIjI2KBkAHIPv71BGC7BUHJ70xAQCwwAvsTWlbkwwDyi5IGWI45qBljtBk4Z/TGas2lzezsdjeVDHyzA7QPxqWNaDIZJZLlC5JOfpn2rRtbub7QGgzGw43AZ/zxUErWzXKvFKW9wQMH14H/ANeq7XZSUeUSqHkjPNS9StjtVnubVI5bhxLH1DqvIXHcfl+VasMqyBSCCCMhh0IrD0rVbdrcLJlzGoXbjLEmrGiSFI0iZWTLsUDEHj0oi7Gckb6VKKij9KmFaghaKKKCjBlmwKhWXmopSaamc81z3NUjQibJq0p4qjBniri9K0iZzJM1Q1jUFsLQvkbz90GrpbAJJwAK43U5pNVv8R/cyEjB7+5+v/16cmRFXZRDG4lkvbjJVW4yeWb0H86SSJ5XD3KnGBsiHHHbPoK1Gghl1CODI+zWsfmPz/COefdiRWVdXck8kju5Iboo4FRuag0hUFJLgRIv8EYwAP51Vmu4UTZC7Ed8DrUDxZ6AD2FOSxLLk5qkkLUrtIrHBOPwoVDyVNW/sDbenPpipksCFBA59afMhcrKBIPDDNJhSpGfx9a2F05QAWFP+wx4+73qedFezZz7bioRiTjpntV1Qlnb+YSDKfuj+7/9epb5Y4XCovznpVf7NJcNubhRwoNVe6JtZleNTcXADNhepJ7CrWoTARCCIFUBzj/P1FRRQsswUcHNRXGTMSOxNPdi2QkJZY5CDj5f6ipmkIGewPzAVArfKR2Jq1DEZXUdVPBz6UMSNqyu1hjRvNjhyfl35If8a6LSb1LidUnWOOZlzGyOCjgdR7EelcFdpiUR85VVAqexvZLdgM9CHAzjBB/qOKm3Ub10PVo3UjjqOtSq1YVrdqUtrqI5id/LkBPKnnH+fcVsn61adyNibNFRg0Ux3MJocmgRYq6Y/amlOKxaNkyKMYFTrk00KKkWmiZFXUZBFZkt90n5vp1/pXO21zHFFcajIF2x/JGPU45/Xj8K6LVozJp0uBkgZArm1tPktYCu6JGEj46MACR+pNKW4orQpymWC3cTHM85Eswz04yq/gDn8R6VTWNpGxySfatPyHvLqQ+u98+o3YH6YqzbWG0lsc1PMaRiZ0VmwIzjParcdrk89BV/7OuMYz9aesYAIxUuTNEkVEtwO1OMKjGBVjABpCo61NyiuYxTWXbnPSrG2obsH7O4HGRzQMxIohdXMkzDK5wo9quJCMMxAGf0qzb25hjVSOi5NSxoMF2wAKpyIUTKMAjmaQjAQZBx37YrIuEySRwOwrpJY98ecYGe/wDn3rHu4P3mPWrhIznEzlQ7AffFTo7KmMnBJB+lCqWCKBzkkCp1iJlZEViG5Uj/AD9a0bMrFeRpHuBI/OeB+AH9MVCpIkBrQltzsiTq6ZZh7Hv/AI1RdMbh/cY/zppg0dZ4buH8tVfLQyFWP+yUOc/oPzrtoz8gHpxXn/huTEEkf8TfKnsdwKn8812miTPPp6+aR5sbNG/1U4/lilHdomRfFFLiirEVCKaRT2ph6VmzRDcYpVFKBTlFIbIb9C2nzgddhrPtoxLHcAL0BQfTpWvPGXtZUXqUIH5VS06HZagnq2STSkrsSdkZ1tZlIULDD7dre+D/APWFW1jCJ2qbGGxTX46VlY1TK0nBqLAyccU+TPeom46UjRDW5Y9xS8dxUZDZ4pCx96BjziobnCxMTzxjH1Ip6sWJ5z9KV4TKm3oDSGRA7gxHFPChozkcDr708wEKBjgU8AldmOM80AVvJJjUEfN1IrK1BApbA5I610og+XnqetZWq2vBI9KqOjJeqMGxi+fzSPlRt34f5zVuOForaIkE85JBxipLdFg09lbG+Vg30Qf41pX0KLBajO394pb/AHenP51blqZJaGBcqYtUJjJUcMCff/69QTIHupCBhXYjHYZ5H61oTW8k987IOIzt5PpwP5Gkns90k6Rqdy7SPrj/APVVKRLRLols4kR+V46/jx/n2rsdCfzGvTtwDcMw98//AKqx7aEIqKoK5VT+OSf8K3dFg8qGV/77k/5/WlB3kTNKxo0U1ulFbmRXNNNOI5pKhmqEFPUc02pIxk0IGTInymqkahV24wFz/Or6Vn3JwrAdSab0JM+4kUTnaetO3AjmqdxHuHEmGqhIb2H7jB8VznQo6Guyg55qFo+tVLW9mZ9sybfSr7NuFIrUh2YXmmGPnOOKlL44pjSoo+YigaIlAU9qkEgHWq0l3EDwc/Sozdo3A5P1pWKLpnXPWnwkM2RWYGJbkfSr1sQCOxpAaAHykVXurZpYjjA46mrEeefSpMbgBVWM72ORETPfqJjnBJI7HHb86s3TtPFPz86bM+nBH+NX7+z2XgdRxyxOP89ahghUTTM3Q7M/gOabYrEUkaKxiAJZmxjHvkH8xT0aO3WWTCkorEL6gcClLnc8hHSEv/wI8AfmaqQAvcRb13GSJgVHuSf8KQjchO9Sx4AbjP4Vt2Q22kfGMjOPrWVp1u0scfmZ3ffb61tKoVQo6DitaS6mM30A0UGitjMhNNNONNNQzVAKli9aiFSpwKEJk+cDNZF7KUhlbnO0EflWoTlSKz7sJtO8A4GORwKJ7BHc5JvtBmQTnylkOWmYbto7YHYe9Z2pvcWty4gvcoqggM/LckduOorqLmWKVdsgVscDsaxbqzt5MlYBn1rKMl1N3FsraXqU8rBZBuwcZFdPH81uHIww45rnbSyEcocR5AO7rgA1uTSNHbgN95uamVr6FJPqKMSNVa5SNDh/m/Gn28nykntVG5uFM3zn5T+lJF7A8lorYYZPoBmnJe6epOdg+tU2ULPkoHi7bT/P9ai1kpcNE0Vu5QRkELxhs9fTpWiimZSk1sjege1uP9Uyn2FXooRxnn+tcTp0NxFtZFbf3DEbT+H5V0+lX0m8xzKR7HqP8frUtJDTbRsbNi8dKEJByfpQ0gJGKcinOTx6CkSJdhRbOz9hWHApe3foAFKk/X/JrT1aQiDZ/e4qisREccS8FyC3sP8AJpNjWxA7KMHHy8sfoAf/AK1VbF5GvYRbp5rbcdeBjitaSyLBlXoRj8MdKm0+3hs5miQAsD8zf0oRVupbtpprdx9paMlsD5FIx+tamcisfUnVI255xxWnbsTBGT3UGtoPoc9SNkpEwGaKBRWpkQGm0402oNQFSjpUY61IKaEx2aoXmDEeetXqzruQPwO1TPYIfEYs0G45OKi8jae9XZMAkGo1ZcgE5rA7Lj7eFT1HQ81V1OffPtXjtV1nRbcuv0FYzvunyaEgXc0rdF+z8dTWddW3zkHkGrcJfHHSkmSR+euKLjM1FaP3XsatxSptwwU49RTTEe4wPpUflHPQ1V7isX0mhUcADv0p/MrA4Ax3FUYiQecitG2HvUMZZhLA43Nke9aEIyuTyarQxA4zVuMcU4oxmylewGZwPapoLUh9zcACrioCckfpUdw+yI9qrl6k819ChqV+lggcLvbOFX+Zplo8Mrq8ZOWOSDWVrJY3hBORgY/LP9ak0Us1wijpmpbOhQtE0rn/AEq/Fso53cn0FbigKABwBwKzdLhDTT3ePvsQp9q0hW1NdTkrSu1FdB+aKZRWlzIjNNp5pvepNAUc1KBTUHNSAcU0SxpOAT6VlXIwSRzxWpIP3bfQ1keYftbRNyrbvw71FQumZd3Ljk8EUmmRG5uAXYhcHHuaSW3a4myxwoPQd6uwwmNAAOKxudDegupxAMkUXCquAP61kPBIJcBTmtub99GOfmXufSq4IibJ+Y+gpsIvQz5/OjQKgYfhTIhc4ySdo5Oa1Gum2n5V49arXU73EXl4VE77eppFkUc4fhh7c1IYw44qBVVRipYZQp2tQBItsCelWra3Ib2pYgGOavwKB2oSuTKVhUTbU8Y45pjcAVIh4q0YNjxxWbqlwkUbPLny1xwOrHsK0icKSTWRcSR3DeW65QnuKJvQdNamJ5d3q1xJIiquf4c9AOK0rC0aEeQjAzycMR/Avep1gKs1tZKVzje/f6Vq2VklpHgcu33mqYxcmbzqKMSWONYo1jQYVRgU8UHrTa6DhHZooopANNNFKaQdaCyVBUmOKYgqXFUSxhHBz3rFkjK3+TW4RVC/hwyyj6GoqK6HB2Zhy5ilkUjvkUW+t2pk+zTkxy44LdG/Gpr9f3obH3uaytS0xbq3LAfvE547isFa+p07o0ZrhFyC2O1V1kYtkkMvqDUsV5ZTWuy6CRyqgzv4x16H8qludHtmb5HdMkZAbinYFJLcpyHceuR7UnlFz3xVh9FgTZ++cgtg8jpg/wD1qh+zWsf2wmd1W15bBGQNoP8AWixXPEPs2QeTTPIwcA1lajfzhoY7OdnLLklTkc1eshPHEDO5eQ9aGrK4c12alkxEmxunUVdjlCzypnhP8M1Ws0/ibt3qK1cySXE3aQ8fToP5VKE1c0926MEVPGOlV4gRGoq4grSOpjLQS5IWEg9W4qiIFimijZi5lY7eOmO5qa5bzLtY16IOfr/nFSQqHvmb/nnGFHtnn/Cm9WCbiizFCkSnaOT1PrTqWkNaoybENAFFKoosTcUCinhaKYiuaFFJTlqTUmQcVKBTIxUoqkSNIpksYljZD3qQ02mBg3URKEEcoeajhAXGenetS9j+fd2Yc/Wsuc7G9q5ZqzNoyurGfrNnlhKq5wMcVmB54ypW4kXac4LHGa35Z1x1qm7oxwQDTTNk9LMybq8uptgM7HYcjbxz+FNhsbiUNuZ8S8uWON319a1diAZUAZ9BTwwUYzzRzDsirb2UVvgIuW7t3qyibpOnFAOenWrEEfzZzwKhu4bEsmFtyq8FhinW8e1QAMD0prcsOuKtRLjGaESyaMcirG9Y0aRvuqMmoVqG8k3lYEPH3mq07Iytdha5djI3Vjk1oW64DMQQWY1Vs1yRjp296v8AargiKj1ENNNO70m2tbGLYgp6imhalUCmCHKKKUUUFlGpIxzUdTR9KhFMmSpKYtOzVkgaYxpSajagTY2QB0IP4Vj3keTgjkHFbFU7+F2XzIwSR1X1rOauhwlZmBPCxOB0qE25K96uyOO/44oVxg81gddzKYSKxGeKkiVmOM54qxMAWyKdBwcDFBVySCHjtVoqFGKajBRxQzgnNSSPRec1YU8VV8zHWmSXWFwpx7+lFxWuXJLlY/lX5n/QVWiPmuecqTlj/eP+FUwTJwchT29frV+3IA56UXuO1kaVtwyj1q7trBm1KOzKyyn5V5IFS23iS2uACIpFBG7nHA/Oumm9Dlno9TawKQio7e4iuoVmhcOjdCKkrQkTFGaQmkJoEPBoqMtRQFyEVKlFFQjRkwOKXNFFWQxKaaKKBDTTDRRSEVL6zSdTIFw46kd6xpIWTI60UVjURvSbsV2XtyKVBgdTRRWZuShsdTSPOq9KKKkaIjKXNAznmiikUSKcGpvtCxpuY9P0oooQmcrq2oteTeXFkqD271dsVLoAg2ZX5jnOfYUUV1pWRxzk+Y6/R8QBoAMKQGX+taReiiqIuNzzRRRQIcq0UUUwP//Z",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014da",
            year: 2015,
            month: 5,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-06-03T21:00:00.000Z",
            paidAmount: 100000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004b",
                dateBirth: "1992-07-11T00:00:00.000Z",
                ID: 39,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-05-19T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.434Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2015-11-03T13:24:56.462Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 23,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "roland.katona7000",
                workPhones: {
                    phone: "",
                    mobile: "+380956937000"
                },
                personalEmail: "roland.katona@thinkmobiles.com",
                workEmail: "roland.katona@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014df",
            year: 2015,
            month: 1,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/QA 14%",
            period: null,
            date: "2015-01-31T22:00:00.000Z",
            paidAmount: 50000,
            supplier: {
                _id: "55b92ad221e4b7c40f000063",
                dateBirth: "1990-07-30T00:00:00.000Z",
                ID: 57,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-11-17T22:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "5644388770bbc2b740ce8a18",
                        department: "55b92ace21e4b7c40f000011"
                    }
                ],
                social: {
                    FB: "",
                    LI: "https://ua.linkedin.com/pub/yana"
                },
                sequence: 0,
                jobType: "fullTime",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.464Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-02-08T08:41:58.734Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.464Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.464Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "5644388770bbc2b740ce8a18",
                department: "55b92ace21e4b7c40f000011",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "yanochka_3007",
                workPhones: {
                    phone: "",
                    mobile: "+380508754761"
                },
                personalEmail: "yana.gusti@gmail.com",
                workEmail: "yana.gusti@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Gusti",
                    first: "Yana"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0,
                transferred: [
                    {
                        date: "2015-11-12T07:01:22.647Z",
                        department: " BusinessDev"
                    }
                ]
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e0",
            year: 2015,
            month: 4,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-04-28T21:00:00.000Z",
            paidAmount: 70000,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e8",
            year: 2015,
            month: 1,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-01-31T22:00:00.000Z",
            paidAmount: 100000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004b",
                dateBirth: "1992-07-11T00:00:00.000Z",
                ID: 39,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-05-19T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.434Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2015-11-03T13:24:56.462Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 23,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "roland.katona7000",
                workPhones: {
                    phone: "",
                    mobile: "+380956937000"
                },
                personalEmail: "roland.katona@thinkmobiles.com",
                workEmail: "roland.katona@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014e9",
            year: 2015,
            month: 1,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-01-31T22:00:00.000Z",
            paidAmount: 50000,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014ea",
            year: 2015,
            month: 3,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Head 8%",
            period: null,
            date: "2015-04-22T21:00:00.000Z",
            paidAmount: 70000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014eb",
            year: 2015,
            month: 3,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-06-03T21:00:00.000Z",
            paidAmount: 100000,
            supplier: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 25,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "55b92ae421e4b7c40f0014ec",
            year: 2015,
            month: 4,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            period: null,
            date: "2015-06-03T21:00:00.000Z",
            paidAmount: 300000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2014-05-25T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            },
            forSale: false
        },
        {
            _id: "56017c16139400f22c000005",
            year: 2015,
            month: 12,
            bonus: true,
            differenceAmount: 0,
            workflow: "Paid",
            paymentRef: "Sales/Usual 8%",
            date: "2015-09-20T22:00:00.000Z",
            paidAmount: 100000,
            supplier: {
                _id: "55b92ad221e4b7c40f00004b",
                dateBirth: "1992-07-11T00:00:00.000Z",
                ID: 39,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-05-19T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.434Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2015-11-03T13:24:56.462Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 23,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "roland.katona7000",
                workPhones: {
                    phone: "",
                    mobile: "+380956937000"
                },
                personalEmail: "roland.katona@thinkmobiles.com",
                workEmail: "roland.katona@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            forSale: false,
            period: null,
            invoice: {
                _id: "56698afcc9393366139f06f6",
                name: "forPayOutBonus",
                forSales: false,
                invoiceDate: "2015-12-10T14:21:26.233Z",
                supplier: null,
                sourceDocument: null,
                paymentReference: "free",
                journal: null,
                paymentInfo: {
                    balance: 0,
                    unTaxed: 0,
                    taxes: 0,
                    total: 0
                },
                salesPerson: null,
                workflow: "5555e54c6a3f01acae0b5564"
            }
        },
        {
            _id: "56e7cd22352670b20da00961",
            year: 2016,
            month: 2,
            period: null,
            paymentRef: "PM Base/Junior ",
            supplier: {
                _id: "55b92ad221e4b7c40f000084",
                dateBirth: "1980-01-28T06:00:00.000Z",
                ID: 63,
                isLead: 0,
                lastFire: 201443,
                fire: [
                    {
                        date: "2014-10-20T00:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: null,
                        jobPosition: "55b92acf21e4b7c40f000027",
                        department: "55b92ace21e4b7c40f00000f"
                    }
                ],
                hire: [
                    {
                        date: "2014-09-01T00:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: null,
                        jobPosition: "55b92acf21e4b7c40f000027",
                        department: "55b92ace21e4b7c40f00000f"
                    }
                ],
                social: {
                    GP: "null",
                    LI: "null",
                    FB: "null"
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.484Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2015-07-29T19:34:42.484Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.484Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.484Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                workflow: "52d2c1369b57890814000005",
                active: true,
                referredBy: "",
                source: "",
                age: 36,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "",
                coach: null,
                manager: null,
                jobPosition: "55b92acf21e4b7c40f000027",
                department: "55b92ace21e4b7c40f00000f",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "aleksandr.dakhno",
                workPhones: {
                    phone: "",
                    mobile: "+38096 358 7693"
                },
                personalEmail: "",
                workEmail: "alex.dakhno@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [ ],
                name: {
                    last: "Dahno",
                    first: "Alex"
                },
                subject: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                isEmployee: false,
                __v: 0
            },
            forSale: false,
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-03-01T22:00:00.000Z",
            paidAmount: 100000
        }
    ];

    var fakeBonusTypeForDD = {
        data: [
            {
                _id: "55b92ad521e4b7c40f00060b",
                name: "PM Base/Junior"
            },
            {
                _id: "55b92ad521e4b7c40f00060a",
                name: "PM Junior/Usual 1.5%"
            },
            {
                _id: "55b92ad521e4b7c40f000609",
                name: "Sales/Head 10%"
            },
            {
                _id: "55b92ad521e4b7c40f000602",
                name: "Sales/Head 8%"
            },
            {
                _id: "55b92ad521e4b7c40f000606",
                name: "Sales/QA 14%"
            },
            {
                _id: "55b92ad521e4b7c40f000605",
                name: "Sales/QA 16%"
            },
            {
                _id: "55b92ad521e4b7c40f000607",
                name: "Sales/QA 8%"
            },
            {
                _id: "55b92ad521e4b7c40f000604",
                name: "Sales/Ref 2%"
            },
            {
                _id: "560eaaa5c90e2fb026ce061e",
                name: "Sales/Usual 4%"
            },
            {
                _id: "55b92ad521e4b7c40f000603",
                name: "Sales/Usual 6%"
            },
            {
                _id: "55b92ad521e4b7c40f000608",
                name: "Sales/Usual 8%"
            },
            {
                _id: "56e2fb7e3abb6ba70f73ae94",
                name: "df"
            },
            {
                _id: "56e2ed3f3abb6ba70f73ae93",
                name: "dfg"
            },
            {
                _id: "56053965cdc112333a000009",
                name: "hjkhg"
            },
            {
                _id: "5605396a82ca87623a00000b",
                name: "hjkhgytryt"
            }
        ]
    };

    var fakeEmplForDD = {
        data: [
            {
                _id: "55b92ad221e4b7c40f000030",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    first: "Alex",
                    last: "Svatuk"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000031",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gleba",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003e",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lapchuk",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000044",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Devezenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004f",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Sokhanych",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000057",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Roman",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000058",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Makhanets",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Sich",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tutunnik",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000084",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Dahno",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Michenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a7",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Ryabcev",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ac",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Volkov",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ce",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Storojenko",
                    first: "Alex"
                }
            },
            {
                _id: "5638aa635d23a8eb04e80af0",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Siladii",
                    first: "Alex"
                }
            },
            {
                _id: "564dac3e9b85f8b16b574fea",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Filchak",
                    first: "Alex"
                }
            },
            {
                _id: "565f0fa6f6427f253cf6bf19",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lysachenko",
                    first: "Alex"
                }
            },
            {
                _id: "566ede9e8453e8b464b70b71",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tonkovid",
                    first: "Alex"
                }
            },
            {
                _id: "56b8b99e6c411b590588feb9",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Ovcharenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ba",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Klochkova",
                    first: "Alexandra"
                }
            },
            {
                _id: "55c330d529bd6ccd0b000007",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Yurenko",
                    first: "Alina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cb",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Yelahina",
                    first: "Alona"
                }
            },
            {
                _id: "565c66633410ae512364dc00",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Timochchenko",
                    first: "Alona"
                }
            },
            {
                _id: "560264bb8dc408c632000005",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Lyakh",
                    first: "Anastas"
                }
            },
            {
                _id: "55ded6b3ae2b22730b00004e",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Dimova",
                    first: "Anastasia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000059",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Dalekorey",
                    first: "Anatoliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b5",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Lemko",
                    first: "Andriana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000045",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Tivodar",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006e",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Hanchak",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000096",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Herasymyuk",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000098",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Krupka",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a3",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Karpenko",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a8",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    first: "Andriy",
                    last: "Korneychuk"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a9",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Loboda",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b3",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Sarkanych",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bf",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Fizer",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c2",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mistetskiy",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    first: "Andriy",
                    last: "Vovk"
                }
            },
            {
                _id: "561bb90a9ebb48212ea838c7",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Svyd",
                    first: "Andriy"
                }
            },
            {
                _id: "561bc5ca9ebb48212ea838c8",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Sokalskiy",
                    first: "Andriy"
                }
            },
            {
                _id: "564da59f9b85f8b16b574fe9",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Chuprov",
                    first: "Andriy"
                }
            },
            {
                _id: "566fe2348453e8b464b70ba6",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Lukashchuk",
                    first: "Andriy"
                }
            },
            {
                _id: "5693b24bd87c9004552b63a1",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Horak",
                    first: "Andriy"
                }
            },
            {
                _id: "56965733d87c9004552b63be",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Samokhin",
                    first: "Andriy"
                }
            },
            {
                _id: "569cce1dcf1f31f925c026fa",
                department: {
                    _id: "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name: {
                    last: "Stupchuk",
                    first: "Andriy"
                }
            },
            {
                _id: "56c19971dfd8a81466e2f6dc",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Khainus",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b8",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Lobas",
                    first: "Anna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006f",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Karabeinikov",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008c",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Gychka",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000094",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Yarosh",
                    first: "Anton"
                }
            },
            {
                _id: "55c0656ad011746b0b000006",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Nizhegorodov",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000083",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zhuk",
                    first: "Antonina"
                }
            },
            {
                _id: "5629e27046bca6e4591f4919",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Petrov",
                    first: "Artem"
                }
            },
            {
                _id: "56b9ccd88f23c5696159cd09",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Antonenko",
                    first: "Artem"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000042",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Myhalko",
                    first: "Artur"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000032",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Sakalo",
                    first: "Bogdan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005a",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Cheypesh",
                    first: "Bogdan"
                }
            },
            {
                _id: "569e63df044ae38173244cfd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Danyliuk",
                    first: "Bogdan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000070",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Pozhidaev",
                    first: "Daniil"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b1",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Korniyenko",
                    first: "Daniil"
                }
            },
            {
                _id: "55fbcb65f9210c860c000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Shamolina",
                    first: "Daria"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000046",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Udod",
                    first: "Denis"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b6",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Vengrin",
                    first: "Denis"
                }
            },
            {
                _id: "55ca0145cbb0f4910b000009",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zinkovskyi",
                    first: "Denis"
                }
            },
            {
                _id: "55effafa8f1e10e50b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    first: "Denis",
                    last: "Pavlenko"
                }
            },
            {
                _id: "5640741570bbc2b740ce89ec",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Lukashov",
                    first: "Denis"
                }
            },
            {
                _id: "565c2793f4dcd63b5dbd7372",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Yaremenko",
                    first: "Denis"
                }
            },
            {
                _id: "566add9aa74aaf316eaea6fc",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Saranyuk",
                    first: "Denis"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000033",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Bruso",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006b",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kanivets",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000071",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Masalovich",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009f",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Dzuba",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bc",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Demchenko",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55cdffa59b42266a4f000015",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Magar",
                    first: "Dmitriy"
                }
            },
            {
                _id: "5600031ba36a8ca10c000028",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Mostiv",
                    first: "Dmitriy"
                }
            },
            {
                _id: "5614d4c7ab24a83b1dc1a7a8",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Babilia",
                    first: "Dmytro"
                }
            },
            {
                _id: "567ac0a48365c9a205406f33",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kolochynsky",
                    first: "Dmytro"
                }
            },
            {
                _id: "564a03d1ad4bc9e53f1f6195",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tanchenec",
                    first: "Edgard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005b",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Chori",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000067",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Rudenko",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000092",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Dedenok",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000066",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Gromadskiy",
                    first: "Egor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000041",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Oleynikov",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000072",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Bernikevich",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008b",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Ugolkov",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a4",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sokolenko",
                    first: "Eugen"
                }
            },
            {
                _id: "55c32e0d29bd6ccd0b000005",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Alexeev",
                    first: "Eugen"
                }
            },
            {
                _id: "55c98aa7cbb0f4910b000005",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Rechun",
                    first: "Eugen"
                }
            },
            {
                _id: "56029cc950de7f4138000005",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Lendyel",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000090",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Shterr",
                    first: "Gabriella"
                }
            },
            {
                _id: "56b9d3eb8f23c5696159cd0b",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Mykhailova",
                    first: "Galina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    first: "German",
                    last: "Kravets"
                }
            },
            {
                _id: "568158fc9cceae182b907756",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Belous",
                    first: "Herman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a2",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Stan",
                    first: "Igor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bb",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Shepinka",
                    first: "Igor"
                }
            },
            {
                _id: "56966c82d87c9004552b63c7",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Kuzma",
                    first: "Ihor"
                }
            },
            {
                _id: "56a0d4b162d172544baf0e3a",
                department: {
                    _id: "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name: {
                    last: "Ilnytskyi",
                    first: "Ihor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c6",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kramarenko",
                    first: "Illia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000035",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mondok",
                    first: "Ilya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000047",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Khymych",
                    first: "Ilya"
                }
            },
            {
                _id: "56090fae86e2435a33000008",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Nukhova",
                    first: "Inna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000073",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Grab",
                    first: "Irina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000034",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Nazarovich",
                    first: "Ishtvan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005c",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Irchak",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000074",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kornyk",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000087",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kostromin",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008e",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Grab",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Feltsan",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a0",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Bilak",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000aa",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lyashenko",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c8",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Bizilya",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cc",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    first: "Ivan",
                    last: "Lyakh"
                }
            },
            {
                _id: "55c98b86cbb0f4910b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kovalenko",
                    first: "Ivan"
                }
            },
            {
                _id: "55dd71eaf09cc2ec0b000007",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Khartov",
                    first: "Ivan"
                }
            },
            {
                _id: "56a5ef86aa157ca50f21fb1d",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Pasichnyuk",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000048",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Chupova",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000068",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Bartish",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009a",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Pasichnyuk",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ab",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Olkhovik",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000085",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gorbushko",
                    first: "Kirill"
                }
            },
            {
                _id: "55e419094983acdd0b000012",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    first: "Kirill",
                    last: "Paliiuk"
                }
            },
            {
                _id: "56b9d49d8f23c5696159cd0c",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Bed",
                    first: "Kirill"
                }
            },
            {
                _id: "56b2287b99ce8d706a81b2bc",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Mudrenok",
                    first: "Kostiantyn"
                }
            },
            {
                _id: "55d1e234dda01e250c000015",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Rimar",
                    first: "Kristian"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009b",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Popp",
                    first: "Larysa"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000075",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Gvozdyo",
                    first: "Lilia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c7",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Mykhailova",
                    first: "Liliya"
                }
            },
            {
                _id: "55bf45cf65cda0810b00000a",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    first: "Liliya",
                    last: "Shustur"
                }
            },
            {
                _id: "564a0186ad4bc9e53f1f6193",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Orlenko",
                    first: "Liliya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005d",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gerevich",
                    first: "Lubomir"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c1",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Zasukhina",
                    first: "Maria"
                }
            },
            {
                _id: "5684ec1a1fec73d05393a2a4",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Zaitseva",
                    first: "Maria"
                }
            },
            {
                _id: "560115cf536bd29228000006",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Myhalko",
                    first: "Marianna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003f",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Kubichka",
                    first: "Marina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000043",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Geraschenko",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000089",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Sychov",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a5",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Holubka",
                    first: "Maxim"
                }
            },
            {
                _id: "55c06411d011746b0b000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rachytskyy",
                    first: "Maxim"
                }
            },
            {
                _id: "566ada96a74aaf316eaea69d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Gladovskyy",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000036",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Yemets",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000049",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kapustey",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000055",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Rogach",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005e",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Didenko",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000069",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Afendikov",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000076",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Glagola",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000077",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Soyma",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b2",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Yeremenko",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Vashkeba",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c4",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Myronyshyn",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c5",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gajdan",
                    first: "Michael"
                }
            },
            {
                _id: "55dd7776f09cc2ec0b000009",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Kavka",
                    first: "Michael"
                }
            },
            {
                _id: "5600042ca36a8ca10c000029",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Filchak",
                    first: "Michael"
                }
            },
            {
                _id: "5667f310a3fc012a68f0d5f5",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Sopko",
                    first: "Michael"
                }
            },
            {
                _id: "56b3412299ce8d706a81b2cd",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Kholtobin",
                    first: "Mykola"
                }
            },
            {
                _id: "565c306af4dcd63b5dbd7373",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Matrafayilo",
                    first: "Myroslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b7",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Polovka",
                    first: "Myroslava"
                }
            },
            {
                _id: "56bdf283dfd8a81466e2f6d0",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Shishko",
                    first: "Nadiya"
                }
            },
            {
                _id: "56938d2cd87c9004552b639e",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Makarova",
                    first: "Nastya"
                }
            },
            {
                _id: "561ba8639ebb48212ea838c4",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Yartysh",
                    first: "Nataliya"
                }
            },
            {
                _id: "566aa49f4f817b7f51746ec0",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Burtnyk",
                    first: "Nataliya"
                }
            },
            {
                _id: "56af32e174d57e0d56d6bee5",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Sichko",
                    first: "Nataliya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a6",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Citrak",
                    first: "Norbert"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000be",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Borys",
                    first: "Oksana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c0",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Kordas",
                    first: "Oksana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003c",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Stasiv",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004a",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000078",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Boyanivskiy",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008a",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mahobey",
                    first: "Oleg"
                }
            },
            {
                _id: "561ba7039ebb48212ea838c3",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Maliavska",
                    first: "Oleksandra"
                }
            },
            {
                _id: "56b9cbb48f23c5696159cd08",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Kovalenko",
                    first: "Oleksii"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000037",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Shanghin",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000079",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gerasimov",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000095",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kuropyatnik",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c9",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    first: "Oleksiy",
                    last: "Fedosov"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b9",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Melnyk",
                    first: "Olena"
                }
            },
            {
                _id: "55e96ab13f3ae4fd0b000009",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Pavliuk",
                    first: "Oles"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c3",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    first: "Olesia",
                    last: "Prokoshkina"
                }
            },
            {
                _id: "56123232c90e2fb026ce064b",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Sikora",
                    first: "Olga"
                }
            },
            {
                _id: "55c84a4aaa36a0e60a000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Muratov",
                    first: "Pavlo"
                }
            },
            {
                _id: "56964a03d87c9004552b63ba",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Skyba",
                    first: "Pavlo"
                }
            },
            {
                _id: "56a7956faa157ca50f21fb25",
                department: {
                    _id: "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name: {
                    last: "Demko",
                    first: "Pavlo"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005f",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                }
            },
            {
                _id: "55e549309624477a0b000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rospopa",
                    first: "Petro"
                }
            },
            {
                _id: "56a78c75aa157ca50f21fb24",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Iyber",
                    first: "Renata"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000051",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mozes",
                    first: "Richard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007a",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Fogash",
                    first: "Robert"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004b",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Katona",
                    first: "Roland"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000038",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Babunich",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000060",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Buchuk",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007b",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Guti",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000086",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Kubichka",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b0",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Donchenko",
                    first: "Roman"
                }
            },
            {
                _id: "55dd73d1f09cc2ec0b000008",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Vizenko",
                    first: "Roman"
                }
            },
            {
                _id: "55eef3fd6dceaee10b000020",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Saldan",
                    first: "Roman"
                }
            },
            {
                _id: "5667f43da3fc012a68f0d5f6",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Katsala",
                    first: "Roman"
                }
            },
            {
                _id: "568bbdfd5827e3b24d8123a7",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Chaban",
                    first: "Roman"
                }
            },
            {
                _id: "568cd341b2bcba971ba6f5c4",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rosul",
                    first: "Roman"
                }
            },
            {
                _id: "568cd4c0b2bcba971ba6f5c5",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Osadchuk",
                    first: "Roman"
                }
            },
            {
                _id: "569e3a73044ae38173244cfb",
                department: {
                    _id: "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name: {
                    last: "Martyniuk",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000056",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Labjak",
                    first: "Ruslan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000097",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Abylgazinov",
                    first: "Samgash"
                }
            },
            {
                _id: "568cdd375527d6691cb68b22",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Melnik",
                    first: "Sergey"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000064",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Tilishevsky",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007c",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sheba",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a1",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Stepaniuk",
                    first: "Sergiy"
                }
            },
            {
                _id: "55d1a2b18f61e2c90b000023",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Degtyar",
                    first: "Sergiy"
                }
            },
            {
                _id: "55dd63f8f09cc2ec0b000006",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Ihnatko",
                    first: "Sergiy"
                }
            },
            {
                _id: "5649b8ccad4bc9e53f1f6192",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Gevelev",
                    first: "Sergiy"
                }
            },
            {
                _id: "5652dd95c4d12cf51e7f7e0b",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Petakh",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    first: "Sofia",
                    last: "Nayda"
                }
            },
            {
                _id: "561b756f9ebb48212ea838c0",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Romanyuk",
                    first: "Stanislav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000039",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Rikun",
                    first: "Stas"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007d",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Volskiy",
                    first: "Stas"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ad",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Krovspey",
                    first: "Stepan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008d",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Kira",
                    first: "Svitlana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ae",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Dolottseva",
                    first: "Tamara"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000061",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mondok",
                    first: "Tamas"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000050",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Holovatska",
                    first: "Tamila"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zmiy",
                    first: "Taras"
                }
            },
            {
                _id: "564a02e0ad4bc9e53f1f6194",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Dvorian",
                    first: "Taras"
                }
            },
            {
                _id: "56813fe29cceae182b907755",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Ukrainskiy",
                    first: "Taras"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000099",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Smertina",
                    first: "Tetyana"
                }
            },
            {
                _id: "55c98df0cbb0f4910b000007",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Berezhnoi",
                    first: "Timur"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006a",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Tsipf",
                    first: "Vadim"
                }
            },
            {
                _id: "56011186536bd29228000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Khruslov",
                    first: "Valentyn"
                }
            },
            {
                _id: "561bb5329ebb48212ea838c6",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Ladomiryak",
                    first: "Valerii"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000af",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Tokareva",
                    first: "Valeriya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007f",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Klimchenko",
                    first: "Vasilisa"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003a",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Agosta",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000040",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Almashiy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000053",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Seredniy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000062",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Cheypesh",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000080",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Barchiy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000093",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Lupchey",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b4",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Prokopyshyn",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55d1d860dda01e250c000010",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Hoshovsky",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000088",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Buchok",
                    first: "Viktor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000091",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kiver",
                    first: "Viktor"
                }
            },
            {
                _id: "55f9298456f79c9c0c000006",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Manhur",
                    first: "Viktor"
                }
            },
            {
                _id: "5626278d750d38934bfa1313",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Rogachenko",
                    first: "Viktoria"
                }
            },
            {
                _id: "5637710e5d23a8eb04e80aed",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Kovalenko",
                    first: "Viktoria"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003b",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Bizilya",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Shuba",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000081",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Sokhanych",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000052",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gerasimenko",
                    first: "Vladimir"
                }
            },
            {
                _id: "561bb1269ebb48212ea838c5",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Pogorilyak",
                    first: "Vladimir"
                }
            },
            {
                _id: "55eeed546dceaee10b00001e",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Turytskyi",
                    first: "Vladyslav"
                }
            },
            {
                _id: "568bbf935827e3b24d8123a8",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Hamalii",
                    first: "Vladyslav"
                }
            },
            {
                _id: "55eee9c26dceaee10b00001d",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Stepanchuk",
                    first: "Volodymyr"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kopinets",
                    first: "Vyacheslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000063",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gusti",
                    first: "Yana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ca",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Vengerova",
                    first: "Yana"
                }
            },
            {
                _id: "55f7c20a6d43203d0c000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Samaryk",
                    first: "Yana"
                }
            },
            {
                _id: "5602a01550de7f4138000008",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Dufynets",
                    first: "Yana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000082",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Fuchko",
                    first: "Yaroslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cf",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Denysiuk",
                    first: "Yaroslav"
                }
            },
            {
                _id: "568bc0b55827e3b24d8123a9",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Syrota",
                    first: "Yaroslav"
                }
            },
            {
                _id: "56014cc8536bd29228000007",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Bezyk",
                    first: "Yevgenia"
                }
            },
            {
                _id: "55ed5a437221afe30b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Porokhnitska",
                    first: "Yulia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000054",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Derevenko",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000065",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sirko",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008f",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Holovatskyi",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009d",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Fedynec",
                    first: "Yuriy"
                }
            },
            {
                _id: "55f7c3736d43203d0c000006",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Bodak",
                    first: "Yuriy"
                }
            },
            {
                _id: "56090d77066d979a33000009",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    first: "Yuriy",
                    last: "Bysaha"
                }
            }
        ]
    };

    var fakeFilteredValues = {
        Persons: {
            _id: null,
            name: [
                {
                    _id: "56e03335c4c321f426f65174",
                    name: "rte re"
                },
                {
                    _id: "56e031f4c4c321f426f65172",
                    name: "res sd"
                },
                {
                    _id: "56d024b4b5057fdb22ff9095",
                    name: "df dsf"
                },
                {
                    _id: "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id: "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id: "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id: "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id: "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id: "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id: "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id: "56e1586fc5df6692126cc41d",
                    name: "test test"
                },
                {
                    _id: "56a9eeabd59a04d6225b0df5",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id: "55b92ad521e4b7c40f00060f",
                    name: "Sharmila "
                },
                {
                    _id: "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id: "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id: "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id: "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id: "55b92ad621e4b7c40f000626",
                    name: "ShargoO "
                },
                {
                    _id: "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id: "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id: "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id: "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id: "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id: "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id: "55ba0362d79a3a343900000e",
                    name: "Ingo Nadler"
                },
                {
                    _id: "56e0332ac4c321f426f65173",
                    name: "tr re"
                },
                {
                    _id: "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id: "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id: "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id: "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id: "55b92ad621e4b7c40f00064b",
                    name: "Thomas "
                },
                {
                    _id: "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id: "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id: "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id: "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id: "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id: "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id: "55ba0701d79a3a3439000012",
                    name: "Francisco Calvo Vicente"
                },
                {
                    _id: "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id: "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id: "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id: "55d37aee226ed3280b000005",
                    name: "Brendan Morrisey"
                },
                {
                    _id: "55b92ad521e4b7c40f000616",
                    name: "ThinkApps "
                },
                {
                    _id: "56ab5ca674d57e0d56d6bda4",
                    name: "Stian Maurstad"
                },
                {
                    _id: "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id: "562bba2062461bfd59ef58c0",
                    name: "Mark Unknown"
                },
                {
                    _id: "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    _id: "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id: "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id: "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id: "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id: "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id: "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id: "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id: "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id: "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id: "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id: "55b92ad621e4b7c40f000627",
                    name: "UfukTogay "
                },
                {
                    _id: "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id: "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id: "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id: "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id: "55b92ad621e4b7c40f000644",
                    name: "iask consulting "
                },
                {
                    _id: "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id: "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id: "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id: "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id: "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id: "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id: "55b92ad521e4b7c40f00061a",
                    name: "Ivcarto "
                },
                {
                    _id: "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id: "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id: "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id: "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id: "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id: "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id: "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id: "55b9fa60d79a3a3439000005",
                    name: "Jason Coutsodimitropoulos"
                },
                {
                    _id: "55b9ff67d79a3a343900000a",
                    name: "Ruslan Kogan"
                },
                {
                    _id: "55ba006ed79a3a343900000b",
                    name: "Jeff Courter"
                },
                {
                    _id: "55ba0479d79a3a3439000010",
                    name: "Drew Lupsor"
                },
                {
                    _id: "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id: "569f581762d172544baf0c3b",
                    name: "Dirk Ziegener"
                },
                {
                    _id: "55ba04d5d79a3a3439000011",
                    name: "Rowan Hick"
                },
                {
                    _id: "56bc9b72dfd8a81466e2f48c",
                    name: "Test Person"
                },
                {
                    _id: "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                },
                {
                    _id: "55d37d50226ed3280b000006",
                    name: "Matt Fulford"
                },
                {
                    _id: "55d38523226ed3280b000007",
                    name: "Peter Hickey"
                },
                {
                    _id: "55b92ad621e4b7c40f000654",
                    name: "iqDesk "
                },
                {
                    _id: "5637627bc928c61d052d500e",
                    name: "Tibor Bekefi"
                },
                {
                    _id: "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id: "56574092bfd103f108eb4ad3",
                    name: "Ales Smokvina"
                },
                {
                    _id: "5661809cbb8be7814fb52584",
                    name: "Selim Yilmaz"
                },
                {
                    _id: "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id: "566d4b55abccac87642cb522",
                    name: "Olivier Sans"
                },
                {
                    _id: "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id: "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                },
                {
                    _id: "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                },
                {
                    _id: "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                }
            ],
            country: [
                {
                    _id: "New Zealand",
                    name: "New Zealand"
                },
                {
                    _id: "Israel",
                    name: "Israel"
                },
                {
                    _id: "Hungary",
                    name: "Hungary"
                },
                {
                    _id: "test",
                    name: "test"
                },
                {
                    _id: "Belgium",
                    name: "Belgium"
                },
                {
                    _id: "United States",
                    name: "United States"
                },
                {
                    _id: "UK",
                    name: "UK"
                },
                {
                    _id: "France",
                    name: "France"
                },
                {
                    _id: "Ukraine",
                    name: "Ukraine"
                },
                {
                    _id: "Ireland",
                    name: "Ireland"
                },
                {
                    _id: "Singapore",
                    name: "Singapore"
                },
                {
                    _id: "Netherlands",
                    name: "Netherlands"
                },
                {
                    _id: "Canada",
                    name: "Canada"
                },
                {
                    _id: "USA",
                    name: "USA"
                },
                {
                    _id: "UAE",
                    name: "UAE"
                },
                {
                    _id: "United Kingdom",
                    name: "United Kingdom"
                },
                {
                    _id: "Romania",
                    name: "Romania"
                },
                {
                    _id: "Germany",
                    name: "Germany"
                },
                {
                    _id: "Spain",
                    name: "Spain"
                },
                {
                    _id: "TU",
                    name: "TU"
                },
                {
                    _id: "Australia",
                    name: "Australia"
                },
                {
                    _id: "USA/Germany",
                    name: "USA/Germany"
                },
                {
                    _id: "US",
                    name: "US"
                },
                {
                    _id: "Sweden",
                    name: "Sweden"
                },
                {
                    _id: "Ohio",
                    name: "Ohio"
                },
                {
                    _id: "Thailand",
                    name: "Thailand"
                }
            ],
            services: [
                {
                    _id: "isSupplier",
                    name: "Supplier"
                },
                {
                    _id: "isCustomer",
                    name: "Customer"
                }
            ]
        },
        Tasks: {
            _id: null,
            project: [
                { }
            ],
            summary: [
                {
                    _id: "5350eaabc3406b2c0900003b",
                    name: "new skins"
                },
                {
                    _id: "5350ea3ec3406b2c09000039",
                    name: "bug fixng"
                },
                {
                    _id: "5350ea0dc3406b2c09000038",
                    name: "finish the design"
                },
                {
                    _id: "5350e82bc3406b2c09000035",
                    name: "wallpapers"
                },
                {
                    _id: "5350eb3fc3406b2c0900003c",
                    name: "finishing the project"
                },
                {
                    _id: "5350ea5ac3406b2c0900003a",
                    name: "new features"
                },
                {
                    _id: "5350e871c3406b2c09000037",
                    name: "testing"
                },
                {
                    _id: "5350e84ec3406b2c09000036",
                    name: "design"
                },
                {
                    _id: "5350e815c3406b2c09000034",
                    name: "Weekly sprint 03-07.02.14"
                }
            ],
            assignedTo: [ ],
            workflow: [
                {
                    _id: "528ce0cdf3f67bc40b00000c",
                    name: "New"
                },
                {
                    _id: "528ce131f3f67bc40b00000d",
                    name: "In Progress"
                }
            ],
            type: [
                {
                    _id: "Feature",
                    name: "Feature"
                },
                {
                    _id: "Bug",
                    name: "Bug"
                },
                {
                    _id: "Task",
                    name: "Task"
                }
            ]
        },
        Product: {
            _id: null,
            name: [
                {
                    _id: "55c0e4a30343b37542000005",
                    name: "Bank expenses"
                },
                {
                    _id: "5540d528dacb551c24000003",
                    name: "IT services"
                }
            ],
            productType: [
                {
                    _id: "Service",
                    name: "Service"
                }
            ],
            canBeSold: [
                {
                    _id: "true",
                    name: "True"
                },
                {
                    _id: "false",
                    name: "False"
                }
            ],
            canBeExpensed: [
                {
                    _id: "true",
                    name: "True"
                },
                {
                    _id: "false",
                    name: "False"
                }
            ],
            canBePurchased: [
                {
                    _id: "true",
                    name: "True"
                },
                {
                    _id: "false",
                    name: "False"
                }
            ]
        },
        Order: [ ],
        Companies: {
            _id: null,
            name: [
                {
                    _id: "56bc9b53dfd8a81466e2f48b",
                    name: "TestAlina "
                },
                {
                    _id: "56a9ee95d59a04d6225b0df4",
                    name: "ThinkMobiles "
                },
                {
                    _id: "56a0d4b962d172544baf0e3b",
                    name: "Chimney "
                },
                {
                    _id: "569f5fbf62d172544baf0d56",
                    name: "BIScience "
                },
                {
                    _id: "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id: "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id: "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id: "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id: "561d1bc0b51032d674856acb",
                    name: "Attrecto "
                },
                {
                    _id: "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id: "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id: "55fe60f5e2a48c310c000005",
                    name: "test supplier "
                },
                {
                    _id: "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id: "569f590262d172544baf0c3e",
                    name: "Time2view "
                },
                {
                    _id: "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id: "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id: "55ba0301d79a3a343900000d",
                    name: "#Play "
                },
                {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id: "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id: "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id: "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id: "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id: "55b9fe20d79a3a3439000009",
                    name: "Kogan "
                },
                {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id: "5661805cbb8be7814fb52529",
                    name: "Otrema "
                },
                {
                    _id: "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    _id: "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker1 "
                },
                {
                    _id: "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id: "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id: "55ba0b46d79a3a3439000013",
                    name: "Unibet "
                },
                {
                    _id: "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id: "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    _id: "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id: "55f55854b81672730c000010",
                    name: "MediaHeads "
                },
                {
                    _id: "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id: "55ba03f8d79a3a343900000f",
                    name: "GlobalWorkshop "
                },
                {
                    _id: "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id: "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id: "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id: "55edaf167221afe30b000040",
                    name: "BetterIt "
                }
            ],
            country: [
                {
                    _id: "Italy",
                    name: "Italy"
                },
                {
                    _id: "Ireland",
                    name: "Ireland"
                },
                {
                    _id: "USA",
                    name: "USA"
                },
                {
                    _id: "Germany",
                    name: "Germany"
                },
                {
                    _id: "Australia",
                    name: "Australia"
                },
                {
                    _id: "United Kingdom",
                    name: "United Kingdom"
                },
                {
                    _id: "United States",
                    name: "United States"
                },
                {
                    _id: "UK",
                    name: "UK"
                },
                {
                    _id: "England",
                    name: "England"
                },
                {
                    _id: "New Zealand",
                    name: "New Zealand"
                },
                {
                    _id: "Spain",
                    name: "Spain"
                },
                {
                    _id: "Sweden",
                    name: "Sweden"
                },
                {
                    _id: "Brazil",
                    name: "Brazil"
                },
                {
                    _id: "Norway",
                    name: "Norway"
                },
                {
                    _id: "Canada",
                    name: "Canada"
                },
                {
                    _id: "OAE",
                    name: "OAE"
                },
                {
                    _id: "Israel",
                    name: "Israel"
                },
                {
                    _id: "USAd",
                    name: "USAd"
                }
            ],
            services: [
                {
                    _id: "isSupplier",
                    name: "Supplier"
                },
                {
                    _id: "isCustomer",
                    name: "Customer"
                }
            ]
        },
        Applications: {
            _id: null,
            name: [
                {
                    _id: "56938d2cd87c9004552b639e",
                    name: "Nastya Makarova"
                },
                {
                    _id: "55effafa8f1e10e50b000006",
                    name: "Denis Pavlenko"
                },
                {
                    _id: "55d1d860dda01e250c000010",
                    name: "Vasiliy Hoshovsky"
                },
                {
                    _id: "55d1a2b18f61e2c90b000023",
                    name: "Sergiy Degtyar"
                },
                {
                    _id: "55cdffa59b42266a4f000015",
                    name: "Dmitriy Magar"
                },
                {
                    _id: "55c98b86cbb0f4910b000006",
                    name: "Ivan Kovalenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000be",
                    name: "Oksana Borys"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bc",
                    name: "Dmitriy Demchenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ba",
                    name: "Alexandra Klochkova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b3",
                    name: "Andriy Sarkanych"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b2",
                    name: "Michael Yeremenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000068",
                    name: "Katerina Bartish"
                },
                {
                    _id: "55b92ad221e4b7c40f00004c",
                    name: "Sofia Nayda"
                },
                {
                    _id: "55b92ad221e4b7c40f000041",
                    name: "Eugen Oleynikov"
                },
                {
                    _id: "55b92ad221e4b7c40f000066",
                    name: "Egor Gromadskiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00003d",
                    name: "German Kravets"
                },
                {
                    _id: "561bc5ca9ebb48212ea838c8",
                    name: "Andriy Sokalskiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00005b",
                    name: "Eduard Chori"
                },
                {
                    _id: "55b92ad221e4b7c40f000058",
                    name: "Alex Makhanets"
                },
                {
                    _id: "55fbcb65f9210c860c000005",
                    name: "Daria Shamolina"
                },
                {
                    _id: "55b92ad221e4b7c40f000054",
                    name: "Yuriy Derevenko"
                },
                {
                    _id: "565c66633410ae512364dc00",
                    name: "Alona Timochchenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000075",
                    name: "Lilia Gvozdyo"
                },
                {
                    _id: "55b92ad221e4b7c40f000050",
                    name: "Tamila Holovatska"
                },
                {
                    _id: "55b92ad221e4b7c40f000049",
                    name: "Michael Kapustey"
                },
                {
                    _id: "55b92ad221e4b7c40f000033",
                    name: "Dmitriy Bruso"
                },
                {
                    _id: "55c98aa7cbb0f4910b000005",
                    name: "Eugen Rechun"
                },
                {
                    _id: "55b92ad221e4b7c40f00003e",
                    name: "Alex Lapchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000067",
                    name: "Eduard Rudenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000084",
                    name: "Alex Dahno"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ab",
                    name: "Katerina Olkhovik"
                },
                {
                    _id: "55b92ad221e4b7c40f00005c",
                    name: "Ivan Irchak"
                },
                {
                    _id: "55b92ad221e4b7c40f00005d",
                    name: "Lubomir Gerevich"
                },
                {
                    _id: "55b92ad221e4b7c40f000056",
                    name: "Ruslan Labjak"
                },
                {
                    _id: "55b92ad221e4b7c40f000042",
                    name: "Artur Myhalko"
                },
                {
                    _id: "55b92ad221e4b7c40f000081",
                    name: "Vitaliy Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000095",
                    name: "Oleksiy Kuropyatnik"
                },
                {
                    _id: "55b92ad221e4b7c40f000045",
                    name: "Andriy Tivodar"
                },
                {
                    _id: "55b92ad221e4b7c40f000069",
                    name: "Michael Afendikov"
                },
                {
                    _id: "55b92ad221e4b7c40f000037",
                    name: "Oleksiy Shanghin"
                },
                {
                    _id: "55b92ad221e4b7c40f000083",
                    name: "Antonina Zhuk"
                },
                {
                    _id: "55b92ad221e4b7c40f00009d",
                    name: "Yuriy Fedynec"
                },
                {
                    _id: "55b92ad221e4b7c40f000035",
                    name: "Ilya Mondok"
                },
                {
                    _id: "55b92ad221e4b7c40f000044",
                    name: "Alex Devezenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000039",
                    name: "Stas Rikun"
                },
                {
                    _id: "55b92ad221e4b7c40f00006b",
                    name: "Dmitriy Kanivets"
                },
                {
                    _id: "55ded6b3ae2b22730b00004e",
                    name: "Anastasia Dimova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b0",
                    name: "Roman Donchenko"
                },
                {
                    _id: "55b92ad221e4b7c40f00006c",
                    name: "Alex Sich"
                },
                {
                    _id: "56b9ccd88f23c5696159cd09",
                    name: "Artem Antonenko"
                },
                {
                    _id: "55b92ad221e4b7c40f00006d",
                    name: "Alex Tutunnik"
                },
                {
                    _id: "55b92ad221e4b7c40f00006f",
                    name: "Anton Karabeinikov"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a6",
                    name: "Norbert Citrak"
                },
                {
                    _id: "55b92ad221e4b7c40f000071",
                    name: "Dmitriy Masalovich"
                },
                {
                    _id: "55b92ad221e4b7c40f0000af",
                    name: "Valeriya Tokareva"
                },
                {
                    _id: "55b92ad221e4b7c40f000074",
                    name: "Ivan Kornyk"
                },
                {
                    _id: "55ed5a437221afe30b000006",
                    name: "Yulia Porokhnitska"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ac",
                    name: "Alex Volkov"
                },
                {
                    _id: "55b92ad221e4b7c40f00008a",
                    name: "Oleg Mahobey"
                },
                {
                    _id: "55b92ad221e4b7c40f00008b",
                    name: "Eugen Ugolkov"
                },
                {
                    _id: "55b92ad221e4b7c40f000099",
                    name: "Tetyana Smertina"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a4",
                    name: "Eugen Sokolenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a9",
                    name: "Andriy Loboda"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ad",
                    name: "Stepan Krovspey"
                }
            ],
            department: [
                {
                    _id: "55b92ace21e4b7c40f000012",
                    name: ".NET/WP"
                },
                {
                    _id: "55b92ace21e4b7c40f000015",
                    name: "HR"
                },
                {
                    _id: "55b92ace21e4b7c40f00000f",
                    name: "iOS"
                },
                {
                    _id: "55b92ace21e4b7c40f000013",
                    name: "Marketing"
                },
                {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                {
                    _id: "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    name: "Finance"
                },
                {
                    _id: "55bb1f14cb76ca630b000006",
                    name: "Design"
                },
                {
                    _id: "55b92ace21e4b7c40f000011",
                    name: "QA"
                },
                {
                    _id: "55b92ace21e4b7c40f000010",
                    name: "Android"
                }
            ],
            jobPosition: [
                {
                    _id: "55eeeddd6dceaee10b00001f",
                    name: "2D Artist"
                },
                {
                    _id: "55b92acf21e4b7c40f00002d",
                    name: "Junior WP"
                },
                {
                    _id: "55b92acf21e4b7c40f000022",
                    name: "Middle Android"
                },
                {
                    _id: "55b92acf21e4b7c40f00002c",
                    name: "Junior iOS"
                },
                {
                    _id: "55b92acf21e4b7c40f00001e",
                    name: "Head of Marketing"
                },
                {
                    _id: "55b92acf21e4b7c40f000023",
                    name: "Middle Designer"
                },
                {
                    _id: "55b92acf21e4b7c40f000021",
                    name: "Junior Android"
                },
                {
                    _id: "55b92acf21e4b7c40f00001c",
                    name: "Middle JS"
                },
                {
                    _id: "5603a84fa5ac49794e00001a",
                    name: "Accountant"
                },
                {
                    _id: "55b92acf21e4b7c40f000017",
                    name: "Junior JS"
                },
                {
                    _id: "55b92acf21e4b7c40f000028",
                    name: "Junior Designer"
                },
                {
                    _id: "55b92acf21e4b7c40f000027",
                    name: "Senior iOS"
                },
                {
                    _id: "55b92acf21e4b7c40f00001d",
                    name: "Middle iOS"
                },
                {
                    _id: "55b92acf21e4b7c40f000018",
                    name: "Junior QA"
                },
                {
                    _id: "55b92acf21e4b7c40f00002a",
                    name: "HR Assistant"
                },
                {
                    _id: "55effa248f1e10e50b000005",
                    name: "Junior Unity 3D"
                },
                {
                    _id: "55b92acf21e4b7c40f00001f",
                    name: "Sales"
                },
                {
                    _id: "55b92acf21e4b7c40f000019",
                    name: "Middle QA"
                },
                {
                    _id: "55b92acf21e4b7c40f000020",
                    name: "Unity3D"
                },
                {
                    _id: "55b92acf21e4b7c40f00002e",
                    name: "Account Manager"
                },
                {
                    _id: "55b92acf21e4b7c40f000025",
                    name: "Digital Marketing"
                },
                {
                    _id: "55b92acf21e4b7c40f000029",
                    name: "HR manager"
                },
                {
                    _id: "56433d7c70bbc2b740ce8a15",
                    name: "Middle .NET/WP"
                },
                {
                    _id: "55b92acf21e4b7c40f00001b",
                    name: "Tech.writer"
                },
                {
                    _id: "55ded360ae2b22730b000043",
                    name: "UI Designer"
                }
            ]
        },
        Employees: {
            _id: null,
            name: [
                {
                    _id: "56c19971dfd8a81466e2f6dc",
                    name: "Andriy Khainus"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c1",
                    name: "Maria Zasukhina"
                },
                {
                    _id: "55eeed546dceaee10b00001e",
                    name: "Vladyslav Turytskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bf",
                    name: "Andriy Fizer"
                },
                {
                    _id: "564a0186ad4bc9e53f1f6193",
                    name: "Liliya Orlenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a8",
                    name: "Andriy Korneychuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c8",
                    name: "Ivan Bizilya"
                },
                {
                    _id: "566fe2348453e8b464b70ba6",
                    name: "Andriy Lukashchuk"
                },
                {
                    _id: "56b3412299ce8d706a81b2cd",
                    name: "Mykola Kholtobin"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c2",
                    name: "Andriy Mistetskiy"
                },
                {
                    _id: "561ba7039ebb48212ea838c3",
                    name: "Oleksandra Maliavska"
                },
                {
                    _id: "55b92ad221e4b7c40f00009f",
                    name: "Dmitriy Dzuba"
                },
                {
                    _id: "55b92ad221e4b7c40f000087",
                    name: "Ivan Kostromin"
                },
                {
                    _id: "561bb5329ebb48212ea838c6",
                    name: "Valerii Ladomiryak"
                },
                {
                    _id: "569e63df044ae38173244cfd",
                    name: "Bogdan Danyliuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a3",
                    name: "Andriy Karpenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000097",
                    name: "Samgash Abylgazinov"
                },
                {
                    _id: "55b92ad221e4b7c40f00003f",
                    name: "Marina Kubichka"
                },
                {
                    _id: "55b92ad221e4b7c40f000093",
                    name: "Vasiliy Lupchey"
                },
                {
                    _id: "568cd341b2bcba971ba6f5c4",
                    name: "Roman Rosul"
                },
                {
                    _id: "55b92ad221e4b7c40f00009c",
                    name: "Ivan Feltsan"
                },
                {
                    _id: "55b92ad221e4b7c40f00007e",
                    name: "Taras Zmiy"
                },
                {
                    _id: "55b92ad221e4b7c40f000091",
                    name: "Viktor Kiver"
                },
                {
                    _id: "55b92ad221e4b7c40f00008f",
                    name: "Yuriy Holovatskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000060",
                    name: "Roman Buchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f00008d",
                    name: "Svitlana Kira"
                },
                {
                    _id: "55b92ad221e4b7c40f00008c",
                    name: "Anton Gychka"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f000080",
                    name: "Vasiliy Barchiy"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b8",
                    name: "Anna Lobas"
                },
                {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: "Vitaliy Shuba"
                },
                {
                    _id: "56966c82d87c9004552b63c7",
                    name: "Ihor Kuzma"
                },
                {
                    _id: "56011186536bd29228000005",
                    name: "Valentyn Khruslov"
                },
                {
                    _id: "5649b8ccad4bc9e53f1f6192",
                    name: "Sergiy Gevelev"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b7",
                    name: "Myroslava Polovka"
                },
                {
                    _id: "55b92ad221e4b7c40f000076",
                    name: "Michael Glagola"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c7",
                    name: "Liliya Mykhailova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b9",
                    name: "Olena Melnyk"
                },
                {
                    _id: "568bbf935827e3b24d8123a8",
                    name: "Vladyslav Hamalii"
                },
                {
                    _id: "55b92ad221e4b7c40f000082",
                    name: "Yaroslav Fuchko"
                },
                {
                    _id: "55b92ad221e4b7c40f00004d",
                    name: "Vyacheslav Kopinets"
                },
                {
                    _id: "55b92ad221e4b7c40f000098",
                    name: "Andriy Krupka"
                },
                {
                    _id: "56965733d87c9004552b63be",
                    name: "Andriy Samokhin"
                },
                {
                    _id: "55b92ad221e4b7c40f000032",
                    name: "Bogdan Sakalo"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000030",
                    name: "Alex Svatuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000090",
                    name: "Gabriella Shterr"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00006e",
                    name: "Andriy Hanchak"
                },
                {
                    _id: "55b92ad221e4b7c40f000038",
                    name: "Roman Babunich"
                },
                {
                    _id: "568cdd375527d6691cb68b22",
                    name: "Sergey Melnik"
                },
                {
                    _id: "55b92ad221e4b7c40f000065",
                    name: "Yuriy Sirko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b1",
                    name: "Daniil Korniyenko"
                },
                {
                    _id: "55c32e0d29bd6ccd0b000005",
                    name: "Eugen Alexeev"
                },
                {
                    _id: "566ada96a74aaf316eaea69d",
                    name: "Maxim Gladovskyy"
                },
                {
                    _id: "55b92ad221e4b7c40f00007f",
                    name: "Vasilisa Klimchenko"
                },
                {
                    _id: "55b92ad221e4b7c40f00008e",
                    name: "Ivan Grab"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "565f0fa6f6427f253cf6bf19",
                    name: "Alex Lysachenko"
                },
                {
                    _id: "567ac0a48365c9a205406f33",
                    name: "Dmytro Kolochynsky"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bd",
                    name: "Michael Vashkeba"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b6",
                    name: "Denis Vengrin"
                },
                {
                    _id: "561bb1269ebb48212ea838c5",
                    name: "Vladimir Pogorilyak"
                },
                {
                    _id: "55b92ad221e4b7c40f00003c",
                    name: "Oleg Stasiv"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bb",
                    name: "Igor Shepinka"
                },
                {
                    _id: "55b92ad221e4b7c40f00007a",
                    name: "Robert Fogash"
                },
                {
                    _id: "55b92ad221e4b7c40f000036",
                    name: "Michael Yemets"
                },
                {
                    _id: "55b92ad221e4b7c40f00007d",
                    name: "Stas Volskiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00007b",
                    name: "Roman Guti"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c4",
                    name: "Michael Myronyshyn"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c0",
                    name: "Oksana Kordas"
                },
                {
                    _id: "56b8b99e6c411b590588feb9",
                    name: "Alex Ovcharenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000048",
                    name: "Katerina Chupova"
                },
                {
                    _id: "564da59f9b85f8b16b574fe9",
                    name: "Andriy Chuprov"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00009a",
                    name: "Katerina Pasichnyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a7",
                    name: "Alex Ryabcev"
                },
                {
                    _id: "55b92ad221e4b7c40f000051",
                    name: "Richard Mozes"
                },
                {
                    _id: "569cce1dcf1f31f925c026fa",
                    name: "Andriy Stupchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000085",
                    name: "Kirill Gorbushko"
                },
                {
                    _id: "55dd73d1f09cc2ec0b000008",
                    name: "Roman Vizenko"
                },
                {
                    _id: "561bb90a9ebb48212ea838c7",
                    name: "Andriy Svyd"
                },
                {
                    _id: "55b92ad221e4b7c40f00006a",
                    name: "Vadim Tsipf"
                },
                {
                    _id: "568bbdfd5827e3b24d8123a7",
                    name: "Roman Chaban"
                },
                {
                    _id: "55b92ad221e4b7c40f000053",
                    name: "Vasiliy Seredniy"
                },
                {
                    _id: "55b92ad221e4b7c40f000096",
                    name: "Andriy Herasymyuk"
                },
                {
                    _id: "5638aa635d23a8eb04e80af0",
                    name: "Alex Siladii"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b4",
                    name: "Vasiliy Prokopyshyn"
                },
                {
                    _id: "55f9298456f79c9c0c000006",
                    name: "Viktor Manhur"
                },
                {
                    _id: "55b92ad221e4b7c40f000057",
                    name: "Alex Roman"
                },
                {
                    _id: "55b92ad221e4b7c40f000094",
                    name: "Anton Yarosh"
                },
                {
                    _id: "560115cf536bd29228000006",
                    name: "Marianna Myhalko"
                },
                {
                    _id: "55e549309624477a0b000005",
                    name: "Petro Rospopa"
                },
                {
                    _id: "55b92ad221e4b7c40f000055",
                    name: "Michael Rogach"
                },
                {
                    _id: "55b92ad221e4b7c40f000059",
                    name: "Anatoliy Dalekorey"
                },
                {
                    _id: "564dac3e9b85f8b16b574fea",
                    name: "Alex Filchak"
                },
                {
                    _id: "55b92ad221e4b7c40f00005a",
                    name: "Bogdan Cheypesh"
                },
                {
                    _id: "56a0d4b162d172544baf0e3a",
                    name: "Ihor Ilnytskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000034",
                    name: "Ishtvan Nazarovich"
                },
                {
                    _id: "55b92ad221e4b7c40f00005e",
                    name: "Michael Didenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000031",
                    name: "Alex Gleba"
                },
                {
                    _id: "55b92ad221e4b7c40f000043",
                    name: "Maxim Geraschenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000062",
                    name: "Vasiliy Cheypesh"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a1",
                    name: "Sergiy Stepaniuk"
                },
                {
                    _id: "564a02e0ad4bc9e53f1f6194",
                    name: "Taras Dvorian"
                },
                {
                    _id: "55b92ad221e4b7c40f000072",
                    name: "Eugen Bernikevich"
                },
                {
                    _id: "55b92ad221e4b7c40f00003a",
                    name: "Vasiliy Agosta"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a5",
                    name: "Maxim Holubka"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b5",
                    name: "Andriana Lemko"
                },
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    _id: "5629e27046bca6e4591f4919",
                    name: "Artem Petrov"
                },
                {
                    _id: "55b92ad221e4b7c40f000077",
                    name: "Michael Soyma"
                },
                {
                    _id: "55b92ad221e4b7c40f000092",
                    name: "Eduard Dedenok"
                },
                {
                    _id: "55b92ad221e4b7c40f000088",
                    name: "Viktor Buchok"
                },
                {
                    _id: "55eee9c26dceaee10b00001d",
                    name: "Volodymyr Stepanchuk"
                },
                {
                    _id: "56090d77066d979a33000009",
                    name: "Yuriy Bysaha"
                },
                {
                    _id: "55b92ad221e4b7c40f000089",
                    name: "Maxim Sychov"
                },
                {
                    _id: "561b756f9ebb48212ea838c0",
                    name: "Stanislav Romanyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000046",
                    name: "Denis Udod"
                },
                {
                    _id: "56b9d49d8f23c5696159cd0c",
                    name: "Kirill Bed"
                },
                {
                    _id: "55eef3fd6dceaee10b000020",
                    name: "Roman Saldan"
                },
                {
                    _id: "55b92ad221e4b7c40f00007c",
                    name: "Sergiy Sheba"
                },
                {
                    _id: "55b92ad221e4b7c40f000073",
                    name: "Irina Grab"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c3",
                    name: "Olesia Prokoshkina"
                },
                {
                    _id: "56b9d3eb8f23c5696159cd0b",
                    name: "Galina Mykhailova"
                },
                {
                    _id: "55b92ad221e4b7c40f00009e",
                    name: "Alex Michenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000086",
                    name: "Roman Kubichka"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c5",
                    name: "Michael Gajdan"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ca",
                    name: "Yana Vengerova"
                },
                {
                    _id: "566ede9e8453e8b464b70b71",
                    name: "Alex Tonkovid"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cb",
                    name: "Alona Yelahina"
                },
                {
                    _id: "5600042ca36a8ca10c000029",
                    name: "Michael Filchak"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cc",
                    name: "Ivan Lyakh"
                },
                {
                    _id: "565c2793f4dcd63b5dbd7372",
                    name: "Denis Yaremenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ae",
                    name: "Tamara Dolottseva"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cd",
                    name: "Andriy Vovk"
                },
                {
                    _id: "55b92ad221e4b7c40f000047",
                    name: "Ilya Khymych"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ce",
                    name: "Alex Storojenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000079",
                    name: "Oleksiy Gerasimov"
                },
                {
                    _id: "55e96ab13f3ae4fd0b000009",
                    name: "Oles Pavliuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cf",
                    name: "Yaroslav Denysiuk"
                },
                {
                    _id: "55bf45cf65cda0810b00000a",
                    name: "Liliya Shustur"
                },
                {
                    _id: "56a7956faa157ca50f21fb25",
                    name: "Pavlo Demko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c6",
                    name: "Illia Kramarenko"
                },
                {
                    _id: "55c06411d011746b0b000005",
                    name: "Maxim Rachytskyy"
                },
                {
                    _id: "55b92ad221e4b7c40f00003b",
                    name: "Vitaliy Bizilya"
                },
                {
                    _id: "55f7c20a6d43203d0c000005",
                    name: "Yana Samaryk"
                },
                {
                    _id: "55c0656ad011746b0b000006",
                    name: "Anton Nizhegorodov"
                },
                {
                    _id: "55c330d529bd6ccd0b000007",
                    name: "Alina Yurenko"
                },
                {
                    _id: "55c84a4aaa36a0e60a000005",
                    name: "Pavlo Muratov"
                },
                {
                    _id: "56bdf283dfd8a81466e2f6d0",
                    name: "Nadiya Shishko"
                },
                {
                    _id: "55b92ad221e4b7c40f000052",
                    name: "Vladimir Gerasimenko"
                },
                {
                    _id: "566aa49f4f817b7f51746ec0",
                    name: "Nataliya Burtnyk"
                },
                {
                    _id: "55ca0145cbb0f4910b000009",
                    name: "Denis Zinkovskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000078",
                    name: "Oleg Boyanivskiy"
                },
                {
                    _id: "55d1e234dda01e250c000015",
                    name: "Kristian Rimar"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55dd63f8f09cc2ec0b000006",
                    name: "Sergiy Ihnatko"
                },
                {
                    _id: "55e419094983acdd0b000012",
                    name: "Kirill Paliiuk"
                },
                {
                    _id: "56090fae86e2435a33000008",
                    name: "Inna Nukhova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c9",
                    name: "Oleksiy Fedosov"
                },
                {
                    _id: "55f7c3736d43203d0c000006",
                    name: "Yuriy Bodak"
                },
                {
                    _id: "56a78c75aa157ca50f21fb24",
                    name: "Renata Iyber"
                },
                {
                    _id: "5600031ba36a8ca10c000028",
                    name: "Dmitriy Mostiv"
                },
                {
                    _id: "55dd7776f09cc2ec0b000009",
                    name: "Michael Kavka"
                },
                {
                    _id: "56014cc8536bd29228000007",
                    name: "Yevgenia Bezyk"
                },
                {
                    _id: "55b92ad221e4b7c40f000064",
                    name: "Sergiy Tilishevsky"
                },
                {
                    _id: "560264bb8dc408c632000005",
                    name: "Anastas Lyakh"
                },
                {
                    _id: "56964a03d87c9004552b63ba",
                    name: "Pavlo Skyba"
                },
                {
                    _id: "56029cc950de7f4138000005",
                    name: "Eugen Lendyel"
                },
                {
                    _id: "55b92ad221e4b7c40f000070",
                    name: "Daniil Pozhidaev"
                },
                {
                    _id: "56af32e174d57e0d56d6bee5",
                    name: "Nataliya Sichko"
                },
                {
                    _id: "5602a01550de7f4138000008",
                    name: "Yana Dufynets"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "56123232c90e2fb026ce064b",
                    name: "Olga Sikora"
                },
                {
                    _id: "5626278d750d38934bfa1313",
                    name: "Viktoria Rogachenko"
                },
                {
                    _id: "5637710e5d23a8eb04e80aed",
                    name: "Viktoria Kovalenko"
                },
                {
                    _id: "5640741570bbc2b740ce89ec",
                    name: "Denis Lukashov"
                },
                {
                    _id: "55b92ad221e4b7c40f00009b",
                    name: "Larysa Popp"
                },
                {
                    _id: "564a03d1ad4bc9e53f1f6195",
                    name: "Edgard Tanchenec"
                },
                {
                    _id: "55b92ad221e4b7c40f0000aa",
                    name: "Ivan Lyashenko"
                },
                {
                    _id: "5652dd95c4d12cf51e7f7e0b",
                    name: "Sergiy Petakh"
                },
                {
                    _id: "55b92ad221e4b7c40f000061",
                    name: "Tamas Mondok"
                },
                {
                    _id: "565c306af4dcd63b5dbd7373",
                    name: "Myroslav Matrafayilo"
                },
                {
                    _id: "5667f310a3fc012a68f0d5f5",
                    name: "Michael Sopko"
                },
                {
                    _id: "56813fe29cceae182b907755",
                    name: "Taras Ukrainskiy"
                },
                {
                    _id: "5667f43da3fc012a68f0d5f6",
                    name: "Roman Katsala"
                },
                {
                    _id: "566add9aa74aaf316eaea6fc",
                    name: "Denis Saranyuk"
                },
                {
                    _id: "568158fc9cceae182b907756",
                    name: "Herman Belous"
                },
                {
                    _id: "5684ec1a1fec73d05393a2a4",
                    name: "Maria Zaitseva"
                },
                {
                    _id: "568bc0b55827e3b24d8123a9",
                    name: "Yaroslav Syrota"
                },
                {
                    _id: "5614d4c7ab24a83b1dc1a7a8",
                    name: "Dmytro Babilia"
                },
                {
                    _id: "568cd4c0b2bcba971ba6f5c5",
                    name: "Roman Osadchuk"
                },
                {
                    _id: "5693b24bd87c9004552b63a1",
                    name: "Andriy Horak"
                },
                {
                    _id: "569e3a73044ae38173244cfb",
                    name: "Roman Martyniuk"
                },
                {
                    _id: "56a5ef86aa157ca50f21fb1d",
                    name: "Ivan Pasichnyuk"
                },
                {
                    _id: "56b2287b99ce8d706a81b2bc",
                    name: "Kostiantyn Mudrenok"
                },
                {
                    _id: "55c98df0cbb0f4910b000007",
                    name: "Timur Berezhnoi"
                },
                {
                    _id: "55dd71eaf09cc2ec0b000007",
                    name: "Ivan Khartov"
                },
                {
                    _id: "56b9cbb48f23c5696159cd08",
                    name: "Oleksii Kovalenko"
                }
            ],
            department: [
                {
                    _id: "56802eb31afe27f547b7ba52",
                    name: "JS"
                },
                {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    name: "Finance"
                },
                {
                    _id: "55bb1f40cb76ca630b000007",
                    name: "PM"
                },
                {
                    _id: "56802ec21afe27f547b7ba53",
                    name: "PHP/WordPress"
                },
                {
                    _id: "55b92ace21e4b7c40f000015",
                    name: "HR"
                },
                {
                    _id: "55b92ace21e4b7c40f000012",
                    name: ".NET/WP"
                },
                {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                {
                    _id: "55b92ace21e4b7c40f000010",
                    name: "Android"
                },
                {
                    _id: "56802e9d1afe27f547b7ba51",
                    name: "CSS/FrontEnd"
                },
                {
                    _id: "55b92ace21e4b7c40f000011",
                    name: "QA"
                },
                {
                    _id: "566ee11b8453e8b464b70b73",
                    name: "Ruby on Rails"
                },
                {
                    _id: "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                {
                    _id: "55b92ace21e4b7c40f000013",
                    name: "Marketing"
                },
                {
                    _id: "55b92ace21e4b7c40f00000f",
                    name: "iOS"
                },
                {
                    _id: "55bb1f14cb76ca630b000006",
                    name: "Design"
                }
            ],
            jobPosition: [
                {
                    _id: "56b8b2116c411b590588feb8",
                    name: "Junior WordPress"
                },
                {
                    _id: "5629e3c284deb7cb59d61b61",
                    name: "Sysadmin"
                },
                {
                    _id: "55effa248f1e10e50b000005",
                    name: "Junior Unity 3D"
                },
                {
                    _id: "564438aa70bbc2b740ce8a19",
                    name: "Head of Android"
                },
                {
                    _id: "55b92acf21e4b7c40f00001f",
                    name: "Sales"
                },
                {
                    _id: "564436a370bbc2b740ce8a17",
                    name: "Head of iOS"
                },
                {
                    _id: "55b92acf21e4b7c40f00002c",
                    name: "Junior iOS"
                },
                {
                    _id: "55b92acf21e4b7c40f000024",
                    name: "Head of Business Development"
                },
                {
                    _id: "55b92acf21e4b7c40f000026",
                    name: "Senior Android"
                },
                {
                    _id: "55c32e2a29bd6ccd0b000006",
                    name: "Middle Unity 3D"
                },
                {
                    _id: "55bf419165cda0810b000006",
                    name: "P.M. Assistant"
                },
                {
                    _id: "564438d470bbc2b740ce8a1a",
                    name: "Head of PM"
                },
                {
                    _id: "55b92acf21e4b7c40f000017",
                    name: "Junior JS"
                },
                {
                    _id: "55b92acf21e4b7c40f000027",
                    name: "Senior iOS"
                },
                {
                    _id: "55dd6259f09cc2ec0b000005",
                    name: "Middle PHP"
                },
                {
                    _id: "55b92acf21e4b7c40f000028",
                    name: "Junior Designer"
                },
                {
                    _id: "55b92acf21e4b7c40f00001c",
                    name: "Middle JS"
                },
                {
                    _id: "56121847c90e2fb026ce0621",
                    name: "Head of JS"
                },
                {
                    _id: "55b92acf21e4b7c40f00002e",
                    name: "Account Manager"
                },
                {
                    _id: "561b73fb9ebb48212ea838bf",
                    name: "Junior PM"
                },
                {
                    _id: "56433d7c70bbc2b740ce8a15",
                    name: "Middle .NET/WP"
                },
                {
                    _id: "55b92acf21e4b7c40f00001b",
                    name: "Tech.writer"
                },
                {
                    _id: "56c1914adfd8a81466e2f6db",
                    name: "Head of ROR"
                },
                {
                    _id: "5644388770bbc2b740ce8a18",
                    name: "Head of QA"
                },
                {
                    _id: "55b92acf21e4b7c40f000019",
                    name: "Middle QA"
                },
                {
                    _id: "560114ab386dd9ad28000005",
                    name: "Office Manager"
                },
                {
                    _id: "55b92acf21e4b7c40f000029",
                    name: "HR manager"
                },
                {
                    _id: "561b75f89ebb48212ea838c1",
                    name: "PM"
                },
                {
                    _id: "55b92acf21e4b7c40f000023",
                    name: "Middle Designer"
                },
                {
                    _id: "56249299e9576d1728a9ed24",
                    name: "Head of Design"
                },
                {
                    _id: "566ee0c68453e8b464b70b72",
                    name: "Junior Ruby on Rails"
                },
                {
                    _id: "55f7c4a36d43203d0c000007",
                    name: "Junior PHP"
                },
                {
                    _id: "5603a84fa5ac49794e00001a",
                    name: "Accountant"
                },
                {
                    _id: "55b92acf21e4b7c40f000020",
                    name: "Unity3D"
                },
                {
                    _id: "55b92acf21e4b7c40f000021",
                    name: "Junior Android"
                },
                {
                    _id: "56b1bea7d6ef38a708dfc2a3",
                    name: "Senior Designer"
                },
                {
                    _id: "55b92acf21e4b7c40f000022",
                    name: "Middle Android"
                },
                {
                    _id: "55b92acf21e4b7c40f00002a",
                    name: "HR Assistant"
                },
                {
                    _id: "55b92acf21e4b7c40f00001d",
                    name: "Middle iOS"
                },
                {
                    _id: "56011b2d93b361cd28000005",
                    name: "Chief Financial Officer"
                },
                {
                    _id: "55eeeddd6dceaee10b00001f",
                    name: "2D Artist"
                },
                {
                    _id: "5600025da36a8ca10c000027",
                    name: "Senior SQL"
                },
                {
                    _id: "56262666750d38934bfa1312",
                    name: "Event/PR manager"
                },
                {
                    _id: "56b1b2b0d6ef38a708dfc2a2",
                    name: "Head of 2D"
                },
                {
                    _id: "5681592f9cceae182b907757",
                    name: "Junior .Net"
                },
                {
                    _id: "55b92acf21e4b7c40f000018",
                    name: "Junior QA"
                },
                {
                    _id: "56bde14cdfd8a81466e2f5ed",
                    name: "Middle WordPress"
                },
                {
                    _id: "56b9cd808f23c5696159cd0a",
                    name: "PR Manager Assistant"
                },
                {
                    _id: "55ddd8a2f09cc2ec0b000030",
                    name: "CSS"
                },
                {
                    _id: "55b92acf21e4b7c40f000025",
                    name: "Digital Marketing"
                }
            ],
            manager: [
                {
                    _id: "5626278d750d38934bfa1313",
                    name: "Viktoria Rogachenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55c0656ad011746b0b000006",
                    name: "Anton Nizhegorodov"
                },
                {
                    _id: "55dd63f8f09cc2ec0b000006",
                    name: "Sergiy Ihnatko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ca",
                    name: "Yana Vengerova"
                },
                {
                    _id: "55b92ad221e4b7c40f000042",
                    name: "Artur Myhalko"
                },
                {
                    _id: "55b92ad221e4b7c40f000073",
                    name: "Irina Grab"
                },
                {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: "Vitaliy Shuba"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000059",
                    name: "Anatoliy Dalekorey"
                },
                {
                    _id: "55b92ad221e4b7c40f000038",
                    name: "Roman Babunich"
                },
                {
                    _id: "55b92ad221e4b7c40f000030",
                    name: "Alex Svatuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000060",
                    name: "Roman Buchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "55b92ad221e4b7c40f000032",
                    name: "Bogdan Sakalo"
                },
                {
                    _id: "55b92ad221e4b7c40f00009a",
                    name: "Katerina Pasichnyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000072",
                    name: "Eugen Bernikevich"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                }
            ]
        },
        Invoice: {
            _id: null,
            workflow: [
                {
                    _id: "5555e54c6a3f01acae0b5564",
                    name: "Draft"
                }
            ],
            supplier: [
                {
                    name: null
                }
            ]
        },
        Quotation: [ ],
        DashVacation: {
            _id: null,
            name: [
                {
                    _id: "56c19971dfd8a81466e2f6dc",
                    name: "Andriy Khainus"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c1",
                    name: "Maria Zasukhina"
                },
                {
                    _id: "55eeed546dceaee10b00001e",
                    name: "Vladyslav Turytskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bf",
                    name: "Andriy Fizer"
                },
                {
                    _id: "564a0186ad4bc9e53f1f6193",
                    name: "Liliya Orlenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a8",
                    name: "Andriy Korneychuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c8",
                    name: "Ivan Bizilya"
                },
                {
                    _id: "566fe2348453e8b464b70ba6",
                    name: "Andriy Lukashchuk"
                },
                {
                    _id: "56b3412299ce8d706a81b2cd",
                    name: "Mykola Kholtobin"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c2",
                    name: "Andriy Mistetskiy"
                },
                {
                    _id: "561ba7039ebb48212ea838c3",
                    name: "Oleksandra Maliavska"
                },
                {
                    _id: "55b92ad221e4b7c40f00009f",
                    name: "Dmitriy Dzuba"
                },
                {
                    _id: "55b92ad221e4b7c40f000087",
                    name: "Ivan Kostromin"
                },
                {
                    _id: "561bb5329ebb48212ea838c6",
                    name: "Valerii Ladomiryak"
                },
                {
                    _id: "569e63df044ae38173244cfd",
                    name: "Bogdan Danyliuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a3",
                    name: "Andriy Karpenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000097",
                    name: "Samgash Abylgazinov"
                },
                {
                    _id: "55b92ad221e4b7c40f00003f",
                    name: "Marina Kubichka"
                },
                {
                    _id: "55b92ad221e4b7c40f000093",
                    name: "Vasiliy Lupchey"
                },
                {
                    _id: "568cd341b2bcba971ba6f5c4",
                    name: "Roman Rosul"
                },
                {
                    _id: "55b92ad221e4b7c40f00009c",
                    name: "Ivan Feltsan"
                },
                {
                    _id: "55b92ad221e4b7c40f00007e",
                    name: "Taras Zmiy"
                },
                {
                    _id: "55b92ad221e4b7c40f000091",
                    name: "Viktor Kiver"
                },
                {
                    _id: "55b92ad221e4b7c40f00008f",
                    name: "Yuriy Holovatskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000060",
                    name: "Roman Buchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f00008d",
                    name: "Svitlana Kira"
                },
                {
                    _id: "55b92ad221e4b7c40f00008c",
                    name: "Anton Gychka"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f000080",
                    name: "Vasiliy Barchiy"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b8",
                    name: "Anna Lobas"
                },
                {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: "Vitaliy Shuba"
                },
                {
                    _id: "56966c82d87c9004552b63c7",
                    name: "Ihor Kuzma"
                },
                {
                    _id: "56011186536bd29228000005",
                    name: "Valentyn Khruslov"
                },
                {
                    _id: "5649b8ccad4bc9e53f1f6192",
                    name: "Sergiy Gevelev"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b7",
                    name: "Myroslava Polovka"
                },
                {
                    _id: "55b92ad221e4b7c40f000076",
                    name: "Michael Glagola"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c7",
                    name: "Liliya Mykhailova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b9",
                    name: "Olena Melnyk"
                },
                {
                    _id: "568bbf935827e3b24d8123a8",
                    name: "Vladyslav Hamalii"
                },
                {
                    _id: "55b92ad221e4b7c40f000082",
                    name: "Yaroslav Fuchko"
                },
                {
                    _id: "55b92ad221e4b7c40f00004d",
                    name: "Vyacheslav Kopinets"
                },
                {
                    _id: "55b92ad221e4b7c40f000098",
                    name: "Andriy Krupka"
                },
                {
                    _id: "56965733d87c9004552b63be",
                    name: "Andriy Samokhin"
                },
                {
                    _id: "55b92ad221e4b7c40f000032",
                    name: "Bogdan Sakalo"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000030",
                    name: "Alex Svatuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000090",
                    name: "Gabriella Shterr"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00006e",
                    name: "Andriy Hanchak"
                },
                {
                    _id: "55b92ad221e4b7c40f000038",
                    name: "Roman Babunich"
                },
                {
                    _id: "568cdd375527d6691cb68b22",
                    name: "Sergey Melnik"
                },
                {
                    _id: "55b92ad221e4b7c40f000065",
                    name: "Yuriy Sirko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b1",
                    name: "Daniil Korniyenko"
                },
                {
                    _id: "55c32e0d29bd6ccd0b000005",
                    name: "Eugen Alexeev"
                },
                {
                    _id: "566ada96a74aaf316eaea69d",
                    name: "Maxim Gladovskyy"
                },
                {
                    _id: "55b92ad221e4b7c40f00007f",
                    name: "Vasilisa Klimchenko"
                },
                {
                    _id: "55b92ad221e4b7c40f00008e",
                    name: "Ivan Grab"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "565f0fa6f6427f253cf6bf19",
                    name: "Alex Lysachenko"
                },
                {
                    _id: "567ac0a48365c9a205406f33",
                    name: "Dmytro Kolochynsky"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bd",
                    name: "Michael Vashkeba"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b6",
                    name: "Denis Vengrin"
                },
                {
                    _id: "561bb1269ebb48212ea838c5",
                    name: "Vladimir Pogorilyak"
                },
                {
                    _id: "55b92ad221e4b7c40f00003c",
                    name: "Oleg Stasiv"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bb",
                    name: "Igor Shepinka"
                },
                {
                    _id: "55b92ad221e4b7c40f00007a",
                    name: "Robert Fogash"
                },
                {
                    _id: "55b92ad221e4b7c40f000036",
                    name: "Michael Yemets"
                },
                {
                    _id: "55b92ad221e4b7c40f00007d",
                    name: "Stas Volskiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00007b",
                    name: "Roman Guti"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c4",
                    name: "Michael Myronyshyn"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c0",
                    name: "Oksana Kordas"
                },
                {
                    _id: "56b8b99e6c411b590588feb9",
                    name: "Alex Ovcharenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000048",
                    name: "Katerina Chupova"
                },
                {
                    _id: "564da59f9b85f8b16b574fe9",
                    name: "Andriy Chuprov"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00009a",
                    name: "Katerina Pasichnyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a7",
                    name: "Alex Ryabcev"
                },
                {
                    _id: "55b92ad221e4b7c40f000051",
                    name: "Richard Mozes"
                },
                {
                    _id: "569cce1dcf1f31f925c026fa",
                    name: "Andriy Stupchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000085",
                    name: "Kirill Gorbushko"
                },
                {
                    _id: "55dd73d1f09cc2ec0b000008",
                    name: "Roman Vizenko"
                },
                {
                    _id: "561bb90a9ebb48212ea838c7",
                    name: "Andriy Svyd"
                },
                {
                    _id: "55b92ad221e4b7c40f00006a",
                    name: "Vadim Tsipf"
                },
                {
                    _id: "568bbdfd5827e3b24d8123a7",
                    name: "Roman Chaban"
                },
                {
                    _id: "55b92ad221e4b7c40f000053",
                    name: "Vasiliy Seredniy"
                },
                {
                    _id: "55b92ad221e4b7c40f000096",
                    name: "Andriy Herasymyuk"
                },
                {
                    _id: "5638aa635d23a8eb04e80af0",
                    name: "Alex Siladii"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b4",
                    name: "Vasiliy Prokopyshyn"
                },
                {
                    _id: "55f9298456f79c9c0c000006",
                    name: "Viktor Manhur"
                },
                {
                    _id: "55b92ad221e4b7c40f000057",
                    name: "Alex Roman"
                },
                {
                    _id: "55b92ad221e4b7c40f000094",
                    name: "Anton Yarosh"
                },
                {
                    _id: "560115cf536bd29228000006",
                    name: "Marianna Myhalko"
                },
                {
                    _id: "55e549309624477a0b000005",
                    name: "Petro Rospopa"
                },
                {
                    _id: "55b92ad221e4b7c40f000055",
                    name: "Michael Rogach"
                },
                {
                    _id: "55b92ad221e4b7c40f000059",
                    name: "Anatoliy Dalekorey"
                },
                {
                    _id: "564dac3e9b85f8b16b574fea",
                    name: "Alex Filchak"
                },
                {
                    _id: "55b92ad221e4b7c40f00005a",
                    name: "Bogdan Cheypesh"
                },
                {
                    _id: "56a0d4b162d172544baf0e3a",
                    name: "Ihor Ilnytskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000034",
                    name: "Ishtvan Nazarovich"
                },
                {
                    _id: "55b92ad221e4b7c40f00005e",
                    name: "Michael Didenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000031",
                    name: "Alex Gleba"
                },
                {
                    _id: "55b92ad221e4b7c40f000043",
                    name: "Maxim Geraschenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000062",
                    name: "Vasiliy Cheypesh"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a1",
                    name: "Sergiy Stepaniuk"
                },
                {
                    _id: "564a02e0ad4bc9e53f1f6194",
                    name: "Taras Dvorian"
                },
                {
                    _id: "55b92ad221e4b7c40f000072",
                    name: "Eugen Bernikevich"
                },
                {
                    _id: "55b92ad221e4b7c40f00003a",
                    name: "Vasiliy Agosta"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a5",
                    name: "Maxim Holubka"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b5",
                    name: "Andriana Lemko"
                },
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    _id: "5629e27046bca6e4591f4919",
                    name: "Artem Petrov"
                },
                {
                    _id: "55b92ad221e4b7c40f000077",
                    name: "Michael Soyma"
                },
                {
                    _id: "55b92ad221e4b7c40f000092",
                    name: "Eduard Dedenok"
                },
                {
                    _id: "55b92ad221e4b7c40f000088",
                    name: "Viktor Buchok"
                },
                {
                    _id: "55eee9c26dceaee10b00001d",
                    name: "Volodymyr Stepanchuk"
                },
                {
                    _id: "56090d77066d979a33000009",
                    name: "Yuriy Bysaha"
                },
                {
                    _id: "55b92ad221e4b7c40f000089",
                    name: "Maxim Sychov"
                },
                {
                    _id: "561b756f9ebb48212ea838c0",
                    name: "Stanislav Romanyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000046",
                    name: "Denis Udod"
                },
                {
                    _id: "56b9d49d8f23c5696159cd0c",
                    name: "Kirill Bed"
                },
                {
                    _id: "55eef3fd6dceaee10b000020",
                    name: "Roman Saldan"
                },
                {
                    _id: "55b92ad221e4b7c40f00007c",
                    name: "Sergiy Sheba"
                },
                {
                    _id: "55b92ad221e4b7c40f000073",
                    name: "Irina Grab"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c3",
                    name: "Olesia Prokoshkina"
                },
                {
                    _id: "56b9d3eb8f23c5696159cd0b",
                    name: "Galina Mykhailova"
                },
                {
                    _id: "55b92ad221e4b7c40f00009e",
                    name: "Alex Michenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000086",
                    name: "Roman Kubichka"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c5",
                    name: "Michael Gajdan"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ca",
                    name: "Yana Vengerova"
                },
                {
                    _id: "566ede9e8453e8b464b70b71",
                    name: "Alex Tonkovid"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cb",
                    name: "Alona Yelahina"
                },
                {
                    _id: "5600042ca36a8ca10c000029",
                    name: "Michael Filchak"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cc",
                    name: "Ivan Lyakh"
                },
                {
                    _id: "565c2793f4dcd63b5dbd7372",
                    name: "Denis Yaremenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ae",
                    name: "Tamara Dolottseva"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cd",
                    name: "Andriy Vovk"
                },
                {
                    _id: "55b92ad221e4b7c40f000047",
                    name: "Ilya Khymych"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ce",
                    name: "Alex Storojenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000079",
                    name: "Oleksiy Gerasimov"
                },
                {
                    _id: "55e96ab13f3ae4fd0b000009",
                    name: "Oles Pavliuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cf",
                    name: "Yaroslav Denysiuk"
                },
                {
                    _id: "55bf45cf65cda0810b00000a",
                    name: "Liliya Shustur"
                },
                {
                    _id: "56a7956faa157ca50f21fb25",
                    name: "Pavlo Demko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c6",
                    name: "Illia Kramarenko"
                },
                {
                    _id: "55c06411d011746b0b000005",
                    name: "Maxim Rachytskyy"
                },
                {
                    _id: "55b92ad221e4b7c40f00003b",
                    name: "Vitaliy Bizilya"
                },
                {
                    _id: "55f7c20a6d43203d0c000005",
                    name: "Yana Samaryk"
                },
                {
                    _id: "55c0656ad011746b0b000006",
                    name: "Anton Nizhegorodov"
                },
                {
                    _id: "55c330d529bd6ccd0b000007",
                    name: "Alina Yurenko"
                },
                {
                    _id: "55c84a4aaa36a0e60a000005",
                    name: "Pavlo Muratov"
                },
                {
                    _id: "56bdf283dfd8a81466e2f6d0",
                    name: "Nadiya Shishko"
                },
                {
                    _id: "55b92ad221e4b7c40f000052",
                    name: "Vladimir Gerasimenko"
                },
                {
                    _id: "566aa49f4f817b7f51746ec0",
                    name: "Nataliya Burtnyk"
                },
                {
                    _id: "55ca0145cbb0f4910b000009",
                    name: "Denis Zinkovskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000078",
                    name: "Oleg Boyanivskiy"
                },
                {
                    _id: "55d1e234dda01e250c000015",
                    name: "Kristian Rimar"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55dd63f8f09cc2ec0b000006",
                    name: "Sergiy Ihnatko"
                },
                {
                    _id: "55e419094983acdd0b000012",
                    name: "Kirill Paliiuk"
                },
                {
                    _id: "56090fae86e2435a33000008",
                    name: "Inna Nukhova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c9",
                    name: "Oleksiy Fedosov"
                },
                {
                    _id: "55f7c3736d43203d0c000006",
                    name: "Yuriy Bodak"
                },
                {
                    _id: "56a78c75aa157ca50f21fb24",
                    name: "Renata Iyber"
                },
                {
                    _id: "5600031ba36a8ca10c000028",
                    name: "Dmitriy Mostiv"
                },
                {
                    _id: "55dd7776f09cc2ec0b000009",
                    name: "Michael Kavka"
                },
                {
                    _id: "56014cc8536bd29228000007",
                    name: "Yevgenia Bezyk"
                },
                {
                    _id: "55b92ad221e4b7c40f000064",
                    name: "Sergiy Tilishevsky"
                },
                {
                    _id: "560264bb8dc408c632000005",
                    name: "Anastas Lyakh"
                },
                {
                    _id: "56964a03d87c9004552b63ba",
                    name: "Pavlo Skyba"
                },
                {
                    _id: "56029cc950de7f4138000005",
                    name: "Eugen Lendyel"
                },
                {
                    _id: "55b92ad221e4b7c40f000070",
                    name: "Daniil Pozhidaev"
                },
                {
                    _id: "56af32e174d57e0d56d6bee5",
                    name: "Nataliya Sichko"
                },
                {
                    _id: "5602a01550de7f4138000008",
                    name: "Yana Dufynets"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "56123232c90e2fb026ce064b",
                    name: "Olga Sikora"
                },
                {
                    _id: "5626278d750d38934bfa1313",
                    name: "Viktoria Rogachenko"
                },
                {
                    _id: "5637710e5d23a8eb04e80aed",
                    name: "Viktoria Kovalenko"
                },
                {
                    _id: "5640741570bbc2b740ce89ec",
                    name: "Denis Lukashov"
                },
                {
                    _id: "55b92ad221e4b7c40f00009b",
                    name: "Larysa Popp"
                },
                {
                    _id: "564a03d1ad4bc9e53f1f6195",
                    name: "Edgard Tanchenec"
                },
                {
                    _id: "55b92ad221e4b7c40f0000aa",
                    name: "Ivan Lyashenko"
                },
                {
                    _id: "5652dd95c4d12cf51e7f7e0b",
                    name: "Sergiy Petakh"
                },
                {
                    _id: "55b92ad221e4b7c40f000061",
                    name: "Tamas Mondok"
                },
                {
                    _id: "565c306af4dcd63b5dbd7373",
                    name: "Myroslav Matrafayilo"
                },
                {
                    _id: "5667f310a3fc012a68f0d5f5",
                    name: "Michael Sopko"
                },
                {
                    _id: "56813fe29cceae182b907755",
                    name: "Taras Ukrainskiy"
                },
                {
                    _id: "5667f43da3fc012a68f0d5f6",
                    name: "Roman Katsala"
                },
                {
                    _id: "566add9aa74aaf316eaea6fc",
                    name: "Denis Saranyuk"
                },
                {
                    _id: "568158fc9cceae182b907756",
                    name: "Herman Belous"
                },
                {
                    _id: "5684ec1a1fec73d05393a2a4",
                    name: "Maria Zaitseva"
                },
                {
                    _id: "568bc0b55827e3b24d8123a9",
                    name: "Yaroslav Syrota"
                },
                {
                    _id: "5614d4c7ab24a83b1dc1a7a8",
                    name: "Dmytro Babilia"
                },
                {
                    _id: "568cd4c0b2bcba971ba6f5c5",
                    name: "Roman Osadchuk"
                },
                {
                    _id: "5693b24bd87c9004552b63a1",
                    name: "Andriy Horak"
                },
                {
                    _id: "569e3a73044ae38173244cfb",
                    name: "Roman Martyniuk"
                },
                {
                    _id: "56a5ef86aa157ca50f21fb1d",
                    name: "Ivan Pasichnyuk"
                },
                {
                    _id: "56b2287b99ce8d706a81b2bc",
                    name: "Kostiantyn Mudrenok"
                },
                {
                    _id: "55c98df0cbb0f4910b000007",
                    name: "Timur Berezhnoi"
                },
                {
                    _id: "55dd71eaf09cc2ec0b000007",
                    name: "Ivan Khartov"
                },
                {
                    _id: "56b9cbb48f23c5696159cd08",
                    name: "Oleksii Kovalenko"
                }
            ],
            department: [
                {
                    _id: "56802eb31afe27f547b7ba52",
                    name: "JS"
                },
                {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    name: "Finance"
                },
                {
                    _id: "55bb1f40cb76ca630b000007",
                    name: "PM"
                },
                {
                    _id: "56802ec21afe27f547b7ba53",
                    name: "PHP/WordPress"
                },
                {
                    _id: "55b92ace21e4b7c40f000015",
                    name: "HR"
                },
                {
                    _id: "55b92ace21e4b7c40f000012",
                    name: ".NET/WP"
                },
                {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                {
                    _id: "55b92ace21e4b7c40f000010",
                    name: "Android"
                },
                {
                    _id: "56802e9d1afe27f547b7ba51",
                    name: "CSS/FrontEnd"
                },
                {
                    _id: "55b92ace21e4b7c40f000011",
                    name: "QA"
                },
                {
                    _id: "566ee11b8453e8b464b70b73",
                    name: "Ruby on Rails"
                },
                {
                    _id: "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                {
                    _id: "55b92ace21e4b7c40f000013",
                    name: "Marketing"
                },
                {
                    _id: "55b92ace21e4b7c40f00000f",
                    name: "iOS"
                },
                {
                    _id: "55bb1f14cb76ca630b000006",
                    name: "Design"
                }
            ]
        },
        salesInvoice: {
            _id: null,
            workflow: [
                {
                    _id: "55647d952e4aa3804a765eca",
                    name: "Partially Paid"
                },
                {
                    _id: "55647d932e4aa3804a765ec9",
                    name: "Unpaid"
                },
                {
                    _id: "55647d982e4aa3804a765ecb",
                    name: "Paid"
                }
            ],
            project: [
                {
                    _id: "56ab958e74d57e0d56d6be3b",
                    name: "Planogram"
                },
                {
                    _id: "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b6",
                    name: "Shiwaforce Karma"
                },
                {
                    _id: "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id: "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id: "561253dfc90e2fb026ce064d",
                    name: "Shiwaforce Karma QA"
                },
                {
                    _id: "569f60d162d172544baf0d58",
                    name: "Android advertisement"
                },
                {
                    _id: "56422bfc70bbc2b740ce89f3",
                    name: "PREEME"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d6",
                    name: "ArTV"
                },
                {
                    _id: "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id: "56a89384eb2b76c70ec74d1e",
                    name: "Locappy"
                },
                {
                    _id: "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id: "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id: "561ebb8cd6c741e8235f42ea",
                    name: "Bodega application"
                },
                {
                    _id: "55cdc96d9b42266a4f000006",
                    name: "Absolute Vodka"
                },
                {
                    _id: "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ce",
                    name: "FlipStar Game"
                },
                {
                    _id: "55f5728cb81672730c00006a",
                    name: "BetterIt ios"
                },
                {
                    _id: "55f55d31b81672730c000020",
                    name: "Farmers App"
                },
                {
                    _id: "55ded24cae2b22730b000040",
                    name: "FarmStatistic"
                },
                {
                    _id: "5629e238129820ab5994e8c0",
                    name: "Bus Project"
                },
                {
                    _id: "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id: "55de2a30f09cc2ec0b00004e",
                    name: "GovMap"
                },
                {
                    _id: "565740e0bfd103f108eb4ad4",
                    name: "HKConnect"
                },
                {
                    _id: "55f56442b81672730c000032",
                    name: "Tinder clone"
                },
                {
                    _id: "55f55a89b81672730c000017",
                    name: "Bimii"
                },
                {
                    _id: "55de24bbf09cc2ec0b000036",
                    name: "FosterFarms"
                },
                {
                    _id: "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id: "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ca",
                    name: "SketchTechPoints"
                },
                {
                    _id: "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id: "55b92ad621e4b7c40f000699",
                    name: "Tablet apps"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c9",
                    name: "spscontrol"
                },
                {
                    _id: "55b92ad621e4b7c40f000677",
                    name: "Android Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f00066a",
                    name: "The Watch Enthusiast"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c6",
                    name: "Demo Rocket"
                },
                {
                    _id: "55b92ad621e4b7c40f000687",
                    name: "iOS/Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f000664",
                    name: "BelgiumHTML"
                },
                {
                    _id: "55b92ad621e4b7c40f000689",
                    name: "iOS4"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a2",
                    name: "Android"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a6",
                    name: "Moriser"
                },
                {
                    _id: "55b92ad621e4b7c40f00067a",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000668",
                    name: "Selenium IDE"
                },
                {
                    _id: "55b92ad621e4b7c40f000688",
                    name: "iOS2"
                },
                {
                    _id: "55b92ad621e4b7c40f000681",
                    name: "AirPort"
                },
                {
                    _id: "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bf",
                    name: "Minder"
                },
                {
                    _id: "55b92ad621e4b7c40f000666",
                    name: "blow.com"
                },
                {
                    _id: "5605736c002c16436b000007",
                    name: "Stentle CSS"
                },
                {
                    _id: "55b92ad621e4b7c40f000696",
                    name: "Software Testing of Web Application"
                },
                {
                    _id: "55b92ad621e4b7c40f00066d",
                    name: "LiveCasinoAndroid"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b2",
                    name: "Player"
                },
                {
                    _id: "55de2cd2f09cc2ec0b000053",
                    name: "Dragon Daze"
                },
                {
                    _id: "55b92ad621e4b7c40f000693",
                    name: "WP Player"
                },
                {
                    _id: "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ad",
                    name: "KX keyboard"
                },
                {
                    _id: "55b92ad621e4b7c40f00066b",
                    name: "Nikky"
                },
                {
                    _id: "56a23c5caa157ca50f21fae1",
                    name: "Demolition Derby"
                },
                {
                    _id: "55b92ad621e4b7c40f00069c",
                    name: "sTrader"
                },
                {
                    _id: "55b92ad621e4b7c40f00068e",
                    name: "Phidget ANE"
                },
                {
                    _id: "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d1",
                    name: "Sales Tool"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c8",
                    name: "PriTriever"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a9",
                    name: "Spokal"
                },
                {
                    _id: "569f5bc662d172544baf0c40",
                    name: "Gilad Nevo Bug fixing"
                },
                {
                    _id: "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id: "55b92ad621e4b7c40f000670",
                    name: "iRemember"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ac",
                    name: "Manual front end testing for e commerce site"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c5",
                    name: "Liquivid"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f0006af",
                    name: "Academic Website testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000692",
                    name: "WishExpress"
                },
                {
                    _id: "56abd16ac6be8658550dc6c3",
                    name: "Baccarat"
                },
                {
                    _id: "55b92ad621e4b7c40f00065f",
                    name: "IOS/Android QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00068a",
                    name: "application regression testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d2",
                    name: "Snapped"
                },
                {
                    _id: "55b92ad621e4b7c40f000665",
                    name: "JellyGames"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a7",
                    name: "couch"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                },
                {
                    _id: "55b92ad621e4b7c40f000669",
                    name: "Airsoft site"
                },
                {
                    _id: "55b92ad621e4b7c40f000675",
                    name: "iOS6"
                },
                {
                    _id: "55b92ad621e4b7c40f00066c",
                    name: "DesignShargo"
                },
                {
                    _id: "55b92ad621e4b7c40f000691",
                    name: "Faceworks"
                },
                {
                    _id: "55b92ad621e4b7c40f000663",
                    name: "ajaxbrowser.com"
                },
                {
                    _id: "562bc32484deb7cb59d61b70",
                    name: "MyDrive"
                },
                {
                    _id: "55b92ad621e4b7c40f000674",
                    name: "Win7 app tester needed"
                },
                {
                    _id: "55b92ad621e4b7c40f00067c",
                    name: "iQshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ae",
                    name: "Kikast"
                },
                {
                    _id: "55b92ad621e4b7c40f00067b",
                    name: "Android Help"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d5",
                    name: "Unlimited Conferencing"
                },
                { },
                {
                    _id: "55b92ad621e4b7c40f00067e",
                    name: "SoulIntentions"
                },
                {
                    _id: "55b92ad621e4b7c40f000662",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a8",
                    name: "sitefix"
                },
                {
                    _id: "55cf5ea04a91e37b0b00012c",
                    name: "Global Workshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a4",
                    name: "iOS Periop"
                },
                {
                    _id: "55f55901b81672730c000011",
                    name: "WhachApp"
                },
                {
                    _id: "55b92ad621e4b7c40f00068c",
                    name: "DRH manual"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b0",
                    name: "Telecom"
                },
                {
                    _id: "55b92ad621e4b7c40f000673",
                    name: "Q/A digital QA"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c4",
                    name: "Ibizawire"
                },
                {
                    _id: "55b92ad621e4b7c40f00069d",
                    name: "iOS3"
                },
                {
                    _id: "55b92ad621e4b7c40f000660",
                    name: "iOS1"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b7",
                    name: "Design"
                },
                {
                    _id: "55b92ad621e4b7c40f000676",
                    name: "QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00067f",
                    name: "Player iOS/And"
                },
                {
                    _id: "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id: "55b92ad621e4b7c40f00069f",
                    name: "iOS5"
                },
                {
                    _id: "55b92ad621e4b7c40f000695",
                    name: "Consent APP"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cd",
                    name: "CloudFuze"
                },
                {
                    _id: "55b92ad621e4b7c40f00069e",
                    name: "Android1"
                },
                {
                    _id: "55b92ad621e4b7c40f000678",
                    name: "Appium testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006aa",
                    name: "DiveplanIT"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b4",
                    name: "Vroup"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d7",
                    name: "Mesa Ave"
                },
                {
                    _id: "55b92ad621e4b7c40f00068b",
                    name: "Unity3D"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a0",
                    name: "GetFit"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                },
                {
                    _id: "55b92ad621e4b7c40f00068f",
                    name: "QMR Android"
                },
                {
                    _id: "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id: "55b92ad621e4b7c40f000683",
                    name: "Bob"
                },
                {
                    _id: "55b92ad621e4b7c40f00067d",
                    name: "Sharalike"
                },
                {
                    _id: "55b92ad621e4b7c40f000667",
                    name: "PT2"
                },
                {
                    _id: "56b9e0268f23c5696159cd0d",
                    name: "test_Alexander"
                },
                {
                    _id: "566857caa3fc012a68f0d83a",
                    name: "SPS Mobile"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a5",
                    name: "Android"
                },
                {
                    _id: "55b92ad621e4b7c40f000690",
                    name: "Max"
                },
                {
                    _id: "55b92ad621e4b7c40f000680",
                    name: "CodeThreads"
                },
                {
                    _id: "55b92ad621e4b7c40f000682",
                    name: "Connexus"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c1",
                    name: "Ganchak Help"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ba",
                    name: "TocToc"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b3",
                    name: "Loyalty"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a3",
                    name: "iOS dev"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b1",
                    name: "Android Automation"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b5",
                    name: "KemblaJoggers"
                },
                {
                    _id: "56685d88a3fc012a68f0d854",
                    name: "Nicolas Burer Design"
                },
                {
                    _id: "563b95acab9698be7c9df727",
                    name: "LoginChineseTrue"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bc",
                    name: "Pseudo"
                },
                {
                    _id: "55b92ad621e4b7c40f000698",
                    name: "Staffd"
                },
                {
                    _id: "55b92ad621e4b7c40f00066f",
                    name: "Oculus Player"
                },
                {
                    _id: "55de1e8ef09cc2ec0b000031",
                    name: "BlueLight"
                },
                {
                    _id: "55b92ad621e4b7c40f000661",
                    name: "Android2"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ab",
                    name: "QMR iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f000672",
                    name: "DRH QA Automation"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                },
                {
                    _id: "55b92ad621e4b7c40f000697",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b9",
                    name: "Curb testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c0",
                    name: "TrumpT QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00066e",
                    name: "LCUpdate iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f000685",
                    name: "Travlr"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c3",
                    name: "Jude"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cb",
                    name: "Bayzat"
                }
            ],
            salesPerson: [
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                }
            ],
            supplier: [
                {
                    _id: "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                },
                {
                    _id: "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id: "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id: "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id: "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id: "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id: "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id: "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id: "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id: "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id: "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id: "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id: "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id: "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id: "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    _id: "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id: "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id: "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id: "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id: "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id: "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id: "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id: "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id: "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id: "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id: "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id: "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id: "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id: "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id: "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id: "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id: "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id: "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id: "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    _id: "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id: "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id: "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id: "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id: "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id: "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id: "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id: "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id: "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id: "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id: "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id: "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id: "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id: "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    name: null
                },
                {
                    _id: "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id: "55edaf167221afe30b000040",
                    name: "BetterIt "
                },
                {
                    _id: "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id: "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id: "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id: "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id: "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id: "55b92ad521e4b7c40f00061a",
                    name: "Ivcarto "
                },
                {
                    _id: "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id: "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id: "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id: "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id: "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id: "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id: "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id: "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker1 "
                },
                {
                    _id: "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id: "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id: "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id: "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id: "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id: "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id: "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id: "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id: "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id: "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id: "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id: "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id: "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id: "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id: "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id: "55f55854b81672730c000010",
                    name: "MediaHeads "
                },
                {
                    _id: "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id: "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id: "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id: "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id: "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id: "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id: "56bc9b72dfd8a81466e2f48c",
                    name: "Test Person"
                },
                {
                    _id: "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                },
                {
                    _id: "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id: "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id: "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id: "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id: "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id: "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                },
                {
                    _id: "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                }
            ]
        },
        salesProduct: {
            _id: null,
            name: [
                {
                    _id: "55c0e4a30343b37542000005",
                    name: "Bank expenses"
                },
                {
                    _id: "5540d528dacb551c24000003",
                    name: "IT services"
                }
            ],
            productType: [
                {
                    _id: "Service",
                    name: "Service"
                }
            ],
            canBeSold: [
                {
                    _id: "true",
                    name: "True"
                },
                {
                    _id: "false",
                    name: "False"
                }
            ],
            canBeExpensed: [
                {
                    _id: "true",
                    name: "True"
                },
                {
                    _id: "false",
                    name: "False"
                }
            ],
            canBePurchased: [
                {
                    _id: "true",
                    name: "True"
                },
                {
                    _id: "false",
                    name: "False"
                }
            ]
        },
        customerPayments: {
            _id: null,
            assigned: [
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    name: null
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                }
            ],
            supplier: [
                {
                    _id: "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                },
                {
                    _id: "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id: "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id: "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id: "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id: "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id: "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id: "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id: "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id: "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id: "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id: "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id: "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id: "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id: "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id: "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id: "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id: "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id: "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id: "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id: "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id: "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id: "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id: "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id: "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id: "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id: "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id: "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id: "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id: "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id: "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id: "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id: "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id: "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id: "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id: "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id: "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id: "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker1 "
                },
                {
                    _id: "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id: "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id: "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id: "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id: "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id: "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id: "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id: "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id: "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id: "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id: "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id: "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id: "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id: "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    _id: "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id: "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    name: null
                },
                {
                    _id: "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id: "55edaf167221afe30b000040",
                    name: "BetterIt "
                },
                {
                    _id: "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id: "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id: "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    _id: "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id: "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id: "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id: "56bc9b72dfd8a81466e2f48c",
                    name: "Test Person"
                },
                {
                    _id: "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id: "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id: "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id: "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id: "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id: "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id: "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id: "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id: "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id: "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id: "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id: "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id: "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id: "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id: "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id: "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id: "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id: "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id: "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id: "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id: "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id: "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id: "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id: "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id: "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id: "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                },
                {
                    _id: "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                },
                {
                    _id: "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id: "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                }
            ],
            name: [
                {
                    _id: "56bdc6ccdfd8a81466e2f57a",
                    name: "PP_235"
                },
                {
                    _id: "56bda818dfd8a81466e2f50a",
                    name: "PP_232"
                },
                {
                    _id: "56bda686dfd8a81466e2f4fc",
                    name: "PP_230"
                },
                {
                    _id: "56bda471dfd8a81466e2f4ed",
                    name: "PP_229"
                },
                {
                    _id: "56bda2f2dfd8a81466e2f4e5",
                    name: "PP_228"
                },
                {
                    _id: "56bda27edfd8a81466e2f4e0",
                    name: "PP_227"
                },
                {
                    _id: "56bc9ef3dfd8a81466e2f49b",
                    name: "PP_222"
                },
                {
                    _id: "56b9e82ffae0cea53a581833",
                    name: "PP_216"
                },
                {
                    _id: "56b9d040fae0cea53a581808",
                    name: "PP_211"
                },
                {
                    _id: "56b4c1a999ce8d706a81b2ee",
                    name: "PP_210"
                },
                {
                    _id: "56b4805499ce8d706a81b2dc",
                    name: "PP_209"
                },
                {
                    _id: "56afdc35f5c2bcd4555cb323",
                    name: "PP_208"
                },
                {
                    _id: "56af67e674d57e0d56d6bf39",
                    name: "PP_200"
                },
                {
                    _id: "56abcd2fc6be8658550dc6c1",
                    name: "PP_198"
                },
                {
                    _id: "56ab603f74d57e0d56d6bdb0",
                    name: "PP_193"
                },
                {
                    _id: "56ab4aa4b4dc0d09232bd80f",
                    name: "PP_189"
                },
                {
                    _id: "56b9ea3bfae0cea53a581843",
                    name: "PP_218"
                },
                {
                    _id: "56ab4950b4dc0d09232bd7f6",
                    name: "PP_187"
                },
                {
                    _id: "56ab486cb4dc0d09232bd7e1",
                    name: "PP_185"
                },
                {
                    _id: "56a9de92b4dc0d09232bd768",
                    name: "PP_184"
                },
                {
                    _id: "56a98730d59a04d6225b0df0",
                    name: "PP_179"
                },
                {
                    _id: "56a2107baa157ca50f21faca",
                    name: "PP_175"
                },
                {
                    _id: "56a144da2208b3af4a527276",
                    name: "PP_169"
                },
                {
                    _id: "56a0eb1862d172544baf1134",
                    name: "PP_166"
                },
                {
                    _id: "56a0c45b62d172544baf0e2a",
                    name: "PP_163"
                },
                {
                    _id: "56a0c38362d172544baf0e26",
                    name: "PP_162"
                },
                {
                    _id: "56a0be6462d172544baf0e13",
                    name: "PP_159"
                },
                {
                    _id: "569ca8c2cf1f31f925c026d3",
                    name: "PP_156"
                },
                {
                    _id: "568bb8777c0383e04c60e8a7",
                    name: "PP_153"
                },
                {
                    _id: "568bb4377c0383e04c60e880",
                    name: "PP_150"
                },
                {
                    _id: "566ebd4b8453e8b464b70ab0",
                    name: "PP_147"
                },
                {
                    _id: "566ebcf28453e8b464b70a8b",
                    name: "PP_146"
                },
                {
                    _id: "566e8f218453e8b464b70a1d",
                    name: "PP_144"
                },
                {
                    _id: "56b9e767fae0cea53a58182b",
                    name: "PP_215"
                },
                {
                    _id: "566e7da28453e8b464b70951",
                    name: "PP_142"
                },
                {
                    _id: "56688cf018ee5c115c2efa12",
                    name: "PP_137"
                },
                {
                    _id: "56688aa518ee5c115c2ef9f7",
                    name: "PP_136"
                },
                {
                    _id: "5668870518ee5c115c2ef9e3",
                    name: "PP_135"
                },
                {
                    _id: "56686126a3fc012a68f0d865",
                    name: "PP_134"
                },
                {
                    _id: "56685bf5a3fc012a68f0d846",
                    name: "PP_133"
                },
                {
                    _id: "56659cea6761dac537930def",
                    name: "PP_131"
                },
                {
                    _id: "566558279294f4d728bcc1f2",
                    name: "PP_130"
                },
                {
                    _id: "566547419294f4d728bcb1b9",
                    name: "PP_127"
                },
                {
                    _id: "5664d00208ed794128637d2c",
                    name: "PP_126"
                },
                {
                    _id: "5664c4b508ed794128637c9c",
                    name: "PP_124"
                },
                {
                    _id: "566430b208ed794128637c6f",
                    name: "PP_123"
                },
                {
                    _id: "56642edb08ed794128637c4a",
                    name: "PP_122"
                },
                {
                    _id: "568bb9cb7c0383e04c60e8b3",
                    name: "PP_154"
                },
                {
                    _id: "566401df08ed794128637b90",
                    name: "PP_118"
                },
                {
                    _id: "5662ef01f13e46fd145355bf",
                    name: "PP_116"
                },
                {
                    _id: "56a0b97c62d172544baf0df6",
                    name: "PP_158"
                },
                {
                    _id: "5662edb7f13e46fd1453554c",
                    name: "PP_113"
                },
                {
                    _id: "5662cef4f13e46fd1453511e",
                    name: "PP_111"
                },
                {
                    _id: "56ab4a6eb4dc0d09232bd806",
                    name: "PP_188"
                },
                {
                    _id: "5662ced2f13e46fd145350cf",
                    name: "PP_110"
                },
                {
                    _id: "5662c027f13e46fd14534e69",
                    name: "PP_105"
                },
                {
                    _id: "5662051a25e5eb511510bd36",
                    name: "PP_102"
                },
                {
                    _id: "5661fed825e5eb511510bc23",
                    name: "PP_100"
                },
                {
                    _id: "5661dd2725e5eb511510b961",
                    name: "PP_99"
                },
                {
                    _id: "5661c681f13e46fd14533ef8",
                    name: "PP_98"
                },
                {
                    _id: "5661c0f1f13e46fd14533b55",
                    name: "PP_96"
                },
                {
                    _id: "5661bdc6f67424071592a38b",
                    name: "PP_95"
                },
                {
                    _id: "5661b37310eb587a55af4e7d",
                    name: "PP_94"
                },
                {
                    _id: "5661af399c4b294469851d7d",
                    name: "PP_93"
                },
                {
                    _id: "5661a8f67d284423697e3546",
                    name: "PP_90"
                },
                {
                    _id: "56a0c71f62d172544baf0e37",
                    name: "PP_164"
                },
                {
                    _id: "56618c967d284423697e2d62",
                    name: "PP_89"
                },
                {
                    _id: "566185a87d284423697e2892",
                    name: "PP_87"
                },
                {
                    _id: "56618064da5c513f4f3b0a68",
                    name: "PP_85"
                },
                {
                    _id: "566065de7f54fd332616873a",
                    name: "PP_82"
                },
                {
                    _id: "5660654d7f54fd33261686b5",
                    name: "PP_81"
                },
                {
                    _id: "566182b1bb8be7814fb527b1",
                    name: "PP_86"
                },
                {
                    _id: "56605a2821ac545f176a60ba",
                    name: "PP_77"
                },
                {
                    _id: "56602683ccc590f32c574a67",
                    name: "PP_76"
                },
                {
                    _id: "5660235b4afaaced62c6773d",
                    name: "PP_75"
                },
                {
                    _id: "566015af6226e3c43108e183",
                    name: "PP_73"
                },
                {
                    _id: "5660111e6226e3c43108dd34",
                    name: "PP_71"
                },
                {
                    _id: "565f58bd2545b4541495e179",
                    name: "PP_70"
                },
                {
                    _id: "56641df308ed794128637be1",
                    name: "PP_120"
                },
                {
                    _id: "565f58aa2ceb020214aa1a85",
                    name: "PP_69"
                },
                {
                    _id: "5662131625e5eb511510be57",
                    name: "PP_103"
                },
                {
                    _id: "565f47762ceb020214aa017f",
                    name: "PP_66"
                },
                {
                    _id: "565c60b13410ae512364dbee",
                    name: "PP_64"
                },
                {
                    _id: "565c5ec43410ae512364dbb6",
                    name: "PP_61"
                },
                {
                    _id: "56a9d592b4dc0d09232bd745",
                    name: "PP_181"
                },
                {
                    _id: "565c5cda3410ae512364db84",
                    name: "PP_60"
                },
                {
                    _id: "565c5c3c3410ae512364db73",
                    name: "PP_59"
                },
                {
                    _id: "565c3e31f4dcd63b5dbd739e",
                    name: "PP_58"
                },
                {
                    _id: "56bdaa13dfd8a81466e2f512",
                    name: "PP_233"
                },
                {
                    _id: "565bfc7c02a32204297a22b6",
                    name: "PP_57"
                },
                {
                    _id: "565b0c4db4c12a54076f7af4",
                    name: "PP_49"
                },
                {
                    _id: "56587fc3bfd103f108eb4c6f",
                    name: "56587962bfd103f108eb4c4d_45"
                },
                {
                    _id: "55b92ae321e4b7c40f001448",
                    name: "3244_2701"
                },
                {
                    _id: "55b92ae321e4b7c40f00143c",
                    name: "3238_2689"
                },
                {
                    _id: "55b92ae321e4b7c40f00143b",
                    name: "3234_2688"
                },
                {
                    _id: "55b92ae321e4b7c40f001437",
                    name: "2220_2684"
                },
                {
                    _id: "56a9d6b9b4dc0d09232bd752",
                    name: "PP_182"
                },
                {
                    _id: "55b92ae321e4b7c40f001433",
                    name: "2231_2680"
                },
                {
                    _id: "55b92ae321e4b7c40f0013bb",
                    name: "31_2560"
                },
                {
                    _id: "565f51952ceb020214aa0fa6",
                    name: "PP_67"
                },
                {
                    _id: "55b92ae321e4b7c40f00142d",
                    name: "1191_2674"
                },
                {
                    _id: "55b92ae321e4b7c40f00143e",
                    name: "2221_2691"
                },
                {
                    _id: "56641ebb08ed794128637c06",
                    name: "PP_121"
                },
                {
                    _id: "55b92ae221e4b7c40f00139f",
                    name: "49_2532"
                },
                {
                    _id: "55b92ae321e4b7c40f001427",
                    name: "1195_2668"
                },
                {
                    _id: "55b92ae321e4b7c40f001425",
                    name: "1188_2666"
                },
                {
                    _id: "55b92ae321e4b7c40f001424",
                    name: "1194_2665"
                },
                {
                    _id: "55b92ae421e4b7c40f001485",
                    name: "3274_2762"
                },
                {
                    _id: "5662c0a7f13e46fd14534ed1",
                    name: "PP_107"
                },
                {
                    _id: "564993b970bbc2b740ce8a31",
                    name: "_16"
                },
                {
                    _id: "55b92ae321e4b7c40f001440",
                    name: "2227_2693"
                },
                {
                    _id: "55b92ae321e4b7c40f001422",
                    name: "2214_2663"
                },
                {
                    _id: "55b92ae321e4b7c40f001421",
                    name: "1168_2662"
                },
                {
                    _id: "55ffabf0a36a8ca10c00000c",
                    name: "_2900"
                },
                {
                    _id: "55b92ae321e4b7c40f00141e",
                    name: "1181_2659"
                },
                {
                    _id: "55b92ae321e4b7c40f00141c",
                    name: "1162_2657"
                },
                {
                    _id: "55b92ae321e4b7c40f001419",
                    name: "1176_2654"
                },
                {
                    _id: "55b92ae321e4b7c40f00146a",
                    name: "4304_2735"
                },
                {
                    _id: "55b92ae321e4b7c40f001418",
                    name: "1166_2653"
                },
                {
                    _id: "55b92ae321e4b7c40f001416",
                    name: "1154_2651"
                },
                {
                    _id: "55b92ae321e4b7c40f0013cf",
                    name: "70_2580"
                },
                {
                    _id: "55ffa9fda36a8ca10c000006",
                    name: "_2898"
                },
                {
                    _id: "55b92ae321e4b7c40f001451",
                    name: "3264_2710"
                },
                {
                    _id: "55b92ae321e4b7c40f001414",
                    name: "2216_2649"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a2",
                    name: "41_2535"
                },
                {
                    _id: "55b92ae321e4b7c40f00142f",
                    name: "1183_2676"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f9",
                    name: "1186_2622"
                },
                {
                    _id: "55b92ae321e4b7c40f0013bd",
                    name: "1128_2562"
                },
                {
                    _id: "55b92ae421e4b7c40f0014c2",
                    name: "5379_2823"
                },
                {
                    _id: "55b92ae321e4b7c40f001413",
                    name: "2224_2648"
                },
                {
                    _id: "55b92ae321e4b7c40f001411",
                    name: "1149_2646"
                },
                {
                    _id: "55b92ae421e4b7c40f0014a2",
                    name: "4329_2791"
                },
                {
                    _id: "55b92ae321e4b7c40f001449",
                    name: "3268_2702"
                },
                {
                    _id: "55b92ae321e4b7c40f00146b",
                    name: "4286_2736"
                },
                {
                    _id: "565860d7bfd103f108eb4b80",
                    name: "565730cebfd103f108eb4a74_35"
                },
                {
                    _id: "55b92ae321e4b7c40f00142b",
                    name: "1192_2672"
                },
                {
                    _id: "55b92ae221e4b7c40f00137f",
                    name: "69_2500"
                },
                {
                    _id: "55b92ae321e4b7c40f00140f",
                    name: "1165_2644"
                },
                {
                    _id: "55b92ae321e4b7c40f00140e",
                    name: "1170_2643"
                },
                {
                    _id: "56b9eadffae0cea53a581853",
                    name: "PP_220"
                },
                {
                    _id: "55b92ae321e4b7c40f00140c",
                    name: "1199_2641"
                },
                {
                    _id: "56621588f67424071592a654",
                    name: "PP_104"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c5",
                    name: "48_2570"
                },
                {
                    _id: "55b92ae221e4b7c40f001399",
                    name: "33_2526"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c3",
                    name: "36_2568"
                },
                {
                    _id: "55b92ae321e4b7c40f001410",
                    name: "1160_2645"
                },
                {
                    _id: "55b92ae321e4b7c40f00140d",
                    name: "1196_2642"
                },
                {
                    _id: "55b92ae421e4b7c40f0014a8",
                    name: "4347_2797"
                },
                {
                    _id: "56a24180aa157ca50f21fb0d",
                    name: "PP_178"
                },
                {
                    _id: "55b92ae321e4b7c40f001406",
                    name: "2182_2635"
                },
                {
                    _id: "55b92ae321e4b7c40f001403",
                    name: "2205_2632"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c2",
                    name: "10_2567"
                },
                {
                    _id: "56617e60bb8be7814fb524ad",
                    name: "PP_84"
                },
                {
                    _id: "55b92ae321e4b7c40f001401",
                    name: "2211_2630"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a9",
                    name: "1078_2542"
                },
                {
                    _id: "55b92ae321e4b7c40f0013da",
                    name: "24_2591"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d3",
                    name: "1082_2584"
                },
                {
                    _id: "55d467f787be25fe0b000008",
                    name: "_2880"
                },
                {
                    _id: "55b92ae321e4b7c40f001442",
                    name: "2217_2695"
                },
                {
                    _id: "55b92ae321e4b7c40f001468",
                    name: "4313_2733"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b6",
                    name: "4354_2811"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ff",
                    name: "1158_2628"
                },
                {
                    _id: "55b92ae321e4b7c40f0013fd",
                    name: "1161_2626"
                },
                {
                    _id: "55b92ae321e4b7c40f001430",
                    name: "1184_2677"
                },
                {
                    _id: "55b92ae321e4b7c40f0013fc",
                    name: "1178_2625"
                },
                {
                    _id: "5664cbbe08ed794128637cef",
                    name: "PP_125"
                },
                {
                    _id: "55b92ae321e4b7c40f0013fa",
                    name: "2204_2623"
                },
                {
                    _id: "55b92ae421e4b7c40f001478",
                    name: "4291_2749"
                },
                {
                    _id: "55b92ae321e4b7c40f001445",
                    name: "3243_2698"
                },
                {
                    _id: "55b92ae221e4b7c40f001386",
                    name: "34_2507"
                },
                {
                    _id: "56af698a74d57e0d56d6bf4c",
                    name: "PP_202"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f8",
                    name: "1189_2621"
                },
                {
                    _id: "55b92ae321e4b7c40f0013fb",
                    name: "3242_2624"
                },
                {
                    _id: "55e4155b4983acdd0b00000f",
                    name: "_2884"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f6",
                    name: "1185_2619"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f4",
                    name: "1201_2617"
                },
                {
                    _id: "55b92ae321e4b7c40f00146e",
                    name: "4314_2739"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f3",
                    name: "1200_2616"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f1",
                    name: "1203_2614"
                },
                {
                    _id: "55b92ae321e4b7c40f00144f",
                    name: "3269_2708"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ef",
                    name: "2184_2612"
                },
                {
                    _id: "566c18c2a74aaf316eaea825",
                    name: "PP_140"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ed",
                    name: "2219_2610"
                },
                {
                    _id: "55b92ae421e4b7c40f00149c",
                    name: "4326_2785"
                },
                {
                    _id: "56a1030662d172544baf113e",
                    name: "PP_167"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c7",
                    name: "1085_2572"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c6",
                    name: "14_2571"
                },
                {
                    _id: "55b92ae321e4b7c40f0013dc",
                    name: "50_2593"
                },
                {
                    _id: "569ca75fcf1f31f925c026c6",
                    name: "PP_155"
                },
                {
                    _id: "55b92ae321e4b7c40f0013eb",
                    name: "1164_2608"
                },
                {
                    _id: "56a15d962208b3af4a52728d",
                    name: "PP_171"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b3",
                    name: "4359_2808"
                },
                {
                    _id: "55f7d2266d43203d0c00000a",
                    name: "_2896"
                },
                {
                    _id: "55b92ae321e4b7c40f001432",
                    name: "2218_2679"
                },
                {
                    _id: "56abcb46c6be8658550dc6af",
                    name: "PP_195"
                },
                {
                    _id: "55b92ae421e4b7c40f0014ae",
                    name: "4351_2803"
                },
                {
                    _id: "55b92ae421e4b7c40f001497",
                    name: "4324_2780"
                },
                {
                    _id: "55b92ae321e4b7c40f001474",
                    name: "4298_2745"
                },
                {
                    _id: "55b92ae321e4b7c40f00140a",
                    name: "1150_2639"
                },
                {
                    _id: "55eebbf26dceaee10b00001a",
                    name: "_2890"
                },
                {
                    _id: "55b92ae421e4b7c40f0014c5",
                    name: "5372_2826"
                },
                {
                    _id: "55b92ae321e4b7c40f0013df",
                    name: "42_2596"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ac",
                    name: "47_2545"
                },
                {
                    _id: "55b92ae321e4b7c40f001436",
                    name: "2233_2683"
                },
                {
                    _id: "56030cd7650aa84d4e00000c",
                    name: "_2911"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ab",
                    name: "21_2544"
                },
                {
                    _id: "55b92ae321e4b7c40f00141a",
                    name: "1190_2655"
                },
                {
                    _id: "561e03f1b51032d674856adf",
                    name: "_2951"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ae",
                    name: "1115_2547"
                },
                {
                    _id: "55b92ae421e4b7c40f0014a9",
                    name: "4340_2798"
                },
                {
                    _id: "56a0eaea62d172544baf1130",
                    name: "PP_165"
                },
                {
                    _id: "56032129cfe9dd624e000010",
                    name: "_2917"
                },
                {
                    _id: "55b92ae321e4b7c40f001402",
                    name: "2212_2631"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ea",
                    name: "1156_2607"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e7",
                    name: "1141_2604"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b1",
                    name: "38_2550"
                },
                {
                    _id: "56bdc7a2dfd8a81466e2f586",
                    name: "PP_236"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a8",
                    name: "32_2541"
                },
                {
                    _id: "55d2dde7873108750b000009",
                    name: "_2873"
                },
                {
                    _id: "55b92ae321e4b7c40f001431",
                    name: "2228_2678"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f2",
                    name: "1204_2615"
                },
                {
                    _id: "5658638fbfd103f108eb4bdd",
                    name: "56573260bfd103f108eb4a83_39"
                },
                {
                    _id: "55b92ae321e4b7c40f001435",
                    name: "3237_2682"
                },
                {
                    _id: "55b92ae221e4b7c40f00139a",
                    name: "73_2527"
                },
                {
                    _id: "55b92ae321e4b7c40f001462",
                    name: "3256_2727"
                },
                {
                    _id: "55d2e208873108750b000010",
                    name: "_2876"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a7",
                    name: "6_2540"
                },
                {
                    _id: "56a1474c2208b3af4a527282",
                    name: "PP_170"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ad",
                    name: "72_2546"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d9",
                    name: "77_2590"
                },
                {
                    _id: "565c5f0f3410ae512364dbc1",
                    name: "PP_62"
                },
                {
                    _id: "55b92ae221e4b7c40f001397",
                    name: "1130_2524"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b9",
                    name: "1100_2558"
                },
                {
                    _id: "56a21a52aa157ca50f21fade",
                    name: "PP_177"
                },
                {
                    _id: "56a0b76a62d172544baf0df1",
                    name: "PP_157"
                },
                {
                    _id: "5661c3595c6e70021566ef47",
                    name: "PP_97"
                },
                {
                    _id: "565862cfbfd103f108eb4bbc",
                    name: "null_38"
                },
                {
                    _id: "55b92ae321e4b7c40f001446",
                    name: "3245_2699"
                },
                {
                    _id: "55b92ae321e4b7c40f001439",
                    name: "2215_2686"
                },
                {
                    _id: "55b92ae221e4b7c40f001396",
                    name: "1080_2523"
                },
                {
                    _id: "55b92ae421e4b7c40f00147a",
                    name: "4320_2751"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ee",
                    name: "1152_2611"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b3",
                    name: "78_2552"
                },
                {
                    _id: "56af695174d57e0d56d6bf48",
                    name: "PP_201"
                },
                {
                    _id: "55b92ae421e4b7c40f00147e",
                    name: "4331_2755"
                },
                {
                    _id: "55b92ae221e4b7c40f001394",
                    name: "7_2521"
                },
                {
                    _id: "55b92ae421e4b7c40f001483",
                    name: "4336_2760"
                },
                {
                    _id: "56bd9fc4dfd8a81466e2f4c4",
                    name: "PP_224"
                },
                {
                    _id: "56574273bfd103f108eb4ae0",
                    name: "565741d9bfd103f108eb4ad7_32"
                },
                {
                    _id: "55b92ae221e4b7c40f001395",
                    name: "43_2522"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d0",
                    name: "1110_2581"
                },
                {
                    _id: "55b92ae321e4b7c40f00142e",
                    name: "1187_2675"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ce",
                    name: "30_2579"
                },
                {
                    _id: "55b92ae421e4b7c40f0014af",
                    name: "4348_2804"
                },
                {
                    _id: "5602f182cfe9dd624e000006",
                    name: "_2904"
                },
                {
                    _id: "55b92ae221e4b7c40f0013a0",
                    name: "15_2533"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a6",
                    name: "1101_2539"
                },
                {
                    _id: "55b92ae221e4b7c40f00138c",
                    name: "1135_2513"
                },
                {
                    _id: "55b92ae221e4b7c40f00139b",
                    name: "1116_2528"
                },
                {
                    _id: "565f47102ceb020214aa003d",
                    name: "PP_65"
                },
                {
                    _id: "55b92ae321e4b7c40f001447",
                    name: "3246_2700"
                },
                {
                    _id: "55b92ae221e4b7c40f00139d",
                    name: "23_2530"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e3",
                    name: "1140_2600"
                },
                {
                    _id: "55b92ae321e4b7c40f001415",
                    name: "1171_2650"
                },
                {
                    _id: "563720d2c928c61d052d5004",
                    name: "_7"
                },
                {
                    _id: "56afdc25f5c2bcd4555cb31c",
                    name: "PP_207"
                },
                {
                    _id: "55b92ae321e4b7c40f0013cb",
                    name: "27_2576"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c0",
                    name: "1083_2565"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a4",
                    name: "1077_2537"
                },
                {
                    _id: "55b92ae221e4b7c40f001383",
                    name: "1081_2504"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d2",
                    name: "45_2583"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c4",
                    name: "76_2569"
                },
                {
                    _id: "566adc41a74aaf316eaea6d7",
                    name: "PP_139"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d6",
                    name: "35_2587"
                },
                {
                    _id: "55b92ae321e4b7c40f0013be",
                    name: "20_2563"
                },
                {
                    _id: "55b92ae221e4b7c40f00137e",
                    name: "29_2499"
                },
                {
                    _id: "55b92ae221e4b7c40f001387",
                    name: "74_2508"
                },
                {
                    _id: "55b92ae321e4b7c40f00143f",
                    name: "3240_2692"
                },
                {
                    _id: "55b92ae221e4b7c40f001388",
                    name: "1118_2509"
                },
                {
                    _id: "56ab4d386d7173f43f96ad30",
                    name: "PP_191"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a5",
                    name: "53_2538"
                },
                {
                    _id: "55b92ae221e4b7c40f001389",
                    name: "13_2510"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ca",
                    name: "1076_2575"
                },
                {
                    _id: "55b92ae221e4b7c40f001391",
                    name: "28_2518"
                },
                {
                    _id: "56654cd99294f4d728bcb433",
                    name: "PP_128"
                },
                {
                    _id: "55b92ae421e4b7c40f00149b",
                    name: "4335_2784"
                },
                {
                    _id: "560320ada5ac49794e000016",
                    name: "_2916"
                },
                {
                    _id: "55b92ae321e4b7c40f001429",
                    name: "2206_2670"
                },
                {
                    _id: "55b92ae221e4b7c40f00138d",
                    name: "79_2514"
                },
                {
                    _id: "55b92ae321e4b7c40f00141f",
                    name: "1172_2660"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c1",
                    name: "1113_2566"
                },
                {
                    _id: "56a1437d2208b3af4a527272",
                    name: "PP_168"
                },
                {
                    _id: "55b92ae321e4b7c40f001408",
                    name: "2213_2637"
                },
                {
                    _id: "55b92ae221e4b7c40f001392",
                    name: "68_2519"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b5",
                    name: "1124_2554"
                },
                {
                    _id: "55b92ae221e4b7c40f00137d",
                    name: "2_2498"
                },
                {
                    _id: "5662ceb0f13e46fd145350a7",
                    name: "PP_109"
                },
                {
                    _id: "55b92ae221e4b7c40f00138e",
                    name: "26_2515"
                },
                {
                    _id: "55b92ae421e4b7c40f001488",
                    name: "4315_2765"
                },
                {
                    _id: "55b92ae421e4b7c40f0014c4",
                    name: "5368_2825"
                },
                {
                    _id: "55b92ae321e4b7c40f001444",
                    name: "3239_2697"
                },
                {
                    _id: "5609050fd06b1b7533000007",
                    name: "_2925"
                },
                {
                    _id: "55b92ae321e4b7c40f001423",
                    name: "3241_2664"
                },
                {
                    _id: "55b92ae221e4b7c40f001385",
                    name: "8_2506"
                },
                {
                    _id: "55b92ae321e4b7c40f001464",
                    name: "3273_2729"
                },
                {
                    _id: "55d1b9b88f61e2c90b000026",
                    name: "null_2871"
                },
                {
                    _id: "55f69d963645b3020c00001f",
                    name: "_2893"
                },
                {
                    _id: "56bda741dfd8a81466e2f506",
                    name: "PP_231"
                },
                {
                    _id: "55b92ae221e4b7c40f001381",
                    name: "18_2502"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b0",
                    name: "37_2549"
                },
                {
                    _id: "55b92ae321e4b7c40f001412",
                    name: "1155_2647"
                },
                {
                    _id: "55b92ae221e4b7c40f00138f",
                    name: "1125_2516"
                },
                {
                    _id: "56a2150baa157ca50f21fad5",
                    name: "PP_176"
                },
                {
                    _id: "55b92ae421e4b7c40f0014ab",
                    name: "4349_2800"
                },
                {
                    _id: "5662ce92f13e46fd14535058",
                    name: "PP_108"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e2",
                    name: "1147_2599"
                },
                {
                    _id: "55b92ae221e4b7c40f001390",
                    name: "52_2517"
                },
                {
                    _id: "56abcab3c6be8658550dc6a7",
                    name: "PP_194"
                },
                {
                    _id: "55b92ae221e4b7c40f001380",
                    name: "1104_2501"
                },
                {
                    _id: "56032a94a5ac49794e000018",
                    name: "_2921"
                },
                {
                    _id: "55b92ae321e4b7c40f0013af",
                    name: "11_2548"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b8",
                    name: "4367_2813"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b2",
                    name: "1133_2551"
                },
                {
                    _id: "55b92ae321e4b7c40f001441",
                    name: "2230_2694"
                },
                {
                    _id: "56654ddd9294f4d728bcb529",
                    name: "PP_129"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b4",
                    name: "25_2553"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b7",
                    name: "17_2556"
                },
                {
                    _id: "55b92ae321e4b7c40f00141d",
                    name: "1180_2658"
                },
                {
                    _id: "56b9e866fae0cea53a58183b",
                    name: "PP_217"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f0",
                    name: "2234_2613"
                },
                {
                    _id: "56b9d09bfae0cea53a581812",
                    name: "PP_212"
                },
                {
                    _id: "55b92ae321e4b7c40f0013fe",
                    name: "1151_2627"
                },
                {
                    _id: "561b67759ebb48212ea838b6",
                    name: "_2944"
                },
                {
                    _id: "55b92ae221e4b7c40f00138b",
                    name: "39_2512"
                },
                {
                    _id: "56617c43bb8be7814fb52465",
                    name: "PP_83"
                },
                {
                    _id: "55b92ae221e4b7c40f00139e",
                    name: "1120_2531"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b4",
                    name: "4352_2809"
                },
                {
                    _id: "55b92ae321e4b7c40f001420",
                    name: "1167_2661"
                },
                {
                    _id: "55b92ae421e4b7c40f001480",
                    name: "4282_2757"
                },
                {
                    _id: "5603028cfa3f91444e000009",
                    name: "_2907"
                },
                {
                    _id: "55b92ae221e4b7c40f001382",
                    name: "44_2503"
                },
                {
                    _id: "55b92ae321e4b7c40f0013bc",
                    name: "71_2561"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b0",
                    name: "4358_2805"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a1",
                    name: "1086_2534"
                },
                {
                    _id: "55e41e954983acdd0b00001a",
                    name: "_2887"
                },
                {
                    _id: "5602fd55650aa84d4e000008",
                    name: "_2906"
                },
                {
                    _id: "55b92ae421e4b7c40f00148a",
                    name: "4339_2767"
                },
                {
                    _id: "5662d772f13e46fd1453519d",
                    name: "PP_112"
                },
                {
                    _id: "55b92ae321e4b7c40f001417",
                    name: "1177_2652"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d1",
                    name: "19_2582"
                },
                {
                    _id: "55b92ae321e4b7c40f00141b",
                    name: "1153_2656"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d4",
                    name: "1132_2585"
                },
                {
                    _id: "55b92ae421e4b7c40f00147b",
                    name: "4299_2752"
                },
                {
                    _id: "56031d7bfa3f91444e000013",
                    name: "_2915"
                },
                {
                    _id: "55b92ae321e4b7c40f0013dd",
                    name: "16_2594"
                },
                {
                    _id: "55b92ae321e4b7c40f001443",
                    name: "2226_2696"
                },
                {
                    _id: "55b92ae321e4b7c40f001471",
                    name: "3275_2742"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d5",
                    name: "9_2586"
                },
                {
                    _id: "55b92ae221e4b7c40f001398",
                    name: "22_2525"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d7",
                    name: "75_2588"
                },
                {
                    _id: "55b92ae421e4b7c40f001484",
                    name: "4325_2761"
                },
                {
                    _id: "5662c056f13e46fd14534e95",
                    name: "PP_106"
                },
                {
                    _id: "55b92ae321e4b7c40f0013d8",
                    name: "1119_2589"
                },
                {
                    _id: "55b92ae321e4b7c40f00144a",
                    name: "3257_2703"
                },
                {
                    _id: "55b92ae321e4b7c40f001455",
                    name: "3248_2714"
                },
                {
                    _id: "55b92ae321e4b7c40f001457",
                    name: "3251_2716"
                },
                {
                    _id: "55b92ae321e4b7c40f00145d",
                    name: "4278_2722"
                },
                {
                    _id: "55b92ae321e4b7c40f00143a",
                    name: "2229_2687"
                },
                {
                    _id: "561b67e99ebb48212ea838bc",
                    name: "_2947"
                },
                {
                    _id: "55b92ae321e4b7c40f001407",
                    name: "2181_2636"
                },
                {
                    _id: "55b92ae321e4b7c40f001454",
                    name: "3250_2713"
                },
                {
                    _id: "55b92ae421e4b7c40f0014cd",
                    name: "5369_2834"
                },
                {
                    _id: "55b92ae321e4b7c40f00144d",
                    name: "3247_2706"
                },
                {
                    _id: "55b92ae321e4b7c40f00144e",
                    name: "3258_2707"
                },
                {
                    _id: "55b92ae421e4b7c40f00149e",
                    name: "4341_2787"
                },
                {
                    _id: "55b92ae321e4b7c40f0013bf",
                    name: "46_2564"
                },
                {
                    _id: "55b92ae321e4b7c40f001452",
                    name: "3259_2711"
                },
                {
                    _id: "568bb8497c0383e04c60e8a0",
                    name: "PP_152"
                },
                {
                    _id: "55b92ae321e4b7c40f001438",
                    name: "2222_2685"
                },
                {
                    _id: "55b92ae321e4b7c40f001453",
                    name: "3262_2712"
                },
                {
                    _id: "55b92ae321e4b7c40f001456",
                    name: "3254_2715"
                },
                {
                    _id: "55b92ae321e4b7c40f001458",
                    name: "3263_2717"
                },
                {
                    _id: "55b92ae321e4b7c40f001459",
                    name: "3255_2718"
                },
                {
                    _id: "55b92ae221e4b7c40f00138a",
                    name: "1084_2511"
                },
                {
                    _id: "55b92ae321e4b7c40f00145c",
                    name: "4296_2721"
                },
                {
                    _id: "55b92ae321e4b7c40f0013cc",
                    name: "1126_2577"
                },
                {
                    _id: "55b92ae421e4b7c40f001481",
                    name: "4308_2758"
                },
                {
                    _id: "55b92ae421e4b7c40f0014a5",
                    name: "4317_2794"
                },
                {
                    _id: "55b92ae321e4b7c40f00145e",
                    name: "4295_2723"
                },
                {
                    _id: "55b92ae321e4b7c40f001463",
                    name: "3249_2728"
                },
                {
                    _id: "55b92ae421e4b7c40f001477",
                    name: "4294_2748"
                },
                {
                    _id: "55b92ae321e4b7c40f001428",
                    name: "1202_2669"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b6",
                    name: "51_2555"
                },
                {
                    _id: "55b92ae321e4b7c40f001460",
                    name: "4285_2725"
                },
                {
                    _id: "566187ca7d284423697e2bd9",
                    name: "PP_88"
                },
                {
                    _id: "55b92ae421e4b7c40f001492",
                    name: "4297_2775"
                },
                {
                    _id: "55b92ae321e4b7c40f001461",
                    name: "3267_2726"
                },
                {
                    _id: "56b9ede0fae0cea53a581863",
                    name: "PP_221"
                },
                {
                    _id: "55b92ae321e4b7c40f001465",
                    name: "3266_2730"
                },
                {
                    _id: "5664027608ed794128637ba4",
                    name: "PP_119"
                },
                {
                    _id: "55b92ae321e4b7c40f001466",
                    name: "3276_2731"
                },
                {
                    _id: "55b92ae321e4b7c40f001467",
                    name: "4305_2732"
                },
                {
                    _id: "55b92ae321e4b7c40f001469",
                    name: "4279_2734"
                },
                {
                    _id: "56b9e72bfae0cea53a581823",
                    name: "PP_214"
                },
                {
                    _id: "55b92ae321e4b7c40f00146f",
                    name: "4280_2740"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f5",
                    name: "1197_2618"
                },
                {
                    _id: "55b92ae321e4b7c40f001470",
                    name: "4310_2741"
                },
                {
                    _id: "55b92ae321e4b7c40f0013f7",
                    name: "1179_2620"
                },
                {
                    _id: "55b92ae321e4b7c40f001473",
                    name: "4287_2744"
                },
                {
                    _id: "55b92ae321e4b7c40f001434",
                    name: "2223_2681"
                },
                {
                    _id: "55b92ae321e4b7c40f001475",
                    name: "4301_2746"
                },
                {
                    _id: "55b92ae321e4b7c40f00144b",
                    name: "3261_2704"
                },
                {
                    _id: "55b92ae421e4b7c40f001476",
                    name: "4311_2747"
                },
                {
                    _id: "5661a9737d284423697e35d2",
                    name: "PP_91"
                },
                {
                    _id: "55b92ae421e4b7c40f001479",
                    name: "4318_2750"
                },
                {
                    _id: "55b92ae421e4b7c40f00147c",
                    name: "4283_2753"
                },
                {
                    _id: "55b92ae321e4b7c40f0013db",
                    name: "1122_2592"
                },
                {
                    _id: "5609058b86e2435a33000007",
                    name: "_2926"
                },
                {
                    _id: "55b92ae421e4b7c40f00147d",
                    name: "4309_2754"
                },
                {
                    _id: "55b92ae221e4b7c40f001393",
                    name: "1103_2520"
                },
                {
                    _id: "55b92ae421e4b7c40f001482",
                    name: "4303_2759"
                },
                {
                    _id: "566c30d48453e8b464b708a1",
                    name: "PP_141"
                },
                {
                    _id: "55b92ae421e4b7c40f001486",
                    name: "4293_2763"
                },
                {
                    _id: "55eebe676dceaee10b00001c",
                    name: "_2891"
                },
                {
                    _id: "55b92ae421e4b7c40f001487",
                    name: "4289_2764"
                },
                {
                    _id: "56bdabd2dfd8a81466e2f51c",
                    name: "PP_234"
                },
                {
                    _id: "55b92ae421e4b7c40f00148b",
                    name: "4300_2768"
                },
                {
                    _id: "55b92ae421e4b7c40f00148c",
                    name: "4277_2769"
                },
                {
                    _id: "55b92ae321e4b7c40f0013de",
                    name: "1087_2595"
                },
                {
                    _id: "55b92ae421e4b7c40f00148e",
                    name: "4292_2771"
                },
                {
                    _id: "56a1fcb562d172544baf114b",
                    name: "PP_172"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e6",
                    name: "1144_2603"
                },
                {
                    _id: "55b92ae421e4b7c40f00148f",
                    name: "4284_2772"
                },
                {
                    _id: "55b92ae421e4b7c40f001491",
                    name: "4312_2774"
                },
                {
                    _id: "55b92ae421e4b7c40f001494",
                    name: "4322_2777"
                },
                {
                    _id: "55b92ae421e4b7c40f00149d",
                    name: "4337_2786"
                },
                {
                    _id: "55b92ae321e4b7c40f001472",
                    name: "4302_2743"
                },
                {
                    _id: "55b92ae421e4b7c40f001495",
                    name: "4323_2778"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e1",
                    name: "1143_2598"
                },
                {
                    _id: "56372174c928c61d052d5005",
                    name: "_9"
                },
                {
                    _id: "55b92ae421e4b7c40f001496",
                    name: "4319_2779"
                },
                {
                    _id: "55b92ae421e4b7c40f001499",
                    name: "4344_2782"
                },
                {
                    _id: "55b92ae421e4b7c40f00149f",
                    name: "4316_2788"
                },
                {
                    _id: "55b92ae321e4b7c40f001404",
                    name: "3235_2633"
                },
                {
                    _id: "56586432bfd103f108eb4bf1",
                    name: "56586414bfd103f108eb4bee_40"
                },
                {
                    _id: "5602fc75fa3f91444e000008",
                    name: "_2905"
                },
                {
                    _id: "55b92ae321e4b7c40f0013ba",
                    name: "5_2559"
                },
                {
                    _id: "55b92ae421e4b7c40f0014a1",
                    name: "4345_2790"
                },
                {
                    _id: "55b92ae321e4b7c40f00145f",
                    name: "4307_2724"
                },
                {
                    _id: "55d2dfba873108750b00000b",
                    name: "_2874"
                },
                {
                    _id: "55b92ae421e4b7c40f0014a4",
                    name: "4342_2793"
                },
                {
                    _id: "55b92ae321e4b7c40f00146d",
                    name: "4306_2738"
                },
                {
                    _id: "55b92ae421e4b7c40f0014a7",
                    name: "4346_2796"
                },
                {
                    _id: "55b92ae421e4b7c40f0014aa",
                    name: "4360_2799"
                },
                {
                    _id: "55b92ae221e4b7c40f00139c",
                    name: "12_2529"
                },
                {
                    _id: "55b92ae421e4b7c40f0014ac",
                    name: "4353_2801"
                },
                {
                    _id: "55b92ae421e4b7c40f0014ad",
                    name: "4356_2802"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b1",
                    name: "4355_2806"
                },
                {
                    _id: "55b92ae421e4b7c40f001489",
                    name: "4338_2766"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b2",
                    name: "4357_2807"
                },
                {
                    _id: "56032471cfe9dd624e000011",
                    name: "_2918"
                },
                {
                    _id: "55b92ae421e4b7c40f001498",
                    name: "4327_2781"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b5",
                    name: "4350_2810"
                },
                {
                    _id: "55b92ae421e4b7c40f0014c0",
                    name: "5373_2821"
                },
                {
                    _id: "55b92ae421e4b7c40f0014bf",
                    name: "5367_2820"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b7",
                    name: "5374_2812"
                },
                {
                    _id: "55b92ae421e4b7c40f0014b9",
                    name: "5381_2814"
                },
                {
                    _id: "55b92ae421e4b7c40f0014ba",
                    name: "5370_2815"
                },
                {
                    _id: "55b92ae421e4b7c40f0014bb",
                    name: "5382_2816"
                },
                {
                    _id: "55b92ae421e4b7c40f0014bc",
                    name: "5378_2817"
                },
                {
                    _id: "5617a4589ebb48212ea83891",
                    name: "_2941"
                },
                {
                    _id: "56b9d100fae0cea53a58181a",
                    name: "PP_213"
                },
                {
                    _id: "55b92ae321e4b7c40f00143d",
                    name: "3236_2690"
                },
                {
                    _id: "55b92ae421e4b7c40f0014bd",
                    name: "5386_2818"
                },
                {
                    _id: "55b92ae421e4b7c40f0014be",
                    name: "4363_2819"
                },
                {
                    _id: "55b92ae421e4b7c40f00148d",
                    name: "4288_2770"
                },
                {
                    _id: "55b92ae421e4b7c40f0014c1",
                    name: "4366_2822"
                },
                {
                    _id: "55b92ae421e4b7c40f0014c7",
                    name: "5376_2828"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e8",
                    name: "1157_2605"
                },
                {
                    _id: "56041083cafdf81e03000005",
                    name: "_2922"
                },
                {
                    _id: "5662ef4df13e46fd14535607",
                    name: "PP_117"
                },
                {
                    _id: "55b92ae321e4b7c40f0013cd",
                    name: "4_2578"
                },
                {
                    _id: "55b92ae421e4b7c40f0014c9",
                    name: "4361_2830"
                },
                {
                    _id: "55b92ae421e4b7c40f0014ca",
                    name: "5371_2831"
                },
                {
                    _id: "56586175bfd103f108eb4b8d",
                    name: "5658614bbfd103f108eb4b89_36"
                },
                {
                    _id: "55b92ae421e4b7c40f0014cc",
                    name: "5375_2833"
                },
                {
                    _id: "55b92ae421e4b7c40f0014ce",
                    name: "5385_2835"
                },
                {
                    _id: "56ab56f074d57e0d56d6bd8f",
                    name: "PP_192"
                },
                {
                    _id: "55d193c28f61e2c90b000008",
                    name: "_2870"
                },
                {
                    _id: "55b92ae321e4b7c40f0013b8",
                    name: "1088_2557"
                },
                {
                    _id: "55d1d20ddda01e250c000009",
                    name: "_2872"
                },
                {
                    _id: "560906109d69c62f33000009",
                    name: "_2927"
                },
                {
                    _id: "55d2e032873108750b00000d",
                    name: "_2875"
                },
                {
                    _id: "55d2e323873108750b000012",
                    name: "_2877"
                },
                {
                    _id: "56a2089baa157ca50f21fac0",
                    name: "PP_174"
                },
                {
                    _id: "55e414cd4983acdd0b00000d",
                    name: "_2883"
                },
                {
                    _id: "55e416664983acdd0b000011",
                    name: "_2885"
                },
                {
                    _id: "566200bc25e5eb511510bc98",
                    name: "PP_101"
                },
                {
                    _id: "55b92ae421e4b7c40f0014a3",
                    name: "4343_2792"
                },
                {
                    _id: "55e41e664983acdd0b000018",
                    name: "_2886"
                },
                {
                    _id: "561b679b9ebb48212ea838b8",
                    name: "_2945"
                },
                {
                    _id: "55eebba76dceaee10b000018",
                    name: "_2889"
                },
                {
                    _id: "5617a77f9ebb48212ea83893",
                    name: "_2942"
                },
                {
                    _id: "56b9ea84fae0cea53a58184b",
                    name: "PP_219"
                },
                {
                    _id: "56a20735aa157ca50f21fabb",
                    name: "PP_173"
                },
                {
                    _id: "55f7d1286d43203d0c000009",
                    name: "_2895"
                },
                {
                    _id: "560303bccfe9dd624e00000a",
                    name: "_2909"
                },
                {
                    _id: "55b92ae321e4b7c40f0013a3",
                    name: "1138_2536"
                },
                {
                    _id: "55fada0e3d8ddf1961000006",
                    name: "_2897"
                },
                {
                    _id: "55ffaa58a36a8ca10c000009",
                    name: "_2899"
                },
                {
                    _id: "5602c95b788a7c3648000006",
                    name: "_2902"
                },
                {
                    _id: "5602f033fa3f91444e000005",
                    name: "_2903"
                },
                {
                    _id: "560312e3cfe9dd624e00000f",
                    name: "_2913"
                },
                {
                    _id: "55eebb596dceaee10b000016",
                    name: "_2888"
                },
                {
                    _id: "560317f3a5ac49794e000014",
                    name: "_2914"
                },
                {
                    _id: "56167e036167262c3b528923",
                    name: "_2938"
                },
                {
                    _id: "561e24dad6c741e8235f42c5",
                    name: "_2956"
                },
                {
                    _id: "56032592fa3f91444e000018",
                    name: "_2919"
                },
                {
                    _id: "5640572370bbc2b740ce89d7",
                    name: "_12"
                },
                {
                    _id: "5605742b2a1305216b000006",
                    name: "_2923"
                },
                {
                    _id: "5662ee87f13e46fd1453558e",
                    name: "PP_115"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e5",
                    name: "1146_2602"
                },
                {
                    _id: "55b92ae321e4b7c40f00145a",
                    name: "3260_2719"
                },
                {
                    _id: "56090486d06b1b7533000006",
                    name: "_2924"
                },
                {
                    _id: "55b92ae321e4b7c40f00145b",
                    name: "3265_2720"
                },
                {
                    _id: "560a96a2aa39905912000006",
                    name: "_2928"
                },
                {
                    _id: "56121bf7c90e2fb026ce0626",
                    name: "_undefined"
                },
                {
                    _id: "561b67449ebb48212ea838b4",
                    name: "_2943"
                },
                {
                    _id: "561b67ca9ebb48212ea838ba",
                    name: "_2946"
                },
                {
                    _id: "561b69ac9ebb48212ea838be",
                    name: "_2948"
                },
                {
                    _id: "561cf88282c0cfc36514052a",
                    name: "_2949"
                },
                {
                    _id: "561e0420b51032d674856ae0",
                    name: "_2952"
                },
                {
                    _id: "55b92ae321e4b7c40f001409",
                    name: "2183_2638"
                },
                {
                    _id: "5620e9ccc201b6c60379a5c6",
                    name: "_2957"
                },
                {
                    _id: "564056d370bbc2b740ce89d5",
                    name: "_11"
                },
                {
                    _id: "5637211ef5cb624b0509407b",
                    name: "_8"
                },
                {
                    _id: "564056a670bbc2b740ce89d3",
                    name: "_10"
                },
                {
                    _id: "5649930f70bbc2b740ce8a2b",
                    name: "_13"
                },
                {
                    _id: "55b92ae221e4b7c40f001384",
                    name: "1131_2505"
                },
                {
                    _id: "55f69c4d3645b3020c00001d",
                    name: "_2892"
                },
                {
                    _id: "5649932f70bbc2b740ce8a2d",
                    name: "_14"
                },
                {
                    _id: "5668a31165bcfefe46fb4627",
                    name: "PP_138"
                },
                {
                    _id: "5649935a70bbc2b740ce8a2f",
                    name: "_15"
                },
                {
                    _id: "56570c2a4d96962262fd4b30",
                    name: "56570c0c4d96962262fd4b2e_21"
                },
                {
                    _id: "566ebcaf8453e8b464b70a61",
                    name: "PP_145"
                },
                {
                    _id: "56571abf4d96962262fd4b61",
                    name: "56571a994d96962262fd4b5e_24"
                },
                {
                    _id: "55b92ae321e4b7c40f00142c",
                    name: "1193_2673"
                },
                {
                    _id: "55b92ae421e4b7c40f00147f",
                    name: "4332_2756"
                },
                {
                    _id: "56030ed5fa3f91444e00000f",
                    name: "_2912"
                },
                {
                    _id: "56570cb24d96962262fd4b47",
                    name: "56570bd04d96962262fd4b26_22"
                },
                {
                    _id: "55b92ae321e4b7c40f00140b",
                    name: "1163_2640"
                },
                {
                    _id: "56571a734d96962262fd4b5b",
                    name: "56571a4a4d96962262fd4b58_23"
                },
                {
                    _id: "56ab4ce66d7173f43f96ad27",
                    name: "PP_190"
                },
                {
                    _id: "568bb5e07c0383e04c60e889",
                    name: "PP_151"
                },
                {
                    _id: "5622902b184ec5a427913307",
                    name: "_2958"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e4",
                    name: "1142_2601"
                },
                {
                    _id: "565727e7bfd103f108eb4a63",
                    name: "565727d7bfd103f108eb4a60_27"
                },
                {
                    _id: "56bd9f28dfd8a81466e2f4bc",
                    name: "PP_223"
                },
                {
                    _id: "55b92ae321e4b7c40f0013c8",
                    name: "40_2573"
                },
                {
                    _id: "56573d00bfd103f108eb4abc",
                    name: "null_30"
                },
                {
                    _id: "55b92ae321e4b7c40f0013e9",
                    name: "1148_2606"
                },
                {
                    _id: "55b92ae421e4b7c40f0014c8",
                    name: "5380_2829"
                },
                {
                    _id: "56587951bfd103f108eb4c47",
                    name: "56587900bfd103f108eb4c44_43"
                }
            ],
            paymentMethod: [
                {
                    _id: "565f2e05ab70d49024242e09",
                    name: "Ukrsibbank 26005536599700"
                },
                {
                    _id: "565f2e05ab70d49024242e08",
                    name: "Erste Bank HU27 1160 0006 0000 0000 4810 3101"
                },
                {
                    _id: "565f2e05ab70d49024242e0d",
                    name: "Ukrsibbank 26000479199400"
                },
                {
                    _id: "565f2e05ab70d49024242e07",
                    name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522"
                },
                {
                    _id: "565f2e05ab70d49024242e0c",
                    name: "Ukrsibbank 26000479199400"
                },
                {
                    _id: "555cc981532aebbc4a8baf37",
                    name: "UkrSibBank"
                },
                {
                    _id: "555cc981532aebbc4a8baf36",
                    name: "Payoneer "
                },
                {
                    _id: "565f2e05ab70d49024242e10",
                    name: "CASH UAH"
                },
                {
                    _id: "555cc981532aebbc4a8baf38",
                    name: "Primary"
                }
            ]
        },
        PayrollExpenses: {
            _id: null,
            year: [
                {
                    _id: 2014,
                    name: 2014
                },
                {
                    _id: 2016,
                    name: 2016
                },
                {
                    _id: 2015,
                    name: 2015
                }
            ],
            month: [
                {
                    _id: 3,
                    name: 3
                },
                {
                    _id: 12,
                    name: 12
                },
                {
                    _id: 4,
                    name: 4
                },
                {
                    _id: 5,
                    name: 5
                },
                {
                    _id: 6,
                    name: 6
                },
                {
                    _id: 7,
                    name: 7
                },
                {
                    _id: 8,
                    name: 8
                },
                {
                    _id: 10,
                    name: 10
                },
                {
                    _id: 9,
                    name: 9
                },
                {
                    _id: 1,
                    name: 1
                },
                {
                    _id: 2,
                    name: 2
                },
                {
                    _id: 0,
                    name: 0
                },
                {
                    _id: 11,
                    name: 11
                }
            ],
            employee: [
                "56b9d49d8f23c5696159cd0c",
                "56b9d3eb8f23c5696159cd0b",
                "56b2287b99ce8d706a81b2bc",
                "56af32e174d57e0d56d6bee5",
                "56a7956faa157ca50f21fb25",
                "56a78c75aa157ca50f21fb24",
                "56a5ef86aa157ca50f21fb1d",
                "569e63df044ae38173244cfd",
                "569cce1dcf1f31f925c026fa",
                "56966c82d87c9004552b63c7",
                "56965733d87c9004552b63be",
                "568cd4c0b2bcba971ba6f5c5",
                "568cd341b2bcba971ba6f5c4",
                "568bbf935827e3b24d8123a8",
                "5684ec1a1fec73d05393a2a4",
                "56813fe29cceae182b907755",
                "567ac0a48365c9a205406f33",
                "566fe2348453e8b464b70ba6",
                "566ede9e8453e8b464b70b71",
                "566add9aa74aaf316eaea6fc",
                "566ada96a74aaf316eaea69d",
                "5667f43da3fc012a68f0d5f6",
                "565c306af4dcd63b5dbd7373",
                "565c2793f4dcd63b5dbd7372",
                "5652dd95c4d12cf51e7f7e0b",
                "564a02e0ad4bc9e53f1f6194",
                "564a0186ad4bc9e53f1f6193",
                "5649b8ccad4bc9e53f1f6192",
                "5640741570bbc2b740ce89ec",
                "5638aa635d23a8eb04e80af0",
                "5637710e5d23a8eb04e80aed",
                "5629e27046bca6e4591f4919",
                "55b92ad221e4b7c40f00004f",
                "55b92ad221e4b7c40f000058",
                "55b92ad221e4b7c40f000045",
                "55b92ad221e4b7c40f000035",
                "569e3a73044ae38173244cfb",
                "55b92ad221e4b7c40f0000ce",
                "55b92ad221e4b7c40f0000b7",
                "55b92ad221e4b7c40f0000b6",
                "55b92ad221e4b7c40f000088",
                "56123232c90e2fb026ce064b",
                "56b3412299ce8d706a81b2cd",
                "55cdffa59b42266a4f000015",
                "55b92ad221e4b7c40f000054",
                "55b92ad221e4b7c40f0000b4",
                "55b92ad221e4b7c40f00007e",
                "55fbcb65f9210c860c000005",
                "560264bb8dc408c632000005",
                "56b8b99e6c411b590588feb9",
                "55b92ad221e4b7c40f000056",
                "55b92ad221e4b7c40f00008a",
                "55b92ad221e4b7c40f0000c0",
                "55b92ad221e4b7c40f000051",
                "56964a03d87c9004552b63ba",
                "55b92ad221e4b7c40f000063",
                "55b92ad221e4b7c40f000053",
                "55b92ad221e4b7c40f00003c",
                "55b92ad221e4b7c40f000061",
                "55d1a2b18f61e2c90b000023",
                "55b92ad221e4b7c40f000098",
                "55b92ad221e4b7c40f0000c6",
                "560115cf536bd29228000006",
                "55b92ad221e4b7c40f00005f",
                "55b92ad221e4b7c40f00004a",
                "55b92ad221e4b7c40f00004e",
                "561bc5ca9ebb48212ea838c8",
                "55b92ad221e4b7c40f0000c3",
                "55b92ad221e4b7c40f00008d",
                "5693b24bd87c9004552b63a1",
                "55b92ad221e4b7c40f00007b",
                "55b92ad221e4b7c40f0000a9",
                "55b92ad221e4b7c40f000060",
                "56b9cbb48f23c5696159cd08",
                "56011186536bd29228000005",
                "55b92ad221e4b7c40f0000a6",
                "55b92ad221e4b7c40f000078",
                "55b92ad221e4b7c40f000049",
                "55b92ad221e4b7c40f00006f",
                "55b92ad221e4b7c40f00009d",
                "55c06411d011746b0b000005",
                "55b92ad221e4b7c40f000036",
                "55b92ad221e4b7c40f000048",
                "55b92ad221e4b7c40f000041",
                "55b92ad221e4b7c40f00003a",
                "55b92ad221e4b7c40f0000a7",
                "5626278d750d38934bfa1313",
                "55b92ad221e4b7c40f000099",
                "55b92ad221e4b7c40f00006b",
                "55b92ad221e4b7c40f000055",
                "55b92ad221e4b7c40f000094",
                "55b92ad221e4b7c40f0000c2",
                "55b92ad221e4b7c40f00005b",
                "55b92ad221e4b7c40f0000ba",
                "55b92ad221e4b7c40f00008c",
                "55b92ad221e4b7c40f0000a2",
                "55b92ad221e4b7c40f000074",
                "55b92ad221e4b7c40f000043",
                "55b92ad221e4b7c40f000032",
                "55b92ad221e4b7c40f000046",
                "565f0fa6f6427f253cf6bf19",
                "55b92ad221e4b7c40f000086",
                "55b92ad221e4b7c40f0000bc",
                "55b92ad221e4b7c40f00004d",
                "55b92ad221e4b7c40f0000ad",
                "55b92ad221e4b7c40f00007f",
                "55b92ad221e4b7c40f000065",
                "55b92ad221e4b7c40f00009b",
                "55b92ad221e4b7c40f000038",
                "55b92ad221e4b7c40f000072",
                "55b92ad221e4b7c40f0000a8",
                "561bb90a9ebb48212ea838c7",
                "55b92ad221e4b7c40f000080",
                "55b92ad221e4b7c40f0000ae",
                "55effafa8f1e10e50b000006",
                "568cdd375527d6691cb68b22",
                "55b92ad221e4b7c40f00004c",
                "55e419094983acdd0b000012",
                "568158fc9cceae182b907756",
                "55b92ad221e4b7c40f00009a",
                "55b92ad221e4b7c40f00006c",
                "55b92ad221e4b7c40f000031",
                "55b92ad221e4b7c40f000062",
                "55b92ad221e4b7c40f0000b0",
                "55b92ad221e4b7c40f00007a",
                "55b92ad221e4b7c40f00003e",
                "55b92ad221e4b7c40f000076",
                "55b92ad221e4b7c40f0000ac",
                "55b92ad221e4b7c40f000093",
                "55b92ad221e4b7c40f0000c1",
                "55b92ad221e4b7c40f00005a",
                "55b92ad221e4b7c40f000090",
                "55b92ad221e4b7c40f0000be",
                "56a0d4b162d172544baf0e3a",
                "55b92ad221e4b7c40f000057",
                "55b92ad221e4b7c40f00003b",
                "55b92ad221e4b7c40f0000b5",
                "55b92ad221e4b7c40f000087",
                "55b92ad221e4b7c40f00004b",
                "55b92ad221e4b7c40f000084",
                "55b92ad221e4b7c40f0000b2",
                "55b92ad221e4b7c40f000030",
                "55b92ad221e4b7c40f000059",
                "55b92ad221e4b7c40f000042",
                "55b92ad221e4b7c40f00005e",
                "55b92ad221e4b7c40f000047",
                "55b92ad221e4b7c40f0000a0",
                "55b92ad221e4b7c40f00006a",
                "55e549309624477a0b000005",
                "55f7c20a6d43203d0c000005",
                "55b92ad221e4b7c40f00009c",
                "55b92ad221e4b7c40f000066",
                "5602a01550de7f4138000008",
                "55c98b86cbb0f4910b000006",
                "55b92ad221e4b7c40f00009f",
                "55b92ad221e4b7c40f000069",
                "55b92ad221e4b7c40f0000a3",
                "55b92ad221e4b7c40f00006d",
                "55eeed546dceaee10b00001e",
                "55b92ad221e4b7c40f0000cf",
                "55b92ad221e4b7c40f000082",
                "55b92ad221e4b7c40f0000b8",
                "56c19971dfd8a81466e2f6dc",
                "55b92ad221e4b7c40f0000ca",
                "55b92ad221e4b7c40f00008b",
                "55b92ad221e4b7c40f0000b9",
                "55b92ad221e4b7c40f0000a4",
                "55b92ad221e4b7c40f00006e",
                "55b92ad221e4b7c40f0000c5",
                "55b92ad221e4b7c40f000097",
                "56029cc950de7f4138000005",
                "55b92ad221e4b7c40f000083",
                "55b92ad221e4b7c40f0000b1",
                "55b92ad221e4b7c40f00009e",
                "55b92ad221e4b7c40f000070",
                "564da59f9b85f8b16b574fe9",
                "561ba8639ebb48212ea838c4",
                "55b92ad221e4b7c40f00003d",
                "55dd73d1f09cc2ec0b000008",
                "55b92ad221e4b7c40f000034",
                "55b92ad221e4b7c40f00003f",
                "55b92ad221e4b7c40f0000bf",
                "55b92ad221e4b7c40f000089",
                "55b92ad221e4b7c40f000077",
                "55b92ad221e4b7c40f0000a5",
                "55b92ad221e4b7c40f000079",
                "55b92ad221e4b7c40f0000aa",
                "55b92ad221e4b7c40f00007c",
                "55b92ad221e4b7c40f000064",
                "561ba7039ebb48212ea838c3",
                "55f9298456f79c9c0c000006",
                "55b92ad221e4b7c40f000039",
                "55ded6b3ae2b22730b00004e",
                "568bc0b55827e3b24d8123a9",
                "55b92ad221e4b7c40f000050",
                "5667f310a3fc012a68f0d5f5",
                "55c0656ad011746b0b000006",
                "55b92ad221e4b7c40f000040",
                "5614d4c7ab24a83b1dc1a7a8",
                "561bb1269ebb48212ea838c5",
                "56bdf283dfd8a81466e2f6d0",
                "55b92ad221e4b7c40f000052",
                "55b92ad221e4b7c40f0000bd",
                "55b92ad221e4b7c40f00008f",
                "55b92ad221e4b7c40f0000a1",
                "55b92ad221e4b7c40f000073",
                "564a03d1ad4bc9e53f1f6195",
                "55b92ad221e4b7c40f000092",
                "55b92ad221e4b7c40f0000c8",
                "55ca0145cbb0f4910b000009",
                "55c32e0d29bd6ccd0b000005",
                "55b92ad221e4b7c40f000091",
                "55b92ad221e4b7c40f0000c7",
                "56014cc8536bd29228000007",
                "568bbdfd5827e3b24d8123a7",
                "55b92ad221e4b7c40f00007d",
                "55b92ad221e4b7c40f0000b3",
                "55c330d529bd6ccd0b000007",
                "55eee9c26dceaee10b00001d",
                "55dd71eaf09cc2ec0b000007",
                "55b92ad221e4b7c40f0000bb",
                "55b92ad221e4b7c40f000085",
                "55dd7776f09cc2ec0b000009",
                "55bf45cf65cda0810b00000a",
                "55d1e234dda01e250c000015",
                "55b92ad221e4b7c40f000095",
                "55b92ad221e4b7c40f0000cb",
                "55c84a4aaa36a0e60a000005",
                "566aa49f4f817b7f51746ec0",
                "55dd63f8f09cc2ec0b000006",
                "55c98df0cbb0f4910b000007",
                "5600031ba36a8ca10c000028",
                "55d1d860dda01e250c000010",
                "5600042ca36a8ca10c000029",
                "55e96ab13f3ae4fd0b000009",
                "55b92ad221e4b7c40f00008e",
                "55b92ad221e4b7c40f0000c4",
                "55eef3fd6dceaee10b000020",
                "564dac3e9b85f8b16b574fea",
                "55ed5a437221afe30b000006",
                "55f7c3736d43203d0c000006",
                "55b92ad221e4b7c40f0000cd",
                "56090fae86e2435a33000008",
                "561b756f9ebb48212ea838c0",
                "56090d77066d979a33000009",
                "55b92ad221e4b7c40f000068",
                "561bb5329ebb48212ea838c6",
                "55b92ad221e4b7c40f0000c9",
                "55b92ad221e4b7c40f000096",
                "55b92ad221e4b7c40f0000cc",
                "55c98aa7cbb0f4910b000005",
                "55b92ad221e4b7c40f00005d",
                "55b92ad221e4b7c40f000044",
                "55b92ad221e4b7c40f000033",
                "55b92ad221e4b7c40f00005c"
            ],
            dataKey: [
                {
                    _id: 201600,
                    name: "00/2016"
                },
                {
                    _id: 201611,
                    name: "11/2016"
                },
                {
                    _id: 201412,
                    name: "12/2014"
                },
                {
                    _id: 201411,
                    name: "11/2014"
                },
                {
                    _id: 201504,
                    name: "04/2015"
                },
                {
                    _id: 201505,
                    name: "05/2015"
                },
                {
                    _id: 201410,
                    name: "10/2014"
                },
                {
                    _id: 201506,
                    name: "06/2015"
                },
                {
                    _id: 201509,
                    name: "09/2015"
                },
                {
                    _id: 201409,
                    name: "09/2014"
                },
                {
                    _id: 201508,
                    name: "08/2015"
                },
                {
                    _id: 201510,
                    name: "10/2015"
                },
                {
                    _id: 201507,
                    name: "07/2015"
                },
                {
                    _id: 201502,
                    name: "02/2015"
                },
                {
                    _id: 201602,
                    name: "02/2016"
                },
                {
                    _id: 201503,
                    name: "03/2015"
                },
                {
                    _id: 201501,
                    name: "01/2015"
                }
            ],
            type: [
                { }
            ]
        },
        salesQuotation: {
            _id: null,
            projectName: [
                {
                    _id: "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id: "56bc8fd2dfd8a81466e2f46b",
                    name: "WSpider"
                },
                {
                    _id: "562bc32484deb7cb59d61b70",
                    name: "MyDrive"
                },
                {
                    _id: "563767135d23a8eb04e80aec",
                    name: "Coach App"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                },
                {
                    _id: "568cea4977b14bf41bf2c32c",
                    name: "LocalCollector"
                },
                {
                    _id: "568b85b33cce9254776f2b4c",
                    name: "FluxIOT"
                },
                {
                    _id: "561d1c3db51032d674856acc",
                    name: "PayFever"
                },
                {
                    _id: "56618227bb8be7814fb526e5",
                    name: "Otrema WP4"
                },
                {
                    _id: "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id: "5629e238129820ab5994e8c0",
                    name: "Bus Project"
                },
                {
                    _id: "55b92ad621e4b7c40f00067f",
                    name: "Player iOS/And"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c2",
                    name: "WP Wrapper Unibet"
                },
                {
                    _id: "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id: "55b92ad621e4b7c40f00068c",
                    name: "DRH manual"
                },
                {
                    _id: "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id: "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id: "55b92ad621e4b7c40f000686",
                    name: "Sensei"
                },
                {
                    _id: "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id: "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id: "56ab5ceb74d57e0d56d6bda5",
                    name: "CAPT"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                {
                    _id: "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id: "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id: "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id: "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c6",
                    name: "Demo Rocket"
                },
                {
                    _id: "55b92ad621e4b7c40f00067d",
                    name: "Sharalike"
                },
                {
                    _id: "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c3",
                    name: "Jude"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id: "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id: "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id: "55b92ad621e4b7c40f000672",
                    name: "DRH QA Automation"
                },
                {
                    _id: "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id: "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id: "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id: "55b92ad621e4b7c40f00066b",
                    name: "Nikky"
                },
                {
                    _id: "561ebb8cd6c741e8235f42ea",
                    name: "Bodega application"
                },
                {
                    _id: "56afdabef5c2bcd4555cb2f8",
                    name: "Design Slots"
                },
                {
                    _id: "56ab891074d57e0d56d6be1f",
                    name: "Serial Box"
                },
                {
                    _id: "563295f6c928c61d052d5003",
                    name: "WordPress Sites"
                },
                {
                    _id: "56a24d5faa157ca50f21fb13",
                    name: "Water Safety App"
                },
                {
                    _id: "56304d56547f50b51d6de2bb",
                    name: "Move for Less"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                }
            ],
            supplier: [
                {
                    _id: "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id: "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id: "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id: "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id: "56ab5ca674d57e0d56d6bda4",
                    name: "Stian Maurstad"
                },
                {
                    _id: "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id: "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id: "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id: "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id: "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id: "5637627bc928c61d052d500e",
                    name: "Tibor Bekefi"
                },
                {
                    _id: "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id: "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id: "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id: "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id: "55b92ad621e4b7c40f00064b",
                    name: "Thomas "
                },
                {
                    _id: "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id: "5661805cbb8be7814fb52529",
                    name: "Otrema "
                },
                {
                    _id: "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id: "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id: "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id: "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id: "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id: "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id: "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id: "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id: "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id: "561d1bc0b51032d674856acb",
                    name: "Attrecto "
                },
                {
                    _id: "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id: "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                }
            ],
            projectmanager: [
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                }
            ],
            workflow: [
                {
                    _id: "5555bf276a3f01acae0b5560",
                    name: "Not Ordered"
                },
                {
                    _id: "55647b932e4aa3804a765ec5",
                    name: "Not Invoiced"
                }
            ]
        },
        jobsDashboard: {
            _id: null,
            type: [
                {
                    _id: "Ordered",
                    name: "Ordered"
                },
                {
                    _id: "Not Quoted",
                    name: "Not Quoted"
                },
                {
                    _id: "Quoted",
                    name: "Quoted"
                },
                {
                    _id: "Invoiced",
                    name: "Invoiced"
                }
            ],
            workflow: [
                {
                    _id: "56337c705d49d8d6537832eb",
                    name: "In Progress"
                },
                {
                    _id: "56337c675d49d8d6537832ea",
                    name: "Finished"
                }
            ],
            project: [
                {
                    _id: "56bdcc69dfd8a81466e2f58a",
                    name: "Buzinga extra costs"
                },
                {
                    _id: "56bc8fd2dfd8a81466e2f46b",
                    name: "WSpider"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b6",
                    name: "Shiwaforce Karma"
                },
                {
                    _id: "56b09dd8d6ef38a708dfc284",
                    name: "Vike Analytics Integration"
                },
                {
                    _id: "56ab958e74d57e0d56d6be3b",
                    name: "Planogram"
                },
                {
                    _id: "56aa2cb4b4dc0d09232bd7aa",
                    name: "AngularJS - Stentle"
                },
                {
                    _id: "56a24d5faa157ca50f21fb13",
                    name: "Water Safety App"
                },
                {
                    _id: "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                {
                    _id: "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id: "569f60d162d172544baf0d58",
                    name: "Android advertisement"
                },
                {
                    _id: "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id: "56a89384eb2b76c70ec74d1e",
                    name: "Locappy"
                },
                {
                    _id: "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id: "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id: "561ebb8cd6c741e8235f42ea",
                    name: "Bodega application"
                },
                {
                    _id: "56ab891074d57e0d56d6be1f",
                    name: "Serial Box"
                },
                {
                    _id: "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id: "565740e0bfd103f108eb4ad4",
                    name: "HKConnect"
                },
                {
                    _id: "56422bfc70bbc2b740ce89f3",
                    name: "PREEME"
                },
                {
                    _id: "563767135d23a8eb04e80aec",
                    name: "Coach App"
                },
                {
                    _id: "55cdc96d9b42266a4f000006",
                    name: "Absolute Vodka"
                },
                {
                    _id: "55de2a30f09cc2ec0b00004e",
                    name: "GovMap"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ce",
                    name: "FlipStar Game"
                },
                {
                    _id: "56afdabef5c2bcd4555cb2f8",
                    name: "Design Slots"
                },
                {
                    _id: "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id: "563295f6c928c61d052d5003",
                    name: "WordPress Sites"
                },
                {
                    _id: "55ded24cae2b22730b000040",
                    name: "FarmStatistic"
                },
                {
                    _id: "5629e238129820ab5994e8c0",
                    name: "Bus Project"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d6",
                    name: "ArTV"
                },
                {
                    _id: "55f56442b81672730c000032",
                    name: "Tinder clone"
                },
                {
                    _id: "55f55a89b81672730c000017",
                    name: "Bimii"
                },
                {
                    _id: "55f55d31b81672730c000020",
                    name: "Farmers App"
                },
                {
                    _id: "55f5728cb81672730c00006a",
                    name: "BetterIt ios"
                },
                {
                    _id: "561253dfc90e2fb026ce064d",
                    name: "Shiwaforce Karma QA"
                },
                {
                    _id: "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id: "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id: "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id: "55de24bbf09cc2ec0b000036",
                    name: "FosterFarms"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ca",
                    name: "SketchTechPoints"
                },
                {
                    _id: "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id: "55b92ad621e4b7c40f000686",
                    name: "Sensei"
                },
                {
                    _id: "55b92ad621e4b7c40f000699",
                    name: "Tablet apps"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c9",
                    name: "spscontrol"
                },
                {
                    _id: "55b92ad621e4b7c40f000677",
                    name: "Android Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f00066a",
                    name: "The Watch Enthusiast"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c6",
                    name: "Demo Rocket"
                },
                {
                    _id: "55b92ad621e4b7c40f000687",
                    name: "iOS/Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f000664",
                    name: "BelgiumHTML"
                },
                {
                    _id: "55b92ad621e4b7c40f000689",
                    name: "iOS4"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a2",
                    name: "Android"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a6",
                    name: "Moriser"
                },
                {
                    _id: "55b92ad621e4b7c40f00067a",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000668",
                    name: "Selenium IDE"
                },
                {
                    _id: "55b92ad621e4b7c40f000688",
                    name: "iOS2"
                },
                {
                    _id: "55b92ad621e4b7c40f000681",
                    name: "AirPort"
                },
                {
                    _id: "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bf",
                    name: "Minder"
                },
                {
                    _id: "55b92ad621e4b7c40f000666",
                    name: "blow.com"
                },
                {
                    _id: "5605736c002c16436b000007",
                    name: "Stentle CSS"
                },
                {
                    _id: "55b92ad621e4b7c40f000696",
                    name: "Software Testing of Web Application"
                },
                {
                    _id: "55b92ad621e4b7c40f00066d",
                    name: "LiveCasinoAndroid"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b2",
                    name: "Player"
                },
                {
                    _id: "55de2cd2f09cc2ec0b000053",
                    name: "Dragon Daze"
                },
                {
                    _id: "55b92ad621e4b7c40f000693",
                    name: "WP Player"
                },
                {
                    _id: "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ad",
                    name: "KX keyboard"
                },
                {
                    _id: "56304d56547f50b51d6de2bb",
                    name: "Move for Less"
                },
                {
                    _id: "55b92ad621e4b7c40f00066b",
                    name: "Nikky"
                },
                {
                    _id: "56a23c5caa157ca50f21fae1",
                    name: "Demolition Derby"
                },
                {
                    _id: "55b92ad621e4b7c40f00069c",
                    name: "sTrader"
                },
                {
                    _id: "56a9ef06d59a04d6225b0df6",
                    name: "UpCity"
                },
                {
                    _id: "55b92ad621e4b7c40f00068e",
                    name: "Phidget ANE"
                },
                {
                    _id: "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d1",
                    name: "Sales Tool"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c8",
                    name: "PriTriever"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a9",
                    name: "Spokal"
                },
                {
                    _id: "569f5bc662d172544baf0c40",
                    name: "Gilad Nevo Bug fixing"
                },
                {
                    _id: "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id: "55b92ad621e4b7c40f000670",
                    name: "iRemember"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ac",
                    name: "Manual front end testing for e commerce site"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c5",
                    name: "Liquivid"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f0006af",
                    name: "Academic Website testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000692",
                    name: "WishExpress"
                },
                {
                    _id: "56abd16ac6be8658550dc6c3",
                    name: "Baccarat"
                },
                {
                    _id: "55b92ad621e4b7c40f00065f",
                    name: "IOS/Android QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00068a",
                    name: "application regression testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d2",
                    name: "Snapped"
                },
                {
                    _id: "55b92ad621e4b7c40f000665",
                    name: "JellyGames"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a7",
                    name: "couch"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                },
                {
                    _id: "55b92ad621e4b7c40f000669",
                    name: "Airsoft site"
                },
                {
                    _id: "568cea4977b14bf41bf2c32c",
                    name: "LocalCollector"
                },
                {
                    _id: "55b92ad621e4b7c40f000675",
                    name: "iOS6"
                },
                {
                    _id: "55b92ad621e4b7c40f00066c",
                    name: "DesignShargo"
                },
                {
                    _id: "55b92ad621e4b7c40f000691",
                    name: "Faceworks"
                },
                {
                    _id: "55b92ad621e4b7c40f000663",
                    name: "ajaxbrowser.com"
                },
                {
                    _id: "562bc32484deb7cb59d61b70",
                    name: "MyDrive"
                },
                {
                    _id: "55b92ad621e4b7c40f000674",
                    name: "Win7 app tester needed"
                },
                {
                    _id: "55b92ad621e4b7c40f00067c",
                    name: "iQshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ae",
                    name: "Kikast"
                },
                {
                    _id: "55b92ad621e4b7c40f00067b",
                    name: "Android Help"
                },
                {
                    _id: "56618227bb8be7814fb526e5",
                    name: "Otrema WP4"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d5",
                    name: "Unlimited Conferencing"
                },
                { },
                {
                    _id: "56ab5ceb74d57e0d56d6bda5",
                    name: "CAPT"
                },
                {
                    _id: "55b92ad621e4b7c40f00067e",
                    name: "SoulIntentions"
                },
                {
                    _id: "55b92ad621e4b7c40f000662",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a8",
                    name: "sitefix"
                },
                {
                    _id: "55cf5ea04a91e37b0b00012c",
                    name: "Global Workshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a4",
                    name: "iOS Periop"
                },
                {
                    _id: "55f55901b81672730c000011",
                    name: "WhachApp"
                },
                {
                    _id: "561d1c3db51032d674856acc",
                    name: "PayFever"
                },
                {
                    _id: "55b92ad621e4b7c40f00068c",
                    name: "DRH manual"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b0",
                    name: "Telecom"
                },
                {
                    _id: "55b92ad621e4b7c40f000673",
                    name: "Q/A digital QA"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c4",
                    name: "Ibizawire"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c2",
                    name: "WP Wrapper Unibet"
                },
                {
                    _id: "55b92ad621e4b7c40f00069d",
                    name: "iOS3"
                },
                {
                    _id: "55b92ad621e4b7c40f000660",
                    name: "iOS1"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b7",
                    name: "Design"
                },
                {
                    _id: "55b92ad621e4b7c40f000676",
                    name: "QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00067f",
                    name: "Player iOS/And"
                },
                {
                    _id: "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id: "55b92ad621e4b7c40f00069f",
                    name: "iOS5"
                },
                {
                    _id: "55b92ad621e4b7c40f000695",
                    name: "Consent APP"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cd",
                    name: "CloudFuze"
                },
                {
                    _id: "568b85b33cce9254776f2b4c",
                    name: "FluxIOT"
                },
                {
                    _id: "55b92ad621e4b7c40f00069e",
                    name: "Android1"
                },
                {
                    _id: "55b92ad621e4b7c40f000678",
                    name: "Appium testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006aa",
                    name: "DiveplanIT"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b4",
                    name: "Vroup"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d7",
                    name: "Mesa Ave"
                },
                {
                    _id: "55b92ad621e4b7c40f00068b",
                    name: "Unity3D"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a0",
                    name: "GetFit"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                },
                {
                    _id: "55b92ad621e4b7c40f00068f",
                    name: "QMR Android"
                },
                {
                    _id: "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id: "55b92ad621e4b7c40f000683",
                    name: "Bob"
                },
                {
                    _id: "55b92ad621e4b7c40f00067d",
                    name: "Sharalike"
                },
                {
                    _id: "55b92ad621e4b7c40f000667",
                    name: "PT2"
                },
                {
                    _id: "56b9e0268f23c5696159cd0d",
                    name: "test_Alexander"
                },
                {
                    _id: "566857caa3fc012a68f0d83a",
                    name: "SPS Mobile"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a5",
                    name: "Android"
                },
                {
                    _id: "55b92ad621e4b7c40f000690",
                    name: "Max"
                },
                {
                    _id: "55b92ad621e4b7c40f000680",
                    name: "CodeThreads"
                },
                {
                    _id: "55b92ad621e4b7c40f000682",
                    name: "Connexus"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c1",
                    name: "Ganchak Help"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ba",
                    name: "TocToc"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b3",
                    name: "Loyalty"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a3",
                    name: "iOS dev"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b1",
                    name: "Android Automation"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b5",
                    name: "KemblaJoggers"
                },
                {
                    _id: "56685d88a3fc012a68f0d854",
                    name: "Nicolas Burer Design"
                },
                {
                    _id: "563b95acab9698be7c9df727",
                    name: "LoginChineseTrue"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bc",
                    name: "Pseudo"
                },
                {
                    _id: "55b92ad621e4b7c40f000698",
                    name: "Staffd"
                },
                {
                    _id: "55b92ad621e4b7c40f00066f",
                    name: "Oculus Player"
                },
                {
                    _id: "55de1e8ef09cc2ec0b000031",
                    name: "BlueLight"
                },
                {
                    _id: "55b92ad621e4b7c40f000661",
                    name: "Android2"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ab",
                    name: "QMR iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f000672",
                    name: "DRH QA Automation"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                },
                {
                    _id: "55b92ad621e4b7c40f000697",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b9",
                    name: "Curb testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c0",
                    name: "TrumpT QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00066e",
                    name: "LCUpdate iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f000685",
                    name: "Travlr"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c3",
                    name: "Jude"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cb",
                    name: "Bayzat"
                }
            ],
            projectManager: [
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    name: null
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                }
            ],
            paymentsCount: [
                {
                    _id: 595,
                    name: 595
                },
                {
                    _id: 0,
                    name: 0
                }
            ]
        },
        wTrack: {
            _id: null,
            jobs: [
                { }
            ],
            projectManager: [
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    name: null
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                }
            ],
            projectName: [
                {
                    _id: "56bc8fd2dfd8a81466e2f46b",
                    name: "WSpider"
                },
                {
                    _id: "56b09dd8d6ef38a708dfc284",
                    name: "Vike Analytics Integration"
                },
                {
                    _id: "56ab958e74d57e0d56d6be3b",
                    name: "Planogram"
                },
                {
                    _id: "56aa2cb4b4dc0d09232bd7aa",
                    name: "AngularJS - Stentle"
                },
                {
                    _id: "56a24d5faa157ca50f21fb13",
                    name: "Water Safety App"
                },
                {
                    _id: "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                {
                    _id: "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id: "569f60d162d172544baf0d58",
                    name: "Android advertisement"
                },
                {
                    _id: "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id: "565740e0bfd103f108eb4ad4",
                    name: "HKConnect"
                },
                {
                    _id: "55de2a30f09cc2ec0b00004e",
                    name: "GovMap"
                },
                {
                    _id: "56422bfc70bbc2b740ce89f3",
                    name: "PREEME"
                },
                {
                    _id: "56ab891074d57e0d56d6be1f",
                    name: "Serial Box"
                },
                {
                    _id: "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id: "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id: "561ebb8cd6c741e8235f42ea",
                    name: "Bodega application"
                },
                {
                    _id: "56a89384eb2b76c70ec74d1e",
                    name: "Locappy"
                },
                {
                    _id: "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id: "561253dfc90e2fb026ce064d",
                    name: "Shiwaforce Karma QA"
                },
                {
                    _id: "56bdcc69dfd8a81466e2f58a",
                    name: "Buzinga extra costs"
                },
                {
                    _id: "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id: "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id: "55f5728cb81672730c00006a",
                    name: "BetterIt ios"
                },
                {
                    _id: "55f55d31b81672730c000020",
                    name: "Farmers App"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d6",
                    name: "ArTV"
                },
                {
                    _id: "55ded24cae2b22730b000040",
                    name: "FarmStatistic"
                },
                {
                    _id: "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id: "5629e238129820ab5994e8c0",
                    name: "Bus Project"
                },
                {
                    _id: "55de24bbf09cc2ec0b000036",
                    name: "FosterFarms"
                },
                {
                    _id: "56afdabef5c2bcd4555cb2f8",
                    name: "Design Slots"
                },
                {
                    _id: "563295f6c928c61d052d5003",
                    name: "WordPress Sites"
                },
                {
                    _id: "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id: "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id: "55f55a89b81672730c000017",
                    name: "Bimii"
                },
                {
                    _id: "55f56442b81672730c000032",
                    name: "Tinder clone"
                },
                {
                    _id: "563767135d23a8eb04e80aec",
                    name: "Coach App"
                },
                {
                    _id: "55cdc96d9b42266a4f000006",
                    name: "Absolute Vodka"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ce",
                    name: "FlipStar Game"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ca",
                    name: "SketchTechPoints"
                },
                {
                    _id: "56618227bb8be7814fb526e5",
                    name: "Otrema WP4"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d5",
                    name: "Unlimited Conferencing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c8",
                    name: "PriTriever"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cd",
                    name: "CloudFuze"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cb",
                    name: "Bayzat"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c4",
                    name: "Ibizawire"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c3",
                    name: "Jude"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f000692",
                    name: "WishExpress"
                },
                {
                    _id: "55b92ad621e4b7c40f0006af",
                    name: "Academic Website testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b6",
                    name: "Shiwaforce Karma"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c5",
                    name: "Liquivid"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ac",
                    name: "Manual front end testing for e commerce site"
                },
                {
                    _id: "55b92ad621e4b7c40f00067b",
                    name: "Android Help"
                },
                {
                    _id: "55b92ad621e4b7c40f000678",
                    name: "Appium testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006aa",
                    name: "DiveplanIT"
                },
                {
                    _id: "568b85b33cce9254776f2b4c",
                    name: "FluxIOT"
                },
                {
                    _id: "55b92ad621e4b7c40f00069e",
                    name: "Android1"
                },
                {
                    _id: "56a9ef06d59a04d6225b0df6",
                    name: "UpCity"
                },
                {
                    _id: "55b92ad621e4b7c40f00068e",
                    name: "Phidget ANE"
                },
                {
                    _id: "56a23c5caa157ca50f21fae1",
                    name: "Demolition Derby"
                },
                {
                    _id: "55b92ad621e4b7c40f00069c",
                    name: "sTrader"
                },
                {
                    _id: "56304d56547f50b51d6de2bb",
                    name: "Move for Less"
                },
                {
                    _id: "55b92ad621e4b7c40f00066b",
                    name: "Nikky"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a6",
                    name: "Moriser"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a9",
                    name: "Spokal"
                },
                {
                    _id: "55b92ad621e4b7c40f000670",
                    name: "iRemember"
                },
                {
                    _id: "569f5bc662d172544baf0c40",
                    name: "Gilad Nevo Bug fixing"
                },
                {
                    _id: "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id: "55b92ad621e4b7c40f000672",
                    name: "DRH QA Automation"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a8",
                    name: "sitefix"
                },
                {
                    _id: "55cf5ea04a91e37b0b00012c",
                    name: "Global Workshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a4",
                    name: "iOS Periop"
                },
                {
                    _id: "561d1c3db51032d674856acc",
                    name: "PayFever"
                },
                {
                    _id: "55f55901b81672730c000011",
                    name: "WhachApp"
                },
                {
                    _id: "55b92ad621e4b7c40f00068c",
                    name: "DRH manual"
                },
                {
                    _id: "55b92ad621e4b7c40f00066a",
                    name: "The Watch Enthusiast"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c9",
                    name: "spscontrol"
                },
                {
                    _id: "55b92ad621e4b7c40f000677",
                    name: "Android Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a7",
                    name: "couch"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c6",
                    name: "Demo Rocket"
                },
                {
                    _id: "55b92ad621e4b7c40f000687",
                    name: "iOS/Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f000664",
                    name: "BelgiumHTML"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                },
                {
                    _id: "55b92ad621e4b7c40f00068f",
                    name: "QMR Android"
                },
                {
                    _id: "55b92ad621e4b7c40f000673",
                    name: "Q/A digital QA"
                },
                {
                    _id: "55b92ad621e4b7c40f000668",
                    name: "Selenium IDE"
                },
                {
                    _id: "55b92ad621e4b7c40f000688",
                    name: "iOS2"
                },
                {
                    _id: "55b92ad621e4b7c40f000681",
                    name: "AirPort"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a2",
                    name: "Android"
                },
                {
                    _id: "56abd16ac6be8658550dc6c3",
                    name: "Baccarat"
                },
                {
                    _id: "55b92ad621e4b7c40f00065f",
                    name: "IOS/Android QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00068a",
                    name: "application regression testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d2",
                    name: "Snapped"
                },
                {
                    _id: "55b92ad621e4b7c40f000665",
                    name: "JellyGames"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d7",
                    name: "Mesa Ave"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a0",
                    name: "GetFit"
                },
                {
                    _id: "55b92ad621e4b7c40f00068b",
                    name: "Unity3D"
                },
                {
                    _id: "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d1",
                    name: "Sales Tool"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id: "55b92ad621e4b7c40f00066d",
                    name: "LiveCasinoAndroid"
                },
                {
                    _id: "5605736c002c16436b000007",
                    name: "Stentle CSS"
                },
                {
                    _id: "55b92ad621e4b7c40f000696",
                    name: "Software Testing of Web Application"
                },
                {
                    _id: "562bc32484deb7cb59d61b70",
                    name: "MyDrive"
                },
                {
                    _id: "55b92ad621e4b7c40f000674",
                    name: "Win7 app tester needed"
                },
                {
                    _id: "55b92ad621e4b7c40f000663",
                    name: "ajaxbrowser.com"
                },
                {
                    _id: "55de1e8ef09cc2ec0b000031",
                    name: "BlueLight"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ab",
                    name: "QMR iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f000661",
                    name: "Android2"
                },
                {
                    _id: "55b92ad621e4b7c40f000689",
                    name: "iOS4"
                },
                {
                    _id: "568cea4977b14bf41bf2c32c",
                    name: "LocalCollector"
                },
                {
                    _id: "55b92ad621e4b7c40f000675",
                    name: "iOS6"
                },
                {
                    _id: "55b92ad621e4b7c40f00066c",
                    name: "DesignShargo"
                },
                {
                    _id: "55b92ad621e4b7c40f000691",
                    name: "Faceworks"
                },
                {
                    _id: "55b92ad621e4b7c40f00067a",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c2",
                    name: "WP Wrapper Unibet"
                },
                {
                    _id: "55b92ad621e4b7c40f00069d",
                    name: "iOS3"
                },
                {
                    _id: "55b92ad621e4b7c40f000660",
                    name: "iOS1"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b7",
                    name: "Design"
                },
                {
                    _id: "55b92ad621e4b7c40f000662",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55de2cd2f09cc2ec0b000053",
                    name: "Dragon Daze"
                },
                {
                    _id: "55b92ad621e4b7c40f000693",
                    name: "WP Player"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b2",
                    name: "Player"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                },
                {
                    _id: "55b92ad621e4b7c40f000669",
                    name: "Airsoft site"
                },
                {
                    _id: "55b92ad621e4b7c40f000666",
                    name: "blow.com"
                },
                {
                    _id: "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bf",
                    name: "Minder"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b5",
                    name: "KemblaJoggers"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b4",
                    name: "Vroup"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b0",
                    name: "Telecom"
                },
                { },
                {
                    _id: "56ab5ceb74d57e0d56d6bda5",
                    name: "CAPT"
                },
                {
                    _id: "55b92ad621e4b7c40f00067e",
                    name: "SoulIntentions"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a5",
                    name: "Android"
                },
                {
                    _id: "55b92ad621e4b7c40f000690",
                    name: "Max"
                },
                {
                    _id: "55b92ad621e4b7c40f000680",
                    name: "CodeThreads"
                },
                {
                    _id: "55b92ad621e4b7c40f000682",
                    name: "Connexus"
                },
                {
                    _id: "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id: "55b92ad621e4b7c40f000683",
                    name: "Bob"
                },
                {
                    _id: "55b92ad621e4b7c40f00067d",
                    name: "Sharalike"
                },
                {
                    _id: "55b92ad621e4b7c40f000667",
                    name: "PT2"
                },
                {
                    _id: "55b92ad621e4b7c40f00067c",
                    name: "iQshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ae",
                    name: "Kikast"
                },
                {
                    _id: "55b92ad621e4b7c40f000676",
                    name: "QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00067f",
                    name: "Player iOS/And"
                },
                {
                    _id: "55b92ad621e4b7c40f000698",
                    name: "Staffd"
                },
                {
                    _id: "55b92ad621e4b7c40f00066f",
                    name: "Oculus Player"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ba",
                    name: "TocToc"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b3",
                    name: "Loyalty"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c1",
                    name: "Ganchak Help"
                },
                {
                    _id: "56b9e0268f23c5696159cd0d",
                    name: "test_Alexander"
                },
                {
                    _id: "566857caa3fc012a68f0d83a",
                    name: "SPS Mobile"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                {
                    _id: "55b92ad621e4b7c40f00066e",
                    name: "LCUpdate iOS"
                },
                {
                    _id: "56685d88a3fc012a68f0d854",
                    name: "Nicolas Burer Design"
                },
                {
                    _id: "563b95acab9698be7c9df727",
                    name: "LoginChineseTrue"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bc",
                    name: "Pseudo"
                },
                {
                    _id: "55b92ad621e4b7c40f000697",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a3",
                    name: "iOS dev"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b1",
                    name: "Android Automation"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f00069f",
                    name: "iOS5"
                },
                {
                    _id: "55b92ad621e4b7c40f000695",
                    name: "Consent APP"
                },
                {
                    _id: "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ad",
                    name: "KX keyboard"
                },
                {
                    _id: "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id: "55b92ad621e4b7c40f000685",
                    name: "Travlr"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b9",
                    name: "Curb testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c0",
                    name: "TrumpT QA"
                },
                {
                    _id: "55b92ad621e4b7c40f000699",
                    name: "Tablet apps"
                },
                {
                    _id: "55b92ad621e4b7c40f000686",
                    name: "Sensei"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                }
            ],
            customer: [
                {
                    _id: "56a9ee95d59a04d6225b0df4",
                    name: "ThinkMobiles "
                },
                {
                    _id: "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                },
                {
                    _id: "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                },
                {
                    _id: "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id: "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id: "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id: "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id: "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id: "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id: "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id: "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id: "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id: "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id: "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    _id: "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id: "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id: "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id: "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id: "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id: "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id: "55b92ad621e4b7c40f00064b",
                    name: "Thomas "
                },
                {
                    _id: "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id: "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id: "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id: "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    name: null
                },
                {
                    _id: "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id: "55edaf167221afe30b000040",
                    name: "BetterIt "
                },
                {
                    _id: "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id: "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id: "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id: "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id: "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id: "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id: "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id: "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id: "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id: "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id: "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id: "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id: "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id: "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id: "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id: "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id: "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id: "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    _id: "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id: "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    _id: "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id: "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id: "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id: "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id: "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id: "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id: "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id: "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id: "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id: "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id: "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id: "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id: "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                },
                {
                    _id: "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id: "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id: "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id: "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id: "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id: "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id: "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id: "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id: "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id: "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id: "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker1 "
                },
                {
                    _id: "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id: "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id: "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id: "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id: "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id: "56ab5ca674d57e0d56d6bda4",
                    name: "Stian Maurstad"
                },
                {
                    _id: "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id: "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id: "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id: "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id: "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id: "55f55854b81672730c000010",
                    name: "MediaHeads "
                },
                {
                    _id: "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id: "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id: "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id: "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id: "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id: "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id: "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id: "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                },
                {
                    _id: "5661805cbb8be7814fb52529",
                    name: "Otrema "
                },
                {
                    _id: "561d1bc0b51032d674856acb",
                    name: "Attrecto "
                },
                {
                    _id: "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id: "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id: "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id: "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id: "5637627bc928c61d052d500e",
                    name: "Tibor Bekefi"
                },
                {
                    _id: "566d4b35abccac87642cb521",
                    name: "Scatch "
                }
            ],
            employee: [
                {
                    name: null
                },
                {
                    _id: "55c330d529bd6ccd0b000007",
                    name: "Alina Yurenko"
                },
                {
                    _id: "5614d4c7ab24a83b1dc1a7a8",
                    name: "Dmytro Babilia"
                },
                {
                    _id: "55b92ad221e4b7c40f000094",
                    name: "Anton Yarosh"
                },
                {
                    _id: "5667f310a3fc012a68f0d5f5",
                    name: "Michael Sopko"
                },
                {
                    _id: "5693b24bd87c9004552b63a1",
                    name: "Andriy Horak"
                },
                {
                    _id: "564a03d1ad4bc9e53f1f6195",
                    name: "Edgard Tanchenec"
                },
                {
                    _id: "564a02e0ad4bc9e53f1f6194",
                    name: "Taras Dvorian"
                },
                {
                    _id: "5637710e5d23a8eb04e80aed",
                    name: "Viktoria Kovalenko"
                },
                {
                    _id: "5652dd95c4d12cf51e7f7e0b",
                    name: "Sergiy Petakh"
                },
                {
                    _id: "565c66633410ae512364dc00",
                    name: "Alona Timochchenko"
                },
                {
                    _id: "56123232c90e2fb026ce064b",
                    name: "Olga Sikora"
                },
                {
                    _id: "55b92ad221e4b7c40f000090",
                    name: "Gabriella Shterr"
                },
                {
                    _id: "55b92ad221e4b7c40f00009a",
                    name: "Katerina Pasichnyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f00008d",
                    name: "Svitlana Kira"
                },
                {
                    _id: "55bf45cf65cda0810b00000a",
                    name: "Liliya Shustur"
                },
                {
                    _id: "55d1e234dda01e250c000015",
                    name: "Kristian Rimar"
                },
                {
                    _id: "55eeed546dceaee10b00001e",
                    name: "Vladyslav Turytskyi"
                },
                {
                    _id: "55e419094983acdd0b000012",
                    name: "Kirill Paliiuk"
                },
                {
                    _id: "56090fae86e2435a33000008",
                    name: "Inna Nukhova"
                },
                {
                    _id: "55e96ab13f3ae4fd0b000009",
                    name: "Oles Pavliuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ce",
                    name: "Alex Storojenko"
                },
                {
                    _id: "5600042ca36a8ca10c000029",
                    name: "Michael Filchak"
                },
                {
                    _id: "55c98aa7cbb0f4910b000005",
                    name: "Eugen Rechun"
                },
                {
                    _id: "55dd71eaf09cc2ec0b000007",
                    name: "Ivan Khartov"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c6",
                    name: "Illia Kramarenko"
                },
                {
                    _id: "55f7c20a6d43203d0c000005",
                    name: "Yana Samaryk"
                },
                {
                    _id: "55c06411d011746b0b000005",
                    name: "Maxim Rachytskyy"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b1",
                    name: "Daniil Korniyenko"
                },
                {
                    _id: "55c84a4aaa36a0e60a000005",
                    name: "Pavlo Muratov"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cf",
                    name: "Yaroslav Denysiuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cd",
                    name: "Andriy Vovk"
                },
                {
                    _id: "5649b8ccad4bc9e53f1f6192",
                    name: "Sergiy Gevelev"
                },
                {
                    _id: "55b92ad221e4b7c40f0000aa",
                    name: "Ivan Lyashenko"
                },
                {
                    _id: "55d1d860dda01e250c000010",
                    name: "Vasiliy Hoshovsky"
                },
                {
                    _id: "565c2793f4dcd63b5dbd7372",
                    name: "Denis Yaremenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cc",
                    name: "Ivan Lyakh"
                },
                {
                    _id: "55dd63f8f09cc2ec0b000006",
                    name: "Sergiy Ihnatko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b6",
                    name: "Denis Vengrin"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bd",
                    name: "Michael Vashkeba"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ae",
                    name: "Tamara Dolottseva"
                },
                {
                    _id: "566ede9e8453e8b464b70b71",
                    name: "Alex Tonkovid"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ca",
                    name: "Yana Vengerova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c7",
                    name: "Liliya Mykhailova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a7",
                    name: "Alex Ryabcev"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c5",
                    name: "Michael Gajdan"
                },
                {
                    _id: "55b92ad221e4b7c40f00009f",
                    name: "Dmitriy Dzuba"
                },
                {
                    _id: "55b92ad221e4b7c40f000085",
                    name: "Kirill Gorbushko"
                },
                {
                    _id: "55b92ad221e4b7c40f000036",
                    name: "Michael Yemets"
                },
                {
                    _id: "55b92ad221e4b7c40f00003c",
                    name: "Oleg Stasiv"
                },
                {
                    _id: "56b2287b99ce8d706a81b2bc",
                    name: "Kostiantyn Mudrenok"
                },
                {
                    _id: "55b92ad221e4b7c40f00008a",
                    name: "Oleg Mahobey"
                },
                {
                    _id: "55b92ad221e4b7c40f000031",
                    name: "Alex Gleba"
                },
                {
                    _id: "55b92ad221e4b7c40f000062",
                    name: "Vasiliy Cheypesh"
                },
                {
                    _id: "55b92ad221e4b7c40f000080",
                    name: "Vasiliy Barchiy"
                },
                {
                    _id: "55b92ad221e4b7c40f000070",
                    name: "Daniil Pozhidaev"
                },
                {
                    _id: "55b92ad221e4b7c40f000092",
                    name: "Eduard Dedenok"
                },
                {
                    _id: "564da59f9b85f8b16b574fe9",
                    name: "Andriy Chuprov"
                },
                {
                    _id: "55b92ad221e4b7c40f000048",
                    name: "Katerina Chupova"
                },
                {
                    _id: "564dac3e9b85f8b16b574fea",
                    name: "Alex Filchak"
                },
                {
                    _id: "55b92ad221e4b7c40f000059",
                    name: "Anatoliy Dalekorey"
                },
                {
                    _id: "55b92ad221e4b7c40f000061",
                    name: "Tamas Mondok"
                },
                {
                    _id: "55b92ad221e4b7c40f000037",
                    name: "Oleksiy Shanghin"
                },
                {
                    _id: "55b92ad221e4b7c40f000072",
                    name: "Eugen Bernikevich"
                },
                {
                    _id: "55b92ad221e4b7c40f00008c",
                    name: "Anton Gychka"
                },
                {
                    _id: "55b92ad221e4b7c40f00003a",
                    name: "Vasiliy Agosta"
                },
                {
                    _id: "55b92ad221e4b7c40f00007f",
                    name: "Vasilisa Klimchenko"
                },
                {
                    _id: "55b92ad221e4b7c40f00003b",
                    name: "Vitaliy Bizilya"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c4",
                    name: "Michael Myronyshyn"
                },
                {
                    _id: "55b92ad221e4b7c40f00007b",
                    name: "Roman Guti"
                },
                {
                    _id: "565c306af4dcd63b5dbd7373",
                    name: "Myroslav Matrafayilo"
                },
                {
                    _id: "55b92ad221e4b7c40f00006b",
                    name: "Dmitriy Kanivets"
                },
                {
                    _id: "564a0186ad4bc9e53f1f6193",
                    name: "Liliya Orlenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bf",
                    name: "Andriy Fizer"
                },
                {
                    _id: "55b92ad221e4b7c40f000098",
                    name: "Andriy Krupka"
                },
                {
                    _id: "55b92ad221e4b7c40f000082",
                    name: "Yaroslav Fuchko"
                },
                {
                    _id: "56965733d87c9004552b63be",
                    name: "Andriy Samokhin"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c9",
                    name: "Oleksiy Fedosov"
                },
                {
                    _id: "55b92ad221e4b7c40f00004d",
                    name: "Vyacheslav Kopinets"
                },
                {
                    _id: "568cdd375527d6691cb68b22",
                    name: "Sergey Melnik"
                },
                {
                    _id: "55b92ad221e4b7c40f000038",
                    name: "Roman Babunich"
                },
                {
                    _id: "55b92ad221e4b7c40f000077",
                    name: "Michael Soyma"
                },
                {
                    _id: "55b92ad221e4b7c40f000052",
                    name: "Vladimir Gerasimenko"
                },
                {
                    _id: "55b92ad221e4b7c40f00006f",
                    name: "Anton Karabeinikov"
                },
                {
                    _id: "56966c82d87c9004552b63c7",
                    name: "Ihor Kuzma"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a1",
                    name: "Sergiy Stepaniuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000047",
                    name: "Ilya Khymych"
                },
                {
                    _id: "567ac0a48365c9a205406f33",
                    name: "Dmytro Kolochynsky"
                },
                {
                    _id: "55b92ad221e4b7c40f00007a",
                    name: "Robert Fogash"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b2",
                    name: "Michael Yeremenko"
                },
                {
                    _id: "55b92ad221e4b7c40f00008e",
                    name: "Ivan Grab"
                },
                {
                    _id: "55b92ad221e4b7c40f000043",
                    name: "Maxim Geraschenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000035",
                    name: "Ilya Mondok"
                },
                {
                    _id: "55b92ad221e4b7c40f00006c",
                    name: "Alex Sich"
                },
                {
                    _id: "55b92ad221e4b7c40f000093",
                    name: "Vasiliy Lupchey"
                },
                {
                    _id: "55b92ad221e4b7c40f00005a",
                    name: "Bogdan Cheypesh"
                },
                {
                    _id: "55b92ad221e4b7c40f000078",
                    name: "Oleg Boyanivskiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00007d",
                    name: "Stas Volskiy"
                },
                {
                    _id: "55b92ad221e4b7c40f000095",
                    name: "Oleksiy Kuropyatnik"
                },
                {
                    _id: "55b92ad221e4b7c40f000058",
                    name: "Alex Makhanets"
                },
                {
                    _id: "55b92ad221e4b7c40f000057",
                    name: "Alex Roman"
                },
                {
                    _id: "55c98df0cbb0f4910b000007",
                    name: "Timur Berezhnoi"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b4",
                    name: "Vasiliy Prokopyshyn"
                },
                {
                    _id: "55b92ad221e4b7c40f000030",
                    name: "Alex Svatuk"
                },
                {
                    _id: "55b92ad221e4b7c40f00006e",
                    name: "Andriy Hanchak"
                },
                {
                    _id: "55ca0145cbb0f4910b000009",
                    name: "Denis Zinkovskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f00005d",
                    name: "Lubomir Gerevich"
                },
                {
                    _id: "55b92ad221e4b7c40f000079",
                    name: "Oleksiy Gerasimov"
                },
                {
                    _id: "55b92ad221e4b7c40f000076",
                    name: "Michael Glagola"
                },
                {
                    _id: "55eef3fd6dceaee10b000020",
                    name: "Roman Saldan"
                },
                {
                    _id: "55b92ad221e4b7c40f000046",
                    name: "Denis Udod"
                },
                {
                    _id: "55b92ad221e4b7c40f00005c",
                    name: "Ivan Irchak"
                },
                {
                    _id: "55b92ad221e4b7c40f000045",
                    name: "Andriy Tivodar"
                },
                {
                    _id: "561b756f9ebb48212ea838c0",
                    name: "Stanislav Romanyuk"
                },
                {
                    _id: "56090d77066d979a33000009",
                    name: "Yuriy Bysaha"
                },
                {
                    _id: "55b92ad221e4b7c40f000088",
                    name: "Viktor Buchok"
                },
                {
                    _id: "55b92ad221e4b7c40f000049",
                    name: "Michael Kapustey"
                },
                {
                    _id: "55b92ad221e4b7c40f000086",
                    name: "Roman Kubichka"
                },
                {
                    _id: "55b92ad221e4b7c40f00007c",
                    name: "Sergiy Sheba"
                },
                {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: "Vitaliy Shuba"
                },
                {
                    _id: "569cce1dcf1f31f925c026fa",
                    name: "Andriy Stupchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b9",
                    name: "Olena Melnyk"
                },
                {
                    _id: "55b92ad221e4b7c40f000032",
                    name: "Bogdan Sakalo"
                },
                {
                    _id: "55b92ad221e4b7c40f000041",
                    name: "Eugen Oleynikov"
                },
                {
                    _id: "566fe2348453e8b464b70ba6",
                    name: "Andriy Lukashchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a8",
                    name: "Andriy Korneychuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c8",
                    name: "Ivan Bizilya"
                },
                {
                    _id: "55b92ad221e4b7c40f00003d",
                    name: "German Kravets"
                },
                {
                    _id: "55b92ad221e4b7c40f000064",
                    name: "Sergiy Tilishevsky"
                },
                {
                    _id: "55b92ad221e4b7c40f000074",
                    name: "Ivan Kornyk"
                },
                {
                    _id: "55b92ad221e4b7c40f000033",
                    name: "Dmitriy Bruso"
                },
                {
                    _id: "55b92ad221e4b7c40f00003e",
                    name: "Alex Lapchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b7",
                    name: "Myroslava Polovka"
                },
                {
                    _id: "55b92ad221e4b7c40f000091",
                    name: "Viktor Kiver"
                },
                {
                    _id: "55b92ad221e4b7c40f00007e",
                    name: "Taras Zmiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00009c",
                    name: "Ivan Feltsan"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00006d",
                    name: "Alex Tutunnik"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a5",
                    name: "Maxim Holubka"
                },
                {
                    _id: "561bb90a9ebb48212ea838c7",
                    name: "Andriy Svyd"
                },
                {
                    _id: "55b92ad221e4b7c40f000044",
                    name: "Alex Devezenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000039",
                    name: "Stas Rikun"
                },
                {
                    _id: "55dd73d1f09cc2ec0b000008",
                    name: "Roman Vizenko"
                },
                {
                    _id: "55dd7776f09cc2ec0b000009",
                    name: "Michael Kavka"
                },
                {
                    _id: "55b92ad221e4b7c40f000051",
                    name: "Richard Mozes"
                },
                {
                    _id: "55b92ad221e4b7c40f00006a",
                    name: "Vadim Tsipf"
                },
                {
                    _id: "55c32e0d29bd6ccd0b000005",
                    name: "Eugen Alexeev"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a4",
                    name: "Eugen Sokolenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000065",
                    name: "Yuriy Sirko"
                },
                {
                    _id: "55f7c3736d43203d0c000006",
                    name: "Yuriy Bodak"
                },
                {
                    _id: "55b92ad221e4b7c40f000066",
                    name: "Egor Gromadskiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00005b",
                    name: "Eduard Chori"
                },
                {
                    _id: "55b92ad221e4b7c40f000034",
                    name: "Ishtvan Nazarovich"
                },
                {
                    _id: "55b92ad221e4b7c40f00005e",
                    name: "Michael Didenko"
                },
                {
                    _id: "5638aa635d23a8eb04e80af0",
                    name: "Alex Siladii"
                },
                {
                    _id: "55b92ad221e4b7c40f000083",
                    name: "Antonina Zhuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000053",
                    name: "Vasiliy Seredniy"
                },
                {
                    _id: "55b92ad221e4b7c40f000054",
                    name: "Yuriy Derevenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000055",
                    name: "Michael Rogach"
                },
                {
                    _id: "55c98b86cbb0f4910b000006",
                    name: "Ivan Kovalenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000084",
                    name: "Alex Dahno"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b0",
                    name: "Roman Donchenko"
                },
                {
                    _id: "55e549309624477a0b000005",
                    name: "Petro Rospopa"
                },
                {
                    _id: "55b92ad221e4b7c40f000096",
                    name: "Andriy Herasymyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c3",
                    name: "Olesia Prokoshkina"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ad",
                    name: "Stepan Krovspey"
                },
                {
                    _id: "55b92ad221e4b7c40f000060",
                    name: "Roman Buchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f00004c",
                    name: "Sofia Nayda"
                },
                {
                    _id: "55b92ad221e4b7c40f00008f",
                    name: "Yuriy Holovatskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000050",
                    name: "Tamila Holovatska"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "55b92ad221e4b7c40f000097",
                    name: "Samgash Abylgazinov"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a3",
                    name: "Andriy Karpenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000087",
                    name: "Ivan Kostromin"
                },
                {
                    _id: "55b92ad221e4b7c40f00009e",
                    name: "Alex Michenko"
                },
                {
                    _id: "55c0656ad011746b0b000006",
                    name: "Anton Nizhegorodov"
                },
                {
                    _id: "561ba7039ebb48212ea838c3",
                    name: "Oleksandra Maliavska"
                },
                {
                    _id: "55b92ad221e4b7c40f000089",
                    name: "Maxim Sychov"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c2",
                    name: "Andriy Mistetskiy"
                }
            ],
            department: [
                { },
                {
                    _id: "566ee11b8453e8b464b70b73",
                    name: "Ruby on Rails"
                },
                {
                    _id: "56802eb31afe27f547b7ba52",
                    name: "JS"
                },
                {
                    _id: "56802e9d1afe27f547b7ba51",
                    name: "CSS/FrontEnd"
                },
                {
                    _id: "55b92ace21e4b7c40f000011",
                    name: "QA"
                },
                {
                    _id: "55b92ace21e4b7c40f000010",
                    name: "Android"
                },
                {
                    _id: "55b92ace21e4b7c40f000012",
                    name: ".NET/WP"
                },
                {
                    _id: "55bb1f40cb76ca630b000007",
                    name: "PM"
                },
                {
                    _id: "56802ec21afe27f547b7ba53",
                    name: "PHP/WordPress"
                },
                {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                {
                    _id: "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                {
                    _id: "55b92ace21e4b7c40f00000f",
                    name: "iOS"
                },
                {
                    _id: "55b92ace21e4b7c40f000013",
                    name: "Marketing"
                },
                {
                    _id: "55bb1f14cb76ca630b000006",
                    name: "Design"
                }
            ],
            year: [
                { },
                {
                    _id: 2016,
                    name: 2016
                },
                {
                    _id: 2015,
                    name: 2015
                },
                {
                    _id: 2014,
                    name: 2014
                }
            ],
            month: [
                { },
                {
                    _id: 7,
                    name: 7
                },
                {
                    _id: 6,
                    name: 6
                },
                {
                    _id: 8,
                    name: 8
                },
                {
                    _id: 10,
                    name: 10
                },
                {
                    _id: 1,
                    name: 1
                },
                {
                    _id: 9,
                    name: 9
                },
                {
                    _id: 2,
                    name: 2
                },
                {
                    _id: 11,
                    name: 11
                },
                {
                    _id: 12,
                    name: 12
                },
                {
                    _id: 5,
                    name: 5
                },
                {
                    _id: 4,
                    name: 4
                },
                {
                    _id: 3,
                    name: 3
                }
            ],
            week: [
                { },
                {
                    _id: 27,
                    name: 27
                },
                {
                    _id: 28,
                    name: 28
                },
                {
                    _id: 25,
                    name: 25
                },
                {
                    _id: 20,
                    name: 20
                },
                {
                    _id: 22,
                    name: 22
                },
                {
                    _id: 29,
                    name: 29
                },
                {
                    _id: 50,
                    name: 50
                },
                {
                    _id: 30,
                    name: 30
                },
                {
                    _id: 14,
                    name: 14
                },
                {
                    _id: 51,
                    name: 51
                },
                {
                    _id: 26,
                    name: 26
                },
                {
                    _id: 47,
                    name: 47
                },
                {
                    _id: 46,
                    name: 46
                },
                {
                    _id: 24,
                    name: 24
                },
                {
                    _id: 8,
                    name: 8
                },
                {
                    _id: 49,
                    name: 49
                },
                {
                    _id: 39,
                    name: 39
                },
                {
                    _id: 48,
                    name: 48
                },
                {
                    _id: 1,
                    name: 1
                },
                {
                    _id: 41,
                    name: 41
                },
                {
                    _id: 45,
                    name: 45
                },
                {
                    _id: 33,
                    name: 33
                },
                {
                    _id: 17,
                    name: 17
                },
                {
                    _id: 34,
                    name: 34
                },
                {
                    _id: 40,
                    name: 40
                },
                {
                    _id: 11,
                    name: 11
                },
                {
                    _id: 35,
                    name: 35
                },
                {
                    _id: 38,
                    name: 38
                },
                {
                    _id: 12,
                    name: 12
                },
                {
                    _id: 44,
                    name: 44
                },
                {
                    _id: 18,
                    name: 18
                },
                {
                    _id: 32,
                    name: 32
                },
                {
                    _id: 43,
                    name: 43
                },
                {
                    _id: 31,
                    name: 31
                },
                {
                    _id: 21,
                    name: 21
                },
                {
                    _id: 52,
                    name: 52
                },
                {
                    _id: 2,
                    name: 2
                },
                {
                    _id: 9,
                    name: 9
                },
                {
                    _id: 3,
                    name: 3
                },
                {
                    _id: 4,
                    name: 4
                },
                {
                    _id: 37,
                    name: 37
                },
                {
                    _id: 5,
                    name: 5
                },
                {
                    _id: 53,
                    name: 53
                },
                {
                    _id: 7,
                    name: 7
                },
                {
                    _id: 36,
                    name: 36
                },
                {
                    _id: 15,
                    name: 15
                },
                {
                    _id: 13,
                    name: 13
                },
                {
                    _id: 10,
                    name: 10
                },
                {
                    _id: 16,
                    name: 16
                },
                {
                    _id: 42,
                    name: 42
                },
                {
                    _id: 6,
                    name: 6
                },
                {
                    _id: 23,
                    name: 23
                },
                {
                    _id: 19,
                    name: 19
                }
            ],
            isPaid: [
                {
                    _id: "true",
                    name: "Paid"
                },
                {
                    _id: "false",
                    name: "Unpaid"
                }
            ]
        },
        Projects: {
            _id: null,
            workflow: [
                {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                {
                    _id: "528ce80ef3f67bc40b000024",
                    name: "Cancelled"
                },
                {
                    _id: "528ce7e3f3f67bc40b000022",
                    name: "Pending"
                },
                {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                {
                    _id: "528ce82df3f67bc40b000025",
                    name: "Closed"
                }
            ],
            customer: [
                {
                    _id: "56a9ee95d59a04d6225b0df4",
                    name: "ThinkMobiles "
                },
                {
                    _id: "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                },
                {
                    _id: "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                },
                {
                    _id: "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id: "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id: "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id: "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id: "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    _id: "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id: "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id: "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id: "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id: "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id: "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id: "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id: "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id: "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id: "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id: "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id: "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id: "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                },
                {
                    _id: "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id: "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id: "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id: "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id: "55b92ad621e4b7c40f00064b",
                    name: "Thomas "
                },
                {
                    _id: "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id: "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id: "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id: "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id: "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id: "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id: "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id: "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id: "55edaf167221afe30b000040",
                    name: "BetterIt "
                },
                {
                    _id: "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id: "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id: "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id: "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id: "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker1 "
                },
                {
                    _id: "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id: "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    _id: "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id: "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id: "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    _id: "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id: "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id: "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id: "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id: "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id: "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id: "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id: "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id: "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id: "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id: "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id: "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id: "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id: "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id: "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id: "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id: "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id: "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id: "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id: "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id: "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id: "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id: "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id: "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id: "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id: "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id: "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id: "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id: "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id: "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id: "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id: "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id: "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id: "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id: "55f55854b81672730c000010",
                    name: "MediaHeads "
                },
                {
                    _id: "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id: "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id: "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id: "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id: "56ab5ca674d57e0d56d6bda4",
                    name: "Stian Maurstad"
                },
                {
                    _id: "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id: "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id: "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id: "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id: "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id: "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                },
                {
                    _id: "5661805cbb8be7814fb52529",
                    name: "Otrema "
                },
                {
                    _id: "561d1bc0b51032d674856acb",
                    name: "Attrecto "
                },
                {
                    _id: "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id: "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id: "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id: "5637627bc928c61d052d500e",
                    name: "Tibor Bekefi"
                },
                {
                    _id: "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id: "566d4b35abccac87642cb521",
                    name: "Scatch "
                }
            ],
            projectmanager: [
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                }
            ],
            name: [
                {
                    _id: "56bdcc69dfd8a81466e2f58a",
                    name: "Buzinga extra costs"
                },
                {
                    _id: "56bc8fd2dfd8a81466e2f46b",
                    name: "WSpider"
                },
                {
                    _id: "56b09dd8d6ef38a708dfc284",
                    name: "Vike Analytics Integration"
                },
                {
                    _id: "56ab958e74d57e0d56d6be3b",
                    name: "Planogram"
                },
                {
                    _id: "56aa2cb4b4dc0d09232bd7aa",
                    name: "AngularJS - Stentle"
                },
                {
                    _id: "56a24d5faa157ca50f21fb13",
                    name: "Water Safety App"
                },
                {
                    _id: "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                {
                    _id: "569f60d162d172544baf0d58",
                    name: "Android advertisement"
                },
                {
                    _id: "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id: "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id: "565740e0bfd103f108eb4ad4",
                    name: "HKConnect"
                },
                {
                    _id: "56422bfc70bbc2b740ce89f3",
                    name: "PREEME"
                },
                {
                    _id: "5638e863593807ff047d99e5",
                    name: "Bizrate"
                },
                {
                    _id: "56ab891074d57e0d56d6be1f",
                    name: "Serial Box"
                },
                {
                    _id: "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id: "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id: "5629e238129820ab5994e8c0",
                    name: "Bus Project"
                },
                {
                    _id: "561ebb8cd6c741e8235f42ea",
                    name: "Bodega application"
                },
                {
                    _id: "56a89384eb2b76c70ec74d1e",
                    name: "Locappy"
                },
                {
                    _id: "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id: "561253dfc90e2fb026ce064d",
                    name: "Shiwaforce Karma QA"
                },
                {
                    _id: "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id: "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id: "55f5728cb81672730c00006a",
                    name: "BetterIt ios"
                },
                {
                    _id: "55f55d31b81672730c000020",
                    name: "Farmers App"
                },
                {
                    _id: "55f56442b81672730c000032",
                    name: "Tinder clone"
                },
                {
                    _id: "55f55a89b81672730c000017",
                    name: "Bimii"
                },
                {
                    _id: "55ded24cae2b22730b000040",
                    name: "FarmStatistic"
                },
                {
                    _id: "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id: "55de2a30f09cc2ec0b00004e",
                    name: "GovMap"
                },
                {
                    _id: "55de24bbf09cc2ec0b000036",
                    name: "FosterFarms"
                },
                {
                    _id: "56afdabef5c2bcd4555cb2f8",
                    name: "Design Slots"
                },
                {
                    _id: "563295f6c928c61d052d5003",
                    name: "WordPress Sites"
                },
                {
                    _id: "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id: "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id: "563767135d23a8eb04e80aec",
                    name: "Coach App"
                },
                {
                    _id: "55cdc96d9b42266a4f000006",
                    name: "Absolute Vodka"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d6",
                    name: "ArTV"
                },
                {
                    _id: "56618227bb8be7814fb526e5",
                    name: "Otrema WP4"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d5",
                    name: "Unlimited Conferencing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ce",
                    name: "FlipStar Game"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cd",
                    name: "CloudFuze"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cb",
                    name: "Bayzat"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ca",
                    name: "SketchTechPoints"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c8",
                    name: "PriTriever"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c4",
                    name: "Ibizawire"
                },
                {
                    _id: "561d1c3db51032d674856acc",
                    name: "PayFever"
                },
                {
                    _id: "55f55901b81672730c000011",
                    name: "WhachApp"
                },
                {
                    _id: "55b92ad621e4b7c40f00068c",
                    name: "DRH manual"
                },
                {
                    _id: "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d1",
                    name: "Sales Tool"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id: "55b92ad621e4b7c40f000685",
                    name: "Travlr"
                },
                {
                    _id: "569f5bc662d172544baf0c40",
                    name: "Gilad Nevo Bug fixing"
                },
                {
                    _id: "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id: "55b92ad621e4b7c40f000670",
                    name: "iRemember"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a9",
                    name: "Spokal"
                },
                {
                    _id: "55b92ad621e4b7c40f000682",
                    name: "Connexus"
                },
                {
                    _id: "55b92ad621e4b7c40f000681",
                    name: "AirPort"
                },
                {
                    _id: "56a9ef06d59a04d6225b0df6",
                    name: "UpCity"
                },
                {
                    _id: "55b92ad621e4b7c40f00068e",
                    name: "Phidget ANE"
                },
                {
                    _id: "56304d56547f50b51d6de2bb",
                    name: "Move for Less"
                },
                {
                    _id: "55b92ad621e4b7c40f00066b",
                    name: "Nikky"
                },
                {
                    _id: "56a23c5caa157ca50f21fae1",
                    name: "Demolition Derby"
                },
                {
                    _id: "55b92ad621e4b7c40f00069c",
                    name: "sTrader"
                },
                {
                    _id: "56ab5ceb74d57e0d56d6bda5",
                    name: "CAPT"
                },
                {
                    _id: "55b92ad621e4b7c40f00067e",
                    name: "SoulIntentions"
                },
                {
                    _id: "55b92ad621e4b7c40f00067b",
                    name: "Android Help"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c9",
                    name: "spscontrol"
                },
                {
                    _id: "55b92ad621e4b7c40f000677",
                    name: "Android Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f00066a",
                    name: "The Watch Enthusiast"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c6",
                    name: "Demo Rocket"
                },
                {
                    _id: "55b92ad621e4b7c40f000687",
                    name: "iOS/Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f000664",
                    name: "BelgiumHTML"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d2",
                    name: "Snapped"
                },
                {
                    _id: "55b92ad621e4b7c40f000665",
                    name: "JellyGames"
                },
                {
                    _id: "55b92ad621e4b7c40f00068a",
                    name: "application regression testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000691",
                    name: "Faceworks"
                },
                {
                    _id: "55b92ad621e4b7c40f000663",
                    name: "ajaxbrowser.com"
                },
                {
                    _id: "562bc32484deb7cb59d61b70",
                    name: "MyDrive"
                },
                {
                    _id: "55b92ad621e4b7c40f000674",
                    name: "Win7 app tester needed"
                },
                {
                    _id: "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id: "55b92ad621e4b7c40f000683",
                    name: "Bob"
                },
                {
                    _id: "55b92ad621e4b7c40f000667",
                    name: "PT2"
                },
                {
                    _id: "55b92ad621e4b7c40f00067d",
                    name: "Sharalike"
                },
                {
                    _id: "55b92ad621e4b7c40f000673",
                    name: "Q/A digital QA"
                },
                {
                    _id: "55b92ad621e4b7c40f000662",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000688",
                    name: "iOS2"
                },
                {
                    _id: "55b92ad621e4b7c40f000668",
                    name: "Selenium IDE"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c5",
                    name: "Liquivid"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ac",
                    name: "Manual front end testing for e commerce site"
                },
                {
                    _id: "55b92ad621e4b7c40f000689",
                    name: "iOS4"
                },
                {
                    _id: "55b92ad621e4b7c40f00067a",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "56abd16ac6be8658550dc6c3",
                    name: "Baccarat"
                },
                {
                    _id: "55b92ad621e4b7c40f00065f",
                    name: "IOS/Android QA"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                },
                {
                    _id: "55b92ad621e4b7c40f000669",
                    name: "Airsoft site"
                },
                {
                    _id: "55b92ad621e4b7c40f00066d",
                    name: "LiveCasinoAndroid"
                },
                {
                    _id: "55b92ad621e4b7c40f00067f",
                    name: "Player iOS/And"
                },
                {
                    _id: "55b92ad621e4b7c40f000676",
                    name: "QA"
                },
                {
                    _id: "5605736c002c16436b000007",
                    name: "Stentle CSS"
                },
                {
                    _id: "55b92ad621e4b7c40f000696",
                    name: "Software Testing of Web Application"
                },
                {
                    _id: "55b92ad621e4b7c40f00066e",
                    name: "LCUpdate iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f000666",
                    name: "blow.com"
                },
                {
                    _id: "568cea4977b14bf41bf2c32c",
                    name: "LocalCollector"
                },
                {
                    _id: "55b92ad621e4b7c40f00066c",
                    name: "DesignShargo"
                },
                {
                    _id: "55b92ad621e4b7c40f000675",
                    name: "iOS6"
                },
                {
                    _id: "55b92ad621e4b7c40f000672",
                    name: "DRH QA Automation"
                },
                {
                    _id: "55de1e8ef09cc2ec0b000031",
                    name: "BlueLight"
                },
                {
                    _id: "55b92ad621e4b7c40f000661",
                    name: "Android2"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ab",
                    name: "QMR iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                },
                {
                    _id: "55b92ad621e4b7c40f00068f",
                    name: "QMR Android"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d7",
                    name: "Mesa Ave"
                },
                {
                    _id: "55b92ad621e4b7c40f00068b",
                    name: "Unity3D"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a0",
                    name: "GetFit"
                },
                {
                    _id: "55de2cd2f09cc2ec0b000053",
                    name: "Dragon Daze"
                },
                {
                    _id: "55b92ad621e4b7c40f000693",
                    name: "WP Player"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b2",
                    name: "Player"
                },
                {
                    _id: "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bf",
                    name: "Minder"
                },
                {
                    _id: "55b92ad621e4b7c40f000697",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f00066f",
                    name: "Oculus Player"
                },
                {
                    _id: "55b92ad621e4b7c40f000698",
                    name: "Staffd"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c1",
                    name: "Ganchak Help"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ba",
                    name: "TocToc"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b3",
                    name: "Loyalty"
                },
                {
                    _id: "55b92ad621e4b7c40f000686",
                    name: "Sensei"
                },
                {
                    _id: "55b92ad621e4b7c40f000699",
                    name: "Tablet apps"
                },
                {
                    _id: "568b85b33cce9254776f2b4c",
                    name: "FluxIOT"
                },
                {
                    _id: "55b92ad621e4b7c40f00069e",
                    name: "Android1"
                },
                {
                    _id: "55b92ad621e4b7c40f000678",
                    name: "Appium testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006aa",
                    name: "DiveplanIT"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c2",
                    name: "WP Wrapper Unibet"
                },
                {
                    _id: "55b92ad621e4b7c40f00069d",
                    name: "iOS3"
                },
                {
                    _id: "55b92ad621e4b7c40f000660",
                    name: "iOS1"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b7",
                    name: "Design"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a2",
                    name: "Android"
                },
                {
                    _id: "55cf5ea04a91e37b0b00012c",
                    name: "Global Workshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a4",
                    name: "iOS Periop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a8",
                    name: "sitefix"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id: "55b92ad621e4b7c40f000680",
                    name: "CodeThreads"
                },
                {
                    _id: "55b92ad621e4b7c40f000690",
                    name: "Max"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a5",
                    name: "Android"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a6",
                    name: "Moriser"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a7",
                    name: "couch"
                },
                {
                    _id: "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ad",
                    name: "KX keyboard"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b6",
                    name: "Shiwaforce Karma"
                },
                {
                    _id: "55b92ad621e4b7c40f00067c",
                    name: "iQshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ae",
                    name: "Kikast"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f000692",
                    name: "WishExpress"
                },
                {
                    _id: "55b92ad621e4b7c40f0006af",
                    name: "Academic Website testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b0",
                    name: "Telecom"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a3",
                    name: "iOS dev"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b1",
                    name: "Android Automation"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b4",
                    name: "Vroup"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b5",
                    name: "KemblaJoggers"
                },
                {
                    _id: "56b9e0268f23c5696159cd0d",
                    name: "test_Alexander"
                },
                {
                    _id: "566857caa3fc012a68f0d83a",
                    name: "SPS Mobile"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                {
                    _id: "56685d88a3fc012a68f0d854",
                    name: "Nicolas Burer Design"
                },
                {
                    _id: "563b95acab9698be7c9df727",
                    name: "LoginChineseTrue"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bc",
                    name: "Pseudo"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f000695",
                    name: "Consent APP"
                },
                {
                    _id: "55b92ad621e4b7c40f00069f",
                    name: "iOS5"
                },
                {
                    _id: "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b9",
                    name: "Curb testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c0",
                    name: "TrumpT QA"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c3",
                    name: "Jude"
                }
            ]
        },
        supplierPayments: {
            _id: null,
            supplier: [
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                }
            ],
            paymentRef: [
                {
                    _id: "Sales/Head 8%",
                    name: "Sales/Head 8%"
                },
                {
                    _id: "Sales/Usual 8%",
                    name: "Sales/Usual 8%"
                },
                {
                    _id: "Sales/QA 14%",
                    name: "Sales/QA 14%"
                },
                {
                    _id: "Sales/QA 16%",
                    name: "Sales/QA 16%"
                },
                {
                    _id: "Sales/Head 10%",
                    name: "Sales/Head 10%"
                }
            ],
            year: [
                {
                    _id: 2014,
                    name: 2014
                },
                {
                    _id: 2015,
                    name: 2015
                }
            ],
            month: [
                {
                    _id: 3,
                    name: 3
                },
                {
                    _id: 4,
                    name: 4
                },
                {
                    _id: 9,
                    name: 9
                },
                {
                    _id: 5,
                    name: 5
                },
                {
                    _id: 10,
                    name: 10
                },
                {
                    _id: 2,
                    name: 2
                },
                {
                    _id: 12,
                    name: 12
                },
                {
                    _id: 11,
                    name: 11
                },
                {
                    _id: 8,
                    name: 8
                },
                {
                    _id: 1,
                    name: 1
                }
            ],
            workflow: [
                {
                    _id: "Paid",
                    name: "Paid"
                }
            ]
        },
        salesOrder: {
            _id: null,
            projectName: [
                {
                    _id: "55b92ad621e4b7c40f0006b6",
                    name: "Shiwaforce Karma"
                },
                {
                    _id: "56ab958e74d57e0d56d6be3b",
                    name: "Planogram"
                },
                {
                    _id: "56aa2cb4b4dc0d09232bd7aa",
                    name: "AngularJS - Stentle"
                },
                {
                    _id: "569ced3fea21e2ac7d729e18",
                    name: "MySmallCommunity"
                },
                {
                    _id: "569f58df62d172544baf0c3d",
                    name: "Haie"
                },
                {
                    _id: "561253dfc90e2fb026ce064d",
                    name: "Shiwaforce Karma QA"
                },
                {
                    _id: "569f60d162d172544baf0d58",
                    name: "Android advertisement"
                },
                {
                    _id: "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                {
                    _id: "56422bfc70bbc2b740ce89f3",
                    name: "PREEME"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d6",
                    name: "ArTV"
                },
                {
                    _id: "562ff292b03714731dd8433b",
                    name: "Appsmakerstore"
                },
                {
                    _id: "56a89384eb2b76c70ec74d1e",
                    name: "Locappy"
                },
                {
                    _id: "5613b6f0c90e2fb026ce068c",
                    name: "iTacit"
                },
                {
                    _id: "562bba6e4a431b5a5a3111fe",
                    name: "Spark"
                },
                {
                    _id: "561ebb8cd6c741e8235f42ea",
                    name: "Bodega application"
                },
                {
                    _id: "55cdc96d9b42266a4f000006",
                    name: "Absolute Vodka"
                },
                {
                    _id: "55cf4fc74a91e37b0b000103",
                    name: "Legal Application"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ce",
                    name: "FlipStar Game"
                },
                {
                    _id: "55f5728cb81672730c00006a",
                    name: "BetterIt ios"
                },
                {
                    _id: "55f55d31b81672730c000020",
                    name: "Farmers App"
                },
                {
                    _id: "5629e238129820ab5994e8c0",
                    name: "Bus Project"
                },
                {
                    _id: "55deb95bae2b22730b000017",
                    name: "YelloDrive"
                },
                {
                    _id: "565740e0bfd103f108eb4ad4",
                    name: "HKConnect"
                },
                {
                    _id: "55f56442b81672730c000032",
                    name: "Tinder clone"
                },
                {
                    _id: "55f55a89b81672730c000017",
                    name: "Bimii"
                },
                {
                    _id: "55ded24cae2b22730b000040",
                    name: "FarmStatistic"
                },
                {
                    _id: "55de2a30f09cc2ec0b00004e",
                    name: "GovMap"
                },
                {
                    _id: "55de24bbf09cc2ec0b000036",
                    name: "FosterFarms"
                },
                {
                    _id: "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                {
                    _id: "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                {
                    _id: "55b92ad621e4b7c40f000697",
                    name: "Pilot"
                },
                {
                    _id: "56abd16ac6be8658550dc6c3",
                    name: "Baccarat"
                },
                {
                    _id: "55b92ad621e4b7c40f00065f",
                    name: "IOS/Android QA"
                },
                {
                    _id: "55b92ad621e4b7c40f00067a",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c3",
                    name: "Jude"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c4",
                    name: "Ibizawire"
                },
                {
                    _id: "55b92ad621e4b7c40f00066d",
                    name: "LiveCasinoAndroid"
                },
                {
                    _id: "562bc32484deb7cb59d61b70",
                    name: "MyDrive"
                },
                {
                    _id: "55b92ad621e4b7c40f000674",
                    name: "Win7 app tester needed"
                },
                {
                    _id: "55cf5ea04a91e37b0b00012c",
                    name: "Global Workshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a4",
                    name: "iOS Periop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cf",
                    name: "Kogan Apps"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d5",
                    name: "Unlimited Conferencing"
                },
                {
                    _id: "55b92ad621e4b7c40f00067b",
                    name: "Android Help"
                },
                {
                    _id: "56685d88a3fc012a68f0d854",
                    name: "Nicolas Burer Design"
                },
                {
                    _id: "563b95acab9698be7c9df727",
                    name: "LoginChineseTrue"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bc",
                    name: "Pseudo"
                },
                {
                    _id: "55b92ad621e4b7c40f000672",
                    name: "DRH QA Automation"
                },
                {
                    _id: "55cf36d54a91e37b0b0000c2",
                    name: "Mobstar"
                },
                {
                    _id: "55b92ad621e4b7c40f000681",
                    name: "AirPort"
                },
                {
                    _id: "55b92ad621e4b7c40f000668",
                    name: "Selenium IDE"
                },
                {
                    _id: "55b92ad621e4b7c40f000688",
                    name: "iOS2"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c8",
                    name: "PriTriever"
                },
                {
                    _id: "55b92ad621e4b7c40f00066e",
                    name: "LCUpdate iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f000698",
                    name: "Staffd"
                },
                {
                    _id: "55b92ad621e4b7c40f00066f",
                    name: "Oculus Player"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cd",
                    name: "CloudFuze"
                },
                {
                    _id: "55b92ad621e4b7c40f000694",
                    name: "QA iOS Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bf",
                    name: "Minder"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b5",
                    name: "KemblaJoggers"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b7",
                    name: "Design"
                },
                {
                    _id: "55b92ad621e4b7c40f000660",
                    name: "iOS1"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a0",
                    name: "GetFit"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d7",
                    name: "Mesa Ave"
                },
                {
                    _id: "55b92ad621e4b7c40f00068b",
                    name: "Unity3D"
                },
                {
                    _id: "55b92ad621e4b7c40f000699",
                    name: "Tablet apps"
                },
                {
                    _id: "55b92ad621e4b7c40f000678",
                    name: "Appium testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006aa",
                    name: "DiveplanIT"
                },
                {
                    _id: "55b92ad621e4b7c40f00069e",
                    name: "Android1"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c7",
                    name: "BizRate"
                },
                {
                    _id: "55b92ad621e4b7c40f000669",
                    name: "Airsoft site"
                },
                {
                    _id: "55b92ad621e4b7c40f00066a",
                    name: "The Watch Enthusiast"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c9",
                    name: "spscontrol"
                },
                {
                    _id: "55b92ad621e4b7c40f000677",
                    name: "Android Tribesta"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a7",
                    name: "couch"
                },
                {
                    _id: "55b92ad621e4b7c40f00068a",
                    name: "application regression testing"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a2",
                    name: "Android"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bd",
                    name: "Purple Ocean"
                },
                {
                    _id: "55b92ad621e4b7c40f000665",
                    name: "JellyGames"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d2",
                    name: "Snapped"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b0",
                    name: "Telecom"
                },
                {
                    _id: "566d4bc3abccac87642cb523",
                    name: "Scatch"
                },
                {
                    _id: "55b92ad621e4b7c40f0006bb",
                    name: "MorfitRun"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d1",
                    name: "Sales Tool"
                },
                {
                    _id: "55b92ad621e4b7c40f00069d",
                    name: "iOS3"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ac",
                    name: "Manual front end testing for e commerce site"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c5",
                    name: "Liquivid"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a9",
                    name: "Spokal"
                },
                {
                    _id: "55b92ad621e4b7c40f000670",
                    name: "iRemember"
                },
                {
                    _id: "569f5bc662d172544baf0c40",
                    name: "Gilad Nevo Bug fixing"
                },
                {
                    _id: "55b92ad621e4b7c40f000684",
                    name: "OnSite Unibet"
                },
                {
                    _id: "55f55901b81672730c000011",
                    name: "WhachApp"
                },
                {
                    _id: "55b92ad621e4b7c40f00068c",
                    name: "DRH manual"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c0",
                    name: "TrumpT QA"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b9",
                    name: "Curb testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000673",
                    name: "Q/A digital QA"
                },
                {
                    _id: "55b92ad621e4b7c40f000675",
                    name: "iOS6"
                },
                {
                    _id: "55b92ad621e4b7c40f00066c",
                    name: "DesignShargo"
                },
                {
                    _id: "55b92ad621e4b7c40f000691",
                    name: "Faceworks"
                },
                {
                    _id: "55de2cd2f09cc2ec0b000053",
                    name: "Dragon Daze"
                },
                {
                    _id: "55b92ad621e4b7c40f000693",
                    name: "WP Player"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b3",
                    name: "Loyalty"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c1",
                    name: "Ganchak Help"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ba",
                    name: "TocToc"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b2",
                    name: "Player"
                },
                {
                    _id: "55cb770bfea413b50b000008",
                    name: "QualPro"
                },
                {
                    _id: "55b92ad621e4b7c40f00067d",
                    name: "Sharalike"
                },
                {
                    _id: "55b92ad621e4b7c40f000683",
                    name: "Bob"
                },
                {
                    _id: "55b92ad621e4b7c40f000667",
                    name: "PT2"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a3",
                    name: "iOS dev"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b1",
                    name: "Android Automation"
                },
                {
                    _id: "55b92ad621e4b7c40f000689",
                    name: "iOS4"
                },
                {
                    _id: "55de1e8ef09cc2ec0b000031",
                    name: "BlueLight"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ab",
                    name: "QMR iOS"
                },
                {
                    _id: "55b92ad621e4b7c40f000661",
                    name: "Android2"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ca",
                    name: "SketchTechPoints"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ad",
                    name: "KX keyboard"
                },
                {
                    _id: "55b92ad621e4b7c40f000671",
                    name: "Kari"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a8",
                    name: "sitefix"
                },
                {
                    _id: "55b92ad621e4b7c40f000662",
                    name: "QMr and It websites testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000664",
                    name: "BelgiumHTML"
                },
                {
                    _id: "55b92ad621e4b7c40f0006c6",
                    name: "Demo Rocket"
                },
                {
                    _id: "55b92ad621e4b7c40f000687",
                    name: "iOS/Tribesta"
                },
                {
                    _id: "5605736c002c16436b000007",
                    name: "Stentle CSS"
                },
                {
                    _id: "55b92ad621e4b7c40f000696",
                    name: "Software Testing of Web Application"
                },
                {
                    _id: "55b92ad621e4b7c40f00067f",
                    name: "Player iOS/And"
                },
                {
                    _id: "55b92ad621e4b7c40f000676",
                    name: "QA"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b4",
                    name: "Vroup"
                },
                {
                    _id: "55b92ad621e4b7c40f00068f",
                    name: "QMR Android"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d8",
                    name: "Casino Game"
                },
                {
                    _id: "56a23c5caa157ca50f21fae1",
                    name: "Demolition Derby"
                },
                {
                    _id: "55b92ad621e4b7c40f00069c",
                    name: "sTrader"
                },
                {
                    _id: "55b92ad621e4b7c40f00066b",
                    name: "Nikky"
                },
                {
                    _id: "55b92ad621e4b7c40f00068e",
                    name: "Phidget ANE"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a6",
                    name: "Moriser"
                },
                {
                    _id: "56b9e0268f23c5696159cd0d",
                    name: "test_Alexander"
                },
                {
                    _id: "566857caa3fc012a68f0d83a",
                    name: "SPS Mobile"
                },
                {
                    _id: "55b92ad621e4b7c40f0006b8",
                    name: "FindLost"
                },
                { },
                {
                    _id: "55b92ad621e4b7c40f00067e",
                    name: "SoulIntentions"
                },
                {
                    _id: "55b92ad621e4b7c40f000685",
                    name: "Travlr"
                },
                {
                    _id: "55b92ad621e4b7c40f000682",
                    name: "Connexus"
                },
                {
                    _id: "55b92ad621e4b7c40f0006cb",
                    name: "Bayzat"
                },
                {
                    _id: "55b92ad621e4b7c40f00069f",
                    name: "iOS5"
                },
                {
                    _id: "55b92ad621e4b7c40f000695",
                    name: "Consent APP"
                },
                {
                    _id: "55b92ad621e4b7c40f0006be",
                    name: "HBO"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d4",
                    name: "M-Government"
                },
                {
                    _id: "55b92ad621e4b7c40f000663",
                    name: "ajaxbrowser.com"
                },
                {
                    _id: "55b92ad621e4b7c40f000666",
                    name: "blow.com"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d9",
                    name: "Pilot"
                },
                {
                    _id: "55b92ad621e4b7c40f000692",
                    name: "WishExpress"
                },
                {
                    _id: "55b92ad621e4b7c40f0006af",
                    name: "Academic Website testing"
                },
                {
                    _id: "55b92ad621e4b7c40f000680",
                    name: "CodeThreads"
                },
                {
                    _id: "55b92ad621e4b7c40f000690",
                    name: "Max"
                },
                {
                    _id: "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                {
                    _id: "55b92ad621e4b7c40f0006a5",
                    name: "Android"
                },
                {
                    _id: "55b92ad621e4b7c40f00067c",
                    name: "iQshop"
                },
                {
                    _id: "55b92ad621e4b7c40f0006ae",
                    name: "Kikast"
                }
            ],
            supplier: [
                {
                    _id: "56a8930ceb2b76c70ec74d1d",
                    name: "Sebastian Lyall"
                },
                {
                    _id: "569f57be62d172544baf0c3a",
                    name: "ETECTURE GmbH "
                },
                {
                    _id: "566d4b35abccac87642cb521",
                    name: "Scatch "
                },
                {
                    _id: "56a23c26aa157ca50f21fae0",
                    name: "Richard Hazenberg"
                },
                {
                    _id: "55b92ad521e4b7c40f000610",
                    name: "Norbert "
                },
                {
                    _id: "55b92ad621e4b7c40f000630",
                    name: "PPT Group "
                },
                {
                    _id: "55b92ad621e4b7c40f00064e",
                    name: "SetFile "
                },
                {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: "Andreas Rabenseifner "
                },
                {
                    _id: "55b92ad521e4b7c40f000611",
                    name: "Remon "
                },
                {
                    _id: "55b92ad621e4b7c40f00063e",
                    name: "VTI "
                },
                {
                    _id: "55b92ad621e4b7c40f000629",
                    name: "Cristaliza "
                },
                {
                    _id: "55b92ad621e4b7c40f000637",
                    name: "Airsoft Holdings "
                },
                {
                    _id: "55b92ad621e4b7c40f00064c",
                    name: "Razvan Chisu "
                },
                {
                    _id: "55b92ad621e4b7c40f000628",
                    name: "Quimron "
                },
                {
                    _id: "55b92ad621e4b7c40f00063d",
                    name: "Gomez "
                },
                {
                    _id: "55b92ad521e4b7c40f00061b",
                    name: "Unlimited Conferencing "
                },
                {
                    _id: "5604170eb904af832d000005",
                    name: "Stentle "
                },
                {
                    _id: "55b92ad621e4b7c40f00065a",
                    name: "Technatives "
                },
                {
                    _id: "55b92ad621e4b7c40f000638",
                    name: "Unibet "
                },
                {
                    _id: "55b92ad621e4b7c40f00062e",
                    name: "Web1 Syndication, Inc "
                },
                {
                    _id: "55b92ad621e4b7c40f000640",
                    name: "Oris4/TimWilson "
                },
                {
                    _id: "55b92ad621e4b7c40f00064d",
                    name: "ProTriever "
                },
                {
                    _id: "55b92ad521e4b7c40f00061e",
                    name: "Luke Raskino "
                },
                {
                    _id: "55cdc93c9b42266a4f000005",
                    name: "AgileFind "
                },
                {
                    _id: "55b92ad621e4b7c40f000633",
                    name: "Chris Mack "
                },
                {
                    _id: "55b92ad621e4b7c40f000656",
                    name: "ShiwaForce "
                },
                {
                    _id: "55b92ad621e4b7c40f000659",
                    name: "PBI-Solutions "
                },
                {
                    _id: "55b92ad621e4b7c40f000646",
                    name: "EtienneL "
                },
                {
                    _id: "55b92ad621e4b7c40f00065d",
                    name: "CloudFuze "
                },
                {
                    _id: "55b92ad621e4b7c40f000641",
                    name: "Global Forwarding LLC "
                },
                {
                    _id: "55b92ad621e4b7c40f000655",
                    name: "We do apps "
                },
                {
                    _id: "55b92ad621e4b7c40f00062b",
                    name: "HashPlay "
                },
                {
                    _id: "55b92ad621e4b7c40f000625",
                    name: "WishExpress "
                },
                {
                    _id: "55b92ad521e4b7c40f000613",
                    name: "Kikast "
                },
                {
                    _id: "56030d81fa3f91444e00000c",
                    name: "Peter F "
                },
                {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: "MobStar "
                },
                {
                    _id: "55b92ad521e4b7c40f000618",
                    name: "Tarun M. "
                },
                {
                    name: null
                },
                {
                    _id: "55b92ad521e4b7c40f000621",
                    name: "Mike Allstar "
                },
                {
                    _id: "55edaf167221afe30b000040",
                    name: "BetterIt "
                },
                {
                    _id: "55b92ad521e4b7c40f000622",
                    name: "Chamin "
                },
                {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: "Buzinga "
                },
                {
                    _id: "55b92ad621e4b7c40f000648",
                    name: "Anand Gupta "
                },
                {
                    _id: "55b92ad521e4b7c40f000619",
                    name: "Israel "
                },
                {
                    _id: "55b92ad621e4b7c40f00064a",
                    name: "Carussel "
                },
                {
                    _id: "55b92ad621e4b7c40f000645",
                    name: "Vlad "
                },
                {
                    _id: "55b92ad621e4b7c40f000636",
                    name: "Constantine "
                },
                {
                    _id: "55b92ad521e4b7c40f000620",
                    name: "Thomas Sinquin "
                },
                {
                    _id: "55b92ad621e4b7c40f000651",
                    name: "Dan D. "
                },
                {
                    _id: "56574032bfd103f108eb4ad2",
                    name: "Marand "
                },
                {
                    _id: "56685d4fa3fc012a68f0d853",
                    name: "Nicolas Burer"
                },
                {
                    _id: "55b92ad621e4b7c40f000623",
                    name: "Vladi "
                },
                {
                    _id: "55b92ad621e4b7c40f000631",
                    name: "Tinybeans "
                },
                {
                    _id: "55b92ad521e4b7c40f000614",
                    name: "The Watch Enthusiast "
                },
                {
                    _id: "55b92ad621e4b7c40f00065b",
                    name: "Kogan.com "
                },
                {
                    _id: "55b92ad621e4b7c40f00063a",
                    name: "TrumpMedia "
                },
                {
                    _id: "55cf4f834a91e37b0b000102",
                    name: "SharperBuilds "
                },
                {
                    _id: "55b92ad621e4b7c40f000649",
                    name: "Contegra Systems "
                },
                {
                    _id: "55b92ad621e4b7c40f000635",
                    name: "Academiacs "
                },
                {
                    _id: "55cf5c194a91e37b0b00012b",
                    name: "Global Workshop Solutions "
                },
                {
                    _id: "55b92ad521e4b7c40f00060d",
                    name: "Sportsman Tracker1 "
                },
                {
                    _id: "55b92ad621e4b7c40f000658",
                    name: "JellyGames "
                },
                {
                    _id: "55b92ad621e4b7c40f000634",
                    name: "Max "
                },
                {
                    _id: "569f603762d172544baf0d57",
                    name: "Nimrod Nahum"
                },
                {
                    _id: "55b92ad521e4b7c40f000615",
                    name: "TechJoiner "
                },
                {
                    _id: "55b92ad621e4b7c40f00064f",
                    name: "Kenlo Group Ltd "
                },
                {
                    _id: "55b92ad621e4b7c40f00063f",
                    name: "Hussam "
                },
                {
                    _id: "55b92ad621e4b7c40f000624",
                    name: "Giroptic "
                },
                {
                    _id: "55b92ad621e4b7c40f000650",
                    name: "PatrickMolander "
                },
                {
                    _id: "55b92ad521e4b7c40f00060e",
                    name: "Pekaboo/D.Kaufman "
                },
                {
                    _id: "55b92ad621e4b7c40f000653",
                    name: "Peter B. "
                },
                {
                    _id: "55b92ad621e4b7c40f000657",
                    name: "Nikky "
                },
                {
                    _id: "55b92ad621e4b7c40f00063c",
                    name: "DigiPresents "
                },
                {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: "PostIndustria "
                },
                {
                    _id: "55f56406b81672730c00002e",
                    name: "App Institute "
                },
                {
                    _id: "55b92ad521e4b7c40f000612",
                    name: "Isaac S. "
                },
                {
                    _id: "55b92ad521e4b7c40f000617",
                    name: "Peter Hickey "
                },
                {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: "Foxtrapp "
                },
                {
                    _id: "55b92ad621e4b7c40f000639",
                    name: "Digital Media "
                },
                {
                    _id: "55b92ad621e4b7c40f000632",
                    name: "evista "
                },
                {
                    _id: "55b92ad621e4b7c40f00062f",
                    name: "Mark "
                },
                {
                    _id: "55b92ad621e4b7c40f00062a",
                    name: "PeachInc "
                },
                {
                    _id: "55b92ad621e4b7c40f00062c",
                    name: "spscontrol "
                },
                {
                    _id: "55f55854b81672730c000010",
                    name: "MediaHeads "
                },
                {
                    _id: "55b92ad621e4b7c40f000643",
                    name: "Angelica "
                },
                {
                    _id: "55b92ad521e4b7c40f00061c",
                    name: "Genexies "
                },
                {
                    _id: "55b92ad621e4b7c40f00065e",
                    name: "Collections Tech "
                },
                {
                    _id: "55b92ad521e4b7c40f00060c",
                    name: "Alexey Blinov"
                },
                {
                    _id: "55b92ad621e4b7c40f000652",
                    name: "Zugara "
                },
                {
                    _id: "55b92ad521e4b7c40f00061a",
                    name: "Ivcarto "
                },
                {
                    _id: "56bc9b72dfd8a81466e2f48c",
                    name: "Test Person"
                },
                {
                    _id: "55ba0df2d79a3a3439000015",
                    name: "Erez Leket"
                },
                {
                    _id: "55b92ad621e4b7c40f000642",
                    name: "Volodymyr Lychman "
                },
                {
                    _id: "55deb987ae2b22730b000018",
                    name: "Yello "
                },
                {
                    _id: "562bed4062461bfd59ef58d1",
                    name: "TreatMe "
                },
                {
                    _id: "562bc2db62461bfd59ef58c7",
                    name: "AppMedia "
                },
                {
                    _id: "562ff202547f50b51d6de2b8",
                    name: "Appsmakerstore "
                },
                {
                    _id: "5637a8e2bf9592df04c55115",
                    name: "Colestreet "
                },
                {
                    _id: "56a0d53b62d172544baf0e3c",
                    name: "Ivar Liden"
                },
                {
                    _id: "55b92ad621e4b7c40f000647",
                    name: "Joren Rapiny "
                },
                {
                    _id: "569f599062d172544baf0c3f",
                    name: "Gilad Nevo"
                }
            ],
            projectmanager: [
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    name: null
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                }
            ],
            workflow: [
                {
                    _id: "5559f344dadd53e09d753ead",
                    name: "Canceled"
                },
                {
                    _id: "55647b932e4aa3804a765ec5",
                    name: "Not Invoiced"
                },
                { },
                {
                    _id: "55647b962e4aa3804a765ec6",
                    name: "Invoiced"
                }
            ]
        },
        salaryReport: {
            _id: null,
            employee: [
                {
                    _id: "56c19971dfd8a81466e2f6dc",
                    name: "Andriy Khainus"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c1",
                    name: "Maria Zasukhina"
                },
                {
                    _id: "55eeed546dceaee10b00001e",
                    name: "Vladyslav Turytskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bf",
                    name: "Andriy Fizer"
                },
                {
                    _id: "564a0186ad4bc9e53f1f6193",
                    name: "Liliya Orlenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a8",
                    name: "Andriy Korneychuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c8",
                    name: "Ivan Bizilya"
                },
                {
                    _id: "566fe2348453e8b464b70ba6",
                    name: "Andriy Lukashchuk"
                },
                {
                    _id: "56b3412299ce8d706a81b2cd",
                    name: "Mykola Kholtobin"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c2",
                    name: "Andriy Mistetskiy"
                },
                {
                    _id: "561ba7039ebb48212ea838c3",
                    name: "Oleksandra Maliavska"
                },
                {
                    _id: "55b92ad221e4b7c40f00009f",
                    name: "Dmitriy Dzuba"
                },
                {
                    _id: "55b92ad221e4b7c40f000087",
                    name: "Ivan Kostromin"
                },
                {
                    _id: "561bb5329ebb48212ea838c6",
                    name: "Valerii Ladomiryak"
                },
                {
                    _id: "569e63df044ae38173244cfd",
                    name: "Bogdan Danyliuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a3",
                    name: "Andriy Karpenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000097",
                    name: "Samgash Abylgazinov"
                },
                {
                    _id: "55b92ad221e4b7c40f00003f",
                    name: "Marina Kubichka"
                },
                {
                    _id: "55b92ad221e4b7c40f000093",
                    name: "Vasiliy Lupchey"
                },
                {
                    _id: "568cd341b2bcba971ba6f5c4",
                    name: "Roman Rosul"
                },
                {
                    _id: "55b92ad221e4b7c40f00009c",
                    name: "Ivan Feltsan"
                },
                {
                    _id: "55b92ad221e4b7c40f00007e",
                    name: "Taras Zmiy"
                },
                {
                    _id: "55b92ad221e4b7c40f000091",
                    name: "Viktor Kiver"
                },
                {
                    _id: "55b92ad221e4b7c40f00008f",
                    name: "Yuriy Holovatskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000060",
                    name: "Roman Buchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f00008d",
                    name: "Svitlana Kira"
                },
                {
                    _id: "55b92ad221e4b7c40f00008c",
                    name: "Anton Gychka"
                },
                {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: "Roland Katona"
                },
                {
                    _id: "55b92ad221e4b7c40f000080",
                    name: "Vasiliy Barchiy"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b8",
                    name: "Anna Lobas"
                },
                {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: "Vitaliy Shuba"
                },
                {
                    _id: "56966c82d87c9004552b63c7",
                    name: "Ihor Kuzma"
                },
                {
                    _id: "56011186536bd29228000005",
                    name: "Valentyn Khruslov"
                },
                {
                    _id: "5649b8ccad4bc9e53f1f6192",
                    name: "Sergiy Gevelev"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b7",
                    name: "Myroslava Polovka"
                },
                {
                    _id: "55b92ad221e4b7c40f000076",
                    name: "Michael Glagola"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c7",
                    name: "Liliya Mykhailova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b9",
                    name: "Olena Melnyk"
                },
                {
                    _id: "568bbf935827e3b24d8123a8",
                    name: "Vladyslav Hamalii"
                },
                {
                    _id: "55b92ad221e4b7c40f000082",
                    name: "Yaroslav Fuchko"
                },
                {
                    _id: "55b92ad221e4b7c40f00004d",
                    name: "Vyacheslav Kopinets"
                },
                {
                    _id: "55b92ad221e4b7c40f000098",
                    name: "Andriy Krupka"
                },
                {
                    _id: "56965733d87c9004552b63be",
                    name: "Andriy Samokhin"
                },
                {
                    _id: "55b92ad221e4b7c40f000032",
                    name: "Bogdan Sakalo"
                },
                {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: "Alex Sokhanych"
                },
                {
                    _id: "55b92ad221e4b7c40f000030",
                    name: "Alex Svatuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000090",
                    name: "Gabriella Shterr"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: "Igor Stan"
                },
                {
                    _id: "55b92ad221e4b7c40f00006e",
                    name: "Andriy Hanchak"
                },
                {
                    _id: "55b92ad221e4b7c40f000038",
                    name: "Roman Babunich"
                },
                {
                    _id: "568cdd375527d6691cb68b22",
                    name: "Sergey Melnik"
                },
                {
                    _id: "55b92ad221e4b7c40f000065",
                    name: "Yuriy Sirko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b1",
                    name: "Daniil Korniyenko"
                },
                {
                    _id: "55c32e0d29bd6ccd0b000005",
                    name: "Eugen Alexeev"
                },
                {
                    _id: "566ada96a74aaf316eaea69d",
                    name: "Maxim Gladovskyy"
                },
                {
                    _id: "55b92ad221e4b7c40f00007f",
                    name: "Vasilisa Klimchenko"
                },
                {
                    _id: "55b92ad221e4b7c40f00008e",
                    name: "Ivan Grab"
                },
                {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: "Oleg Ostroverkh"
                },
                {
                    _id: "565f0fa6f6427f253cf6bf19",
                    name: "Alex Lysachenko"
                },
                {
                    _id: "567ac0a48365c9a205406f33",
                    name: "Dmytro Kolochynsky"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bd",
                    name: "Michael Vashkeba"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b6",
                    name: "Denis Vengrin"
                },
                {
                    _id: "561bb1269ebb48212ea838c5",
                    name: "Vladimir Pogorilyak"
                },
                {
                    _id: "55b92ad221e4b7c40f00003c",
                    name: "Oleg Stasiv"
                },
                {
                    _id: "55b92ad221e4b7c40f0000bb",
                    name: "Igor Shepinka"
                },
                {
                    _id: "55b92ad221e4b7c40f00007a",
                    name: "Robert Fogash"
                },
                {
                    _id: "55b92ad221e4b7c40f000036",
                    name: "Michael Yemets"
                },
                {
                    _id: "55b92ad221e4b7c40f00007d",
                    name: "Stas Volskiy"
                },
                {
                    _id: "55b92ad221e4b7c40f00007b",
                    name: "Roman Guti"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c4",
                    name: "Michael Myronyshyn"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c0",
                    name: "Oksana Kordas"
                },
                {
                    _id: "56b8b99e6c411b590588feb9",
                    name: "Alex Ovcharenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000048",
                    name: "Katerina Chupova"
                },
                {
                    _id: "564da59f9b85f8b16b574fe9",
                    name: "Andriy Chuprov"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: "Ivan Bilak"
                },
                {
                    _id: "55b92ad221e4b7c40f00009a",
                    name: "Katerina Pasichnyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a7",
                    name: "Alex Ryabcev"
                },
                {
                    _id: "55b92ad221e4b7c40f000051",
                    name: "Richard Mozes"
                },
                {
                    _id: "569cce1dcf1f31f925c026fa",
                    name: "Andriy Stupchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000085",
                    name: "Kirill Gorbushko"
                },
                {
                    _id: "55dd73d1f09cc2ec0b000008",
                    name: "Roman Vizenko"
                },
                {
                    _id: "561bb90a9ebb48212ea838c7",
                    name: "Andriy Svyd"
                },
                {
                    _id: "55b92ad221e4b7c40f00006a",
                    name: "Vadim Tsipf"
                },
                {
                    _id: "568bbdfd5827e3b24d8123a7",
                    name: "Roman Chaban"
                },
                {
                    _id: "55b92ad221e4b7c40f000053",
                    name: "Vasiliy Seredniy"
                },
                {
                    _id: "55b92ad221e4b7c40f000096",
                    name: "Andriy Herasymyuk"
                },
                {
                    _id: "5638aa635d23a8eb04e80af0",
                    name: "Alex Siladii"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b4",
                    name: "Vasiliy Prokopyshyn"
                },
                {
                    _id: "55f9298456f79c9c0c000006",
                    name: "Viktor Manhur"
                },
                {
                    _id: "55b92ad221e4b7c40f000057",
                    name: "Alex Roman"
                },
                {
                    _id: "55b92ad221e4b7c40f000094",
                    name: "Anton Yarosh"
                },
                {
                    _id: "560115cf536bd29228000006",
                    name: "Marianna Myhalko"
                },
                {
                    _id: "55e549309624477a0b000005",
                    name: "Petro Rospopa"
                },
                {
                    _id: "55b92ad221e4b7c40f000055",
                    name: "Michael Rogach"
                },
                {
                    _id: "55b92ad221e4b7c40f000059",
                    name: "Anatoliy Dalekorey"
                },
                {
                    _id: "564dac3e9b85f8b16b574fea",
                    name: "Alex Filchak"
                },
                {
                    _id: "55b92ad221e4b7c40f00005a",
                    name: "Bogdan Cheypesh"
                },
                {
                    _id: "56a0d4b162d172544baf0e3a",
                    name: "Ihor Ilnytskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000034",
                    name: "Ishtvan Nazarovich"
                },
                {
                    _id: "55b92ad221e4b7c40f00005e",
                    name: "Michael Didenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000031",
                    name: "Alex Gleba"
                },
                {
                    _id: "55b92ad221e4b7c40f000043",
                    name: "Maxim Geraschenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000062",
                    name: "Vasiliy Cheypesh"
                },
                {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: "Peter Voloshchuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a1",
                    name: "Sergiy Stepaniuk"
                },
                {
                    _id: "564a02e0ad4bc9e53f1f6194",
                    name: "Taras Dvorian"
                },
                {
                    _id: "55b92ad221e4b7c40f000072",
                    name: "Eugen Bernikevich"
                },
                {
                    _id: "55b92ad221e4b7c40f00003a",
                    name: "Vasiliy Agosta"
                },
                {
                    _id: "55b92ad221e4b7c40f0000a5",
                    name: "Maxim Holubka"
                },
                {
                    _id: "55b92ad221e4b7c40f0000b5",
                    name: "Andriana Lemko"
                },
                {
                    _id: "561ba8639ebb48212ea838c4",
                    name: "Nataliya Yartysh"
                },
                {
                    _id: "5629e27046bca6e4591f4919",
                    name: "Artem Petrov"
                },
                {
                    _id: "55b92ad221e4b7c40f000077",
                    name: "Michael Soyma"
                },
                {
                    _id: "55b92ad221e4b7c40f000092",
                    name: "Eduard Dedenok"
                },
                {
                    _id: "55b92ad221e4b7c40f000088",
                    name: "Viktor Buchok"
                },
                {
                    _id: "55eee9c26dceaee10b00001d",
                    name: "Volodymyr Stepanchuk"
                },
                {
                    _id: "56090d77066d979a33000009",
                    name: "Yuriy Bysaha"
                },
                {
                    _id: "55b92ad221e4b7c40f000089",
                    name: "Maxim Sychov"
                },
                {
                    _id: "561b756f9ebb48212ea838c0",
                    name: "Stanislav Romanyuk"
                },
                {
                    _id: "55b92ad221e4b7c40f000046",
                    name: "Denis Udod"
                },
                {
                    _id: "56b9d49d8f23c5696159cd0c",
                    name: "Kirill Bed"
                },
                {
                    _id: "55eef3fd6dceaee10b000020",
                    name: "Roman Saldan"
                },
                {
                    _id: "55b92ad221e4b7c40f00007c",
                    name: "Sergiy Sheba"
                },
                {
                    _id: "55b92ad221e4b7c40f000073",
                    name: "Irina Grab"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c3",
                    name: "Olesia Prokoshkina"
                },
                {
                    _id: "56b9d3eb8f23c5696159cd0b",
                    name: "Galina Mykhailova"
                },
                {
                    _id: "55b92ad221e4b7c40f00009e",
                    name: "Alex Michenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000086",
                    name: "Roman Kubichka"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c5",
                    name: "Michael Gajdan"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ca",
                    name: "Yana Vengerova"
                },
                {
                    _id: "566ede9e8453e8b464b70b71",
                    name: "Alex Tonkovid"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cb",
                    name: "Alona Yelahina"
                },
                {
                    _id: "5600042ca36a8ca10c000029",
                    name: "Michael Filchak"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cc",
                    name: "Ivan Lyakh"
                },
                {
                    _id: "565c2793f4dcd63b5dbd7372",
                    name: "Denis Yaremenko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ae",
                    name: "Tamara Dolottseva"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cd",
                    name: "Andriy Vovk"
                },
                {
                    _id: "55b92ad221e4b7c40f000047",
                    name: "Ilya Khymych"
                },
                {
                    _id: "55b92ad221e4b7c40f0000ce",
                    name: "Alex Storojenko"
                },
                {
                    _id: "55b92ad221e4b7c40f000079",
                    name: "Oleksiy Gerasimov"
                },
                {
                    _id: "55e96ab13f3ae4fd0b000009",
                    name: "Oles Pavliuk"
                },
                {
                    _id: "55b92ad221e4b7c40f0000cf",
                    name: "Yaroslav Denysiuk"
                },
                {
                    _id: "55bf45cf65cda0810b00000a",
                    name: "Liliya Shustur"
                },
                {
                    _id: "56a7956faa157ca50f21fb25",
                    name: "Pavlo Demko"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c6",
                    name: "Illia Kramarenko"
                },
                {
                    _id: "55c06411d011746b0b000005",
                    name: "Maxim Rachytskyy"
                },
                {
                    _id: "55b92ad221e4b7c40f00003b",
                    name: "Vitaliy Bizilya"
                },
                {
                    _id: "55f7c20a6d43203d0c000005",
                    name: "Yana Samaryk"
                },
                {
                    _id: "55c0656ad011746b0b000006",
                    name: "Anton Nizhegorodov"
                },
                {
                    _id: "55c330d529bd6ccd0b000007",
                    name: "Alina Yurenko"
                },
                {
                    _id: "55c84a4aaa36a0e60a000005",
                    name: "Pavlo Muratov"
                },
                {
                    _id: "56bdf283dfd8a81466e2f6d0",
                    name: "Nadiya Shishko"
                },
                {
                    _id: "55b92ad221e4b7c40f000052",
                    name: "Vladimir Gerasimenko"
                },
                {
                    _id: "566aa49f4f817b7f51746ec0",
                    name: "Nataliya Burtnyk"
                },
                {
                    _id: "55ca0145cbb0f4910b000009",
                    name: "Denis Zinkovskyi"
                },
                {
                    _id: "55b92ad221e4b7c40f000078",
                    name: "Oleg Boyanivskiy"
                },
                {
                    _id: "55d1e234dda01e250c000015",
                    name: "Kristian Rimar"
                },
                {
                    _id: "55b92ad221e4b7c40f000040",
                    name: "Vasiliy Almashiy"
                },
                {
                    _id: "55dd63f8f09cc2ec0b000006",
                    name: "Sergiy Ihnatko"
                },
                {
                    _id: "55e419094983acdd0b000012",
                    name: "Kirill Paliiuk"
                },
                {
                    _id: "56090fae86e2435a33000008",
                    name: "Inna Nukhova"
                },
                {
                    _id: "55b92ad221e4b7c40f0000c9",
                    name: "Oleksiy Fedosov"
                },
                {
                    _id: "55f7c3736d43203d0c000006",
                    name: "Yuriy Bodak"
                },
                {
                    _id: "56a78c75aa157ca50f21fb24",
                    name: "Renata Iyber"
                },
                {
                    _id: "5600031ba36a8ca10c000028",
                    name: "Dmitriy Mostiv"
                },
                {
                    _id: "55dd7776f09cc2ec0b000009",
                    name: "Michael Kavka"
                },
                {
                    _id: "56014cc8536bd29228000007",
                    name: "Yevgenia Bezyk"
                },
                {
                    _id: "55b92ad221e4b7c40f000064",
                    name: "Sergiy Tilishevsky"
                },
                {
                    _id: "560264bb8dc408c632000005",
                    name: "Anastas Lyakh"
                },
                {
                    _id: "56964a03d87c9004552b63ba",
                    name: "Pavlo Skyba"
                },
                {
                    _id: "56029cc950de7f4138000005",
                    name: "Eugen Lendyel"
                },
                {
                    _id: "55b92ad221e4b7c40f000070",
                    name: "Daniil Pozhidaev"
                },
                {
                    _id: "56af32e174d57e0d56d6bee5",
                    name: "Nataliya Sichko"
                },
                {
                    _id: "5602a01550de7f4138000008",
                    name: "Yana Dufynets"
                },
                {
                    _id: "55b92ad221e4b7c40f000063",
                    name: "Yana Gusti"
                },
                {
                    _id: "56123232c90e2fb026ce064b",
                    name: "Olga Sikora"
                },
                {
                    _id: "5626278d750d38934bfa1313",
                    name: "Viktoria Rogachenko"
                },
                {
                    _id: "5637710e5d23a8eb04e80aed",
                    name: "Viktoria Kovalenko"
                },
                {
                    _id: "5640741570bbc2b740ce89ec",
                    name: "Denis Lukashov"
                },
                {
                    _id: "55b92ad221e4b7c40f00009b",
                    name: "Larysa Popp"
                },
                {
                    _id: "564a03d1ad4bc9e53f1f6195",
                    name: "Edgard Tanchenec"
                },
                {
                    _id: "55b92ad221e4b7c40f0000aa",
                    name: "Ivan Lyashenko"
                },
                {
                    _id: "5652dd95c4d12cf51e7f7e0b",
                    name: "Sergiy Petakh"
                },
                {
                    _id: "55b92ad221e4b7c40f000061",
                    name: "Tamas Mondok"
                },
                {
                    _id: "565c306af4dcd63b5dbd7373",
                    name: "Myroslav Matrafayilo"
                },
                {
                    _id: "5667f310a3fc012a68f0d5f5",
                    name: "Michael Sopko"
                },
                {
                    _id: "56813fe29cceae182b907755",
                    name: "Taras Ukrainskiy"
                },
                {
                    _id: "5667f43da3fc012a68f0d5f6",
                    name: "Roman Katsala"
                },
                {
                    _id: "566add9aa74aaf316eaea6fc",
                    name: "Denis Saranyuk"
                },
                {
                    _id: "568158fc9cceae182b907756",
                    name: "Herman Belous"
                },
                {
                    _id: "5684ec1a1fec73d05393a2a4",
                    name: "Maria Zaitseva"
                },
                {
                    _id: "568bc0b55827e3b24d8123a9",
                    name: "Yaroslav Syrota"
                },
                {
                    _id: "5614d4c7ab24a83b1dc1a7a8",
                    name: "Dmytro Babilia"
                },
                {
                    _id: "568cd4c0b2bcba971ba6f5c5",
                    name: "Roman Osadchuk"
                },
                {
                    _id: "5693b24bd87c9004552b63a1",
                    name: "Andriy Horak"
                },
                {
                    _id: "569e3a73044ae38173244cfb",
                    name: "Roman Martyniuk"
                },
                {
                    _id: "56a5ef86aa157ca50f21fb1d",
                    name: "Ivan Pasichnyuk"
                },
                {
                    _id: "56b2287b99ce8d706a81b2bc",
                    name: "Kostiantyn Mudrenok"
                },
                {
                    _id: "55c98df0cbb0f4910b000007",
                    name: "Timur Berezhnoi"
                },
                {
                    _id: "55dd71eaf09cc2ec0b000007",
                    name: "Ivan Khartov"
                },
                {
                    _id: "56b9cbb48f23c5696159cd08",
                    name: "Oleksii Kovalenko"
                }
            ],
            department: [
                {
                    _id: "56802eb31afe27f547b7ba52",
                    name: "JS"
                },
                {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    name: "Finance"
                },
                {
                    _id: "55bb1f40cb76ca630b000007",
                    name: "PM"
                },
                {
                    _id: "56802ec21afe27f547b7ba53",
                    name: "PHP/WordPress"
                },
                {
                    _id: "55b92ace21e4b7c40f000015",
                    name: "HR"
                },
                {
                    _id: "55b92ace21e4b7c40f000012",
                    name: ".NET/WP"
                },
                {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                {
                    _id: "55b92ace21e4b7c40f000010",
                    name: "Android"
                },
                {
                    _id: "56802e9d1afe27f547b7ba51",
                    name: "CSS/FrontEnd"
                },
                {
                    _id: "55b92ace21e4b7c40f000011",
                    name: "QA"
                },
                {
                    _id: "566ee11b8453e8b464b70b73",
                    name: "Ruby on Rails"
                },
                {
                    _id: "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                {
                    _id: "55b92ace21e4b7c40f000013",
                    name: "Marketing"
                },
                {
                    _id: "55b92ace21e4b7c40f00000f",
                    name: "iOS"
                },
                {
                    _id: "55bb1f14cb76ca630b000006",
                    name: "Design"
                }
            ]
        }
    };

    var fakeSortedUpSupplierPaayments = [{
        _id: "55bf426165cda0810b000009",
        differenceAmount: 0,
        workflow: "Draft",
        paymentRef: "",
        period: null,
        date: "2015-08-03T00:00:00.000Z",
        paymentMethod: {
            _id: "555cc981532aebbc4a8baf36",
            name: "Payoneer ",
            account: "Payoneer ",
            currency: "USD",
            bank: "",
            owner: "Payoneer "
        },
        paidAmount: 9800,
        invoice: {
            _id: "55b92ae221e4b7c40f00136a",
            paymentDate: "2015-08-03T00:00:00.000Z",
            dueDate: "2015-08-01T07:28:44.856Z",
            ID: 3367,
            editedBy: {
                date: "2015-07-29T19:34:58.533Z",
                user: "52203e707d4dba8813000003"
            },
            createdBy: {
                date: "2015-07-29T19:34:58.533Z",
                user: "52203e707d4dba8813000003"
            },
            creationDate: "2015-07-29T19:34:58.533Z",
            groups: {
                group: [ ],
                users: [ ],
                owner: null
            },
            whoCanRW: "everyOne",
            workflow: "55647d982e4aa3804a765ecb",
            products: [
                {
                    subTotal: 9800,
                    unitPrice: 9800,
                    taxes: 0,
                    jobs: "564cfd8ba6e6390160c9ef20",
                    description: "",
                    product: "5540d528dacb551c24000003",
                    quantity: 1
                }
            ],
            payments: [
                "55bf426165cda0810b000009"
            ],
            paymentInfo: {
                taxes: 0,
                unTaxed: 9800,
                balance: 0,
                total: 9800
            },
            paymentTerms: null,
            salesPerson: "55b92ad221e4b7c40f000063",
            invoiceDate: "2015-07-27T07:28:44.856Z",
            project: "55b92ad621e4b7c40f00067d",
            paymentReference: "free",
            sourceDocument: "564cfd8da6e6390160c9f132",
            supplier: "55b92ad621e4b7c40f000646",
            forSales: true,
            invoiceType: "wTrack",
            name: "25032754",
            __v: 1,
            _type: "wTrackInvoice"
        },
        forSale: false,
        assigned: {
            _id: "55b92ad221e4b7c40f000063",
            dateBirth: "1990-07-30T00:00:00.000Z",
            ID: 57,
            isLead: 2,
            fire: [ ],
            hire: [
                {
                    date: "2013-11-17T22:00:00.000Z",
                    info: "",
                    salary: 0,
                    jobType: "fullTime",
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "5644388770bbc2b740ce8a18",
                    department: "55b92ace21e4b7c40f000011"
                }
            ],
            social: {
                FB: "",
                LI: "https://ua.linkedin.com/pub/yana"
            },
            sequence: 0,
            jobType: "fullTime",
            gender: "male",
            marital: "married",
            contractEnd: {
                date: "2015-07-29T19:34:42.464Z",
                reason: ""
            },
            attachments: [ ],
            editedBy: {
                date: "2016-02-08T08:41:58.734Z",
                user: "55ba2f3ed79a3a343900001d"
            },
            createdBy: {
                date: "2015-07-29T19:34:42.464Z",
                user: "52203e707d4dba8813000003"
            },
            creationDate: "2015-07-29T19:34:42.464Z",
            color: "#4d5a75",
            otherInfo: "",
            groups: {
                group: [ ],
                users: [ ],
                owner: "55ba28c8d79a3a3439000016"
            },
            whoCanRW: "everyOne",
            workflow: null,
            active: false,
            referredBy: "",
            source: "",
            age: 25,
            homeAddress: {
                country: "",
                zip: "",
                state: "",
                city: "",
                street: ""
            },
            otherId: "",
            bankAccountNo: "",
            nationality: "Ukrainian",
            coach: null,
            manager: "55b92ad221e4b7c40f00004f",
            jobPosition: "5644388770bbc2b740ce8a18",
            department: "55b92ace21e4b7c40f000011",
            visibility: "Public",
            relatedUser: null,
            officeLocation: "",
            skype: "yanochka_3007",
            workPhones: {
                phone: "",
                mobile: "+380508754761"
            },
            personalEmail: "yana.gusti@gmail.com",
            workEmail: "yana.gusti@thinkmobiles.com",
            workAddress: {
                country: "",
                zip: "",
                state: "",
                city: "",
                street: ""
            },
            tags: [
                ""
            ],
            name: {
                last: "Gusti",
                first: "Yana"
            },
            subject: "",
            imageSrc: "data:image/jpeg;base64,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",
            isEmployee: true,
            __v: 0,
            transferred: [
                {
                    date: "2015-11-12T07:01:22.647Z",
                    department: " BusinessDev"
                }
            ]
        }
    }];

    var supplierPaymentsCollecion;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('SupplierPayments View', function () {
        var $fixture;
        var $elFixture;

        before(function(){
            windowConfirmStub = sinon.stub(window, 'confirm');
        });

        after(function(){
            view.remove();
            topBarView.remove();
            listView.remove();

            windowConfirmStub.restore();
        });

        describe('#initialize()', function () {
            var server;

            before(function () {
                $fixture = $(fixtures);
                $fixture.appendTo(document.body);
                $elFixture = $fixture.find('#wrapper');

                server = sinon.fakeServer.create();

            });

            after(function () {
                server.restore();
            });

            it('Should create main view', function () {
                var $expectedSubMenuEl;
                var $expectedMenuEl;

                server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'supplierPayments'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="60"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="60"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/supplierPayments');

            });

        });

        describe('TopBarView', function(){
            var server;

            before(function(){
                server = sinon.fakeServer.create();
            });

            after(function(){
                server.restore();
            });

            it('Try to create TopBarView', function(){
                var supplierPaymentsUrl = new RegExp('\/payment\/supplier\/list', 'i');

                server.respondWith('GET', supplierPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSupplierPayments)]);

                supplierPaymentsCollecion = new SupplierPaymentsCollection({
                    viewType: 'list',
                    page: 1,
                    count: 100,
                    contentType: 'supplierPayments'
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: supplierPaymentsCollecion
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

        });

        describe('SupplierPayments list view', function () {
            var server;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function(){

                it('Try to create supplierPayments list view', function (done) {
                    var $listHolder;
                    var supplierPaymentsUrl = new RegExp('\/payment\/supplier\/list', 'i');

                    setTimeout(function(){
                        server.respondWith('GET', '/bonusType/getForDD', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeBonusTypeForDD)]);
                        server.respondWith('GET', '/employees/getForDD', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplForDD)]);
                        server.respondWith('GET', supplierPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSupplierPayments)]);

                        listView = new ListView({
                            collection: supplierPaymentsCollecion,
                            startTime: new Date(),
                            count: 100
                        });

                        server.respond();
                        server.respond();
                        server.respond();

                        $listHolder = listView.$el;

                        expect($listHolder.find('table')).to.exist;

                        done();
                    }, 200);

                });

                it('Try to delete item', function () {
                    var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');
                    var $firstEl = $(listView.$el.find('#listTable input')[5]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.prop('checked', true);

                    server.respondWith('DELETE', supplierPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);

                    $deleteBtn.click();

                    listView.deleteItems();

                    server.respond();

                    $firstEl.click();

                });

                it('Try to create item', function(){
                    var $emplInput;
                    var $bonusTypeInput;
                    var $yearInput;
                    var $monthInput;
                    var $paidInput;
                    var $amountInput;
                    var $dateOfPaidInput;
                    var $input;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $newSelectEl;

                    $createBtn.click();
                    listView.createItem();

                    $emplInput = listView.$el.find('td[data-content="employee"]')[0];
                    $bonusTypeInput = listView.$el.find('td[data-content="bonusType"]')[0];
                    $yearInput = listView.$el.find('td[data-content="year"]')[0];
                    $monthInput = listView.$el.find('td[data-content="month"]')[0];
                    $paidInput = listView.$el.find('td[data-content="paid"]')[0];
                    $amountInput = listView.$el.find('td[data-content="paidAmount"]')[0];
                    $dateOfPaidInput = listView.$el.find('td[data-content="date"]')[0];

                    $emplInput.click();
                    $newSelectEl = listView.$el.find('.newSelectList li')[0];
                    $newSelectEl.click();

                    $bonusTypeInput.click();
                    $newSelectEl = listView.$el.find('.newSelectList li')[0];
                    $newSelectEl.click();

                    $yearInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('2016');
                    $input.focusout();

                    $monthInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('1');
                    $input.focusout();

                    $paidInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('1000');
                    $input.focusout();

                    $amountInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('1000000000');
                    $input.focusout();

                    $dateOfPaidInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('2 Mar, 2016');
                    $input.focusout();

                    server.respondWith('POST', '/payment/supplier/ ', [200, {"Content-Type": "application/json"}, JSON.stringify({})]);

                    $saveBtn.click();
                    listView.saveItem();

                    server.respond();
                    expect(listView.$el.find('input[type="text"].editing').length).to.equals(0);
                });

                it('Try to edit item', function(){
                    var $input;
                    var $monthInput = listView.$el.find('td[data-content="month"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $body = $('body');
                    var $tableContainer = listView.$el.find('table');

                    $monthInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('2');

                    $body.click();

                    server.respondWith('PATCH', '/payment/supplier/', [200, {"Content-Type": "application/json"}, JSON.stringify({})]);

                    $saveBtn.click();
                    listView.saveItem();

                    server.respond();

                    expect($tableContainer.find('input[type="text"].editing').length).to.equals(0);
                    expect($(listView.$el.find('td[data-content="month"]')[0]).text()).to.be.equals('2');

                });

                /!*it ('Try to sort down list', function(){
                    var $yearInput;
                    var $cancelBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $sortTypeBtn = listView.$el.find('th[data-sort="year"]');
                    var supplierPaymentsUrl = new RegExp('\/payment\/supplier\/', 'i');
                    var totalCollUrl = new RegExp('\/payment\/supplier\/totalCollectionLength', 'i');

                    $cancelBtn.click();

                    server.respondWith('GET', supplierPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSortedUpSupplierPaayments)]);
                    server.respondWith('GET', totalCollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 1
                    })]);

                    $sortTypeBtn.click();

                    listView.goSort();

                    server.respond();

                    $yearInput = $(listView.$el.find('td[data-content="year"]')[0]);

                    expect($yearInput.text()).to.be.equals('2014');

                });

                it ('Try to sort up list', function(){
                    var $sortTypeBtn = listView.$el.find('th[data-sort="bonusType"]');
                    var bonusTypeUrl = new RegExp('\/bonusType\/list', 'i');
                    var totalCollUrl = new RegExp('\/bonusType\/list\/totalCollectionLength', 'i')
                    var $bonusTypeInput;

                    server.respondWith('GET', bonusTypeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSortedUpBonusType)]);
                    server.respondWith('GET', totalCollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 15
                    })]);

                    $sortTypeBtn.click();

                    server.respond();

                    $bonusTypeInput = $(listView.$el.find('td[data-content="bonusType"]')[0]);

                    expect($bonusTypeInput.text()).to.be.equals('Sales');

                });*!/



            });

        });

    });

});
*/
