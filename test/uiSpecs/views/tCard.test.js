define([
    'jQuery',
    'modules',
    'text!fixtures/index.html',
    'collections/wTrack/filterCollection',
    'views/main/MainView',
    'views/wTrack/list/ListView',
    'views/wTrack/list/createJob',
    'views/wTrack/TopBarView',
    'views/wTrack/CreateView',
    'views/Filter/FilterView',
    'helpers/eventsBinder',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'testConstants/currentUser'
], function ($,
             modules,
             fixtures,
             TCardCollection,
             MainView,
             ListView,
             createJob,
             TopBarView,
             CreateView,
             FilterView,
             eventsBinder,
             chai,
             chaiJquery,
             sinonChai,
             currentUser) {
    'use strict';

    var expect;
    var fakeTCard = {
        total: 10077,
        data : [
            {
                1           : 0,
                2           : 4,
                3           : 8,
                4           : 8,
                5           : 8,
                6           : 0,
                7           : 0,
                _id         : "575fdf9ea169be136a935704",
                total       : 10077,
                customer    : {
                    name: {
                        last : "Voloshchuk",
                        first: "Peter"
                    }
                },
                project     : {
                    _id : "56e689c75ec71b00429745a9",
                    name: "360CamSDK"
                },
                employee    : {
                    _id : "55b92ad221e4b7c40f000070",
                    name: {
                        last : "Pozhidaev",
                        first: "Daniil"
                    }
                },
                department  : {
                    _id : "55b92ace21e4b7c40f000010",
                    name: "Android"
                },
                jobs        : {
                    _id : "56e6f1ae0d773c634e918b68",
                    name: "March"
                },
                workflow    : {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                dateByWeek  : 201624,
                month       : 6,
                year        : 2016,
                week        : 24,
                worked      : 28,
                _type       : "ordinary",
                createdBy   : {
                    date: "2016-06-14T10:42:38.627Z"
                },
                notRemovable: false
            },
            {
                1           : 8,
                2           : 8,
                3           : 8,
                4           : 8,
                5           : 0,
                6           : 0,
                7           : 0,
                _id         : "575fdf0cc5d7fcf869b24c84",
                total       : 10077,
                customer    : {
                    name: {
                        last : "",
                        first: "#Play"
                    }
                },
                project     : {
                    _id : "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                employee    : {
                    _id : "55b92ad221e4b7c40f000046",
                    name: {
                        last : "Udod",
                        first: "Denis"
                    }
                },
                department  : {
                    _id : "56e175c4d62294582e10ca68",
                    name: "Unity"
                },
                jobs        : {
                    _id : "564cfd8ba6e6390160c9ef58",
                    name: "HashPlay1028/2015"
                },
                workflow    : {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                dateByWeek  : 201626,
                month       : 6,
                year        : 2016,
                week        : 26,
                worked      : 32,
                _type       : "ordinary",
                createdBy   : {
                    date: "2016-06-14T10:40:12.255Z"
                },
                notRemovable: false
            },
            {
                1           : 0,
                2           : 0,
                3           : 0,
                4           : 0,
                5           : 8,
                6           : 0,
                7           : 0,
                _id         : "575fdf0c7330dff16a340395",
                total       : 10077,
                customer    : {
                    name: {
                        last : "",
                        first: "#Play"
                    }
                },
                project     : {
                    _id : "55b92ad621e4b7c40f0006d3",
                    name: "HashPlay"
                },
                employee    : {
                    _id : "55b92ad221e4b7c40f000046",
                    name: {
                        last : "Udod",
                        first: "Denis"
                    }
                },
                department  : {
                    _id : "56e175c4d62294582e10ca68",
                    name: "Unity"
                },
                jobs        : {
                    _id : "564cfd8ba6e6390160c9ef58",
                    name: "HashPlay1028/2015"
                },
                workflow    : {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                dateByWeek  : 201626,
                month       : 7,
                year        : 2016,
                week        : 26,
                worked      : 8,
                _type       : "ordinary",
                createdBy   : {
                    date: "2016-06-14T10:40:12.254Z"
                },
                notRemovable: true
            }
        ]
    };
    var fakeProjectForWTrack = {
        data: [
            {
                _id             : "56e689c75ec71b00429745a9",
                TargetEndDate   : "2016-03-31T00:00:00.000Z",
                StartDate       : "2016-03-13T22:00:00.000Z",
                budget          : {
                    projectTeam: [
                        "56e6f1ae0d773c634e918b68"
                    ],
                    bonus      : []
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-03-14T16:19:02.059Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "iOs",
                createdBy       : {
                    date: "2016-03-14T09:52:07.280Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent          : null,
                sequence        : 0,
                groups          : {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [],
                    group: []
                },
                whoCanRW        : "everyOne",
                projectmanager  : {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: {
                        last : "Voloshchuk",
                        first: "Peter"
                    }
                },
                customer        : {
                    _id : "56a9eeabd59a04d6225b0df5",
                    name: {
                        last : "Voloshchuk",
                        first: "Peter"
                    }
                },
                task            : [],
                projectName     : "360CamSDK",
                projectShortDesc: "SDK",
                __v             : 0,
                EndDate         : "2016-03-24T22:00:00.000Z",
                notRemoveble    : false
            },
            {
                _id             : "569f60d162d172544baf0d58",
                StartDate       : "2015-11-30T22:00:00.000Z",
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "56cf1b6e541812c071973595",
                        "56c599c7d2b48ede4ba4224b",
                        "56e291d1896e98a661aa831c",
                        "56b4be1799ce8d706a81b2e0",
                        "569f624a62d172544baf0d5c"
                    ]
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-03-16T10:35:13.214Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "",
                createdBy       : {
                    date: "2016-01-20T10:26:25.668Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent          : null,
                sequence        : 0,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                projectmanager  : {
                    _id : "561ba8639ebb48212ea838c4",
                    name: {
                        last : "Yartysh",
                        first: "Nataliya"
                    }
                },
                customer        : {
                    _id : "569f603762d172544baf0d57",
                    name: {
                        last : "Nahum",
                        first: "Nimrod"
                    }
                },
                task            : [],
                projectName     : "Android advertisement",
                projectShortDesc: "Supportment of app",
                __v             : 0,
                EndDate         : "2016-03-30T21:00:00.000Z",
                TargetEndDate   : "",
                description     : "",
                notRemoveble    : false
            },
            {
                _id             : "562bba6e4a431b5a5a3111fe",
                StartDate       : null,
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "56e1b802aeb5e8b52e89d190",
                        "56f39d42e7c600fe4fbae59a",
                        "569eb11e2208b3af4a52723b",
                        "56ab4d776d7173f43f96ad34",
                        "56641a4308ed794128637bd3",
                        "56641a6108ed794128637bd4",
                        "56641a3908ed794128637bd2"
                    ]
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-05-17T13:40:58.188Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "",
                createdBy       : {
                    date: "2015-10-24T17:05:50.305Z",
                    user: "55cb7302fea413b50b000007"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "Closed"
                },
                parent          : null,
                sequence        : 0,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                projectmanager  : null,
                customer        : {
                    _id : "5735a1a609f1f719488087ed",
                    name: {
                        last : "",
                        first: "Social Media Wave, GmbH"
                    }
                },
                task            : [],
                projectName     : "Spark",
                projectShortDesc: "App inspired by Snapchat",
                __v             : 0,
                TargetEndDate   : "",
                EndDate         : null,
                description     : "",
                salesmanager    : {
                    _id : "55b92ad221e4b7c40f000040",
                    name: {
                        last : "Almashiy",
                        first: "Vasiliy"
                    }
                },
                paymentTerms    : {
                    _id : "55536e52475b7be475f335f6",
                    name: "15 Days"
                },
                paymentMethod   : "565f2e05ab70d49024242e07",
                notRemoveble    : true
            }
        ]
    };
    var fakeEmployee = {
        data: [
            {
                _id       : "55b92ad221e4b7c40f000030",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    first: "Alex",
                    last : "Svatuk"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000031",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Gleba",
                    first: "Alex"
                }
            }
        ]
    };
    var fakeJobsWithId = [
        {
            _id   : "564cfd8ba6e6390160c9ef64",
            budget: {
                budgetTotal  : {
                    costSum   : 5055970,
                    revenueSum: 1865999.9999999998,
                    hoursSum  : 2454,
                    maxDate   : 201619,
                    minDate   : 201534
                },
                budget       : [],
                projectValues: [],
                projectTeam  : [
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000010",
                            departmentName: "Android"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f0000cf",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000021",
                                name: "Junior Android"
                            },
                            name       : {
                                last : "Denysiuk",
                                first: "Yaroslav"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 91246.94376528118,
                            hoursSum  : 120
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000016",
                            departmentName: "Web"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f000049",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f00001c",
                                name: "Middle JS"
                            },
                            name       : {
                                last : "Kapustey",
                                first: "Michael"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 69955.9902200489,
                            hoursSum  : 92
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000010",
                            departmentName: "Android"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f00005a",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000022",
                                name: "Middle Android"
                            },
                            name       : {
                                last : "Cheypesh",
                                first: "Bogdan"
                            }
                        },
                        budget    : {
                            costSum   : 2569512,
                            revenueSum: 304156.4792176039,
                            hoursSum  : 400
                        }
                    },
                    {
                        department: {
                            _id           : "55bb1f14cb76ca630b000006",
                            departmentName: "Design"
                        },
                        employee  : {
                            _id        : "55f7c20a6d43203d0c000005",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000028",
                                name: "Junior Designer"
                            },
                            name       : {
                                last : "Samaryk",
                                first: "Yana"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 88965.77017114914,
                            hoursSum  : 117
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000016",
                            departmentName: "Web"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f000060",
                            jobPosition: {
                                _id : "56121847c90e2fb026ce0621",
                                name: "Head of JS"
                            },
                            name       : {
                                last : "Buchuk",
                                first: "Roman"
                            }
                        },
                        budget    : {
                            costSum   : 2486458,
                            revenueSum: 197701.71149144255,
                            hoursSum  : 260
                        }
                    },
                    {
                        department: {
                            _id           : "56802e9d1afe27f547b7ba51",
                            departmentName: "CSS/FrontEnd"
                        },
                        employee  : {
                            _id        : "561bb1269ebb48212ea838c5",
                            jobPosition: {
                                _id : "55ddd8a2f09cc2ec0b000030",
                                name: "CSS"
                            },
                            name       : {
                                last : "Pogorilyak",
                                first: "Vladimir"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 200743.2762836186,
                            hoursSum  : 264
                        }
                    },
                    {
                        department: {
                            _id           : "55bb1f14cb76ca630b000006",
                            departmentName: "Design"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f00008c",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000023",
                                name: "Middle Designer"
                            },
                            name       : {
                                last : "Gychka",
                                first: "Anton"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 60831.295843520784,
                            hoursSum  : 80
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000010",
                            departmentName: "Android"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f00009c",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000021",
                                name: "Junior Android"
                            },
                            name       : {
                                last : "Feltsan",
                                first: "Ivan"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 273740.8312958435,
                            hoursSum  : 360
                        }
                    },
                    {
                        department: {
                            _id           : "55bb1f14cb76ca630b000006",
                            departmentName: "Design"
                        },
                        employee  : {
                            _id        : "55e419094983acdd0b000012",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000023",
                                name: "Middle Designer"
                            },
                            name       : {
                                first: "Kirill",
                                last : "Paliiuk"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 79841.07579462102,
                            hoursSum  : 105
                        }
                    },
                    {
                        department: {
                            _id           : "55bb1f14cb76ca630b000006",
                            departmentName: "Design"
                        },
                        employee  : {
                            _id        : "5637710e5d23a8eb04e80aed",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000028",
                                name: "Junior Designer"
                            },
                            name       : {
                                last : "Kovalenko",
                                first: "Viktoria"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 24332.518337408314,
                            hoursSum  : 32
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000016",
                            departmentName: "Web"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f0000a1",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000017",
                                name: "Junior JS"
                            },
                            name       : {
                                last : "Stepaniuk",
                                first: "Sergiy"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 317843.5207823961,
                            hoursSum  : 418
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000016",
                            departmentName: "Web"
                        },
                        employee  : {
                            _id        : "5667f43da3fc012a68f0d5f6",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000017",
                                name: "Junior JS"
                            },
                            name       : {
                                last : "Katsala",
                                first: "Roman"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 30415.64792176039,
                            hoursSum  : 40
                        }
                    },
                    {
                        department: {
                            _id           : "55bb1f14cb76ca630b000006",
                            departmentName: "Design"
                        },
                        employee  : {
                            _id        : "561ba7039ebb48212ea838c3",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000028",
                                name: "Junior Designer"
                            },
                            name       : {
                                last : "Maliavska",
                                first: "Oleksandra"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 18249.388753056235,
                            hoursSum  : 24
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000016",
                            departmentName: "Web"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f0000c7",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000017",
                                name: "Junior JS"
                            },
                            name       : {
                                last : "Mykhailova",
                                first: "Liliya"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 60831.295843520784,
                            hoursSum  : 80
                        }
                    },
                    {
                        department: {
                            _id           : "55bb1f14cb76ca630b000006",
                            departmentName: "Design"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f000039",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000023",
                                name: "Middle Designer"
                            },
                            name       : {
                                last : "Rikun",
                                first: "Stas"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 47144.25427872861,
                            hoursSum  : 62
                        }
                    }
                ]
            },
            name  : "QualProAdvance/2015"
        },
        {
            _id   : "569eaa9b2208b3af4a5271d8",
            budget: {
                budgetTotal  : {
                    costSum   : 0,
                    revenueSum: 668400,
                    hoursSum  : 1172,
                    maxDate   : 201614,
                    minDate   : 201547
                },
                budget       : [],
                projectValues: [],
                projectTeam  : [
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000010",
                            departmentName: "Android"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f00005a",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000022",
                                name: "Middle Android"
                            },
                            name       : {
                                last : "Cheypesh",
                                first: "Bogdan"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 155123.54948805462,
                            hoursSum  : 272
                        }
                    },
                    {
                        department: {
                            _id           : "55bb1f14cb76ca630b000006",
                            departmentName: "Design"
                        },
                        employee  : {
                            _id        : "5637710e5d23a8eb04e80aed",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000028",
                                name: "Junior Designer"
                            },
                            name       : {
                                last : "Kovalenko",
                                first: "Viktoria"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 6843.686006825938,
                            hoursSum  : 12
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000016",
                            departmentName: "Web"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f000049",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f00001c",
                                name: "Middle JS"
                            },
                            name       : {
                                last : "Kapustey",
                                first: "Michael"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 141436.17747440274,
                            hoursSum  : 248
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000011",
                            departmentName: "QA"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f000088",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000018",
                                name: "Junior QA"
                            },
                            name       : {
                                last : "Buchok",
                                first: "Viktor"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 22812.286689419798,
                            hoursSum  : 40
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000016",
                            departmentName: "Web"
                        },
                        employee  : {
                            _id        : "55b92ad221e4b7c40f0000a1",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000017",
                                name: "Junior JS"
                            },
                            name       : {
                                last : "Stepaniuk",
                                first: "Sergiy"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 189341.97952218432,
                            hoursSum  : 332
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000016",
                            departmentName: "Web"
                        },
                        employee  : {
                            _id        : "5667f43da3fc012a68f0d5f6",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000017",
                                name: "Junior JS"
                            },
                            name       : {
                                last : "Katsala",
                                first: "Roman"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 132311.26279863482,
                            hoursSum  : 232
                        }
                    },
                    {
                        department: {
                            _id           : "55b92ace21e4b7c40f000011",
                            departmentName: "QA"
                        },
                        employee  : {
                            _id        : "56c2f2a7dfd8a81466e2f71f",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000018",
                                name: "Junior QA"
                            },
                            name       : {
                                last : "Mateleshka",
                                first: "Viktor"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 11406.143344709899,
                            hoursSum  : 20
                        }
                    },
                    {
                        department: {
                            _id           : "55bb1f14cb76ca630b000006",
                            departmentName: "Design"
                        },
                        employee  : {
                            _id        : "55f7c20a6d43203d0c000005",
                            jobPosition: {
                                _id : "55b92acf21e4b7c40f000028",
                                name: "Junior Designer"
                            },
                            name       : {
                                last : "Samaryk",
                                first: "Yana"
                            }
                        },
                        budget    : {
                            costSum   : 0,
                            revenueSum: 9124.914675767917,
                            hoursSum  : 16
                        }
                    }
                ]
            },
            name  : "QualPro Jan"
        },
        {
            _id   : "5729a74771d367e52185bd41",
            budget: {
                budgetTotal  : {
                    costSum   : 0,
                    revenueSum: 0,
                    hoursSum  : 0,
                    maxDate   : null,
                    minDate   : null
                },
                budget       : [],
                projectValues: [],
                projectTeam  : [
                    {
                        budget: {
                            costSum   : 0,
                            revenueSum: 0,
                            hoursSum  : 0
                        }
                    }
                ]
            },
            name  : "01.05.16 - 31.05.16"
        }
    ];
    var tCardCollection;
    var view;
    var topBarView;
    var listView;
    var ajaxSpy;
    var selectFilterSpy;
    var removeFilterSpy;
    var saveFilterSpy;
    var removeSavedFilterSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('tCardView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            ajaxSpy = sinon.spy($, 'ajax');
            selectFilterSpy = sinon.spy(FilterView.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(FilterView.prototype, 'saveFilter');
            removeSavedFilterSpy = sinon.spy(FilterView.prototype, 'removeFilterFromDB');
        });

        after(function () {
            view.remove();
            listView.remove();
            topBarView.remove();

            if ($('.ui-dialog').length) {
                $('.ui-dialog').remove();
            }

            ajaxSpy.restore();
            selectFilterSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
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

                server.respondWith('GET', '/getModules', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);
                view = new MainView({el: $elFixture, contentType: 'wTrack'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');
                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="75"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="75"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/wTrack');

            });

        });

        describe('TopBarView', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to fetch collection with error', function () {
                var tCardUrl = new RegExp('\/wTrack\/', 'i');

                server.respondWith('GET', tCardUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);

                tCardCollection = new TCardCollection({
                    contentType: 'wTrack',
                    viewType   : 'list'
                });
                server.respond();
            });

            it('Try to create TopBarView', function () {
                var tCardUrl = new RegExp('\/wTrack\/', 'i');

                server.respondWith('GET', tCardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);
                tCardCollection = new TCardCollection({
                    contentType: 'wTrack',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false
                });
                server.respond();

                expect(tCardCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: tCardCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Time Card');
            });
        });

        describe('tCardView', function () {
            var server;
            var windowConfirmStub;
            var mainSpy;
            var clock;
            var deleteSpy;
            var saveSpy;
            var goToCreateJobSpy;
            var createJobSpy;
            var $thisEl;
            var sortSpy;

            before(function () {
                App.startPreload = function () {
                    App.preloaderShowFlag = true;
                    $('#loading').show();
                };

                App.stopPreload = function () {
                    App.preloaderShowFlag = false;
                    $('#loading').hide();
                };

                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                saveSpy = sinon.spy(ListView.prototype, 'saveItem');

                goToCreateJobSpy = sinon.spy(ListView.prototype, 'generateJob');
                createJobSpy = sinon.spy(createJob.prototype, 'initialize');

                sortSpy = sinon.spy(ListView.prototype, 'goSort');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
                clock.restore();
                deleteSpy.restore();
                saveSpy.restore();
                sortSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ListView', function (done) {
                    var projectsUrl = new RegExp('\/projects\/getForWtrack', 'i');
                    var employeeUrl = new RegExp('\/employees\/getForDD', 'i');
                    var depsUrl = new RegExp('\/departments\/getForDD', 'i');
                    var $firstRow;
                    var colCount;
                    var type;
                    var sprint;
                    var project;
                    var customer;
                    var employee;
                    var department;
                    var year;
                    var month;
                    var week;
                    var hours;
                    var monday;
                    var tuesday;
                    var wednesday;
                    var thursday;
                    var friday;
                    var saturday;
                    var sunday;
                    var $pagination;

                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProjectForWTrack)]);
                    server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployee)]);
                    server.respondWith('GET', depsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployee)]);

                    listView = new ListView({
                        startTime : new Date(),
                        collection: tCardCollection

                    });
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    eventsBinder.subscribeCollectionEvents(tCardCollection, listView);
                    eventsBinder.subscribeTopBarEvents(topBarView, listView);

                    tCardCollection.trigger('fetchFinished', {
                        totalRecords: tCardCollection.totalRecords,
                        currentPage : tCardCollection.currentPage,
                        pageSize    : tCardCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);

                    // third item in the list must be disabled to delete

                    expect($thisEl.find('#listTable > tr').last().find('td.notForm > input').prop('disabled')).to.be.equals(true);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(19);

                    type = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(type).not.to.be.empty;
                    expect(type).to.not.match(/object Object|undefined/);

                    project = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(project).not.to.be.empty;
                    expect(project).to.not.match(/object Object|undefined/);

                    sprint = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(sprint).not.to.be.empty;
                    expect(sprint).to.not.match(/object Object|undefined/);

                    customer = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(customer).not.to.be.empty;
                    expect(customer).to.not.match(/object Object|undefined/);

                    employee = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(employee).not.to.be.empty;
                    expect(employee).to.not.match(/object Object|undefined/);

                    department = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(department).not.to.be.empty;
                    expect(department).to.not.match(/object Object|undefined/);

                    year = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(year).not.to.be.empty;
                    expect(year).to.not.match(/object Object|undefined/);

                    month = $firstRow.find('td:nth-child(10)').text().trim();
                    expect(month).not.to.be.empty;
                    expect(month).to.not.match(/object Object|undefined/);

                    week = $firstRow.find('td:nth-child(11)').text().trim();
                    expect(week).not.to.be.empty;
                    expect(week).to.not.match(/object Object|undefined/);

                    hours = $firstRow.find('td:nth-child(12)').text().trim();
                    expect(hours).not.to.be.empty;
                    expect(hours).to.not.match(/object Object|undefined/);

                    monday = $firstRow.find('td:nth-child(13)').text().trim();
                    expect(monday).to.not.match(/object Object|undefined/);

                    tuesday = $firstRow.find('td:nth-child(14)').text().trim();
                    expect(tuesday).to.not.match(/object Object|undefined/);

                    wednesday = $firstRow.find('td:nth-child(15)').text().trim();
                    expect(wednesday).to.not.match(/object Object|undefined/);

                    thursday = $firstRow.find('td:nth-child(16)').text().trim();
                    expect(thursday).to.not.match(/object Object|undefined/);

                    friday = $firstRow.find('td:nth-child(17)').text().trim();
                    expect(friday).to.not.match(/object Object|undefined/);

                    saturday = $firstRow.find('td:nth-child(18)').text().trim();
                    expect(saturday).to.not.match(/object Object|undefined/);

                    sunday = $firstRow.find('td:nth-child(19)').text().trim();
                    expect(sunday).to.not.match(/object Object|undefined/);

                    $pagination = $thisEl.find('.pagination');
                    expect($pagination.find('.pageList')).to.exist;
                    expect($pagination.find('.nextPrev')).to.exist;

                    done();
                });

                it('Try to choose 25 items for list', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needItemsBtn = $pagination.find('.pageList > a').first();
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needItemsBtn.click();
                    server.respond();
                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.exist;
                    expect(ajaxResponse.data).to.have.property('count', '25');
                    expect(ajaxResponse.data).to.have.property('page', 1);
                });

                it('Try to select page 2', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $currentPageList = $pagination.find('.currentPageList');
                    var $pageList;
                    var $needPageBtn;
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $currentPageList.mouseover();
                    $pageList = $pagination.find('#pageList');
                    expect($pageList).to.have.css('display', 'block');

                    $needPageBtn = $pageList.find('li').eq(1);

                    $needPageBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.exist;
                    expect(ajaxResponse.data).to.have.property('count', '25');
                    expect(ajaxResponse.data).to.have.property('page', 2);
                });

                it('Try to choose 50 items for list', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needItemsBtn = $pagination.find('.pageList > a').eq(1);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needItemsBtn.click();
                    server.respond();
                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.exist;
                    expect(ajaxResponse.data).to.have.property('count', '50');
                    expect(ajaxResponse.data).to.have.property('page', 1);
                });

                it('Try to choose 100 items for list', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needItemsBtn = $pagination.find('.pageList > a').eq(2);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needItemsBtn.click();
                    server.respond();
                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.exist;
                    expect(ajaxResponse.data).to.have.property('count', '100');
                    expect(ajaxResponse.data).to.have.property('page', 1);
                });

                it('Try to choose 200 items for list', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needItemsBtn = $pagination.find('.pageList > a').eq(3);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needItemsBtn.click();
                    server.respond();
                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.exist;
                    expect(ajaxResponse.data).to.have.property('count', '200');
                    expect(ajaxResponse.data).to.have.property('page', 1);
                });

                it('Try to filter listView', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $searchOptionsDropDown;
                    var $employeeBtn;
                    var $employeeContainer;
                    var $customerContainer;
                    var $customerBtn;
                    var $selectedItem;
                    var ajaxResponse;
                    var ajaxFilter;

                    selectFilterSpy.reset();

                    $searchArrow.click();
                    $searchOptionsDropDown = $searchContainer.find('.search-options');
                    expect($searchOptionsDropDown).to.have.not.class('hidden');
                    expect($searchOptionsDropDown.find('.drop-down-filter > ul > li')).to.have.not.lengthOf(0);


                    // filter by employee

                    ajaxSpy.reset();

                    $employeeBtn = $searchContainer.find('#employeeFullContainer > .groupName');
                    $employeeBtn.click();
                    $employeeContainer = $searchContainer.find('#employeeContainer');
                    expect($employeeContainer).to.have.not.class('hidden');

                    $selectedItem = $employeeContainer.find('#employeeUl > li').first();
                    $selectedItem.click();

                    expect(selectFilterSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
                    expect($employeeContainer.find('#employeeUl > li').first()).to.have.class('checkedValue');

                    expect(ajaxSpy.calledOnce).to.be.true;

                    ajaxResponse = ajaxSpy.args[0][0];
                    expect(ajaxResponse).to.have.property('url', '/wTrack/');
                    expect(ajaxResponse).to.have.property('type', 'GET');

                    expect(ajaxResponse.data.filter).to.have.property('employee');
                    ajaxFilter = ajaxResponse.data.filter.employee;
                    expect(ajaxFilter).to.have.property('key', 'employee._id');
                    expect(ajaxFilter.value)
                        .to.be.instanceof(Array)
                        .and
                        .to.have.lengthOf(1);


                    // filter by customer
                    ajaxSpy.reset();

                    $customerBtn = $searchContainer.find('#customerFullContainer > .groupName');
                    $customerBtn.click();
                    $customerContainer = $searchContainer.find('#customerContainer');
                    expect($customerContainer).to.have.not.class('hidden');

                    $selectedItem = $customerContainer.find('#customerUl > li').first();
                    $selectedItem.click();

                    expect(selectFilterSpy.calledTwice).to.be.true;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(2);
                    expect($customerContainer.find('#customerUl > li').first()).to.have.class('checkedValue');

                    expect(ajaxSpy.calledOnce).to.be.true;

                    ajaxResponse = ajaxSpy.args[0][0];
                    expect(ajaxResponse).to.have.property('url', '/wTrack/');
                    expect(ajaxResponse).to.have.property('type', 'GET');

                    expect(ajaxResponse.data.filter).to.have.property('customer');
                    ajaxFilter = ajaxResponse.data.filter.customer;
                    expect(ajaxFilter).to.have.property('key', 'customer._id');
                    expect(ajaxFilter.value)
                        .to.be.instanceof(Array)
                        .and
                        .to.have.lengthOf(1);


                    // remove customer filter (uncheck)
                    ajaxSpy.reset();

                    $selectedItem = $customerContainer.find('#customerUl > li').first();
                    $selectedItem.click();

                    expect(selectFilterSpy.calledThrice).to.be.true;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
                    expect($customerContainer.find('#customerUl > li').first()).to.have.not.class('checkedValue');

                    expect(ajaxSpy.calledOnce).to.be.true;

                    ajaxResponse = ajaxSpy.args[0][0];
                    expect(ajaxResponse).to.have.property('url', '/wTrack/');
                    expect(ajaxResponse).to.have.property('type', 'GET');

                    expect(ajaxResponse.data.filter).to.have.not.property('customer');
                });

                it('Try to save employees filter', function () {
                    var usersUrl = new RegExp('\/users\/', 'i');
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $favoritesTab = $searchContainer.find('li[data-value="#favoritesContent"]');
                    var $nameInput;
                    var $saveBtn;
                    var spyResponse;

                    saveFilterSpy.reset();
                    mainSpy.reset();

                    $favoritesTab.click();
                    $nameInput = $searchContainer.find('#forFilterName');
                    $nameInput.val('TestFilter');
                    $saveBtn = $searchContainer.find('#saveFilterButton');

                    // try to save filter with existing name
                    $saveBtn.click();
                    spyResponse = mainSpy.args[0][0];

                    expect(saveFilterSpy.calledOnce).to.be.true;
                    expect(spyResponse).to.have.property('type', 'error');

                    $nameInput.val('TestFilter1');
                    server.respondWith('PATCH', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({"success":{"_id":"52203e707d4dba8813000003","__v":0,"attachments":[],"lastAccess":"2016-06-15T12:50:20.856Z","profile":1387275598000,"relatedEmployee":"55b92ad221e4b7c40f00004f","savedFilters":[{"_id":"574335bb27725f815747d579","viewType":"","byDefault":"Leads"},{"_id":"576140b0db710fca37a2d950","viewType":"","byDefault":""},{"_id":"5761467bdb710fca37a2d951","viewType":"","byDefault":""},{"_id":"57615278db710fca37a2d952","viewType":"","byDefault":""}],"kanbanSettings":{"tasks":{"foldWorkflows":["528ce3caf3f67bc40b000013","528ce3acf3f67bc40b000012","528ce30cf3f67bc40b00000f","528ce35af3f67bc40b000010"],"countPerPage":10},"applications":{"foldWorkflows":["Empty"],"countPerPage":10},"opportunities":{"foldWorkflows":[],"countPerPage":10}},"credentials":{"access_token":"","refresh_token":""},"pass":"082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9","email":"info@thinkmobiles.com","login":"admin","imageSrc":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"}})]);
                    $saveBtn.click();
                    server.respond();

                    expect(saveFilterSpy.calledTwice).to.be.true;
                    expect($searchContainer.find('#favoritesContent > li')).to.have.lengthOf(3);
                });

                it('Try to remove saved filter', function () {
                    var usersUrl = new RegExp('\/users\/', 'i');
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $deleteFilterBtn = $searchContainer.find('.removeSavedFilter').last();

                    server.respondWith('PATCH', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({"success":{"_id":"52203e707d4dba8813000003","__v":0,"attachments":[],"lastAccess":"2016-06-15T12:50:20.856Z","profile":1387275598000,"relatedEmployee":"55b92ad221e4b7c40f00004f","savedFilters":[{"_id":"574335bb27725f815747d579","viewType":"","byDefault":"Leads"},{"_id":"576140b0db710fca37a2d950","viewType":"","byDefault":""},{"_id":"5761467bdb710fca37a2d951","viewType":"","byDefault":""},{"_id":"57615278db710fca37a2d952","viewType":"","byDefault":""}],"kanbanSettings":{"tasks":{"foldWorkflows":["528ce3caf3f67bc40b000013","528ce3acf3f67bc40b000012","528ce30cf3f67bc40b00000f","528ce35af3f67bc40b000010"],"countPerPage":10},"applications":{"foldWorkflows":["Empty"],"countPerPage":10},"opportunities":{"foldWorkflows":[],"countPerPage":10}},"credentials":{"access_token":"","refresh_token":""},"pass":"082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9","email":"info@thinkmobiles.com","login":"admin","imageSrc":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"}})]);
                    $deleteFilterBtn.click();
                    server.respond();

                    expect(removeSavedFilterSpy.calledOnce).to.be.true;
                    expect($searchContainer.find('#favoritesContent > li')).to.have.lengthOf(2);
                });

                it('Try to remove employee filter', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $deleteFilterBtn = $searchContainer.find('.removeValues');
                    var ajaxResponse;

                    removeFilterSpy.reset();
                    ajaxSpy.reset();

                    $deleteFilterBtn.click();
                    server.respond();

                    expect(removeFilterSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(0);

                    expect(ajaxSpy.calledOnce).to.be.true;
                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse).to.have.property('url', '/wTrack/');
                    expect(ajaxResponse).to.have.property('type', 'GET');
                    expect(ajaxResponse.data.filter).to.be.empty;
                });

                it('Try to delete item with 403 error', function () {
                    var spyResponse;
                    var $needCheckBtn = listView.$el.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    mainSpy.reset();

                    $needCheckBtn.click();

                    server.respondWith('DELETE', wTrackUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(deleteSpy.calledOnce).to.be.true;
                });

                it('Try to delete item', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    server.respondWith('DELETE', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledTwice).to.be.true;
                });

                it('Try to go sort', function () {
                    var $sortEl = listView.$el.find('th[data-sort="project.name"]');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');
                    var ajaxResponse;

                    sortSpy.reset();
                    ajaxSpy.reset();

                    server.respondWith('GET', tCardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);
                    $sortEl.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(sortSpy.calledOnce).to.be.true;
                    expect(ajaxResponse).to.have.property('data');
                    expect(ajaxResponse.data).to.have.property('contentType', 'wTrack');
                    expect(ajaxResponse.data).to.have.property('count', '200');
                    expect(ajaxResponse.data.sort).to.be.exist;
                    expect(ajaxResponse.data.sort).to.have.property('project.name', 1);

                    server.respondWith('GET', tCardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeTCard[1], fakeTCard[0]])]);
                    $sortEl.click();
                    server.respond();
                    expect(sortSpy.calledTwice).to.be.true;

                    ajaxResponse = ajaxSpy.args[1][0];

                    expect(ajaxResponse).to.have.property('data');
                    expect(ajaxResponse.data).to.have.property('contentType', 'wTrack');
                    expect(ajaxResponse.data).to.have.property('count', '200');
                    expect(ajaxResponse.data.sort).to.be.exist;
                    expect(ajaxResponse.data.sort).to.have.property('project.name', -1);
                });

                // it('Try to filter tCard listView', )

                it('Try to check|uncheck all checkboxes', function () {
                    var $checkAllBtn = listView.$el.find('#checkAll');

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.true;

                    $checkAllBtn.click();
                });

                it('Try to create item', function () {
                    var $projectBtn;
                    var $employeeBtn;
                    var $select;
                    var $sprintBtn;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var jobUrl = new RegExp('\/jobs\/getForDD', 'i');
                    var wTrackUrl = '/wTrack/';

                    $createBtn.click();


                    $projectBtn = listView.$el.find('#listTable > tr:nth-child(1) > td[data-content="project"]');
                    $projectBtn.click();

                    $select = listView.$el.find('#562bba6e4a431b5a5a3111fe');
                    server.respondWith('GET', jobUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsWithId)]);
                    $select.click();
                    server.respond();
                    $employeeBtn = listView.$el.find('#listTable > tr:nth-child(1) > td[data-content="employee"]');
                    $employeeBtn.click();
                    $select = listView.$el.find('#55b92ad221e4b7c40f000030');
                    $select.click();

                    $sprintBtn = listView.$el.find('#listTable > tr.false > td:nth-child(3)');
                    $sprintBtn.removeClass(' errorContent');
                    $sprintBtn.text('March');

                    server.respondWith('POST', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([{id: '56f9172a160c8d6315f0862f'}])]);
                    $saveBtn.click();
                    server.respond();

                    expect(saveSpy.calledOnce).to.be.true;
                });

                it('Try to copy tCard row', function () {
                    var $copyBtn;
                    var $needCheckBox = listView.$el.find('#listTable > tr:nth-child(2) > td.notForm > input');

                    $needCheckBox.click();
                    $copyBtn = topBarView.$el.find('#top-bar-copyBtn');
                    $copyBtn.click();

                    expect(listView.$el.find('#listTable > tr').length).to.be.equals(5);
                });

                it('Try to delete item with changes ', function () {
                    var $needCheckBtn = listView.$el.find('#listTable > tr:nth-child(2) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    $needCheckBtn.click();

                    server.respondWith('DELETE', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    //expect(listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)').text().trim()).to.be.equals('Eugen Lendyel')
                });

                it('Try to create Job', function () {
                    var $dialogEl;
                    var jobsUrl = new RegExp('\/jobs\/getForDD', 'i');
                    var $jobsBtn = listView.$el.find('#listTable > tr:nth-child(1) > td[data-content="jobs"]');
                    var $selectedItem;
                    var generateBtn;

                    server.respondWith('GET', jobsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsWithId)]);
                    $jobsBtn.click();
                    server.respond();
                    $selectedItem = $jobsBtn.find('.newSelectList li#createJob');
                    $selectedItem.click();
                    $dialogEl = $('.ui-dialog');

                    expect(goToCreateJobSpy.called).to.be.true;
                    expect(createJobSpy.called).to.be.true;
                    expect($dialogEl).to.exist;

                    $dialogEl.find('input.createJobInput').val('NewTestJob');
                    server.respondWith('POST', '/jobs/', [200, {'Content-Type': 'application/json'}, JSON.stringify({id: "c218"})]);

                    generateBtn = $dialogEl.find('#generateBtn');
                    generateBtn.click();


                    fakeJobsWithId.push({
                        _id   : "574e9082946d489532fc6e5e",
                        budget: {
                            budget       : [],
                            projectValues: [],
                            projectTeam  : []
                        },
                        name  : "NewTestJob"
                    });
                    server.respond();
                });

                it('Try to fail create Job and cancel', function () {
                    var $dialogEl;
                    var jobsUrl = new RegExp('\/jobs\/getForDD', 'i');
                    var $jobsBtn = listView.$el.find('#listTable > tr:nth-child(1) > td[data-content="jobs"]');
                    var $selectedItem;
                    var spyResponse;
                    var generateBtn;
                    var cancelBtn;

                    server.respondWith('GET', jobsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsWithId)]);
                    $jobsBtn.click();
                    server.respond();
                    $selectedItem = $jobsBtn.find('.newSelectList li#createJob');
                    $selectedItem.click();
                    $dialogEl = $('.ui-dialog');

                    mainSpy.reset();

                    expect(goToCreateJobSpy.called).to.be.true;
                    expect(createJobSpy.called).to.be.true;
                    expect($dialogEl).to.exist;

                    $dialogEl.find('input.createJobInput').val('$$##');

                    generateBtn = $dialogEl.find('#generateBtn');
                    generateBtn.click();

                    spyResponse = mainSpy.args[0][0];

                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please, enter correct Job name!');

                    cancelBtn = $dialogEl.find('#cancelBtn');
                    cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                /*it('Try to edit wTrack', function () {
                 var $selectedItem;
                 var $input;
                 var spyResponse;
                 var $yearBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="year"]');
                 var $jobsBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="jobs"]');
                 var $projectsBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="project"]');
                 var $typeBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="type"]');
                 var $employeeBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="employee"]');
                 var $monthBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="month"]');
                 var $weekBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="week"]');
                 var $mondayBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="1"]');
                 var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                 var jobsUrl = new RegExp('\/jobs\/getForDD', 'i');
                 var vacationUrl = new RegExp('\/vacation\/list', 'i');
                 var holidaysUrl = new RegExp('\/holidays\/list', 'i');
                 var wTrackUrl = '/wTrack/';
                 var keyDownEventEnter = $.Event('keydown', {keyCode: 13});
                 var keyDownEvent = $.Event('keydown');
                 var keyUpEvent = $.Event('keyup');

                 mainSpy.reset();
                 ajaxSpy.reset();

                 // change monday hours
                 server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 $mondayBtn.click();
                 server.respond();
                 server.respond();

                 $input = $mondayBtn.find('input');

                 $input.trigger(keyDownEvent);
                 $input.val('10');
                 server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 $input.trigger(keyUpEvent);

                 $input.trigger('change');
                 server.respond();
                 server.respond();

                 spyResponse = mainSpy.args[0][0];
                 expect(spyResponse).to.have.property('type', 'error');
                 expect(spyResponse).to.have.property('message', 'Сreate Overtime tCard for input more than 8 hours');

                 // change year

                 $yearBtn.click();

                 server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 $selectedItem = $yearBtn.find('.newSelectList > li:nth-child(1)');
                 $selectedItem.click();
                 server.respond();
                 server.respond();

                 // change month
                 server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 $monthBtn.click();
                 server.respond();
                 server.respond();
                 $input = $monthBtn.find('input');
                 $input.trigger(keyDownEventEnter);
                 $input.val('12');
                 server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);

                 $input.trigger('change');
                 server.respond();
                 server.respond();

                 // change job
                 server.respondWith('GET', jobsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsWithId)]);
                 $jobsBtn.click();
                 server.respond();
                 $selectedItem = $jobsBtn.find('.newSelectList li:nth-child(2)');
                 $selectedItem.click();

                 //change project

                 $projectsBtn.click();

                 $selectedItem = $projectsBtn.find('.newSelectList li:nth-child(2)');
                 server.respondWith('GET', jobsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsWithId)]);
                 $selectedItem.click();
                 server.respond();

                 //change employee

                 $employeeBtn.click();

                 $selectedItem = $employeeBtn.find('.newSelectList li:nth-child(2)');
                 server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 $selectedItem.click();
                 server.respond();
                 server.respond();

                 // chang week
                 $weekBtn.click();
                 $selectedItem = $weekBtn.find('.newSelectList > li:nth-child(1)');
                 server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                 server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);

                 $selectedItem.click();
                 server.respond();
                 server.respond();

                 //change type

                 $typeBtn.click();

                 $selectedItem = $typeBtn.find('.newSelectList li:nth-child(2)');
                 $selectedItem.click();

                 ajaxSpy.reset();

                 server.respondWith('PATCH', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                 $saveBtn.click();
                 server.respond();
                 });*/
            });
        });
    });
});
