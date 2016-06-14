define([
    'collections/Customers/CustomersCollection',
    'chai'
], function (CustomersCollection, chai) {
    'use strict';
    var expect = chai.expect;

    describe('CustomersCollection', function () {
        var mainSpy;
        var server;
        var customersCollection;

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        var fakeCustomers = {
            data: [
                {
                    _id: "55b92ad521e4b7c40f00060e",
                    ID: 11,
                    __v: 0,
                    companyInfo: {
                        size: null,
                        industry: null
                    },
                    editedBy: {
                        date: "2015-07-29T19:34:45.991Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:45.991Z",
                        user: "52203e707d4dba8813000003"
                    },
                    history: [ ],
                    attachments: [ ],
                    notes: [ ],
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: null
                    },
                    whoCanRW: "everyOne",
                    social: {
                        LI: "",
                        FB: ""
                    },
                    color: "#4d5a75",
                    relatedUser: null,
                    salesPurchases: {
                        receiveMessages: 0,
                        language: "English",
                        reference: "",
                        active: true,
                        implementedBy: null,
                        salesTeam: null,
                        salesPerson: null,
                        isSupplier: false,
                        isCustomer: true
                    },
                    title: "",
                    internalNotes: "",
                    contacts: [ ],
                    phones: {
                        fax: "",
                        mobile: "",
                        phone: ""
                    },
                    skype: "",
                    jobPosition: "",
                    website: "",
                    address: {
                        country: "USA",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    timezone: "UTC",
                    department: null,
                    company: null,
                    email: "",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    name: {
                        last: "",
                        first: "Pekaboo/D.Kaufman"
                    },
                    isOwn: false,
                    type: "Person",
                    fullName: "Pekaboo/D.Kaufman ",
                    id: "55b92ad521e4b7c40f00060e"
                },
                {
                    _id: "55b92ad521e4b7c40f00060f",
                    ID: 16,
                    __v: 0,
                    companyInfo: {
                        size: null,
                        industry: null
                    },
                    editedBy: {
                        date: "2015-07-29T19:34:45.991Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:45.991Z",
                        user: "52203e707d4dba8813000003"
                    },
                    history: [ ],
                    attachments: [ ],
                    notes: [ ],
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: null
                    },
                    whoCanRW: "everyOne",
                    social: {
                        LI: "",
                        FB: ""
                    },
                    color: "#4d5a75",
                    relatedUser: null,
                    salesPurchases: {
                        receiveMessages: 0,
                        language: "English",
                        reference: "",
                        active: true,
                        implementedBy: null,
                        salesTeam: null,
                        salesPerson: null,
                        isSupplier: false,
                        isCustomer: true
                    },
                    title: "",
                    internalNotes: "",
                    contacts: [ ],
                    phones: {
                        fax: "",
                        mobile: "",
                        phone: ""
                    },
                    skype: "",
                    jobPosition: "",
                    website: "",
                    address: {
                        country: "Singapore",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    timezone: "UTC",
                    department: null,
                    company: null,
                    email: "",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    name: {
                        last: "",
                        first: "Sharmila"
                    },
                    isOwn: false,
                    type: "Person",
                    fullName: "Sharmila ",
                    id: "55b92ad521e4b7c40f00060f"
                }
            ]
        };

        it ('Try to create collection with contentType="salesOrders"', function(){
            var customersUrl = '/customers/';

            server.respondWith('GET', customersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomers)]);
            customersCollection = new CustomersCollection({
                viewType: 'list'
            });
            server.respond();

            expect(customersCollection.toJSON().length).to.be.equals(1);
        });

    });
});
