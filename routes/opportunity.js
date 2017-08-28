var express = require('express');
var router = express.Router();
var OpportunityHandler = require('../handlers/opportunity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';

    var handler = new OpportunityHandler(models, event);
    var moduleId = MODULES.OPPORTUNITIES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'opportunities');
    }

    /**
     *@api {get} /opportunities/ Request Opportunities
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunities
     * @apiGroup Opportunity
     *
     * @apiParam {String} workflowId
     * @apiParam {String} viewType="kanban"
     *
     *
     * @apiSuccess {Object} Opportunities
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
     {
          data: [
            {
              _id: "583e84406ea87b590d48b70a",
              projectType: "fixed",
              attachments: [
                {
                  _id: "583e8535aefcfc140ea84ba5",
                  name: "Backend RFP V1.1.pdf",
                  shortPas: "uploads%2Fopportunities%2F583e84406ea87b590d48b70a%2FBackend%20RFP%20V1.1.pdf",
                  size: "0.79&nbsp;Mb",
                  uploadDate: "2016-11-30T07:52:21.531Z",
                  uploaderName: "bohdana.stets"
                },
                {
                  _id: "583e8535aefcfc140ea84ba6",
                  name: "Database Schema.pdf",
                  shortPas: "uploads%2Fopportunities%2F583e84406ea87b590d48b70a%2FDatabase%20Schema.pdf",
                  size: "0.605&nbsp;Mb",
                  uploadDate: "2016-11-30T07:52:21.533Z",
                  uploaderName: "bohdana.stets"
                }
              ],
              notes: [
                {
                  note: "Interested in Backend and Database Development.",
                  _id: "583e852849e63fdc0d88a8b2",
                  user: {
                    login: "bohdana.stets",
                    _id: "573d7f7907676c6435eeff3e"
                  },
                  date: "2016-11-30T08:52:08.000Z",
                  task: null
                },
                ...
              ],
              sequence: 41,
              workflow: {
                _id: "528cdd2af3f67bc40b000007"
              },
              expectedClosing: null,
              nextAction: {
                date: "2016-11-30T07:48:16.524Z",
                desc: ""
              },
              salesPerson: {
                _id: "56e17661177f76f72edf774c",
                name: {
                  last: "Stets",
                  first: "Bogdana"
                },
                fullName: "Bogdana Stets",
                id: "56e17661177f76f72edf774c"
              },
              tags: [
                {
                  _id: "57a0de6fe29f483f1db951fd",
                  name: "PHP",
                  color: "bgGrey"
                },
                {
                  _id: "57aded1f51eec4534abb0f2b",
                  name: "Ruby",
                  color: "bgPurple"
                }
              ],
              customer: {
                _id: "583e86c5ed5a2cbf0db9f53c",
                name: {
                  last: "Grechko",
                  first: "Dmytro"
                },
                fullName: "Dmytro Grechko",
                id: "583e86c5ed5a2cbf0db9f53c"
              },
              expectedRevenue: {
                currency: "",
                progress: 0,
                value: 0
              },
              name: "Interested in Backend Development"
            },
        ...
          ]
}
     */
    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getByViewType);

    /**
     *@api {get} /opportunities/getForDd Request Opportunities forDd
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesForDd
     * @apiGroup Opportunity
     *
     * @apiParam {Boolean} isOpportunitie="true"
     *
     *
     * @apiSuccess {Object} Opportunities
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
          data: [
            {
              _id: "579eec792912255e5df7d36f",
              contacts: [

              ],
              __v: 0,
              externalId: null,
              skype: "",
              social: {
                LI: "",
                FB: ""
              },
              projectType: "fixed",
              attachments: [

              ],
              notes: [
                {
                  _id: "579eec792912255e5df7d370",
                  note: "Зацікавлений в розробці AR додатку для дітей. Надіслав документацію зараз уточнюємо ще деякі питання по естімейту.",
                  user: {
                    login: "bohdana.stets",
                    _id: "573d7f7907676c6435eeff3e"
                  },
                  date: "2016-08-01T06:30:17.969Z",
                  task: null
                }
              ],
              convertedDate: "2016-08-01T07:33:52.843Z",
              isConverted: true,
              source: "",
              campaign: "",
              editedBy: {
                date: "2016-09-19T07:17:04.451Z",
                user: "56239e58e9576d1728a9ed1f"
              },
              createdBy: {
                date: "2016-08-01T06:30:17.967Z",
                user: "573d7f7907676c6435eeff3e"
              },
              sequence: 42,
              groups: {
                group: [

                ],
                users: [

                ],
                owner: null
              },
              whoCanRW: "everyOne",
              workflow: "528cdf1cf3f67bc40b00000b",
              reffered: "",
              optout: false,
              active: true,
              color: "#4d5a75",
              categories: {
                name: "",
                id: ""
              },
              priority: "Trivial",
              expectedClosing: "2016-09-04T21:00:00.000Z",
              nextAction: {
                date: "2016-08-04T21:00:00.000Z",
                desc: ""
              },
              internalNotes: "",
              salesTeam: null,
              salesPerson: "56123232c90e2fb026ce064b",
              func: "",
              phones: {
                fax: "",
                phone: "",
                mobile: ""
              },
              email: "",
              contactName: {
                last: "",
                first: ""
              },
              address: {
                country: "",
                zip: "",
                state: "",
                city: "",
                street: ""
              },
              tags: [
                "5787a2b2f112b4b449878014",
                "578893982bfddc9a494cce04",
                "578893ab29d879da49ac7965"
              ],
              customer: "579eee6bcfd1fe3d5ddde48b",
              company: "579eed3d081c7ea05dfbf7c5",
              tempCompanyField: "",
              creationDate: "2016-08-01T06:30:17.966Z",
              jobPosition: "",
              expectedRevenue: {
                currency: "",
                progress: 0,
                value: 1500
              },
              name: "AR App Development",
              isOpportunitie: true
            },
        ...
          ]
}
     */
    router.get('/getForDd', authStackMiddleware, handler.getForDd);

    /**
     *@api {get} /opportunities/getFilterValues Request FilterValues
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Opportunity
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
         "_id": null,
         "Name": [
             ".net devs",
             "APP Project",
             "AR/VR Store",
             ...
         ],
         "Creation date": [
             "2016-07-12T13:14:28.804Z",
             "2016-07-12T09:42:36.899Z",
             ...
         ],
         "Expected revenue": [
             0,
             200,
             300,
             640,
             1000,
             ...
         ]
     }
     ]
     */
    router.get('/getFilterValues', authStackMiddleware, accessStackMiddleware, handler.getFilterValues);

    /**
     *@api {get} /opportunities/OpportunitiesForMiniView Request Opportunities For MiniView
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesForMiniView
     * @apiGroup Opportunity
     *
     * @apiParam (?Field=value) {String} person Unique id of Person
     * @apiParam (?Field=value) {String} company Unique id of Company
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=4 Count of Opportunities which will show
     * @apiParam (?Field=value) {Boolean} onlyCount=true
     *
     * @apiSuccess {Object} OpportunitiesForMiniView
     * @apiSuccessExample Success-Response:
     {
       listLength: 256,
       data: [
         {
           _id: "5654dd337fd64406664b9216",
           workflow: {
             _id: "528cdef4f3f67bc40b00000a",
             name: "In development"
           },
           nextAction: {
             date: "2016-03-30T22:00:00.000Z"
           },
           expectedRevenue: {
             currency: "$",
             value: 6000
           },
           name: "Stian Maurstad (Ihor's client)"
         },
     ...
       ]
     }
     */
    router.get('/OpportunitiesForMiniView', authStackMiddleware, accessStackMiddleware, handler.opportunitiesForMiniView);

    /**
     *@api {get} /opportunities/OpportunitiesForChart Request OpportunitiesForChart
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesForChart(Won/Lost tab)
     * @apiGroup Opportunity
     *
     * @apiParam (?Field=value) {String="Date"} type
     * @apiParam (?Field=value) {Object} filter="{date:{value: ["Sun Dec 18 2016 00:00:00 GMT+0200 (EET)","Tue Jan 17 2017 00:00:00 GMT+0200 (EET)"]}}"
     * @apiParam (?Field=value) {String="D","M","W","DW","DM"} dataItem witch means dayOfYear, month, week, dayOfWeek, dayOfMonth
     *
     * @apiSuccess {Object} OpportunitiesForChart
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
     {
       "data": [
         {
           "_id": {
             "year": "2017",
             "mounth": "01",
             "day": "11"
           },
           "wonCount": 0,
           "lostCount": 0,
           "inProgressCount": 0
         },
         {
           "_id": {
             "year": "2017",
             "mounth": "01",
             "day": "12"
           },
           "wonCount": 0,
           "lostCount": 0,
           "inProgressCount": 0
         }
       ]
     }
     */

    /**
     *@api {get} /opportunities/OpportunitiesForChart Request OpportunitiesForChart(Opportunities tab)
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesForChart
     * @apiGroup Opportunity
     *
     * @apiParam (?Field=value) {Object} filter="{date:{value: ["Sun Dec 18 2016 00:00:00 GMT+0200 (EET)","Tue Jan 17 2017 00:00:00 GMT+0200 (EET)"]}}"
     *
     * @apiSuccess {Object} OpportunitiesForChart
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
      data: [
        {
          _id: "PM approve",
          data: [
            {
              salesPerson: "Denis Udod",
              count: 1,
              sum: 100500
            }
          ]
        },
        {
          _id: "Done estimate",
          data: [
            {
              salesPerson: "Alex Hoshylyk",
              count: 1,
              sum: 100500
            },
            {
              salesPerson: "Alex Lysachenko",
              count: 1,
              sum: 100500
            },
            {
              salesPerson: "Alex Sokhanych",
              count: 1,
              sum: 100500
            }
          ]
        },
        {
          _id: "To estimate",
          data: [
            {
              salesPerson: null,
              count: 1,
              sum: 0
            },
            {
              salesPerson: "Alex Hoshylyk",
              count: 1,
              sum: 100500
            }
          ]
        },
        {
          _id: "Send offer",
          data: [
            {
              salesPerson: "Alex Filchak",
              count: 1,
              sum: 100500
            },
            {
              salesPerson: "Alex Khutorskyi",
              count: 1,
              sum: 100500
            },
            {
              salesPerson: "Eugen Loskutov",
              count: 1,
              sum: 100500
            },
            {
              salesPerson: "Alex Michenko",
              count: 1,
              sum: 100500
            }
          ]
        },
        {
          _id: "Lost",
          data: [
            {
              salesPerson: null,
              count: 1,
              sum: 500
            }
          ]
        }
      ]
    }
     */
    router.get('/OpportunitiesForChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesForChart);

    /**
     *@api {get} /opportunities/OpportunitiesConversionForChart Request OpportunitiesConversionForChart
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesConversionForChart
     * @apiGroup Opportunity
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: ["Sun Dec 18 2016 00:00:00 GMT+0200 (EET)","Tue Jan 25 2017 00:00:00 GMT+0200 (EET)"]}}" Filter object of period of time
     *
     * @apiSuccess {Object} OpportunitiesConversionForChart
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
     {
          data: [
            {
              _id: null,
              wonSum: 0,
              wonCount: 0,
              lostSum: 500,
              lostCount: 1,
              sale: null
            }
          ]
}
     */
    router.get('/OpportunitiesConversionForChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesConversionForChart);

    /**
     *@api {get} /opportunities/OpportunitiesAgingChart Request OpportunitiesAgingChart
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunitiesAgingChart
     * @apiGroup Opportunity
     *
     * @apiSuccess {Object} OpportunitiesAgingChart
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
     {
      "data": [
        {
          "0-7_Sum": 301500,
          "8-15_Sum": 0,
          "16-30_Sum": 0,
          "31-60_Sum": 53000,
          "61-120_Sum": 11000,
          ">120_Sum": 0,
          "0-7_Count": 3,
          "8-15_Count": 0,
          "16-30_Count": 0,
          "31-60_Count": 4,
          "61-120_Count": 5,
          ">120_Count": 0,
          "workflow": "Done estimate"
        },
        ...
      ]
}
     */
    router.get('/OpportunitiesAgingChart', authStackMiddleware, accessStackMiddleware, handler.getOpportunitiesAgingChart);

    /**
     *@api {get} /opportunities/getLengthByWorkflows/ Request LengthByWorkflows
     *
     * @apiVersion 0.0.1
     * @apiName getLengthByWorkflows
     * @apiGroup Opportunity
     *
     * @apiSuccess {Object} LengthByWorkflows
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "showMore": true,
    "arrayOfObjects": [
        {
            "_id": "528cdd2af3f67bc40b000007",
            "count": 1
        },
        {
            "_id": "5773e332ba4ab32d0f4dc85e",
            "count": 1
        },
        {
            "_id": "56dd819ccc599b971852913b",
            "count": 16
        },
        {
            "_id": "528cdf1cf3f67bc40b00000b",
            "count": 29
        },
        {
            "_id": "528cdef4f3f67bc40b00000a",
            "count": 24
        }
    ]
}
     */
    router.get('/getLengthByWorkflows', authStackMiddleware, accessStackMiddleware, handler.getLengthByWorkflows);

    /**
     *@api {get} /opportunities/priority/ Request Priorities
     *
     * @apiVersion 0.0.1
     * @apiName getPriorities
     * @apiGroup Opportunity
     *
     *
     * @apiSuccess {Object} Priorities
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
     {
       data: [
         {
           _id: "Hot",
           priority: "Hot",
           type: "Leads"
         },
         {
           _id: "Cold",
           priority: "Cold",
           type: "Leads"
         },
         {
           _id: "Medium",
           priority: "Medium",
           type: "Leads"
         }
       ]
     }
     */
    router.get('/priority', authStackMiddleware, accessStackMiddleware, handler.getLeadsPriority);
    router.get('/getFilteredOpportunities', authStackMiddleware, accessStackMiddleware, handler.getFilteredOpportunities);

    /**
     *@api {get} /opportunities/:id Request Opportunity
     *
     * @apiVersion 0.0.1
     * @apiName getOpportunity
     * @apiGroup Opportunity
     *
     * @apiParam (?Field=value) {String} id Unique id of Opportunities
     *
     * @apiSuccess {Object} Opportunity
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
  _id: "583e84406ea87b590d48b70a",
  skype: "",
  social: {
    LI: "",
    FB: ""
  },
  attachments: [
    {
      _id: "583e8535aefcfc140ea84ba5",
      name: "Backend RFP V1.1.pdf",
      shortPas: "uploads%2Fopportunities%2F583e84406ea87b590d48b70a%2FBackend%20RFP%20V1.1.pdf",
      size: "0.79&nbsp;Mb",
      uploadDate: "2016-11-30T07:52:21.531Z",
      uploaderName: "bohdana.stets"
    },
    {
      _id: "583e8535aefcfc140ea84ba6",
      name: "Database Schema.pdf",
      shortPas: "uploads%2Fopportunities%2F583e84406ea87b590d48b70a%2FDatabase%20Schema.pdf",
      size: "0.605&nbsp;Mb",
      uploadDate: "2016-11-30T07:52:21.533Z",
      uploaderName: "bohdana.stets"
    }
  ],
  notes: [
    {
      date: "2016-11-30T07:48:16.549Z",
      history: {
        editedBy: {
          _id: "573d7f7907676c6435eeff3e",
          login: "bohdana.stets"
        },
        newValue: "New",
        changedField: "workflow",
        collectionName: "Opportunities",
        contentId: "583e84406ea87b590d48b70a",
        date: "2016-11-30T07:48:16.549Z"
      },
      user: {
        _id: "573d7f7907676c6435eeff3e",
        login: "bohdana.stets"
      },
      _id: ""
    },
    {
      _id: "583e86f6ed5a2cbf0db9f53d",
      note: "Документ для естімейта - https://1drv.ms/x/s!AtnPpnqS9oa0gRJOUw9kkx6mEsju",
      user: {
        login: "bohdana.stets",
        _id: "573d7f7907676c6435eeff3e"
      },
      date: "2016-11-30T07:59:50.518Z",
      task: null
    },
    {
      date: "2016-11-30T08:01:41.464Z",
      history: {
        editedBy: {
          _id: "573d7f7907676c6435eeff3e",
          login: "bohdana.stets"
        },
        prevValue: "To estimate",
        newValue: "To estimate",
        changedField: "workflow",
        collectionName: "Opportunities",
        contentId: "583e84406ea87b590d48b70a",
        date: "2016-11-30T08:01:41.464Z"
      },
      user: {
        _id: "573d7f7907676c6435eeff3e",
        login: "bohdana.stets"
      },
      _id: ""
    },
    {
      note: "Interested in Backend and Database Development.",
      _id: "583e852849e63fdc0d88a8b2",
      user: {
        login: "bohdana.stets",
        _id: "573d7f7907676c6435eeff3e"
      },
      date: "2016-11-30T08:52:08.000Z",
      task: null
    },
    {
      _id: "583e8535aefcfc140ea84ba7",
      attachment: {
        name: "Backend RFP V1.1.pdf",
        shortPas: "uploads%2Fopportunities%2F583e84406ea87b590d48b70a%2FBackend%20RFP%20V1.1.pdf"
      },
      user: {
        login: "bohdana.stets",
        _id: "573d7f7907676c6435eeff3e"
      },
      date: "2016-11-30T08:52:21.000Z",
      task: null
    },
    {
      _id: "583e8535aefcfc140ea84ba8",
      attachment: {
        name: "Database Schema.pdf",
        shortPas: "uploads%2Fopportunities%2F583e84406ea87b590d48b70a%2FDatabase%20Schema.pdf"
      },
      user: {
        login: "bohdana.stets",
        _id: "573d7f7907676c6435eeff3e"
      },
      date: "2016-11-30T08:52:21.000Z",
      task: null
    }
  ],
  source: "Outbound LinkedIn",
  campaign: "",
  editedBy: {
    date: "2016-11-30T08:31:58.127Z",
    user: {
      _id: "573d7f7907676c6435eeff3e",
      login: "bohdana.stets"
    }
  },
  createdBy: {
    date: "2016-11-30T07:48:16.525Z",
    user: {
      _id: "573d7f7907676c6435eeff3e",
      login: "bohdana.stets"
    }
  },
  groups: {
    group: [

    ],
    users: [

    ],
    owner: null
  },
  whoCanRW: "everyOne",
  workflow: {
    _id: "528cdd2af3f67bc40b000007",
    name: "To estimate",
    sequence: 4
  },
  priority: "Cold",
  expectedClosing: null,
  nextAction: {
    date: "2016-11-30T07:48:16.524Z",
    desc: ""
  },
  internalNotes: "",
  salesPerson: {
    _id: "56e17661177f76f72edf774c",
    name: {
      last: "Stets",
      first: "Bogdana"
    },
    fullName: "Bogdana Stets",
    id: "56e17661177f76f72edf774c"
  },
  phones: {
    fax: "",
    phone: "",
    mobile: ""
  },
  email: "grechkoda@gmail.com",
  contactName: {
    last: "Grechko",
    first: "Dmytro"
  },
  address: {
    country: "Canada",
    zip: "",
    state: "",
    city: "North York",
    street: ""
  },
  tags: [
    {
      _id: "57a0de6fe29f483f1db951fd",
      name: "PHP",
      color: "bgGrey"
    },
    {
      _id: "57aded1f51eec4534abb0f2b",
      name: "Ruby",
      color: "bgPurple"
    }
  ],
  customer: {
    _id: "583e86c5ed5a2cbf0db9f53c",
    externalId: null,
    __v: 0,
    channel: null,
    integrationId: "",
    companyInfo: {
      industry: null
    },
    editedBy: {
      date: "2016-11-30T07:59:01.444Z",
      user: null
    },
    createdBy: {
      date: "2016-11-30T07:59:01.444Z",
      user: "573d7f7907676c6435eeff3e"
    },
    history: [

    ],
    attachments: [

    ],
    notes: [

    ],
    groups: {
      group: [

      ],
      users: [

      ],
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
      salesPerson: "56e17661177f76f72edf774c",
      isSupplier: false,
      isCustomer: true
    },
    title: "",
    internalNotes: "",
    contacts: [

    ],
    phones: {
      fax: "",
      mobile: "",
      phone: ""
    },
    skype: "",
    jobPosition: "",
    website: "",
    shippingAddress: {
      name: "",
      country: "",
      zip: "",
      state: "",
      city: "",
      street: ""
    },
    address: {
      country: "",
      zip: "",
      state: "",
      city: "",
      street: ""
    },
    timezone: "UTC",
    department: null,
    company: "583e86c5ed5a2cbf0db9f53b",
    email: "grechkoda@gmail.com",
    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
    name: {
      last: "Grechko",
      first: "Dmytro"
    },
    isHidden: false,
    isOwn: false,
    type: "Person",
    fullName: "Dmytro Grechko",
    id: "583e86c5ed5a2cbf0db9f53c"
  },
  company: {
    _id: "583e86c5ed5a2cbf0db9f53b",
    externalId: null,
    __v: 0,
    channel: null,
    integrationId: "",
    companyInfo: {
      industry: null
    },
    editedBy: {
      date: "2016-11-30T07:59:01.431Z",
      user: null
    },
    createdBy: {
      date: "2016-11-30T07:59:01.431Z",
      user: "573d7f7907676c6435eeff3e"
    },
    history: [

    ],
    attachments: [

    ],
    notes: [

    ],
    groups: {
      group: [

      ],
      users: [

      ],
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
      salesPerson: "56e17661177f76f72edf774c",
      isSupplier: false,
      isCustomer: true
    },
    title: "",
    internalNotes: "",
    contacts: [

    ],
    phones: {
      fax: "",
      mobile: "",
      phone: ""
    },
    skype: "",
    jobPosition: "",
    website: "",
    shippingAddress: {
      name: "",
      country: "",
      zip: "",
      state: "",
      city: "",
      street: ""
    },
    address: {
      country: "Canada",
      zip: "",
      state: "",
      city: "North York",
      street: ""
    },
    timezone: "UTC",
    department: null,
    company: null,
    email: "",
    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
    name: {
      last: "",
      first: "Deskree"
    },
    isHidden: false,
    isOwn: false,
    type: "Company",
    fullName: "Deskree ",
    id: "583e86c5ed5a2cbf0db9f53b"
  },
  tempCompanyField: "Deskree",
  jobPosition: "CEO",
  expectedRevenue: {
    currency: "",
    progress: 0,
    value: 0
  },
  name: "Interested in Backend Development",
  isOpportunitie: true,
  followers: [

  ]
}
     */
    router.get('/:id', authStackMiddleware, accessStackMiddleware, handler.getById);
    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.post('/createLeadFromSite', handler.addNewLeadFromSite);

    /**
     *@api {post} /opportunities/uploadFiles/ Request for updating Opportunity and upload Files
     *
     * @apiVersion 0.0.1
     * @apiName uploadFiles
     * @apiGroup Opportunity
     *
     * @apiHeader (HeaderName=HeaderValue) {String} Content-Type="multipart/form-data"
     * @apiHeader (HeaderName=HeaderValue) {String} modelid
     * @apiHeader (HeaderName=HeaderValue) {String} modelname="Opportunities"
     *
     * @apiSuccess {Object} UpdatedOpportunity
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": "Opportunity updated success",
      "data": {
        "_id": "57693909e6b2b396201e2411",
        "__v": 0,
        "skype": "",
        "social": {
          "LI": "",
          "FB": ""
        },
        "projectType": "fixed",
        "attachments": [
          {
            "_id": "57850694b7c30f675048cdad",
            "name": "united-kingdom-england-london-6527.jpg",
            "shortPas": "uploads%2Fopportunities%2F57693909e6b2b396201e2411%2Funited-kingdom-england-london-6527.jpg",
            "size": "0.309&nbsp;Mb",
            "uploadDate": "2016-07-12T15:02:44.827Z",
            "uploaderName": "admin"
          }
        ],
        "notes": [

        ],
        "convertedDate": "2016-06-21T12:54:33.527Z",
        "isConverted": false,
        "source": "",
        "campaign": "",
        "editedBy": {
          "date": "2016-07-12T14:55:12.973Z",
          "user": "52203e707d4dba8813000003"
        },
        "createdBy": {
          "date": "2016-06-21T12:54:33.527Z",
          "user": "563f673270bbc2b740ce89ae"
        },
        "sequence": 10,
        "groups": {
          "group": [

          ],
          "users": [

          ],
          "owner": "560c099da5d4a2e20ba5068b"
        },
        "whoCanRW": "everyOne",
        "workflow": "528cdcb4f3f67bc40b000006",
        "reffered": "",
        "optout": false,
        "active": false,
        "color": "#4d5a75",
        "categories": {
          "name": "",
          "id": ""
        },
        "priority": "Select",
        "expectedClosing": "",
        "nextAction": {
          "date": "2016-07-03T22:00:00.000Z",
          "desc": ""
        },
        "internalNotes": "",
        "salesTeam": null,
        "salesPerson": "55b92ad221e4b7c40f000040",
        "func": "",
        "phones": {
          "fax": "",
          "phone": "",
          "mobile": ""
        },
        "email": "",
        "contactName": {
          "last": "",
          "first": ""
        },
        "address": {
          "country": "USA",
          "zip": "",
          "state": "",
          "city": "",
          "street": ""
        },
        "customer": "574818d53ee88113675f3520",
        "company": null,
        "tempCompanyField": "",
        "creationDate": "2016-06-21T12:54:33.526Z",
        "expectedRevenue": {
          "currency": "$",
          "progress": 0,
          "value": 0
        },
        "name": "iOS + Android",
        "isOpportunitie": true
      }
}
     */
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    /**
     *@api {patch} /opportunities/:id Request for updating Opportunity
     *
     * @apiVersion 0.0.1
     * @apiName updateOpportunity
     * @apiGroup Opportunity
     *
     * @apiParam {String} id Unique id of Opportunity
     * @apiParamExample {json} Request-Example:
{
      "customer": "574818d53ee88113675f3520",
      "address": {
        "street": "",
        "city": "",
        "state": "",
        "zip": "",
        "country": "USA"
      },
      "active": false,
      "groups": {
        "owner": "560c099da5d4a2e20ba5068b",
        "users": [

        ],
        "group": [

        ]
      }
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": "Opportunities updated",
      "notes": [

      ],
      "sequence": 10
}
     *
     */
    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.updateOnlySelectedFields);
    router.put('/:id', authStackMiddleware, accessStackMiddleware, handler.update);

    /**
     *@api {delete} /opportunities/:id Request for deleting Opportunity
     *
     * @apiVersion 0.0.1
     * @apiName deleteOpportunity
     * @apiGroup Opportunity
     *
     * @apiParam {String} id Unique id of Opportunity
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"Opportunities removed"
}
     */
    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    /**
     *@api {delete} /opportunities/ Request for deleting selected Opportunities
     *
     * @apiVersion 0.0.1
     * @apiName deleteSelectedOpportunities
     * @apiGroup Opportunity
     *
     * @apiParamExample {json} Request-Example:
{
      "contentType": "Opportunities",
      "ids": [
            "57153854eb8118dc63f02b7f",
            "574300a57c51918533cb200b"
      ]
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":true
}
     */
    router.delete('/', authStackMiddleware, accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
