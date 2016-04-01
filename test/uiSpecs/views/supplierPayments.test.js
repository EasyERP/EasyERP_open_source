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

    var modules = [
        {
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

    var fakeSortedUpSupplierPaayments = [{
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
                    info: "плюс %",
                    salary: 450,
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
                date: "2016-03-16T08:21:17.245Z",
                user: "55b8cb7d0ce4affc2a0015cb"
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
                total: 0,
                balance: 0,
                unTaxed: 0,
                taxes: 0
            },
            salesPerson: null,
            workflow: null
        }
    }, {
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
            _type: "wTrackInvoice",
            currency: {
                rate: 1,
                _id: "565eab29aeb95fa9c0f9df2d"
            }
        },
        forSale: false,
        assigned: {
            _id: "55b92ad221e4b7c40f000063",
            dateBirth: "1990-07-30T00:00:00.000Z",
            ID: 57,
            isLead: 2,
            fire: [
                {
                    date: "2013-11-17T22:00:00.000Z",
                    info: "Update",
                    salary: 450,
                    jobType: "fullTime",
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "5644388770bbc2b740ce8a18",
                    department: "55b92ace21e4b7c40f000011"
                }
            ],
            hire: [
                {
                    date: "2013-11-17T22:00:00.000Z",
                    info: "",
                    salary: 450,
                    jobType: "fullTime",
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "5644388770bbc2b740ce8a18",
                    department: "55b92ace21e4b7c40f000011"
                },
                {
                    date: "2015-04-30T21:00:00.000Z",
                    info: "",
                    salary: 900,
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
                date: "2016-03-11T13:43:49.975Z",
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

            it('Try to change ViewType', function(){
                var $listBtn = topBarView.$el.find('#listBtn');

                $listBtn.click();

                expect(window.location.hash).to.be.equals('#easyErp/supplierPayments/list');
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

                it ('Try to sort up list', function(){
                    var $sortTypeBtn = listView.$el.find('th[data-sort="month"]');
                    var supplierPayments = new RegExp('\/payment\/supplier\/list', 'i');
                    var $firstTableRow;

                    server.respondWith('GET', supplierPayments, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeSortedUpSupplierPaayments[1], fakeSortedUpSupplierPaayments[0]])]);
                    $sortTypeBtn.click();
                    server.respond();

                    $firstTableRow = listView.$el.find('#listTable > tr:nth-child(1)');
                    expect($firstTableRow.attr('data-id')).to.be.equals('55bf426165cda0810b000009');

                    server.respondWith('GET', supplierPayments, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSortedUpSupplierPaayments)]);
                    $sortTypeBtn.click();
                    server.respond();

                    $firstTableRow = listView.$el.find('#listTable > tr:nth-child(1)');
                    expect($firstTableRow.attr('data-id')).to.be.equals('56017c16139400f22c000005');

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
            });

        });

    });

});
*/
