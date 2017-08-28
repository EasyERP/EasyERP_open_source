var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';
    var handler = new CustomerHandler(models, event);
    var moduleId = MODULES.PERSONS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'person', event);
    }

    router.use(authStackMiddleware);

    /**
     *@api {get} /persons/ Request Persons
     *
     * @apiVersion 0.0.1
     * @apiName getPersons
     * @apiGroup Person
     *
     * @apiParam (?Field=value) {String} viewType="thumbnails" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=50 Count of Persons which will show
     * @apiParam (?Field=value) {String} contentType="Persons" Type of content
     *
     * @apiSuccess {Object} Persons
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
             total: 279,
                 data: [
                 {
                     _id           : "583e86c5ed5a2cbf0db9f53c",
                     salesPurchases: {
                         receiveMessages: 0,
                         language       : "English",
                         reference      : "",
                         active         : true,
                         implementedBy  : null,
                         salesTeam      : null,
                         salesPerson    : "56e17661177f76f72edf774c",
                         isSupplier     : false,
                         isCustomer     : true
                     },
                     address       : {
                         country: ""
                     },
                     company       : {
                         _id     : "583e86c5ed5a2cbf0db9f53b",
                         name    : {
                             last : "",
                             first: "Deskree"
                         },
                         fullName: "Deskree ",
                         id      : "583e86c5ed5a2cbf0db9f53b"
                     },
                     email         : "grechkoda@gmail.com",
                     name          : {
                         last : "Grechko",
                         first: "Dmytro"
                     },
                     fullName      : "Dmytro Grechko",
                     id            : "583e86c5ed5a2cbf0db9f53c"
                 },
                 {
                     _id           : "583d4f6aed5a2cbf0db9f531",
                     salesPurchases: {
                         receiveMessages: 0,
                         language       : "English",
                         reference      : "",
                         active         : true,
                         implementedBy  : null,
                         salesTeam      : null,
                         salesPerson    : "56e17661177f76f72edf774c",
                         isSupplier     : false,
                         isCustomer     : true
                     },
                     address       : {
                         country: ""
                     },
                     company       : null,
                     email         : "Geoff@MasterYourMedics.com",
                     name          : {
                         last : "",
                         first: "Geoff"
                     },
                     fullName      : "Geoff ",
                     id            : "583d4f6aed5a2cbf0db9f531"
                 },
                 ...
         ]
         }
     */
    router.get('/', accessStackMiddleware, handler.getByViewType);

    /**
     *@api {get} /persons/getPersonAlphabet/ Request PersonAlphabet
     *
     * @apiVersion 0.0.1
     * @apiName getPersonAlphabet
     * @apiGroup Person
     *
     * @apiParam (?Field=value) {Number} mid=39 Type of View
     * @apiParam (?Field=value) {String} contentType="Persons" Type of content
     *
     * @apiSuccess {Object} Persons
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
   data: [
     {
       _id: "h"
     },
     {
       _id: "O"
     },
     {
       _id: "y"
     },
     {
       _id: "X"
     },
     {
       _id: "u"
     },
     {
       _id: "U"
     },
     {
       _id: "S"
     },
     {
       _id: "I"
     },
     {
       _id: "B"
     },
     {
       _id: "C"
     },
     {
       _id: "N"
     },
     {
       _id: "P"
     },
     {
       _id: "F"
     },
     {
       _id: "T"
     },
     {
       _id: "E"
     },
     {
       _id: ""
     },
     {
       _id: "v"
     },
     {
       _id: "H"
     },
     {
       _id: "G"
     },
     {
       _id: "A"
     },
     {
       _id: "M"
     },
     {
       _id: "L"
     },
     {
       _id: "W"
     },
     {
       _id: "V"
     },
     {
       _id: "R"
     },
     {
       _id: "Y"
     },
     {
       _id: "D"
     },
     {
       _id: "K"
     },
     {
       _id: "J"
     },
     {
       _id: "Z"
     },
     {
       _id: "d"
     }
   ]
 }
     */
    router.get('/getPersonAlphabet', accessStackMiddleware, handler.getCompaniesAlphabet);

    /**
     *@api {get} /persons/getPersonsForMiniView/ Request Persons for MiniView
     *
     * @apiVersion 0.0.1
     * @apiName getPersonsForMiniView
     * @apiGroup Person
     *
     * @apiSuccess {Object} Persons
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
          data: [
            {
              _id: "57ce6557a3c7f97535e33da5",
              phones: {
                mobile: ""
              },
              email: "",
              name: {
                last: "Hurst",
                first: "Aaron"
              },
              fullName: "Aaron Hurst",
              id: "57ce6557a3c7f97535e33da5"
            },
            {
              _id: "57a8a926c2bdd8bf07e54a3c",
              phones: {
                mobile: ""
              },
              email: "",
              name: {
                last: "Abu",
                first: "Abdul"
              },
              fullName: "Abdul Abu",
              id: "57a8a926c2bdd8bf07e54a3c"
            },
            ...
          ]
}
     */
    router.get('/getPersonsForMiniView', handler.getFilterPersonsForMiniView);

    /**
     *@api {get} /persons/:id Request Person
     *
     * @apiVersion 0.0.1
     * @apiName getPerson
     * @apiGroup Person
     *
     * @apiParam (?Field=value) {String} id Unique id of Person
     *
     * @apiSuccess {Object} Person
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
        _id: "5832f6b3aefcfc140ea7bcce",
        dateBirth: "",
        externalId: null,
        __v: 0,
        channel: null,
        integrationId: "",
        companyInfo: {
          industry: null
        },
        editedBy: {
          date: "2016-11-21T13:29:23.846Z",
          user: {
            _id: "579f4680a836b2661d941593",
            login: "iryna.labai"
          }
        },
        createdBy: {
          date: "2016-11-21T13:29:23.846Z",
          user: {
            _id: "579f4680a836b2661d941593",
            login: "iryna.labai"
          }
        },
        history: [

        ],
        attachments: [

        ],
        notes: [
          {
            date: "2016-11-21T13:29:23.861Z",
            history: {
              prevValue: null,
              newValue: "Guy",
              changedField: "First Name",
              collectionName: "Persons",
              contentId: "5832f6b3aefcfc140ea7bcce",
              date: "2016-11-21T13:29:23.861Z"
            },
            name: ""
          },
          {
            date: "2016-11-21T13:29:23.861Z",
            history: {
              prevValue: null,
              newValue: "Doron",
              changedField: "Last Name",
              collectionName: "Persons",
              contentId: "5832f6b3aefcfc140ea7bcce",
              date: "2016-11-21T13:29:23.861Z"
            },
            name: ""
          },
          {
            date: "2016-11-21T13:29:23.861Z",
            history: {
              prevValue: null,
              newValue: "https://www.linkedin.com/in/guydoron?trk=extra_biz_connect_hb_upphoto",
              changedField: "LinkedIn",
              collectionName: "Persons",
              contentId: "5832f6b3aefcfc140ea7bcce",
              date: "2016-11-21T13:29:23.861Z"
            },
            name: ""
          },
          {
            date: "2016-11-21T13:29:23.861Z",
            history: {
              prevValue: null,
              newValue: "doronguy1",
              changedField: "Skype",
              collectionName: "Persons",
              contentId: "5832f6b3aefcfc140ea7bcce",
              date: "2016-11-21T13:29:23.861Z"
            },
            name: ""
          },
          {
            date: "2016-11-21T13:29:23.861Z",
            history: {
              prevValue: null,
              newValue: "Israel",
              changedField: "Country",
              collectionName: "Persons",
              contentId: "5832f6b3aefcfc140ea7bcce",
              date: "2016-11-21T13:29:23.861Z"
            },
            name: ""
          },
          {
            date: "2016-11-21T13:29:23.861Z",
            history: {
              prevValue: null,
              newValue: "Owner",
              changedField: "Job Position",
              collectionName: "Persons",
              contentId: "5832f6b3aefcfc140ea7bcce",
              date: "2016-11-21T13:29:23.861Z"
            },
            name: ""
          },
          {
            date: "2016-11-21T13:29:23.861Z",
            history: {
              prevValue: null,
              newValue: "2016-11-21T13:29:23.846Z",
              changedField: "Creation Date",
              collectionName: "Persons",
              contentId: "5832f6b3aefcfc140ea7bcce",
              date: "2016-11-21T13:29:23.861Z"
            },
            name: ""
          },
          {
            date: "2016-11-29T10:23:50.991Z",
            history: {
              editedBy: {
                _id: "579f4680a836b2661d941593",
                login: "iryna.labai"
              },
              prevValue: null,
              newValue: true,
              changedField: "isOpportunitie",
              collectionName: "Opportunities",
              contentId: "583d5736aefcfc140ea84b97",
              date: "2016-11-29T10:23:50.991Z"
            },
            user: {
              _id: "579f4680a836b2661d941593",
              login: "iryna.labai"
            },
            name: "opportunity ECIsland Sales Tool Unity"
          },
          {
            date: "2016-11-29T10:23:50.991Z",
            history: {
              editedBy: {
                _id: "579f4680a836b2661d941593",
                login: "iryna.labai"
              },
              prevValue: null,
              newValue: "2016-11-29T10:23:50.971Z",
              changedField: "Creation Date",
              collectionName: "Opportunities",
              contentId: "583d5736aefcfc140ea84b97",
              date: "2016-11-29T10:23:50.991Z"
            },
            user: {
              _id: "579f4680a836b2661d941593",
              login: "iryna.labai"
            },
            name: "opportunity ECIsland Sales Tool Unity"
          }
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
          LI: "https://www.linkedin.com/in/guydoron?trk=extra_biz_connect_hb_upphoto",
          FB: ""
        },
        color: "#4d5a75",
        relatedUser: null,
        salesPurchases: {
          receiveMessages: 0,
          language: "English",
          reference: "",
          active: false,
          implementedBy: null,
          salesTeam: null,
          salesPerson: null,
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
        skype: "doronguy1",
        jobPosition: "Owner",
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
          country: "Israel",
          zip: "43880",
          state: "",
          city: "Kibutz Haogen",
          street: ""
        },
        timezone: "UTC",
        department: null,
        company: {
          _id: "5832f543a7cfd69d0d1e3315",
          externalId: null,
          __v: 0,
          channel: null,
          integrationId: "",
          companyInfo: {
            industry: null
          },
          editedBy: {
            date: "2016-11-21T13:26:10.638Z",
            user: "579f4680a836b2661d941593"
          },
          createdBy: {
            date: "2016-11-21T13:23:15.726Z",
            user: "579f4680a836b2661d941593"
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
            LI: "https://www.linkedin.com/company/2248624?trk=tyah&trkInfo=clickedVertical%3Acompany%2CclickedEntityId%3A2248624%2Cidx%3A1-1-1%2CtarId%3A1479734429301%2Ctas%3Amoblers",
            FB: ""
          },
          color: "#4d5a75",
          relatedUser: null,
          salesPurchases: {
            receiveMessages: 0,
            language: "English",
            reference: "",
            active: false,
            implementedBy: null,
            salesTeam: null,
            salesPerson: null,
            isSupplier: false,
            isCustomer: false
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
          website: "https://www.linkedin.com/redirec",
          shippingAddress: {
            name: "",
            country: "",
            zip: "",
            state: "",
            city: "",
            street: ""
          },
          address: {
            country: "Israel",
            zip: "43880",
            state: "",
            city: "Kibutz Haogen",
            street: ""
          },
          timezone: "UTC",
          department: null,
          company: null,
          email: "",
          imageSrc: "data:image/jpeg;base64,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",
          name: {
            last: "",
            first: "moblers"
          },
          isHidden: false,
          isOwn: false,
          type: "Company",
          fullName: "moblers ",
          id: "5832f543a7cfd69d0d1e3315"
        },
        email: "",
        imageSrc: "data:image/jpeg;base64,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",
        name: {
          last: "Doron",
          first: "Guy"
        },
        isHidden: false,
        isOwn: false,
        type: "Person",
        fullName: "Guy Doron",
        id: "5832f6b3aefcfc140ea7bcce",
        opportunities: [
          {
            _id: "583d5736aefcfc140ea84b97",
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

            ],
            convertedDate: "2016-11-29T10:23:50.971Z",
            isConverted: false,
            source: "",
            campaign: "",
            editedBy: {
              date: "2016-11-29T10:28:54.841Z",
              user: "579f4680a836b2661d941593"
            },
            createdBy: {
              date: "2016-11-29T10:23:50.971Z",
              user: "579f4680a836b2661d941593"
            },
            sequence: 38,
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
              name: "To estimate"
            },
            reffered: "",
            optout: false,
            active: true,
            color: "#4d5a75",
            categories: {
              name: "",
              id: ""
            },
            priority: "Cold",
            expectedClosing: null,
            nextAction: {
              date: "2016-11-29T10:23:50.971Z",
              desc: ""
            },
            internalNotes: "",
            salesTeam: null,
            salesPerson: {
              _id: "55b92ad221e4b7c40f000072",
              name: {
                last: "Bernikevich",
                first: "Eugen"
              },
              fullName: "Eugen Bernikevich",
              id: "55b92ad221e4b7c40f000072"
            },
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
              "578893982bfddc9a494cce04"
            ],
            customer: "5832f6b3aefcfc140ea7bcce",
            company: "5832f543a7cfd69d0d1e3315",
            tempCompanyField: "",
            creationDate: "2016-11-29T10:23:50.970Z",
            jobPosition: "",
            expectedRevenue: {
              currency: "$",
              progress: 0,
              value: 0
            },
            name: "ECIsland Sales Tool Unity",
            isOpportunitie: true
          }
        ]
  }
     */

    router.get('/:id', handler.getById);

    /**
     *@api {post} /persons/ Request for creating new Person
     *
     * @apiVersion 0.0.1
     * @apiName createNewPerson
     * @apiGroup Person
     *
     * @apiParamExample {json} Request-Example:
     {
           "id": null,
           "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
           "type": "Person",
           "name": {
             "first": "Mark",
             "last": "Sopko"
           },
           "email": "mark@gmail.com",
           "address": {
             "street": "",
             "city": "",
             "state": "",
             "zip": "",
             "country": ""
           },
           "website": "",
           "jobPosition": "",
           "skype": "",
           "phones": {
             "phone": "",
             "mobile": "",
             "fax": ""
           },
           "salesPurchases": {
             "isCustomer": true,
             "isSupplier": false,
             "active": false,
             "implementedBy": null,
             "salesPerson": null,
             "salesTeam": null,
             "reference": "",
             "language": "English"
           },
           "dateBirth": "",
           "attachments": [

           ],
           "notes": [

           ],
           "social": {
             "LI": "",
             "FB": ""
           },
           "groups": {
             "owner": null,
             "users": [

             ],
             "group": [

             ]
           },
           "whoCanRW": "everyOne"
             }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 201 Created
     {
         "success": "A new Person crate success",
         "id": "57864ca394ced09b471c9bb8"
     }
     */
    router.post('/', accessStackMiddleware, handler.create);

    /**
     *@api {post} /persons/uploadFiles Request for uploadFiles and updating Person
     *
     * @apiVersion 0.0.1
     * @apiName uploadFiles
     * @apiGroup Person
     *
     * @apiHeader (HeaderName=HeaderValue) {String} Content-Type="multipart/form-data"
     * @apiHeader (HeaderName=HeaderValue) {String} modelid
     * @apiHeader (HeaderName=HeaderValue) {String} modelname="Persons"
     *
     * @apiSuccess {Object} UpdatedPerson
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success": "Customers updated success",
         "data": {
         "_id": "55b92ad621e4b7c40f000623",
         "ID": 32,
         "__v": 0,
         "dateBirth": "",
         "companyInfo": {
           "size": null,
           "industry": null
         },
         "editedBy": {
           "date": "2016-07-13T13:51:51.104Z",
           "user": "52203e707d4dba8813000003"
         },
         "createdBy": {
           "date": "2015-07-29T19:34:46.000Z",
           "user": "52203e707d4dba8813000003"
         },
         "history": [

         ],
         "attachments": [
           {
             "_id": "5786479894ced09b471c9bb7",
             "name": "united-kingdom-england-london-6527(1).jpg",
             "shortPas": "uploads%2Fpersons%2F55b92ad621e4b7c40f000623%2Funited-kingdom-england-london-6527(1).jpg",
             "size": "0.309&nbsp;Mb",
             "uploadDate": "2016-07-13T13:52:24.681Z",
             "uploaderName": "admin"
           }
         ],
         "notes": [

         ],
         "groups": {
           "group": [

           ],
           "users": [

           ],
           "owner": "560c099da5d4a2e20ba5068b"
         },
         "whoCanRW": "everyOne",
         "social": {
           "LI": "",
           "FB": ""
         },
         "color": "#4d5a75",
         "relatedUser": null,
         "salesPurchases": {
           "receiveMessages": 0,
           "language": "English",
           "reference": "",
           "active": false,
           "implementedBy": null,
           "salesTeam": null,
           "salesPerson": null,
           "isSupplier": false,
           "isCustomer": true
         },
         "title": "",
         "internalNotes": "",
         "contacts": [

         ],
         "phones": {
           "fax": "",
           "mobile": "",
           "phone": ""
         },
         "skype": "",
         "jobPosition": "Founder and CEO",
         "website": "",
         "address": {
           "country": "Belgium",
           "zip": "",
           "state": "",
           "city": "Antwerp",
           "street": ""
         },
         "timezone": "UTC",
         "department": null,
         "company": "574e8dc9cafdf9d135cfd651",
         "email": "",
         "imageSrc": "data:image/jpeg;base64,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",
         "name": {
           "last": "Trop",
           "first": "Vladi"
         },
         "isOwn": false,
         "type": "Person",
         "fullName": "Vladi Trop",
         "id": "55b92ad621e4b7c40f000623"
         }
     }
     */
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    /**
     *@api {put} /persons/:id Request for updating Person
     *
     * @apiVersion 0.0.1
     * @apiName updatePerson
     * @apiGroup Person
     *
     * @apiParam {String} id Unique id of Person
     * @apiParamExample {json} Request-Example:
     {
           "id": "55b92ad521e4b7c40f000610",
           "imageSrc": "data:image/jpeg;base64,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",
           "type": "Person",
           "name": {
             "first": "Roberto",
             "last": "Appart"
           },
           "email": "norbert@app-art.eu",
           "address": {
             "street": "",
             "city": "",
             "state": "",
             "zip": "",
             "country": "Belgium"
           },
           "website": "",
           "jobPosition": null,
           "skype": "",
           "phones": {
             "phone": "",
             "mobile": "",
             "fax": ""
           },
           "salesPurchases": {
             "isCustomer": true,
             "isSupplier": false,
             "active": false,
             "reference": "",
             "language": "English"
           },
           "department": null,
           "dateBirth": "",
           "attachments": [

           ],
           "notes": [

           ],
           "_id": "55b92ad521e4b7c40f000610",
           "editedBy": {
             "date": "27 May, 2016, 17:51:36",
             "user": {
               "_id": "57231ce22387d7b821a694c2",
               "login": "ivan.pasichnyuk"
             }
           },
           "createdBy": {
             "date": "29 Jul, 2015, 22:34:45",
             "user": {
               "_id": "52203e707d4dba8813000003",
               "login": "admin"
             }
           },
           "groups": {
             "owner": "560c099da5d4a2e20ba5068b",
             "users": [

             ],
             "group": [

             ]
           },
           "social": {
             "LI": "",
             "FB": ""
           },
           "company": "57485e59b85f5b921f77e840",
           "fullName": "Norbert Appart"
     }
     *
     * @apiSuccess {Object} UpdatedPerson
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "_id": "55b92ad521e4b7c40f000610",
           "ID": 21,
           "__v": 0,
           "dateBirth": "",
           "companyInfo": {
             "size": null,
             "industry": null
           },
           "editedBy": {
             "date": "2016-07-13T13:23:31.831Z",
             "user": "52203e707d4dba8813000003"
           },
           "createdBy": {
             "date": "2015-07-29T19:34:45.000Z",
             "user": null
           },
           "history": [

           ],
           "attachments": [

           ],
           "notes": [

           ],
           "groups": {
             "group": [

             ],
             "users": [

             ],
             "owner": "560c099da5d4a2e20ba5068b"
           },
           "whoCanRW": "everyOne",
           "social": {
             "LI": "",
             "FB": ""
           },
           "color": "#4d5a75",
           "relatedUser": null,
           "salesPurchases": {
             "receiveMessages": 0,
             "language": "English",
             "reference": "",
             "active": false,
             "implementedBy": null,
             "salesTeam": null,
             "salesPerson": null,
             "isSupplier": false,
             "isCustomer": true
           },
           "title": "",
           "internalNotes": "",
           "contacts": [

           ],
           "phones": {
             "fax": "",
             "mobile": "",
             "phone": ""
           },
           "skype": "",
           "jobPosition": null,
           "website": "",
           "address": {
             "country": "Belgium",
             "zip": "",
             "state": "",
             "city": "",
             "street": ""
           },
           "timezone": "UTC",
           "department": null,
           "company": "57485e59b85f5b921f77e840",
           "email": "norbert@app-art.eu",
           "imageSrc": "data:image/jpeg;base64,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",
           "name": {
             "last": "Appart",
             "first": "Roberto"
           },
           "isOwn": false,
           "type": "Person",
           "fullName": "Roberto Appart",
           "id": "55b92ad521e4b7c40f000610"
     }
     */
    router.put('/:id', accessStackMiddleware, handler.update);

    /**
     *@api {patch} /persons/:id Request for updating only selected fields of Person
     *
     * @apiVersion 0.0.1
     * @apiName partlyUpdatePerson
     * @apiGroup Person
     *
     * @apiParam {String} id Unique id of Person
     * @apiParamExample {json} Request-Example:
     {
         "attachments":[],
         "fileName":"united-kingdom-england-london-6527.jpg"
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success":"Customer updated",
         "notes":[]
     }
     */
    router.patch('/:id', accessStackMiddleware, handler.udateOnlySelectedFields);

    /**
     *@api {delete} /persons/:id Request for deleting Person
     *
     * @apiVersion 0.0.1
     * @apiName deletePerson
     * @apiGroup Person
     *
     * @apiParam {String} id Unique id of Person
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success":"customer removed"
     }
     */
    router.delete('/:id', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.remove);

    /**
     *@api {delete} /persons/ Request for deleting chosen Persons
     *
     * @apiVersion 0.0.1
     * @apiName deletePersons
     * @apiGroup Person
     *
     * @apiParamExample {json} Request-Example:
     {
         "contentType": "Persons",
         "ids": [
             "577cc32e7802b0e6727201e2",
             "5776401f0a8bdaf820f748e4"
         ]
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "ok":1,
         "n":2
     }
     */
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
