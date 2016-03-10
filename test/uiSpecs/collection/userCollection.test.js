define([
    'collections/Users/filterCollection',
    'models/UsersModel',
    'chai'
], function (UserCollection, UserModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('UserCollection', function () {
        var mainSpy;
        var server;
        var userCollection;

        var fakeUsers = {
            "data": [
                {
                    "_id": "560c099da5d4a2e20ba5068b",
                    "profile": {
                        "_id": 1387275598000,
                        "__v": 0,
                        "attachments": [],
                        "profileAccess": [
                            {
                                "module": 1,
                                "_id": "52b0254ead08de381e000002",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 6,
                                "_id": "52b0254ead08de381e000004",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 7,
                                "_id": "52b0254ead08de381e000005",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 14,
                                "_id": "52b0254ead08de381e000007",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 15,
                                "_id": "52b0254ead08de381e000008",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 19,
                                "_id": "52b0254ead08de381e000009",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 24,
                                "_id": "52b0254ead08de381e00000c",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 25,
                                "_id": "52b0254ead08de381e00000d",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 36,
                                "_id": "52b0254ead08de381e000010",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 39,
                                "_id": "52b0254ead08de381e000011",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 40,
                                "_id": "52b0254ead08de381e000012",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 42,
                                "_id": "52b0254ead08de381e000013",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 43,
                                "_id": "52b0254ead08de381e000014",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 44,
                                "_id": "52b0254ead08de381e000015",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 49,
                                "_id": "52b0254ead08de381e000016",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 50,
                                "_id": "52b0254ead08de381e000017",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 51,
                                "_id": "52b0254ead08de381e000018",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 52,
                                "_id": "52b0254ead08de381e000019",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 29,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 53,
                                "_id": "52ef6d5f9d8a19c819e19f7f",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 54,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 57,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 56,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 55,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 58,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 59,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 61,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 60,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 62,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 63,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 64,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 65,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 73,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 71,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 72,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 68,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 67,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 65,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 75,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 69,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 66,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 70,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 74,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 9,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 76,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 77,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 80,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 78,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 79,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 80,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 82,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 83,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 84,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 85,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 86,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 87,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 88,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            }
                        ],
                        "profileDescription": "No description",
                        "profileName": "admin"
                    },
                    "lastAccess": "2016-02-07T20:07:56.648Z",
                    "relatedEmployee": null,
                    "savedFilters": [
                        {
                            "_id": "566594636761dac5379303d4",
                            "viewType": "",
                            "byDefault": "DashVacation"
                        }
                    ],
                    "kanbanSettings": {
                        "tasks": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "applications": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "opportunities": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        }
                    },
                    "credentials": {
                        "access_token": "",
                        "refresh_token": ""
                    },
                    "email": "alex.svatuk@thinkmobiles.com",
                    "login": "AlexSvatuk",
                    "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
                },
                {
                    "_id": "55ba28c8d79a3a3439000016",
                    "profile": {
                        "_id": 1438158808000,
                        "__v": 0,
                        "profileAccess": [
                            {
                                "_id": "52b024f07fa64ad41e000002",
                                "module": 1,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000004",
                                "module": 6,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000005",
                                "module": 7,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000007",
                                "module": 14,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000008",
                                "module": 15,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000009",
                                "module": 19,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e00000c",
                                "module": 24,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e00000d",
                                "module": 25,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000010",
                                "module": 36,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000011",
                                "module": 39,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000012",
                                "module": 40,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000013",
                                "module": 42,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000014",
                                "module": 43,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000015",
                                "module": 44,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000016",
                                "module": 49,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000017",
                                "module": 50,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000018",
                                "module": 51,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000019",
                                "module": 52,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001f",
                                "module": 29,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52ef6d5f9d8a19c819e19f7e",
                                "module": 53,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001e",
                                "module": 54,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001d",
                                "module": 57,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001c",
                                "module": 56,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001b",
                                "module": 55,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001a",
                                "module": 58,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000019",
                                "module": 59,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000018",
                                "module": 61,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000017",
                                "module": 60,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000016",
                                "module": 62,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000015",
                                "module": 63,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000014",
                                "module": 64,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000013",
                                "module": 65,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000012",
                                "module": 73,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000011",
                                "module": 71,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000010",
                                "module": 72,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000f",
                                "module": 68,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000e",
                                "module": 67,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000d",
                                "module": 65,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000c",
                                "module": 75,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000a",
                                "module": 69,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000008",
                                "module": 66,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000006",
                                "module": 70,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000005",
                                "module": 74,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b89f6ddf6af7240d000007",
                                "module": 9,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "560543257b2cc8f567000006",
                                "module": 76,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 77,
                                "_id": "569fa13362d172544baf0dac",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 80,
                                "_id": "569fa13362d172544baf0dab",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 78,
                                "_id": "569fa13362d172544baf0daa",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 79,
                                "_id": "569fa13362d172544baf0da9",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 80,
                                "_id": "569fa13362d172544baf0da8",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 82,
                                "_id": "569fa13362d172544baf0da7",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 83,
                                "_id": "569fa13362d172544baf0da6",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 84,
                                "_id": "569fa13362d172544baf0da5",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 85,
                                "_id": "569fa13362d172544baf0da4",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 86,
                                "_id": "569fa13362d172544baf0da3",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 87,
                                "_id": "569fa13362d172544baf0da2",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 88,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            }
                        ],
                        "profileDescription": "No description",
                        "profileName": "HR"
                    },
                    "lastAccess": "2016-02-16T08:21:20.405Z",
                    "relatedEmployee": null,
                    "savedFilters": [],
                    "kanbanSettings": {
                        "tasks": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "applications": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "opportunities": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        }
                    },
                    "credentials": {
                        "access_token": "",
                        "refresh_token": ""
                    },
                    "email": "andriana.lemko@thinkmobiles.com",
                    "login": "AndrianaLemko",
                    "imageSrc": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1CzhdAI8H7oA5zzxz+nFbVlEoKgj0weuT+VUI7VvkZSME56k9h2P0/nW/YRMGSXHKkHjjI/Ee1fMUqj2PSlTtqeneA7WNdHmAH3pmHI6DC4H5VT8S6EralA8iqoSK8dDjkZgxnr0rX8GxSpo7tIMZlJ57DatXdZt/NkhJTcxinjH/AAKM8fpXsR/hownTUkeD/FHw2moa4gtLUK1/pj5lIwEVpmlY+mSGc/h715x+14J9N+Cnh+yWdo2uvEsNtMi9ZUWG4cgnuNxQ/UCvobxloUd3eaLdzsqxC2ksZlABD5BGD7fIfzrx79sPwvJq/wACH1a2hDN4e1e21OR9x3EljbuMY9Jix7ALmpi7M4o0lGbZ0f7PNjCPDlisac7F3DvnAr3ZbY4+XCduK8D/AGYdSTUPCFlcB2bdEpJz1OOe/wDnFfQ1uwdQWPCjOT61hR1jc9CcbMx9U0xLtPmUk9OTXjHjzwbBe3QUqQhOTz/T6V7b4guDbsh7buQPSvkz46+JPE/xI8TD4beBro2WmKf+Jxqu7aFjB+YBvT5SCONx4JC7jSqcqersTGMt4nifx0X4fC+ifwLrv2rXNNfdcJbRStGQpBA8wLtz3yDjjk5rzP4eeOr74c+PLbxZ4flVGsrxbq2iDEq1u45iYkAnCkxt+JHY13fxD8f/AA68EWy+CPh5bvepZkJd34G7zpOjFnAw59xx2HHFea3mnvPpsGrWweMw5fa4wSucupxjjkkZ56g8YralV5Y6qy8zKdNVHdO76n60eD/EWl+NvDGm+KdGctaalbrPGGA3LkcqwBwGByCM8EGrs1qeccmvmv8AYV8ff2l4U1TwDeTnztJuPOt0ZMHyZCT0Jzw3UdAWHrX1G8TAZAyP8mle40rrzOamsSSwwD35FZVzZk5Uj611s8AweBg+grMubTqcZzSCxyFzZK3yhQMZGD3qg9idxKqMH1WuontWYkNj0qjJAVdhjHNUlqOUHY4/T42mhB8xmbGMHOSM+tbunIysiZdRkLx/F6/59KydAbLR5jJywAB6Z4/Kum0q2jFzHJIpZQ69B7/rXk0Vs0ds7nonhZX/ALMC5LFSdxPc4A/kK0bz5fs8mOPNCdB/Flf6isrwliO2e33OcSEqPUYreuohNbOCG+Qh+nQjBB/lXtU9aZzNnD+IJLbXdMtxaFQYbrLAgk7o3DsBg852sD/vVieLvDena14K8S6HqMPnW95bTTTmOTywIp0dHGemRHnB9W+hrq9digsdKvStoVeG5kkTaM7gVLk8e8hH4e1Q6PE09pbxi3ge2mtXhlVeQ2xsRZ9coBn6+1ZzMPtHyz+yf4lfw3d6h4A1m4H2vSbp4c9nUE4YZ5wQdw9QR619Y/2lblN0Ljp90HrX55fHO08X/D/4m3+t+FdR+yS2s7QXzZXc0ZOYpiBnbkFQd2Mb4gM5zXe/CX44apIttYX2stqN1IQzYJ5PoO2K5PaSpxva/wCh6EYOquZdD6b+I/iZtO0eW5ZiuwZLZ4BGa+Vm1K58Z3cPgzw9frpza209xeXYjdz5QyuBsG7rjODkfKeQCK+yrLSNE+JfgZoby1BW6iKt6jt19a+Y77wnN8GfGjWM9xcnT5m3KoxtZM9/z7VlN8k1UnqnsbU6HtoShD4jzfw9+zBJ4fn1BNcu45oLqd5be0tZHnLR7spksil9uSM7UHUn7w27HxO+CMfhLwFDr0Vusd5ATOIQNxC4Py+528emfpX1Z4JuPCuu28dzpjQszfMAcZB+lcr8f7MSeFrlAqsUUkFx0PsKdac5r2renQnDUFR/dJb7nx5+y942PgX4vaZcyb4rC8lOmXJZlCpbzfNGzOxwArKXPqIwBkmv06hHmwK+Dkj+gr8dpFl8P+IEnVVVPPwpJKqHB3Juxw3K/lkV+svwo8UDxl8OfD/ib5/Mv7GKSXdGUJcKAzYPYkEj2rvpu+xxTg4ScWbU0JGGPWqEyPkjOR6etbUgzg7eO9UJ4+N2PfFaSh3Hy3MC4hGenBHQVQkhw3TP51uTxZYkA1Skhbdx/KpW4XaWp5npGcqy8DsSMsPpXbaekSmORAOWU/XnOOv/ANeuL0vYu3K7WwAAOB6/413OhMCh27lCjIOcYOex/OvGwr6HRVWp0+hNsuDIxOwnBwMdx/WusZUZmhJx5qkDt7fhXL6YqMkoG3LLu4Bxn1/Dn8fWutXJ8qUg5wN3tnr/ACr2KTtGxySepzGrg3FvdJNK0YeygRZBwVd2kDMfQ4ArG0bcujptYtFbSM06rnLRhR1H1jP5122oKvkJIlupkUyjDDP3A23/AD71yvhqG3TQL8wQtIMRZGRmQFFzz7hyM+uaGtTB/EfLH7YngiFfE+n6nNp5ew8TWr6XexwBvMNwo+RxyEyitFjP8UQOGxgfMHw40G70bXbGxu7G1W80y5aJHiAkVmD/AOt3jh/9k9MYPPWv0Q/aC8Hnxv8ACvVYbeF5b3T0+323z+WFeEse/ByrSMehO1RXytaaRYXGoWXiO1JKzARhiANwT5VOAMf6vyxnn7p5PWvOxNZ0k49z3cpw8MRJSe60Prn4Fak8ekJp05DMAGBPfNXfjL8NLDxlYfadrLdQoTGy9c1wPw51tbXWtMsbeRo4m/1rem7O38M17Tq/iawkSa0spBcXduMtGnzD3BI4HfiowtWFbDOE+hVanPD4lSh1PgvTdd8UfDnxfti1Ynyrgw3EJJz1O047ehHtXsfifxtD4x0EI+wb49rA8tuPv6fzrh/iV8N/EsvizUPGF1AyWl9O00UX8KD1bsTgfqfx8z1DxV/Z+uW+jW9xK2fnkCgsoXjJJ+hHNedKUpe7B+p706VOtyzS1PNfinoj6TdS7bZTJbv5oBHGQWLOwzyQhH5e9fa37B3jMa78M77w9LLvfR7vchkuN8hSVQfufwoGDBT0OD6Gvln4v6hp+q+RdJEkkM9uizDA+9GCGwe2cY/D612H7BPjFdG+Kh8MXDOia1pzxIhPymdBvOM9ThG6c+vavXwFRzpptHzmYUlCq2foYxHaqsilgccVaJU89xUDc/J3r1mro4VpozNmQKPu8VRkQlsgcfXFasqhs9qrPESxO4CojGz1JqaHjmjFXkijJPzlRhevJ6AV22kS/OjA4GMY7AfSuCsJDE6gkggkrzyD3P5V2mlzRsVYMR046gfQ189h5JM6qiud7pEfmOoUAhsqc9ORxn15rrLZRPZIepZSpz+I/oK43TJgyggn5CNvtXZ6cm60aLGXjYgA+o5FezCWlzgmMuEuXt5h8uRJ+74wQjDv/wACzXN+ELU/Z7wXICFrmYxoABhVk+T/AMdUfka6wKHuLjcP3bwh1PbjoP51haPtFzHZuwV3cpgZz3OP++Spq29UYPQlW3WaO4t5lSRXCMRtyGG3D5z1GAw/E18S+MfD48EeKtd8NpC0FrZSLdWbTEB5IT0CAeu9iRjP7v2r7iskUXs8Um5lBG1MD+6OPp8355r52/aj8MNZXOl+NbSxF2zN/Y10rr8h84skL56AiVwAx6Flrhx9NyhdbntZJiFRr8s3o/8Ahzzj4f8AiMPqtzK0i7AqID1GePT8f1r6M8NeJdE0/T2l1G6gjymfmdVOMZJOen418saRHpEkK3Om3W5WQEbTjPcfQ89fb659R8DeFtCiW2vYZJzdJhg8kzTNkDB/1hYj3x614eGr+xqn0+YYanUfPJtI6f4j6Z4l8exwaPokH2HSowxku50YRKeMMASGlOG4xheGywIwfk/xN4Gt9I8dX+labHNcfY2VJrhwN8j4ySTgADkcDgY6V9qanqGs6napptnIiHG0zFeg9QOlcBr3w90zRNPu9RnlV7iUGR3YZJPHPv8AjXZiZppypq/dk4bFQp0/ZtW/rdnxjqWirqF9cWcnmutjaXl0yEZUIsTMSeR3I+v6Vyvwt8XH4b/FTw74omaS2hsdYDXR2q7CFwqyEbuPub8dOoPHBHoerZsNQ1G7uW8hNQs7u0WQggKjoyh89uCT+A9a8Q+IsjvqMghhRHlClGGQQDsYHHTop7dzXVgJ3aj5Hi5srSc1sftDE4kRWxtBAPPUcUxu+K8J/ZR/aB8B/E/4eeGfCUfjOyufGenaPbxX+mzSkXchjUoZAHA80kR722btu8bsbhn2fQ/EXh7xRp66v4Z1zT9WsXZlW6sLpJ4WZThgHQlSQeD6GvdPHi1JaMnkC7sknnj9KgcAn5sn6GrDMpBYYPP1/wA9Kzr3WtJ0+byL7VbO2kI3BZplQkdM4J6cH8qaYTXuniAKR3G5geuB7fTNdLpM4AVVPTgnPSuZuSEk3Z5AxjFX9LuzkLlWHY5PFfJt8kjt5eZHqehzrtBzgH+HPSu60eXy5jG5xlQ4JPqN2fyP8q8o0a9bGA5bPqcH/P8AhXomk3ZlubWQciSJQefTKn/0E16+HqcyOGrFxZvljDeW7TZCtvix7FsDP5j8651Wkt9bwGIYXy+n3CoXj8UPP1rdlAz5k7g7ZgwAGABtB/mK5zxFPFp+sRXxcCS5IVFLFFJBHHH3vvyHB7rnrWk5cpz8tzYtrjy9augMMjJHghgedxBGOo6Z9/wrjfjN4UsfGvhfW/Cmo5EOo28kDSCNZmgJyUkWM9WU7WX/AGlFX7u5hs/EltqnlmOW/hERO8dcjbnjtuPP1pfFFzM97avEqm3ubZllYrvbzQwKYXp0yPqR0rnr1v3cka0o2kj8kNY8T+NPgt461PwtayrHbafeSxLp1yfNjSLdmPDA7s7SMEY4wSOcV9P/AAc+PljrUUBvoHiJOyVQ29oz0IPTjPTivMv24/Ayaf4wtPG9lCRb6kDZ3ihI0CSpuMRwDklo1IycZWNDya8O+G3i658PeJLaSaZvKdgkh6B06Akeo5H4YrKpQp4ygqyXvfqepg8bKhX+r13eD/C+x+pFr470WWz+02EzSlgcARsCf0rhtdudd12WeF7hkguTgofmbb/dz2/CsnwLdW2oaXb3lu4ZJE+8G4x/kV3tjp0bAEAjJ/nXiOpOorHrTSozaPmn416Xa6R5Ebxud8ZlfggFV527uxOP69q8D+L2iw6Rpy3epFBOlhaTFT94sA0ZH+P09q+kfjhbWup69eG6kkSFb6Kzba+0iGOFZHI9MmVlP0HtXyl8d75r/U/DsLXbz2t7oMDMQMCSQu53cHox6HjjOK9PK4OUkjz8zqclO76nh0k0plcuxLbiT271u+D/AIi+PPAlzNdeCfGeuaBNOoWZ9M1CW1aQDoGMbDcBk4Bz1rEuUZ5GkD53kufrnn9f6VHDFhy+cD0NfTrV2Plb2dzuYPjR8WLeT7RB8SfE8c6zTT+ZHrNwjb5eZGG1hgseWx97A3A4zWdrHxA8d+INQl1XXPGOt395LtDz3OoTTSMFAABd3LHAAAyTgADpXOFcNjLYB+Y0AIe6nsCTzXRGmkiHNt6n7B6yjQ/Nj73vWfbXXluVORhvy+tdd490l9Nu5Y412hzvT055x16fWvP5JGWUEnqQPpXxmNpuEz6PDS5lY9A0a9KlQWIwO5r1DwvdGRbOcNwoeLk8kgg8f9/BXhujXpUAdcnJ7/8A669W8D3BJSORyzBxMo5KqADk5HTnb+VdOBqXdjOvHQ9J1FVFrMy4zw+APqK434gxy3uhNPFgS2kwZG4ygJG0qTnn5j2PTPbnq5bhjHeMjj92FXnoDwcfqPzrmNWkM9vq1lPciOGK2jk3ZIAURtvYk9CA3PptFduKtZo44rU4zVvEhvfC2k6xb6t5EjGItl/utIPlRs43cvGMcZJx7HQ8X6p9t8FXepW5Xy7eCa4Tby5iaBidvGA2SMBvSuHTUA/hLW9KCkXOkyglw4YxxPgoQfYrJjPPHNdLod2b/wAOyWE85kE1o6loXKFi2VHzDkdc5HII9q8Zyc00+qOuCUWn5njnx18O2/xi+DdxqugWZvJb+yj1K3Eas7Q3MaBmO0ngusZiwB12joa/Nt5riyvShRSDklcZByPvD8MHNfeHwk8e2fh3W9Z8CeJtTeKHzZbeO2+8sUz3QgCrzuK5mjCqowuXdsABh8m/HrwA3gH4g6hYCMizuJGu7Qk8BHYkqOTkK2V5OehOM16GXydJujLrqjPHxTfPHpp/kfQP7LnxCefSG0nVZ8LD/qmJAz68e+K+jV8e6Npuly31/eRQQWqNJLLK4VERQSWJJ4GAT7AV+eHhX4u6H4C0RLTTtHmvdRVtzyNL5MRbPXIyzfTH4iuQ8b/Fnxz8QGNvrOqyfY9+9LKAlYVOByRk7jx1YnGeMVg8sq1azkvdiepWzLDQox15p2V7d/Nnr37R/wAdNI8f67Npvg0slmw8i5vUYqLoD5iAv935V+bqdq84HPjfjnUJbi901ReNOmn2yWKMxBGIfkBBHBzyf+BVgW889my3EMjrMhBVlJyCDkY9wQMUy7uJJraKB8nY7vuJJ5IUY9vu/rXt0MPChTUIdD5qviamJblNmYI2+4xwoP8AOo4otrEhhkZ/H8KmXcCST0GOP8/SlQEkIgJPbHeu2lG7uc7fQglQhueM9aqlWz95eOORmrtwHC5Gc8VnrJJzlupzzW0nYmOux+8HxG08T2UFzHHllbDDsR/jnFeE6urWszrgHDYH59fwr6e1Kyi1Gxkspf8AlquAcZwfWvnfxhYPazSeagDxMyOPQjOa+dzOlpzo9+g+SpZ7MydNviOWYj1JPpXsXwwvLe5vnhWRmLwoM5/Aj6ZOe3SvBLW6kQ5C4+bI/wAmvZfglcvPqru3yqI8Dn7x5PH4An8q8zBO9VI6MSrwuewByf7QRmynyE47cDI+vH6isC1WHVNR1LSrs4guYSrJ2bzBhv0/lV6KadrrVpCH8pY8DPTcABx9cf5zXPaXfBfFkFv5abSVWYkHILFShHboGH4GvSxEryUe5wRta55T4csknsPGNqr7Bem3mjC87RIHkYnJ+8HMoP8Aujvmren6qLVre2tpFUG3nZkAxhgAVXrxxIvqMMOemc/RL6C3l8WTXE6x2aXaWyseAUh8xpMnkZ+d/bn0qp4buYW0XxF4k1KfzYVu3kT5OYIIYYhKsZI5IMBzz0cDjFeXKDaNYz1PmT40XMHhv4oXN9cRRvb3ZvpwwLAK89q8asdvULKm8gfeBI6msn4savY/Fr4eQ3OwJrukWK3sKu4eZoVQeaJAFURbwS6oM5EbE/eFR/Fj7Vqng7wlr+tzs1zr0Nwkg27WKRSt5ZI6H5DnPH4ZrxSPxle6TY2txbyQrdSTlsQxj94VMRSSXIxIpBuEA9iGHQV6mHoupSg18UXuZYityVHfaSODlgkztkPJPr1qSO3WKPcvJq1exwfbZGtUIjLllBOSFJ//AFUoJYY2fNnPB7eleuk5Ox5Td9Cvt2gZGOarTkuxUgYHStFlYJzgFeT2z9KpTowd8kHaoPXI/DiuhUrJEXuyh0bAIwwJ/L0zT4ol3LgHnjFORGDEhWbHy4A5z7/41aUOm1lRt21jnH14IFdFKmiJOxRvYjtwrM4GevbNYr79525PPrXR35DQbQjF1zuG0kgdPoP/AK9c3MQJG3OM/Q/0qcRFKSLpas/oWJPFeS/Ffw8UuWu44F8i7XBKrwHA/wDrZ/A16hpeo2mr6fbapYTCS3uY1kRs84I6H0I6Eeoqn4v0n+2dBuYUB86NTJFgZO4dvx6V5lemq1Ox7M9uZdD5SeNo53hZRvXqeTjHXpzXr3wKYS6o8ixEIYWRDtwOAd2T7bk4/wBr615j4qsjZXiy9BMN67Tj5uh/z716L+zvd/8AE+u4JW4lt2ERLcM4ILBc8ZIGTj+4vFeDhocmISZ01J89LmR7PfPDa6beybFWR9ocAdSxwAT36gfhXB+FLj7V4xub4yo0MLiInsnlxF2z+MmK6zxVcNbaJcyyRlzJMzKo9EjyGAz2ZQa4bwjMtlZXN5cZiTyDNNJuILyXEgCR4xwQmec9cdhz2V9a6XY4r2ieZaXo02oaY+lXKmAa3qH2/VfLO4HJHyIuON6woSOQRK3TrUvxBktp7T/hVOgyrFf3lu0l5bxH57e3dJGwx67nLEMDk/vlJxuGeh8DKjanPqN39me6YyPp1tjKxQqNu9woxg4DAZz1BwF5+bv2e9em1r9pLxN4k1WZrhdf09tTG+63srPJbOAHOSAiO34RgcgA0qdDmhKT3MnUaasYnjrRI9Q+GUN3YXAmmtdXZ4AVysX2nzkdAc4KhwCOgGcdBXyLKZl8+zlLKXAmCEqAGQEryemA8nA6lhX3d4Jay1G68S+B9Q120u5tGubmKMPF5bxSW12kojKFcPtRnGRkYRsDGCfiPVtPvItauba4CLJbELKMYKsABjnqwPB9we2a7MDTmuaFupniailaRkwQs48zYBk4GDgZ/lV+K3aVdzRBlx1xWqLWBWZLcMytjBwAV9Ryecc88cYPqBN9mWCMGULnBI6hduM8k55ye2eM5r6Khg2tzzpzRz92FiRVcHByVbaRkVmON+9kk2npk8dB79en8q2tSVsJtdGV8b1LDep//WDVGGFpN23Egzgc8njp+lVKneVhXurlOCPzCJFbOGz75A6D8vpVpoRsXMIZfu/OpwoPTn/9fSp/sy7VKK2wDDZX7jc8dDxj0P8AiGzxRvbscyKyqfnADKDx1Q8kevHpxwa3hT5TNyKVxG01qWijPyAswAzj0OfzPpXJzJGZW+UdfbiukMqi1ZCRvU9QeDzjHP8AT/8AVz90/wC+OElPAzhiBmuTFa2aN6N0z9sf2fvFK3thfeGLqRzNZv58O5icxnAYLxwAdp68lz717GAMY7Gvjv4fate6X4t0i+s5AsiTImCMhlYhWB+qkj8a+xAMYrwsJPnhyvoe1SlzRseCfFzw35M12giRAp8+Jto6d19+/HsKq/s9xvL4phuGTKCOaNMJ0CrySexBYAeoZvevSfijaxT6fC8gz5cg2jAx8ytnPHsK4H9nezt4vF148abWSzkGQeuZW6/go/KuScFDExaCErRcD0/xfcLdaybVkJt7G3ZJQG4Ly4yhHrtC/QNnpXnXjXxLd6Fo9n4X0fT4LnV/EtwF65EKBVXzCB94K0iAqSPlYHPGK9A8Sk2xuJ4yd87SyuSerKCB+G0AfQVxotILrxtFJMgLWtvcNCf7hcDcR6fdX/vkVnUlao31ZlK7Kdro0mkLrN5ayNLfWmhTJbgpgbkVkVl7DcwJIHAIOOtfK3wovdE0D9ozw7DexRC11i5vrGKAL8vkGCdSw2nDAzYReDkbu6Ln7T8VJ/ZXg7xXqNnI6z22lKkTZ+6PIBGPoWY/jXwZ8ObqW8/aXuLWUjytELWlko6RLbxAIyg8KxMYZiuOWbAGa6cJTc2436MxrS9nG50vgGWz0z4y3tzrEjyfbPE+7aDGq3Et200MgkRiGYKlw2NoPIBIwCR87+KdElHi7WrvZuju9RupEDDD4MmQCnbIIOQMHnuCF968cXl7pXxJnmtrt9lh4muRbRYVViGyJiAVAbnz5FPPQ+5z5jqUizT3V7JEpaK9eBVJJUKGkYdTnO4A9ev1NfU5fglz877I8mpXajY5ey0wlVk+zhiB5jGRNuOR6kZzkfnWZrPmKYFWCPYcFiTyeMAbcnoMg/Q13mo6db2yQSxbxKkscJcHaWXBIyBgZDKrcAcjNcdf2EEGs/ZV3FSPvFvmGT/n9PSvZnBRXKjnUru5y17Hm4PlNAUzkYySD1PX2GKikslSLYVdXI3AnnIXPHpjjHfp2rotR0qxd5SLdV3Tj7oxwWXj6fN+gqpdlnZt7biq5BIBIO4gfliub2STL5m0YFxDHHEnlMqCYBto4wRkHPHXI7ep7iqbyMhkiZtvGQDlMep4H0/Dt3rc1GCOwlMMA/dTI8jI3Iyr7R+g/U1j3Uxhyirny9qglmGRgHnBrOcbbCjK7sYFyzwsxVpN3RjuPI47/lWY6vuIwMjg5Gea3tTiVI5tuR5aBh9cYyawZCBK67ehx1NeZW0OyEran//Z"
                },
                {
                    "_id": "55ba2ef1d79a3a343900001c",
                    "profile": {
                        "_id": 1438158808000,
                        "__v": 0,
                        "profileAccess": [
                            {
                                "_id": "52b024f07fa64ad41e000002",
                                "module": 1,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000004",
                                "module": 6,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000005",
                                "module": 7,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000007",
                                "module": 14,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000008",
                                "module": 15,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000009",
                                "module": 19,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e00000c",
                                "module": 24,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e00000d",
                                "module": 25,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000010",
                                "module": 36,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000011",
                                "module": 39,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000012",
                                "module": 40,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000013",
                                "module": 42,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000014",
                                "module": 43,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000015",
                                "module": 44,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000016",
                                "module": 49,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000017",
                                "module": 50,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": true
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000018",
                                "module": 51,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52b024f07fa64ad41e000019",
                                "module": 52,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001f",
                                "module": 29,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "52ef6d5f9d8a19c819e19f7e",
                                "module": 53,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001e",
                                "module": 54,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001d",
                                "module": 57,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001c",
                                "module": 56,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001b",
                                "module": 55,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400001a",
                                "module": 58,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000019",
                                "module": 59,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000018",
                                "module": 61,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000017",
                                "module": 60,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000016",
                                "module": 62,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000015",
                                "module": 63,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000014",
                                "module": 64,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000013",
                                "module": 65,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000012",
                                "module": 73,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000011",
                                "module": 71,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000010",
                                "module": 72,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000f",
                                "module": 68,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000e",
                                "module": 67,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000d",
                                "module": 65,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000c",
                                "module": 75,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c2400000a",
                                "module": 69,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000008",
                                "module": 66,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000006",
                                "module": 70,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b790eaa5ebea2c24000005",
                                "module": 74,
                                "access": {
                                    "del": false,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "55b89f6ddf6af7240d000007",
                                "module": 9,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "560543257b2cc8f567000006",
                                "module": 76,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 77,
                                "_id": "569fa13362d172544baf0dac",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 80,
                                "_id": "569fa13362d172544baf0dab",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 78,
                                "_id": "569fa13362d172544baf0daa",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 79,
                                "_id": "569fa13362d172544baf0da9",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 80,
                                "_id": "569fa13362d172544baf0da8",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 82,
                                "_id": "569fa13362d172544baf0da7",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 83,
                                "_id": "569fa13362d172544baf0da6",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 84,
                                "_id": "569fa13362d172544baf0da5",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 85,
                                "_id": "569fa13362d172544baf0da4",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 86,
                                "_id": "569fa13362d172544baf0da3",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 87,
                                "_id": "569fa13362d172544baf0da2",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 88,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            }
                        ],
                        "profileDescription": "No description",
                        "profileName": "HR"
                    },
                    "lastAccess": "2016-02-09T14:22:09.708Z",
                    "relatedEmployee": null,
                    "savedFilters": [],
                    "kanbanSettings": {
                        "tasks": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "applications": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "opportunities": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        }
                    },
                    "credentials": {
                        "access_token": "",
                        "refresh_token": ""
                    },
                    "email": "anna.lobas@thinkmobiles.com",
                    "login": "AnnaLobas",
                    "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
                },
                {
                    "_id": "55c1e1276708490b0b000035",
                    "profile": {
                        "_id": 1387275504000,
                        "__v": 0,
                        "attachments": [],
                        "profileAccess": [
                            {
                                "module": 1,
                                "_id": "52b024f07fa64ad41e000002",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 6,
                                "_id": "52b024f07fa64ad41e000004",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 7,
                                "_id": "52b024f07fa64ad41e000005",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 14,
                                "_id": "52b024f07fa64ad41e000007",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 15,
                                "_id": "52b024f07fa64ad41e000008",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 19,
                                "_id": "52b024f07fa64ad41e000009",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 24,
                                "_id": "52b024f07fa64ad41e00000c",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 25,
                                "_id": "52b024f07fa64ad41e00000d",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 36,
                                "_id": "52b024f07fa64ad41e000010",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 39,
                                "_id": "52b024f07fa64ad41e000011",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 40,
                                "_id": "52b024f07fa64ad41e000012",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 42,
                                "_id": "52b024f07fa64ad41e000013",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 43,
                                "_id": "52b024f07fa64ad41e000014",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 44,
                                "_id": "52b024f07fa64ad41e000015",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 49,
                                "_id": "52b024f07fa64ad41e000016",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 50,
                                "_id": "52b024f07fa64ad41e000017",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 51,
                                "_id": "52b024f07fa64ad41e000018",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 52,
                                "_id": "52b024f07fa64ad41e000019",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 29,
                                "_id": "55b790eaa5ebea2c2400001f",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 53,
                                "_id": "52ef6d5f9d8a19c819e19f7e",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 54,
                                "_id": "55b790eaa5ebea2c2400001e",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 57,
                                "_id": "55b790eaa5ebea2c2400001d",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 56,
                                "_id": "55b790eaa5ebea2c2400001c",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 55,
                                "_id": "55b790eaa5ebea2c2400001b",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 58,
                                "_id": "55b790eaa5ebea2c2400001a",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 59,
                                "_id": "55b790eaa5ebea2c24000019",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 61,
                                "_id": "55b790eaa5ebea2c24000018",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 60,
                                "_id": "55b790eaa5ebea2c24000017",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 62,
                                "_id": "55b790eaa5ebea2c24000016",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 63,
                                "_id": "55b790eaa5ebea2c24000015",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 64,
                                "_id": "55b790eaa5ebea2c24000014",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 65,
                                "_id": "55b790eaa5ebea2c24000013",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 73,
                                "_id": "55b790eaa5ebea2c24000012",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 71,
                                "_id": "55b790eaa5ebea2c24000011",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 72,
                                "_id": "55b790eaa5ebea2c24000010",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 68,
                                "_id": "55b790eaa5ebea2c2400000f",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 67,
                                "_id": "55b790eaa5ebea2c2400000e",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 65,
                                "_id": "55b790eaa5ebea2c2400000d",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 75,
                                "_id": "55b790eaa5ebea2c2400000c",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 69,
                                "_id": "55b790eaa5ebea2c2400000a",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 66,
                                "_id": "55b790eaa5ebea2c24000008",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 70,
                                "_id": "55b790eaa5ebea2c24000006",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 74,
                                "_id": "55b790eaa5ebea2c24000005",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 9,
                                "_id": "55b89f3fdf6af7240d000005",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba16a2",
                                "module": 76,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba16a1",
                                "module": 77,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba16a0",
                                "module": 80,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba169f",
                                "module": 78,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba169e",
                                "module": 79,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba169d",
                                "module": 82,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba169c",
                                "module": 83,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba169b",
                                "module": 85,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba169a",
                                "module": 86,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba1699",
                                "module": 87,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "_id": "56b8aeb3d184bb7423ba1698",
                                "module": 88,
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            }
                        ],
                        "profileDescription": "No description",
                        "profileName": "baned"
                    },
                    "lastAccess": "2016-02-08T15:13:39.185Z",
                    "relatedEmployee": null,
                    "savedFilters": [],
                    "kanbanSettings": {
                        "tasks": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "applications": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "opportunities": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        }
                    },
                    "credentials": {
                        "access_token": "",
                        "refresh_token": ""
                    },
                    "email": "artur.myhalko@thinkmobiles.com",
                    "login": "ArturMyhalko",
                    "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
                },
                {
                    "_id": "55b9fbcdd79a3a3439000007",
                    "profile": {
                        "_id": 1438158771000,
                        "__v": 0,
                        "profileAccess": [
                            {
                                "module": 1,
                                "_id": "52b0254ead08de381e000002",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 6,
                                "_id": "52b0254ead08de381e000004",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 7,
                                "_id": "52b0254ead08de381e000005",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 14,
                                "_id": "52b0254ead08de381e000007",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 15,
                                "_id": "52b0254ead08de381e000008",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 19,
                                "_id": "52b0254ead08de381e000009",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 24,
                                "_id": "52b0254ead08de381e00000c",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 25,
                                "_id": "52b0254ead08de381e00000d",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 36,
                                "_id": "52b0254ead08de381e000010",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 39,
                                "_id": "52b0254ead08de381e000011",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 40,
                                "_id": "52b0254ead08de381e000012",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 42,
                                "_id": "52b0254ead08de381e000013",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 43,
                                "_id": "52b0254ead08de381e000014",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 44,
                                "_id": "52b0254ead08de381e000015",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 49,
                                "_id": "52b0254ead08de381e000016",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 50,
                                "_id": "52b0254ead08de381e000017",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 51,
                                "_id": "52b0254ead08de381e000018",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 52,
                                "_id": "52b0254ead08de381e000019",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 29,
                                "_id": "55b88fc39ea5a7142b00003a",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 53,
                                "_id": "52ef6d5f9d8a19c819e19f7f",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 54,
                                "_id": "55b88fc39ea5a7142b000039",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 57,
                                "_id": "55b88fc39ea5a7142b000038",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 56,
                                "_id": "55b88fc39ea5a7142b000037",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 55,
                                "_id": "55b88fc39ea5a7142b000036",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 58,
                                "_id": "55b88fc39ea5a7142b000035",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 59,
                                "_id": "55b88fc39ea5a7142b000034",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 61,
                                "_id": "55b88fc39ea5a7142b000033",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 60,
                                "_id": "55b88fc39ea5a7142b000032",
                                "access": {
                                    "del": false,
                                    "editWrite": false,
                                    "read": false
                                }
                            },
                            {
                                "module": 62,
                                "_id": "55b88fc39ea5a7142b000031",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 63,
                                "_id": "55b88fc39ea5a7142b000030",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 64,
                                "_id": "55b88fc39ea5a7142b00002f",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 65,
                                "_id": "55b88fc39ea5a7142b00002e",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 73,
                                "_id": "55b88fc39ea5a7142b00002d",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 71,
                                "_id": "55b88fc39ea5a7142b00002c",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 72,
                                "_id": "55b88fc39ea5a7142b00002b",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 68,
                                "_id": "55b88fc39ea5a7142b00002a",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 67,
                                "_id": "55b88fc39ea5a7142b000029",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 65,
                                "_id": "55b88fc39ea5a7142b000028",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 75,
                                "_id": "55b88fc39ea5a7142b000027",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 69,
                                "_id": "55b88fc39ea5a7142b000025",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 66,
                                "_id": "55b88fc39ea5a7142b000023",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 70,
                                "_id": "55b88fc39ea5a7142b000021",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 74,
                                "_id": "55b88fc39ea5a7142b000020",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 9,
                                "_id": "55b89f57df6af7240d000006",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "56225080c558b13c1bbf8763",
                                "module": 76,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "_id": "56225080c558b13c1bbf8762",
                                "module": 77,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 80,
                                "_id": "569fa895897940204bdd4a07",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 78,
                                "_id": "569fa895897940204bdd4a06",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 79,
                                "_id": "569fa895897940204bdd4a05",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 80,
                                "_id": "569fa895897940204bdd4a04",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 82,
                                "_id": "569fa895897940204bdd4a03",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 83,
                                "_id": "569fa895897940204bdd4a02",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 84,
                                "_id": "569fa895897940204bdd4a01",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 85,
                                "_id": "569fa895897940204bdd4a00",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 86,
                                "_id": "569fa895897940204bdd49ff",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 87,
                                "_id": "569fa895897940204bdd49fe",
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            },
                            {
                                "module": 88,
                                "access": {
                                    "del": true,
                                    "editWrite": true,
                                    "read": true
                                }
                            }
                        ],
                        "profileDescription": "No description",
                        "profileName": "SalesAccount"
                    },
                    "lastAccess": "2016-01-20T09:44:14.487Z",
                    "relatedEmployee": null,
                    "savedFilters": [],
                    "kanbanSettings": {
                        "tasks": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "applications": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        },
                        "opportunities": {
                            "foldWorkflows": [],
                            "countPerPage": 10
                        }
                    },
                    "credentials": {
                        "access_token": "",
                        "refresh_token": ""
                    },
                    "email": "igor.stan@thinkmobiles.com",
                    "login": "Igor Stan",
                    "imageSrc": "data:image/jpeg;base64,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"
                }
            ]
        };

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
            userCollection.remove();
        });

        it ('Try to create collection with error', function(){

            server.respondWith('GET', '/users/', [404, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);

            userCollection = new UserCollection({});

            server.respond();
        });

        it ('Try to create collection with unauthorized error', function(){

            server.respondWith('GET', '/users/', [401, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);

            userCollection = new UserCollection({});

            server.respond();
        });

        it ('Try to use showMore with error', function(done){
            var spyResponse;

            server.respondWith('GET', '/users/', [400, {"Content-Type": "application/json"}, JSON.stringify(new Error())]);

            userCollection.showMore({
                page: 2,
                count: 2,

                success: function(){
                    done();
                },

                error: function(сollection, response){
                    done(response.responseJSON);
                }
            });

            server.respond();

            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');

        });

        it ('Try to use showMore without options', function(done){
            server.respondWith('GET', '/users/', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);

            userCollection.showMore({
                success: function(){
                    done();
                },

                error: function(сollection, response){
                    done(response.responseJSON);
                }
            });

            server.respond();

            expect(userCollection).is.an('object');
            expect(userCollection.page).is.equals(1);

        });

        it ('Try to use showMore', function(done){
            server.respondWith('GET', '/users/', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);

            userCollection.showMore({
                page: 1,
                count: 2,

                success: function(){
                    done();
                },

                error: function(сollection, response){
                    done(response);
                }
            });

            server.respond();

            expect(userCollection).is.an('object');
            expect(userCollection.page).is.equals(4);

        });


    });
});