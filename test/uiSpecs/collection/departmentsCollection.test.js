define([
    'collections/Departments/filterCollection',
    'models/DepartmentsModel',
    'chai'
], function (DepartmentsCollection, DepartmentsModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('DepartmentsCollection', function () {
        var mainSpy;
        var server;
        var departmentsCollection;

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        var fakeDepartments = {
            data: [
                {
                    _id: "55b92ace21e4b7c40f000012",
                    ID: 4,
                    __v: 0,
                    sequence: 10,
                    nestingLevel: 0,
                    editedBy: {
                        date: "2015-11-19T11:09:15.406Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.909Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: ".NET/WP"
                },
                {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    __v: 0,
                    sequence: 10,
                    nestingLevel: 0,
                    editedBy: {
                        user: null
                    },
                    createdBy: {
                        date: "2015-09-30T16:19:15.986Z",
                        user: "560c099da5d4a2e20ba5068b"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: "Finance"
                },
                {
                    _id: "55bb1f14cb76ca630b000006",
                    __v: 0,
                    sequence: 9,
                    nestingLevel: 0,
                    editedBy: {
                        date: "2015-09-17T09:57:56.972Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-31T07:09:08.957Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: {
                        _id: "55b92ad221e4b7c40f000039",
                        name: {
                            last: "Rikun",
                            first: "Stas"
                        },
                        fullName: "Stas Rikun",
                        id: "55b92ad221e4b7c40f000039"
                    },
                    parentDepartment: null,
                    departmentName: "Design"
                },
                {
                    _id: "55bb1f40cb76ca630b000007",
                    __v: 0,
                    sequence: 9,
                    nestingLevel: 0,
                    editedBy: {
                        user: null
                    },
                    createdBy: {
                        date: "2015-07-31T07:09:52.155Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: {
                        _id: "55b92ad221e4b7c40f000030",
                        name: {
                            last: "Svatuk",
                            first: "Alex"
                        },
                        fullName: "Alex Svatuk",
                        id: "55b92ad221e4b7c40f000030"
                    },
                    parentDepartment: null,
                    departmentName: "PM"
                },
                {
                    _id: "55b92ace21e4b7c40f00000f",
                    ID: 1,
                    __v: 0,
                    sequence: 0,
                    nestingLevel: 0,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.907Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: "iOS"
                },
                {
                    _id: "55b92ace21e4b7c40f000010",
                    ID: 2,
                    __v: 0,
                    sequence: 0,
                    nestingLevel: 0,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.908Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: "Android"
                },
                {
                    _id: "55b92ace21e4b7c40f000011",
                    ID: 3,
                    __v: 0,
                    sequence: 0,
                    nestingLevel: 0,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.908Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: "QA"
                },
                {
                    _id: "55b92ace21e4b7c40f000013",
                    ID: 5,
                    __v: 0,
                    sequence: 0,
                    nestingLevel: 0,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.909Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: "Marketing"
                },
                {
                    _id: "55b92ace21e4b7c40f000014",
                    ID: 6,
                    __v: 0,
                    sequence: 0,
                    nestingLevel: 0,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.909Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: "BusinessDev"
                },
                {
                    _id: "55b92ace21e4b7c40f000015",
                    ID: 7,
                    __v: 0,
                    sequence: 0,
                    nestingLevel: 0,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.909Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: "HR"
                },
                {
                    _id: "55b92ace21e4b7c40f000016",
                    ID: 8,
                    __v: 0,
                    sequence: 0,
                    nestingLevel: 0,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.910Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: null,
                    departmentName: "Web"
                },
                {
                    _id: "56802eb31afe27f547b7ba52",
                    __v: 0,
                    sequence: 3,
                    nestingLevel: 1,
                    editedBy: {
                        user: null
                    },
                    createdBy: {
                        date: "2015-12-27T18:32:19.543Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: {
                        _id: "55b92ace21e4b7c40f000016",
                        departmentName: "Web"
                    },
                    departmentName: "JS"
                },
                {
                    _id: "566ee11b8453e8b464b70b73",
                    __v: 0,
                    sequence: 2,
                    nestingLevel: 1,
                    editedBy: {
                        date: "2015-12-27T18:32:01.531Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-12-14T15:32:43.470Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: {
                        _id: "55b92ace21e4b7c40f000016",
                        departmentName: "Web"
                    },
                    departmentName: "Ruby on Rails"
                },
                {
                    _id: "56802e9d1afe27f547b7ba51",
                    __v: 0,
                    sequence: 1,
                    nestingLevel: 1,
                    editedBy: {
                        user: null
                    },
                    createdBy: {
                        date: "2015-12-27T18:31:57.230Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: {
                        _id: "55b92ace21e4b7c40f000016",
                        departmentName: "Web"
                    },
                    departmentName: "CSS/FrontEnd"
                },
                {
                    _id: "56802ec21afe27f547b7ba53",
                    __v: 0,
                    sequence: 0,
                    nestingLevel: 1,
                    editedBy: {
                        date: "2015-12-27T18:32:40.776Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-12-27T18:32:34.872Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: {
                        _id: "55b92ace21e4b7c40f000016",
                        departmentName: "Web"
                    },
                    departmentName: "PHP/WordPress"
                }
            ]
        };

        it ('Try to create collection', function(){

            server.respondWith('GET', '/Departments/list', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepartments)]);

            departmentsCollection = new DepartmentsCollection({
                viewType: 'list',
                success: function(){
                    done();
                },
                error: function(collection, response){
                    done(response);
                }
            });

            server.respond();
        });

        it ('Try to show more with error', function(){
            var spyResponse;

            server.respondWith('GET', '/Departments/list', [400, {"Content-Type": "application/json"}, JSON.stringify(new Error())]);

            departmentsCollection.showMore({
                success: function(){
                    done();
                },
                error: function(collection, response){
                    done(response.responseJSON);
                }
            });

            server.respond();
            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');

        });

        it ('Try to show more without the options', function(){

            server.respondWith('GET', '/Departments/list', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepartments)]);

            departmentsCollection.showMore({
                success: function(){
                    done();
                },
                error: function(collection, response){
                    done(response);
                }
            });

            server.respond();

            expect(departmentsCollection).is.an('object');
            expect(departmentsCollection.page).is.equals(3);
        });

        it ('Try to show more with the options[page, count]', function(){

            server.respondWith('GET', '/Departments/list', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepartments)]);

            departmentsCollection.showMore({
                page: 3,
                count: 1,
                success: function(collections){
                    done(collections);
                },
                error: function(collection, response){
                    done(response);
                }
            });

            server.respond();

            expect(departmentsCollection).is.an('object');
            expect(departmentsCollection.page).is.equals(4);
        });


    });
});
