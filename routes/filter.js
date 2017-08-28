var express = require('express');
var router = express.Router();
var filterHandler = require('../handlers/filter');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new filterHandler(models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /filter/Employees Request filter for Employees
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForEmployees
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForEmployees
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
               "_id": null,
               "name": [
                 {
                   "_id": "577bc8067f4cef0a37b82277",
                   "name": "Vasya Solovyov"
                 },
                 {
                   "_id": "57762870f9a7a48d58879027",
                   "name": "Ivanka Britanyuk"
                 },
               ...
               ],
               "department": [
             {
                 "_id": "55b92ace21e4b7c40f000013",
                 "name": "Marketing"
             },
             {
                 "_id": "560c0b83a5d4a2e20ba5068c",
                 "name": "Finance"
             },
             {
                 "_id": "55b92ace21e4b7c40f000014",
                 "name": "BusinessDev"
             },
             ...
             ],
             "jobPosition": [
                 {
                     "_id": "56cc7ba1541812c07197357a",
                     "name": "IT Researcher"
                 },
                 {
                     "_id": "5720700a7ddd4b42221d86e6",
                     "name": "IT researcher"
                 },
                 {
                     "_id": "57582457213bb78c75dfd40e",
                     "name": "SMM manager"
                 },
                 ...
             ],
             "manager": [
                 {
                     "_id": "564dac3e9b85f8b16b574fea",
                     "name": "Alex Filchak"
                 },
                 {
                     "_id": "55b92ad221e4b7c40f000031",
                     "name": "Alex Gleba"
                 },
                 ...
             ]
     }
     * */
    router.get('/Employees', handler.getEmployeesFilters);
    router.get('/contractJobs', handler.getContarctJobsFilters);
    router.get('/projectsDashboard', handler.getProjectsDashboardFilters);

    /**
     *@api {get} /filter/Persons Request filter for Persons
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForPersons
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForPersons
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "name": [
         {
           "_id": "575fcfa6d4aef4766ad9aae3",
           "name": "Thijs Schnitger"
         },
         {
           "_id": "575e6a257f3384556ae3d11d",
           "name": "Till Schrader"
         },
         ...
         ],
         "country": [
         {
           "_id": "the Netherlands",
           "name": "the Netherlands"
         },
         {
           "_id": "Mexico",
           "name": "Mexico"
         },
         ...
         ],
         "services": [
         {
           "name": "Supplier",
           "_id": "isSupplier"
         },
         {
           "name": "Customer",
           "_id": "isCustomer"
         }
         ]
     }
     * */
    router.get('/Persons', handler.getPersonFilters);

    /**
     *@api {get} /filter/Companies Request filter for Companies
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForCompanies
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForCompanies
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "name": [
             {
                 "_id": "575e696a7f3384556ae3d11c",
                 "name": "Chilicon IT "
             },
             {
                 "_id": "575ab7eb3319da9d6ac1c140",
                 "name": "ITFarm "
             },
             {
                 "_id": "575987cb9c10be346a160f20",
                 "name": "Pazam "
             },
             ...
         ],
         "country": [
             {
                 "_id": "Thailand",
                 "name": "Thailand"
             },
             {
                 "_id": "New Zeland",
                 "name": "New Zeland"
             },
             ...
         ],
         "services": [
             {
                 "name": "Supplier",
                 "_id": "isSupplier"
             },
             {
                 "name": "Customer",
                 "_id": "isCustomer"
             }
         ]
     }
     * */
    router.get('/Companies', handler.getCompaniesFilters);

    /**
     *@api {get} /filter/Applications Request filter for Applications
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForApplications
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForApplications
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "name": [
         {
             "_id": "5715ee359f1136bd3af3b662",
             "name": "Vitaliy Driuchenko"
         },
         {
             "_id": "56dd4b727bd21335130c4f95",
             "name": "Andriy Merentsov"
         },
         {
             "_id": "56cdd631541812c071973584",
             "name": "Maryna Sheverya"
         },
             ...
         ],
         "department": [
             {
                 "_id": "55bb1f40cb76ca630b000007",
                 "name": "PM"
             },
             {
                 "_id": "55b92ace21e4b7c40f000015",
                 "name": "HR"
             },
             ...
         ],
         "jobPosition": [
             {
                 "_id": "56b9cd808f23c5696159cd0a",
                 "name": "PR Manager Assistant"
             },
             {
                 "_id": "5629e3c284deb7cb59d61b61",
                 "name": "Sysadmin"
             },
             {
                 "_id": "566ee0c68453e8b464b70b72",
                 "name": "Junior Ruby on Rails"
             },
            ...
         ]
     }
     */
    router.get('/Applications', handler.getApplicationFilters);

    /**
     *@api {get} /filter/Projects Request filter for Projects
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForProjects
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForProjects
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "workflow": [
             {
                 "_id": "528ce82df3f67bc40b000025",
                 "name": "Closed"
             },
             {
                 "_id": "528ce7d0f3f67bc40b000021",
                 "name": "New"
             }
         ],
         "customer": [
             {
                 "_id": "55cdc93c9b42266a4f000005",
                 "name": "AgileFind "
             },
             {
                 "_id": "574818d53ee88113675f3520",
                 "name": "Academiacs, Inc. "
             },
             {
                 "_id": "575988b67f3384556ae3d100",
                 "name": "Alexander Israel"
             }
         ],
         "projectManager": [
             {
                 "name": null
             },
             {
                 "_id": "55b92ad221e4b7c40f000038",
                 "name": "Roman Babunich"
             }
         ],
         "salesManager": [
             {
                 "_id": "55b92ad221e4b7c40f000057",
                 "name": "Alex Roman"
             },
             {
                 "name": null
             }
         ],
         "name": [
             {
                 "_id": "577a7638da57c4f43c69f680",
                 "name": "Solution"
             },
             {
                 "_id": "577a67e6da57c4f43c69f678",
                 "name": "test"
             },
             {
                 "_id": "577a66acda57c4f43c69f677",
                 "name": "EasyERP"
             }
         ]
     }
     */
    router.get('/Projects', handler.getProjectFilters);

    /**
     *@api {get} /filter/Tasks Request filter for Tasks
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForTasks
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForTasks
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "project": [
             {}
         ],
         "summary": [
             {
                 "_id": "5350eaabc3406b2c0900003b",
                 "name": "new skins"
             },
             ...
         ],
         "assignedTo": [
             {
                 "_id": "55b92ad221e4b7c40f000090",
                 "name": "Gabriella Shterr"
             },
             {
                 "name": "None"
             }
         ],
         "workflow": [
             {
                 "_id": "528ce35af3f67bc40b000010",
                 "name": "Testing"
             },
             {
                 "_id": "528ce0cdf3f67bc40b00000c",
                 "name": "New"
             },
             {
                 "_id": "528ce131f3f67bc40b00000d",
                 "name": "In Progress"
             }
         ],
         "type": [
             {
                 "_id": "Feature",
                 "name": "Feature"
             },
             {
                 "_id": "Bug",
                 "name": "Bug"
             },
             {
                 "_id": "Task",
                 "name": "Task"
             }
         ]
     }
     */
    router.get('/Tasks', handler.getTasksFilters);

    /**
     *@api {get} /filter/Invoices Request filter for Invoices
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForInvoices
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForInvoices
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "workflow": [
             {
                 "_id": "55647d932e4aa3804a765ec9",
                 "name": "Unpaid"
             },
             {
                 "_id": "55647d982e4aa3804a765ecb",
                 "name": "Paid"
             },
             {}
         ],
         "supplier": [
             {
                 "_id": "55cf4f834a91e37b0b000102",
                 "name": "SharperBuilds "
             },
             {
                 "_id": "574818d53ee88113675f3520",
                 "name": "Academiacs, Inc. "
             },
             {
                 "_id": "55cdc93c9b42266a4f000005",
                 "name": "AgileFind "
             },
             {
                 "_id": "57347f7fa91aace5132deff9",
                 "name": "Digipresence "
             },
             {
                 "_id": "572c750c7ae8db5b4e0b854a",
                 "name": "End User "
             },
             {
                 "name": null
             }
         ]
     }
     *
     * */
    router.get('/Invoices', handler.getInvoiceFilters);
    router.get('/purchaseInvoices', handler.getInvoiceFilters);

    /**
     *@api {get} /filter/salesInvoices Request filter for SalesInvoices
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForSalesInvoices
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForSalesInvoices
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "workflow": [
             {
                 "_id": "5555e54c6a3f01acae0b5564",
                 "name": "Draft"
             },
             {
                 "_id": "55647d952e4aa3804a765eca",
                 "name": "Partially Paid"
             },
             {
                 "_id": "55647d932e4aa3804a765ec9",
                 "name": "Unpaid"
             },
             {
                 "_id": "55647d982e4aa3804a765ecb",
                 "name": "Paid"
             }
         ],
         "project": [
             {}
         ],
         "salesPerson": [
             {
                 "_id": "56e2e83a74ac46664a83e94b",
                 "name": "Yevgenia Melnyk"
             },
             {
                 "_id": "55e96ab13f3ae4fd0b000009",
                 "name": "Oles Pavliuk"
             },
             {
                 "_id": "5602a01550de7f4138000008",
                 "name": "Yana Dufynets"
             },
            ...
         ],
         "supplier": [
             {
                 "_id": "55b92ad621e4b7c40f00064b",
                 "name": "Thomas Knudsen"
             },
             {
                 "_id": "5735a1a609f1f719488087ed",
                 "name": "Social Media Wave, GmbH "
             },
             ...
         ]
     }
     *
     * */
    router.get('/salesInvoices', handler.getSalesInvoiceFilters);

    /**
     *@api {get} /filter/salesProforma Request filter for SalesProforma
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForSalesProforma
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForSalesProforma
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "workflow": [
             {
                 "_id": "573db03b782445233dbe6835",
                 "name": "Cancelled"
             },
             {
                 "_id": "56fabc6b5ad5d96f4fb08eab",
                 "name": "Unpaid"
             },
             {
                 "_id": "56fabcb8e71823e438e4e1c8",
                 "name": "Partially Paid"
             },
             {
                 "_id": "56fabce2e71823e438e4e1c9",
                 "name": "Paid"
             },
             {
                 "_id": "56fabcf0e71823e438e4e1ca",
                 "name": "Invoiced"
             }
         ],
         "project": [
             {}
         ],
         "salesPerson": [
             {
                 "_id": "55b92ad221e4b7c40f00004a",
                 "name": "Oleg Ostroverkh"
             },
             {
                 "_id": "55b92ad221e4b7c40f00005f",
                 "name": "Peter Voloshchuk"
             },
             ...
         ],
         "supplier": [
             {
                 "_id": "55b92ad521e4b7c40f00060c",
                 "name": "Alexey Blinov"
             },
             {
                 "_id": "5721d1bb2d11557621505d02",
                 "name": "Pere Sanz"
             },
             {
                 "_id": "562bed4062461bfd59ef58d1",
                 "name": "TreatMe "
             },
             ...
         ]
     }
     */
    router.get('/invoice', handler.getSalesInvoicesFilters);

    /**
     *@api {get} /filter/customerPayments Request filter for CustomerPayments
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForCustomerPayments
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForCustomerPayments
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "assigned": [
             {
                 "_id": "56e2e83a74ac46664a83e94b",
                 "name": "Yevgenia Melnyk"
             },
             {
                 "_id": "5602a01550de7f4138000008",
                 "name": "Yana Dufynets"
             },
             ...
         ],
         "supplier": [
             {
                 "_id": "55b92ad621e4b7c40f00064b",
                 "name": "Thomas Knudsen"
             },
             {
                 "_id": "57358f3e4403a33547ee1e36",
                 "name": "Move for Less, Inc "
             },
             ...
         ],
         "name": [
             {
                 "_id": "575ab98645a95cd06a2ab284",
                 "name": "PP_526"
             },
             {
                 "_id": "575ab8d8d4aef4766ad9a032",
                 "name": "PP_524"
             },
             {
                 "_id": "5758083da6d2f5e975463207",
                 "name": "PP_522"
             },
             ...
         ],
         "paymentMethod": [
             {
                 "_id": "565f2e05ab70d49024242e0f",
                 "name": "CASH USD"
             },
             {
                 "_id": "565f2e05ab70d49024242e08",
                 "name": "Erste EUR"
             },
             ...
         ]
     }
     */
    router.get('/purchasePayments', handler.getPurchasePaymentsFilters);
    router.get('/customerPayments', handler.getCustomerPaymentsFilters);

    /**
     *@api {get} /filter/supplierPayments Request filter for SupplierPayments
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForSupplierPayments
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForSupplierPayments
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "supplier": [
             {
                 "name": null
             },
             {
                 "_id": "55b92ad221e4b7c40f000063",
                 "name": "Yana Gusti",
                 "isEmployee": true
             },
             ...
         ],
         "paymentRef": [
             {
                 "_id": "Sales/Head 8%",
                 "name": "Sales/Head 8%"
             },
             {
                 "_id": "Sales/Usual 8%",
                 "name": "Sales/Usual 8%"
             },
             ...
         ],
         "year": [
             {
                 "_id": 2014,
                 "name": 2014
             },
             {
                 "_id": 2015,
                 "name": 2015
             }
         ],
         "month": [
             {
                 "_id": 3,
                 "name": 3
             },
             {
                 "_id": 4,
                 "name": 4
             },
            ...
         ],
         "workflow": [
             {
                 "_id": "Paid",
                 "name": "Paid"
             }
         ]
     }
     */
    router.get('/supplierPayments', handler.getSupplierPaymentsFilters);
    router.get('/Products', handler.getProductsFilters);

    /**
     *@api {get} /filter/Quotations Request filter for Quotations
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForQuotations
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForQuotations
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "supplier": [
             {
                 "_id": "55b92ad521e4b7c40f00061e",
                 "name": "Luke Raskino "
             }
         ],
         "workflow": [
             {
                 "_id": "55647b962e4aa3804a765ec6",
                 "name": "Invoiced"
             }
         ]
     }
     * */
    router.get('/Quotations', handler.getQuotationFilters);

    /**
     *@api {get} /filter/salesQuotations Request filter for SalesQuotations
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForSalesQuotations
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForSalesQuotations
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "project": [
             {
                 "_id": "55b92ad621e4b7c40f00067f",
                 "name": "Player iOS/And"
             },
             {
                 "_id": "5732cda74b20992a37961efc",
                 "name": "Sandos E-Learning"
             },
             ...
         ],
         "supplier": [
             {
                 "_id": "570f3f2fe3b40faf4f238ac3",
                 "name": "MyVote Today "
             },
             ...
         ],
         "salesManager": [
             {
                 "_id": "56029cc950de7f4138000005",
                 "name": "Eugen Lendyel"
             },
             ...
         ],
         "workflow": [
             {
                 "_id": "55647b932e4aa3804a765ec5",
                 "name": "Not Invoiced"
             },
             {
                 "_id": "5555bf276a3f01acae0b5560",
                 "name": "Not Ordered"
             }
         ]
     }
     * */
    router.get('/salesQuotations', handler.getSalesQuotationFilters);

    /**
     *@api {get} /filter/salesOrders Request filter for SalesOrders
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForSalesOrders
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForSalesOrders
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "project": [
             {
                 "_id": "573311ba9a3a5ba65f140e51",
                 "name": "UAEPedia"
             },
             {
                 "_id": "56e292585def9136621b7800",
                 "name": "Casino"
             },
            ...
         ],
         "supplier": [
             {
                 "_id": "5773d1fcc99704120f44cba4",
                 "name": "Alexandre Fourtoy"
             },
             {
                 "_id": "56e290f1896e98a661aa831a",
                 "name": "Game scale "
             },
             {
                 "_id": "575988b67f3384556ae3d100",
                 "name": "Alexander Israel"
             },
            ...
         ],
         "salesManager": [
             {
                 "_id": "56e2e83a74ac46664a83e94b",
                 "name": "Yevgenia Melnyk"
             },
             {
                 "_id": "56029cc950de7f4138000005",
                 "name": "Eugen Lendyel"
             },
             ...
         ],
         "workflow": [
             {
                 "_id": "55647b932e4aa3804a765ec5",
                 "name": "Not Invoiced"
             },
             {},
             {
                 "_id": "55647b962e4aa3804a765ec6",
                 "name": "Invoiced"
             }
         ]
     }
     *
     * */
    router.get('/salesOrders', handler.getSalesOrdersFilters);

    router.get('/order', handler.getOrderFilters);

    /**
     *@api {get} /filter/Orders Request filter for Orders
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForOrders
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForOrders
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "projectName": [
             {}
         ],
         "supplier": [
             {
                 "name": null
             }
         ],
         "projectmanager": [
             {}
         ],
         "workflow": [
             {
                 "_id": "55647b962e4aa3804a765ec6",
                 "name": "Invoiced"
             }
         ]
     }
     * */
    router.get('/Orders', handler.getOrdersFilters);
    router.get('/purchaseOrders', handler.getOrdersFilters);

    /**
     *@api {get} /filter/Leads Request filter for Leads
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForLeads
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForLeads
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "contactName": [
             {
                 "_id": "Ross OCrowley",
                 "name": "Ross OCrowley"
             },
             {
                 "_id": "Guillaume Garreau",
                 "name": "Guillaume Garreau"
             },
             {
                 "_id": "Mats Andersson",
                 "name": "Mats Andersson"
             },
             ...
         ],
         "source": [
             {
                 "_id": "Offline Meetings",
                 "name": "Offline Meetings"
             },
             {
                 "_id": "Web Organic",
                 "name": "Web Organic"
             },
             {
                 "_id": "Outbound",
                 "name": "Outbound"
             },
             {
                 "_id": "",
                 "name": ""
             },
             {
                 "_id": null,
                 "name": null
             }
         ],
         "workflow": [
             {
                 "_id": "528ce74ef3f67bc40b00001e",
                 "name": "Draft"
             },
             {
                 "_id": "528ce779f3f67bc40b00001f",
                 "name": "In Progress"
             },
             {
                 "_id": "574ff52cf44dcec01dbb6e16",
                 "name": "Qualified"
             },
             {
                 "_id": "528ce79bf3f67bc40b000020",
                 "name": "Cancelled"
             }
         ],
         "salesPerson": [
             {
                 "name": "Heino Deubner"
             },
             {
                 "_id": "55b92ad221e4b7c40f00005f",
                 "name": "rene "
             },
             {
                 "_id": "55b92ad221e4b7c40f00005f",
                 "name": " Lee"
             },
            ...
         ]
     }
     *
     * */
    router.get('/DealTasks', handler.getDealsTasksFilters);
    router.get('/Leads', handler.getLeadsFilters);

    /**
     *@api {get} /filter/Opportunities Request filter for Opportunities
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForOpportunities
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForOpportunities
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "customer": [
             {
                 "_id": "56ab5ca674d57e0d56d6bda4",
                 "name": "Stian Maurstad"
             },
             {
                 "_id": "562bc2db62461bfd59ef58c7",
                 "name": "AppMedia "
             },
             ...
         ],
         "workflow": [
             {
                 "_id": "56dd819ccc599b971852913b",
                 "name": "To be discussed"
             },
             {
                 "_id": "528cdcb4f3f67bc40b000006",
                 "name": "To be done"
             },
             ...
         ],
         "salesPerson": [
             {
                 "_id": "570b72468f1cf7c354040534",
                 "name": "Dmytro Lylyk"
             },
             {
                 "_id": "55b92ad221e4b7c40f000040",
                 "name": "Vasiliy Almashiy"
             },
             ...
         ]
     }
     *
     * */
    router.get('/Opportunities', handler.getOpportunitiesFilters);

    /**
     *@api {get} /filter/salaryReport Request filter for SalaryReport
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForSalaryReport
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForSalaryReport
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "employee": [
             {
                 "_id": "577e59c98286c89d37076872",
                 "name": "Vasya Pupkin",
                 "isEmployee": false
             },
             {
                 "_id": "577e52b73d3b1efd3422d4fc",
                 "name": "sadas sadasdas",
                 "isEmployee": false
             },
             {
                 "_id": "5773bff2c51130066a4f3837",
                 "name": "Ivan Chekan",
                 "isEmployee": true
             },
             ...
         ],
         "department": [
             {
                 "name": "None"
             },
             {
                 "_id": "560c0b83a5d4a2e20ba5068c",
                 "name": "Finance"
             },
             {
                 "_id": "56e175c4d62294582e10ca68",
                 "name": "Unity"
             },
             ...
         ],
         "onlyEmployees": {
             "_id": "true",
             "name": "true"
         }
     }
     *
     * */
    router.get('/salaryReport', handler.getSalaryReportFilters);

    /**
     *@api {get} /filter/wTrack Request filter for WTrack
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForWTrack
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForWTrack
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "jobs": [
             {}
         ],
         "project": [
             {
                 "_id": "576d33c7d742b37b20468e59",
                 "name": "Race"
             },
             {
                 "_id": "575ea5d93319da9d6ac1c152",
                 "name": "Banners Maria"
             },
             {
                 "_id": "5755446ee99e78c875401453",
                 "name": "responsive website"
             },
             ...
         ],
         "customer": [
             {
                 "_id": "5773d1fcc99704120f44cba4",
                 "name": "Alexandre Fourtoy"
             },
             {
                 "_id": "5735a3dde9e6c01a47f07b04",
                 "name": "Karim Tribak"
             },
             {
                 "_id": "575988b67f3384556ae3d100",
                 "name": "Alexander Israel"
             },
            ...
         ],
         "employee": [
             {
                 "_id": "5767b78abd2fcd4d213ab9a6",
                 "name": "Anton Havrylenko",
                 "isEmployee": true
             },
             {
                 "_id": "57334db42fc64e916c25a1a3",
                 "name": "Anton Smirnov",
                 "isEmployee": false
             },
             ...
         ],
         "department": [
             {
                 "_id": "57693bb4995fc1bd201669e1",
                 "name": "Xamarin"
             },
             {
                 "_id": "56802eb31afe27f547b7ba52",
                 "name": "JS"
             },
             ...
         ],
         "year": [
             {
                 "_id": 2014,
                 "name": 2014
             },
             {
                 "_id": 2015,
                 "name": 2015
             },
             {
                 "_id": 2016,
                 "name": 2016
             }
         ],
         "month": [
             {
                 "_id": 7,
                 "name": 7
             },
             {
                 "_id": 6,
                 "name": 6
             },
             ...
         ],
         "week": [
             {
                 "_id": 30,
                 "name": 30
             },
             {
                 "_id": 27,
                 "name": 27
             },
             ...
         ],
         "_type": [
             {
                 "_id": "overtime",
                 "name": "overtime"
             },
             {
                 "_id": "ordinary",
                 "name": "ordinary"
             }
         ],
         "isPaid": [
             {
                 "_id": "true",
                 "name": "Paid"
             },
             {
                 "_id": "false",
                 "name": "Unpaid"
             }
         ]
     }
     *
     * */
    router.get('/wTrack', handler.getWtrackFilters);

    /**
     *@api {get} /filter/ExpensesInvoice Request filter for ExpensesInvoice
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForExpensesInvoice
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForExpensesInvoice
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "workflow": [
             {
                 "_id": "55647d982e4aa3804a765ecb",
                 "name": "Paid"
             },
             {}
         ],
         "supplier": [
             {
                 "_id": "572c750c7ae8db5b4e0b854a",
                 "name": "End User "
             },
             {
                 "name": null
             }
         ]
     }
     *
     * */
    router.get('/ExpensesInvoice', handler.getExpensesInvoiceFilters);
    router.get('/WriteOff', handler.getWriteOffFilters);

    /**
     *@api {get} /filter/DividendInvoice Request filter for DividendInvoice
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForDividendInvoice
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForDividendInvoice
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "workflow": [
             {
                 "_id": "55647d982e4aa3804a765ecb",
                 "name": "Paid"
             }
         ]
     }
     *
     * */
    router.get('/DividendInvoice', handler.getDividendInvoiceFilters);

    /**
     *@api {get} /filter/DashVacation Request filter for DashVacation
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForDashVacation
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForDashVacation
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "name": [
             {
                 "_id": "5773bff2c51130066a4f3837",
                 "name": "Ivan Chekan"
             },
             {
                 "_id": "57679cd51425f5f92098c732",
                 "name": "Yuriy Gonchar"
             },
             ...
         ],
         "department": [
             {
                 "_id": "55b92ace21e4b7c40f000012",
                 "name": ".NET/WP"
             },
             {
                 "_id": "560c0b83a5d4a2e20ba5068c",
                 "name": "Finance"
             },
             ...
         ],
         "salesManager": [
             {
                 "_id": "55e96ab13f3ae4fd0b000009",
                 "name": "Oles Pavliuk"
             },
             {
                 "_id": "56029cc950de7f4138000005",
                 "name": "Eugen Lendyel"
             },
             ...
         ],
         "projecttype": [
             {
                 "_id": ".net",
                 "name": ".net"
             },
             {
                 "_id": "qa",
                 "name": "qa"
             },
             ...
         ]
     }
     *
     *
     * */
    router.get('/DashVacation', handler.getDashVacationFilters);

    /**
     *@api {get} /filter/ExpensesPayments Request filter for ExpensesPayments
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForExpensesPayments
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForExpensesPayments
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "supplier": [
             {
                 "name": null
             }
         ],
         "paymentRef": [
             {
                 "_id": "",
                 "name": ""
             }
         ],
         "year": [
             {
                 "name": "None"
             }
         ],
         "month": [
             {
                 "name": "None"
             }
         ],
         "workflow": [
             {
                 "_id": "Paid",
                 "name": "Paid"
             }
         ]
     }
     *
     * */
    router.get('/ExpensesPayments', handler.getExpensesPaymentsFilters);

    /**
     *@api {get} /filter/DividendPayments Request filter for DividendPayments
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForDividendPayments
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForDividendPayments
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "supplier": [
             {
                 "name": null
             }
         ],
         "paymentRef": [
             {
                 "_id": "",
                 "name": ""
             }
         ],
         "year": [
             {
                 "name": "None"
             }
         ],
         "month": [
             {
                 "name": "None"
             }
         ],
         "workflow": [
             {
                 "_id": "Paid",
                 "name": "Paid"
             }
         ]
     }
     *
     * */
    router.get('/DividendPayments', handler.getDividendPaymentsFilters);

    /**
     *@api {get} /filter/PayrollExpenses Request filter for PayrollExpenses
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForPayrollExpenses
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForPayrollExpenses
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "year": [
             {
                 "_id": 2016,
                 "name": 2016
             },
             {
                 "_id": 2015,
                 "name": 2015
             },
             {
                 "_id": 2014,
                 "name": 2014
             }
         ],
         "month": [
             {
                 "_id": 7,
                 "name": 7
             },
             {
                 "_id": 6,
                 "name": 6
             },
             ...
         ],
         "employee": [
             "57625b9ae6b2b396201e0ded",
             "57613be1d2ebf06e2104e71b",
             ...
         ],
         "dataKey": [
             {
                 "_id": 201606,
                 "name": "06/2016"
             },
             {
                 "_id": 201504,
                 "name": "04/2015"
             },
             ...
         ],
         "type": [
             {}
         ]
     }
     *
     * */
    router.get('/PayrollExpenses', handler.getPayRollFilters);

    /**
     *@api {get} /filter/jobsDashboard Request filter for JobsDashboard
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForJobsDashboard
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForJobsDashboard
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "type": [
             {
                 "_id": "Ordered",
                 "name": "Ordered"
             },
             {
                 "_id": "Not Ordered",
                 "name": "Not Ordered"
             },
             ...

         ],
         "workflow": [
             {
                 "_id": "56337c705d49d8d6537832eb",
                 "name": "In Progress"
             },
             {
                 "_id": "56337c675d49d8d6537832ea",
                 "name": "Finished"
             }
         ],
         "project": [
             {
                 "_id": "577509417134263421caa2cc",
                 "name": "BlackJack Surrender"
             },
             {
                 "_id": "576d33c7d742b37b20468e59",
                 "name": "Race"
             },
             ...
         ],
         "salesManager": [
             {
                 "_id": "56e2e83a74ac46664a83e94b",
                 "name": "Yevgenia Melnyk"
             },
             {
                 "_id": "56029cc950de7f4138000005",
                 "name": "Eugen Lendyel"
             },
             ...
         ],
         "paymentsCount": [
             {
                 "_id": 3,
                 "name": 3
             },
             {
                 "_id": 4,
                 "name": 4
             },
             ...
         ]
     }
     *
     * */
    router.get('/jobsDashboard', handler.getDashJobsFilters);

    /**
     *@api {get} /filter/journalEntry Request filter for JournalEntry
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForJournalEntry
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForJournalEntry
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "journalName": [
             {
                 "_id": "Close month / Admin expenses",
                 "name": "Close month / Admin expenses"
             },
             {
                 "_id": "Finished Goods",
                 "name": "Finished Goods"
             },
             {
                 "_id": "COGS",
                 "name": "COGS"
             },
             {
                 "_id": "Dividend Invoice Journal",
                 "name": "Dividend Invoice Journal"
             },
             {
                 "_id": "Dividend Invoice Payment",
                 "name": "Dividend Invoice Payment"
             },
             ...
         ],
         "sourceDocument": [
             {
                 "name": null
             },
             {
                 "_id": "57613be1d2ebf06e2104e71b",
                 "name": "Nikoletta Chukhran"
             },
             ...
         ],
         "creditAccount": [
             {
                 "_id": "565eb53a6aa50532e5df0bf1",
                 "name": "220000 Admin Expenses"
             },
             {
                 "_id": "565eb53a6aa50532e5df0bed",
                 "name": "212800 Admin Salary Expenses"
             },
             ...
         ]
     }
     *
     * */
    router.get('/journalEntry', handler.getJournalEntryFilters);

    /**
     *@api {get} /filter/inventoryReport Request filter for InventoryReport
     *
     * @apiVersion 0.0.1
     * @apiName getFilterForInventoryReport
     * @apiGroup Filter
     *
     * @apiSuccess {Object} FilterForInventoryReport
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": null,
         "project": [
             {
                 "_id": "571a079eb629a41976c9ac96",
                 "name": "3D Bolus (Windows)"
             },
             {
                 "_id": "56a89384eb2b76c70ec74d1e",
                 "name": "Locappy"
             },
             ...
         ],
         "type": [
             {},
             {
                 "_id": "web",
                 "name": "web"
             },
             {
                 "_id": "qa",
                 "name": "qa"
             },
             ...
         ],
         "salesManager": [
             {
                 "_id": "56e2e83a74ac46664a83e94b",
                 "name": "Yevgenia Melnyk"
             },
             {
                 "_id": "55e96ab13f3ae4fd0b000009",
                 "name": "Oles Pavliuk"
             },
             ...
         ]
     }
     *
     * */
    router.get('/inventoryReport', handler.getInventoryReportFilters);

    router.get('/goodsOutNotes', handler.getGoodsOutNotesFilters);

    router.get('/stockTransactions', handler.getStockTransactionsFilters);

    router.get('/stockInventory', handler.getProductsAvailabilityFilters);

    router.get('/ChartOfAccount', handler.getChartOfAccountFilters);

    router.get('/billOfMaterials',handler.getBillOfMaterialsFilters);

    return router;
};
