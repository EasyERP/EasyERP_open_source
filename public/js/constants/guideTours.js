'use strict';

(function () {
        var root;

        var GUIDES = {

            Inventory: [
                {
                    id     : 'createProduct',
                    display: 'Create Product',
                    steps  : [{
                        title         : 'Inventory',
                        message       : 'You can access the Inventory section from the main menu. From here you can create and manage all of your products. Clear, then press Next button to go to Products.',
                        selector      : 'i.icon-Inventory',
                        url           : '#easyErp/reportsDashboard',
                        isDefault     : 1,
                        hidePrevButton: true,
                        step          : 0
                    }, {
                        title   : 'Creating A Product & Variant',
                        message : 'Click on "New" button to open create dialog.',
                        url     : '#easyErp/Products',
                        selector: '#top-bar-createBtn',
                        step    : 1
                    }, {
                        step  : 2,
                        button: '#top-bar-createBtn'

                    }]
                },

                {
                    id     : 'createVariants',
                    display: 'Create Variants',
                    steps  : [
                        {
                            title         : 'Inventory',
                            message       : 'Go to Inventory -> Products',
                            selector      : 'i.icon-Inventory',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Inventory',
                            message : 'Click on the item of products',
                            selector: '#listTable > tr:first',
                            url     : '#easyErp/Products/list',
                            step    : 1,
                            error   : {
                                title  : 'Error!',
                                message: 'It seems like you have no correct Product. Please, create it, you also can path the guide to learn how it goes.'
                            }
                        },
                        {
                            button: '#listTable > tr> td.variantGuideTours:first',
                            step  : 2
                        },
                        {
                            title   : 'Inventory',
                            message : 'Click on the "Create Variant"',
                            selector: 'ul.dialog-tabs > li > a#createVariant',
                            step    : 3,
                            error   : {
                                title  : 'Error!',
                                message: 'It seems like you have no correct Product. Please, create it, you also can path the guide to learn how it goes.'
                            }
                        },
                        {
                            button: 'ul.dialog-tabs > li > a#createVariant',
                            step  : 4
                        },
                        {
                            title   : 'Inventory',
                            message : 'Select all the options you want and click "Create Variants" ',
                            selector: '.editPanel:first',
                            step    : 5,
                            isEnd   : true
                        }
                    ]

                },

                {
                    id     : 'checkInventoryLevel',
                    display: 'Check Inventory level',
                    steps  : [
                        {
                            title         : 'Inventory',
                            message       : 'Go to Stock Detail',
                            selector      : 'i.icon-Inventory',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'CRM',
                            message : 'You can see Stock Detail',
                            selector: 'table.stripedList',
                            url     : '#easyErp/stockInventory/list',
                            step    : 1,
                            isEnd   : true
                        }
                    ]
                }
            ],

            Accounting: [

                {
                    id     : 'checkBalanceSheet',
                    display: 'Check Balance sheet',
                    steps  : [
                        {
                            title         : 'Accounting',
                            message       : 'Go to Accounting',
                            selector      : 'i.icon-Accounting',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Accounting',
                            message : 'Check Your Balance sheet',
                            selector: 'div._totalBalanceTableWrap:last',
                            url     : '#easyErp/balanceSheet/list',
                            step    : 1,
                            onTop   : 1,
                            isEnd   : true
                        }
                    ]
                },

                {
                    id     : 'checkProfitAndLoss',
                    display: 'Check Profit and Loss',
                    steps  : [
                        {
                            title         : 'Accounting',
                            message       : 'Go to Accounting',
                            selector      : 'i.icon-Accounting',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Accounting',
                            message : 'You can see your profit and loss',
                            selector: 'div._profitTableWrap:first',
                            url     : '#easyErp/profitAndLoss/list',
                            step    : 1,
                            isEnd   : true
                        }
                    ]
                },

                {
                    id     : 'cashFlow',
                    display: 'Check Cash Flow',
                    steps  : [
                        {
                            title         : 'Accounting',
                            message       : 'Go to Accounting',
                            selector      : 'i.icon-Accounting',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Accounting',
                            message : 'You can see your cash  flow',
                            url     : '#easyErp/cashFlow/list',
                            step    : 1,
                            onTop   : 1,
                            selector: '#totalCashFlow',
                            isEnd   : true
                        }
                    ]
                },

                {
                    id     : 'checkSalesInvoiceAging',
                    display: 'Check Sales Invoice aging',
                    steps  : [
                        {
                            title         : 'CRM',
                            message       : 'Go to Invoice Aging',
                            selector      : 'i.icon-Sales',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'CRM',
                            message : 'You can see Invoice Aging',
                            selector: '#listTable > tr:first',
                            url     : '#easyErp/invoiceAging/list',
                            step    : 1,
                            isEnd   : true
                        }
                    ]
                }
            ],

            Sales: [

                {
                    id     : 'createOrder',
                    display: 'Create Sales Order',
                    steps  : [{
                        title         : 'CRM',
                        message       : 'You can access the CRM section from the main menu. Clear, then press Next button to go to Orders.',
                        selector      : 'i.icon-Sales',
                        url           : '#easyErp/reportsDashboard',
                        step          : 0,
                        hidePrevButton: true,
                        isDefault     : 1
                    }, {
                        title   : 'Creating Orders',
                        message : 'Click on "New" button to open create dialog.',
                        url     : '#easyErp/order',
                        selector: '#top-bar-createBtn',
                        step    : 1,
                        isEnd   : true
                    }, {
                        step  : 2,
                        button: '#top-bar-createBtn'
                    }]
                },

                {
                    id     : 'deliverInventory',
                    display: 'Make delivery from Sales Order',
                    steps  : [
                        {
                            step          : 0,
                            title         : 'CRM Deliver Inventory',
                            message       : 'Go to Orders.',
                            selector      : 'i.icon-Sales',
                            url           : '#easyErp/reportsDashboard',
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            step    : 1,
                            title   : 'CRM Deliver Inventory',
                            message : 'Go to Orders.',
                            selector: '#listTable>tr>td>span.red._shipped:first',
                            url     : '#easyErp/order/list',
                            error   : {
                                title  : 'Error!',
                                message: 'It seems like you have no correct Order. Please, create it, you also can path the guide to learn how it goes.'
                            }
                        },
                        {
                            button: '#listTable>tr>td>span.red._shipped:first',
                            step  : 2
                        },
                        {
                            title   : 'CRM',
                            message : 'Go to edit to receive Inventory.',
                            selector: 'span.icon-pencil2',
                            step    : 3
                        },
                        {
                            button      : 'span.icon-pencil2',
                            step        : 4,
                            cancelButton: 'span.closeBtn'
                        },
                        {
                            title   : 'CRM',
                            message : 'Click on the  "Order Actions", choose Order Action',
                            selector: 'a.btn.slim.fullfillOrder:first',
                            step    : 5,
                            isEnd   : true
                        },
                        {
                            button      : 'a.btn.slim.fullfillOrder:first',
                            step        : 6,
                            cancelButton: 'span.closeBtn'
                        }
                    ]
                },

                {
                    id     : 'createCRMPayment',
                    display: 'Get payment for Sales Order',
                    steps  : [
                        {
                            title         : 'CRM Payment',
                            message       : 'If you want create payment? go to CRM -> Order',
                            selector      : 'i.icon-Sales',
                            url           : '#easyErp/dashboards',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            step    : 1,
                            title   : 'Find your Order',
                            url     : '#easyErp/order/list',
                            message : 'Let\'s open previously created order and modify it to Invoice.',
                            selector: '#listTable > tr> td.status_Order:not(:contains("Invoiced")):first',
                            error   : {
                                title  : 'Error!',
                                message: 'It seems like you have no correct Order. Please, create it, you also can path the guide to learn how it goes.'
                            }
                        }, {
                            step        : 2,
                            button      : '#listTable > tr> td.status_Order:not(:contains("Invoiced")):first',
                            cancelButton: 'span.closeBtn'
                        }, {
                            step    : 3,
                            selector: 'ul._btnsBlockFixed> li.fullfillOrderWrap >a.fullfillOrder',
                            title   : 'Payments options',
                            message : 'Choose create payment'
                        }, {
                            step        : 4,
                            button      : 'li.prepay',
                            cancelButton: 'span.closeBtn'
                        }, {
                            step          : 5,
                            selector      : '#paymentMethod',
                            title         : 'Creating',
                            message       : 'Select smth & click Create button.',
                            hidePrevButton: true
                        }
                    ]
                },

                {
                    id     : 'receiveCRMInvoice',
                    display: 'Receive Invoice from CRM Order',
                    steps  : [
                        {
                            title         : 'CRM',
                            message       : 'Go to Orders',
                            selector      : 'i.icon-Sales',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'CRM',
                            message : 'Click on the Order',
                            selector: '#listTable > tr> td.status_Order:not(:contains("Invoiced")):first',
                            url     : '#easyErp/order/list',
                            step    : 1,
                            error   : {
                                title  : 'Error!',
                                message: 'It seems like you have no correct Order. Please, create it, you also can path the guide to learn how it goes.'
                            }
                        },
                        {
                            button      : '#listTable > tr> td.status_Order:not(:contains("Invoiced")):first',
                            step        : 2,
                            cancelButton: 'span.closeBtn'
                        },
                        {
                            title   : 'CRM',
                            message : 'Go to edit to receive invoice.',
                            selector: '.editButton',
                            step    : 3
                        },
                        {
                            button      : '.editButton',
                            step        : 4,
                            cancelButton: 'span.closeBtn'
                        },
                        {
                            title   : 'CRM',
                            message : 'Success!',
                            selector: '.receiveInvoice',
                            step    : 5,
                            isEnd   : true
                        }
                    ]
                },

                {
                    id     : 'createPerson',
                    display: 'Create Person',
                    steps  : [
                        {
                            title         : 'CRM',
                            message       : 'Go to Persons',
                            selector      : 'i.icon-Sales',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'CRM',
                            message : 'Click on the "New" button',
                            selector: '#top-bar-createBtn',
                            url     : '#easyErp/Persons/list',
                            step    : 1
                        },
                        {
                            button: '#top-bar-createBtn',
                            step  : 2
                        },
                        {
                            title   : 'CRM',
                            message : 'Enter all information and click "Create"',
                            selector: '#create-person-dialog',
                            step    : 3,
                            isEnd   : true
                        }
                    ]
                },

                {
                    id     : 'createCompanies',
                    display: 'Create Companies',
                    steps  : [
                        {
                            title         : 'CRM',
                            message       : 'Go to Companies',
                            selector      : 'i.icon-Sales',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'CRM',
                            message : 'Click on the "New" button',
                            selector: '#createBtnHolder > #top-bar-createBtn',
                            url     : '#easyErp/Companies/list',
                            step    : 1
                        },
                        {
                            button: '#top-bar-createBtn',
                            step  : 2
                        },
                        {
                            title   : 'CRM',
                            message : 'Enter all information and click "Create"',
                            selector: 'span.ui-button-text:contains("Create")',
                            step    : 3,
                            isEnd   : true
                        }
                    ]
                }
            ],

            Purchase: [

                {
                    id     : 'createPurchaseOrder',
                    display: 'Create Purchase Order',
                    steps  : [{
                        title         : 'CRM',
                        message       : 'You can access the Purchase section from the main menu. Clear, then press Next button to go to Orders.',
                        selector      : 'i.icon-Purchases',
                        url           : '#easyErp/reportsDashboard',
                        step          : 0,
                        hidePrevButton: true,
                        isDefault     : 1
                    }, {
                        title   : 'Creating Purchase Orders',
                        message : 'Click on "New" button to open create dialog.',
                        url     : '#easyErp/purchaseOrders/list',
                        selector: '#top-bar-createBtn',
                        step    : 1,
                        isEnd   : true
                    }, {
                        step  : 2,
                        button: '#top-bar-createBtn'
                    }]
                },

                {
                    id     : 'receiveInventory',
                    display: 'Receive Inventory from Purchase Order',
                    steps  : [{
                        title         : 'Opening An Order List',
                        message       : 'To create invoice first you must have an order, so let\'s create it. Go to Orders.',
                        selector      : 'i.icon-Purchases',
                        url           : '#easyErp/reportsDashboard',
                        step          : 0,
                        hidePrevButton: true,
                        isDefault     : 1
                    }, {
                        step    : 1,
                        title   : 'Find your Order',
                        url     : '#easyErp/purchaseOrders/list',
                        message : 'Let\'s open previously created order and modify it to Invoice.',
                        selector: '#listTable>tr>td>span.red:first',
                        error   : {
                            title  : 'Error!',
                            message: 'It seems like you have no correct Order. Please, create it, you also can path the guide to learn how it goes.'
                        }
                    }, {
                        step  : 2,
                        button: '#listTable>tr>td>span.red:first'
                    }, {
                        title   : 'Edit Order',
                        message : 'Go to edit to receive inventory.',
                        selector: '#editButton',
                        step    : 3
                    }, {
                        step  : 4,
                        button: '#editButton'
                    }, {
                        title   : 'Create a goods-in note',
                        message : 'Create a goods-in note and take products to warehouse. ',
                        selector: 'span.fullfillOrder:first',
                        step    : 5
                    }, {
                        step  : 6,
                        button: 'a.receiveInventory'
                    }, {
                        title   : 'Receive Inventory',
                        message : 'Congratulations, you was create invoice successfully. Press End button to finish.',
                        selector: '#goodsInNotesSaveBtn',
                        step    : 7,
                        isEnd   : true
                    }, {
                        step  : 8,
                        button: '#goodsInNotesSaveBtn'
                    }]
                },
                {
                    id     : 'createPayments',
                    display: 'Create Purchase Payment',
                    steps  : [{
                        step          : 0,
                        title         : 'Opening An Order List',
                        message       : 'To create invoice first you must have an order, so let\'s create it. Go to Orders.',
                        selector      : 'i.icon-Purchases',
                        url           : '#easyErp/reportsDashboard',
                        hidePrevButton: true,
                        isDefault     : 1
                    }, {
                        step    : 1,
                        title   : 'Find your Order',
                        url     : '#easyErp/purchaseOrders/list',
                        message : 'Let\'s open previously created order and modify it to Invoice.',
                        selector: '#listTable > tr> td:nth-child(5):not(:contains("Invoiced received")):first',
                        error   : {
                            title  : 'Error!',
                            message: 'It seems like you have no correct Order. Please, create it, you also can path the guide to learn how it goes.'
                        }
                    }, {
                        step  : 2,
                        button: '#listTable > tr> td:nth-child(5):not(:contains("Invoiced received")):first'
                    }, {
                        step    : 3,
                        selector: 'ul._btnsBlockFixed> li.fullfillOrderWrap >a.fullfillOrder',
                        title   : 'Payments options',
                        message : 'Choose create payment'
                    }, {
                        step  : 4,
                        button: 'li.activeItem> a.prepay'
                    }, {
                        step          : 5,
                        selector      : '#paymentMethod',
                        title         : 'Creating',
                        message       : 'Select smth & click Create button.',
                        hidePrevButton: true
                    }]
                },

                {
                    id     : 'createInvoice',
                    display: 'Receive Purchase Invoice',
                    steps  : [{
                        title         : 'Opening An Order List',
                        message       : 'To create invoice first you must have an order, so let\'s create it. Go to Orders.',
                        selector      : 'i.icon-Purchases',
                        url           : '#easyErp/reportsDashboard',
                        hidePrevButton: true,
                        step          : 0,
                        isDefault     : 1
                    }, {
                        step    : 1,
                        title   : 'Find your Order',
                        url     : '#easyErp/purchaseOrders/list',
                        message : 'Let\'s open previously created order and modify it to Invoice.',
                        error   : {
                            title  : 'Error!',
                            message: 'It seems like you have no correct Order. Please, create it, you also can path the guide to learn how it goes.'
                        },
                        selector: '#listTable > tr> td:nth-child(5):not(:contains("Invoiced received")):first'
                    }, {
                        step  : 2,
                        button: '#listTable > tr> td:nth-child(5):not(:contains("Invoiced received")):first'
                    }, {
                        title   : 'Receive Invoice',
                        message : 'Go to edit to receive invoice.',
                        selector: '.editButton',
                        step    : 3
                    }, {
                        step  : 4,
                        button: '.editButton'
                    }, {
                        title   : 'Invoice received',
                        message : 'Congratulations, you was create invoice successfully. Press End button to finish.',
                        selector: '.receiveInvoice',
                        step    : 5,
                        isEnd   : true
                    }, {
                        step  : 6,
                        button: 'button.ui-button-text'
                    }]
                }
            ],

            Integration: [
                {
                    id     : 'createChannel',
                    display: 'Create Channel for synch',
                    steps  : [
                        {
                            title         : 'Integrations',
                            message       : 'To create a new channel, go to "Integrations"',
                            selector      : 'i.icon-integrations',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Create new Channel',
                            message : 'To add a new channel, click on the “Add Channel” button.',
                            selector: 'span.actionAddNew',
                            url     : '#easyErp/integrations',
                            step    : 1
                        },
                        {
                            button      : 'span.actionAddNew',
                            cancelButton: '#cancelBtn',
                            step        : 2
                        },
                        {
                            title   : 'App type',
                            message : 'Choose a channel type, and enter name of your channel',
                            selector: 'div._newForm',
                            step    : 3,
                            isEnd   : true
                        }
                    ]
                },
            ],

            HR: [
                {
                    id     : 'createEmployees',
                    display: 'Create Employees',
                    steps  : [
                        {
                            title         : 'HR',
                            message       : 'To create a new employee, go to "HR"',
                            selector      : 'i.icon-HR',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Create new Employee',
                            message : 'To add a new employee, click on the “New” button.',
                            selector: '#top-bar-createBtn',
                            url     : '#easyErp/Employees/list',
                            step    : 1
                        },
                        {
                            button      : '#top-bar-createBtn',
                            cancelButton: 'button:contains("Cancel")',
                            step        : 2
                        },
                        {
                            title   : 'Information about Employee',
                            message : 'Enter information about employee, and click on the “Create” button',
                            selector: 'button:contains("Create")',
                            step    : 3,
                            isEnd   : true
                        }
                    ]
                },
                {
                    id     : 'birthdays',
                    display: 'Get Birthdays',
                    steps  : [
                        {
                            title         : 'HR',
                            message       : 'If you want to see birthdays, go to "HR"',
                            selector      : 'i.icon-HR',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Birthdays',
                            message : 'You can view the birthdays of your employees  in current week, next week and current month',
                            selector: '#birthdaysList',
                            url     : '#easyErp/Birthdays/list',
                            step    : 1,
                            isEnd   : true
                        }
                    ]
                },
                {
                    id     : 'createApplications',
                    display: 'Create Application',
                    steps  : [
                        {
                            title         : 'HR',
                            message       : 'To create a new application, go to "HR"',
                            selector      : 'i.icon-HR',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Create new Application',
                            message : 'To add a new application, click on the “New” button.',
                            selector: '#top-bar-createBtn',
                            url     : '#easyErp/Applications/list',
                            step    : 1
                        },
                        {
                            button      : '#top-bar-createBtn',
                            cancelButton: 'button:contains("Cancel")',
                            step        : 2
                        },
                        {
                            title   : 'Information about Application',
                            message : 'Enter information about application, and click on the “Create” button',
                            selector: 'button:contains("Create")',
                            step    : 3,
                            isEnd   : true
                        }
                    ]
                },
                {
                    id     : 'createJobPosition',
                    display: 'Create Job Position',
                    steps  : [
                        {
                            title         : 'HR',
                            message       : 'To create a new Job Position, go to "HR"',
                            selector      : 'i.icon-HR',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Create new Job Position',
                            message : 'To add a new Job Position, click on the “New” button.',
                            selector: '#top-bar-createBtn',
                            url     : '#easyErp/JobPositions/list',
                            step    : 1
                        },
                        {
                            button      : '#top-bar-createBtn',
                            cancelButton: 'button:contains("Cancel")',
                            step        : 2
                        },
                        {
                            title   : 'Information about Job Position',
                            message : 'Enter information about Job Position, and click on the “Create” button',
                            selector: 'button:contains("Create")',
                            step    : 3,
                            isEnd   : true
                        }
                    ]
                },
                {
                    id     : 'createNewVacation',
                    display: 'Create Vacation',
                    steps  : [
                        {
                            title         : 'HR',
                            message       : 'To create a new Job Position, go to "HR"',
                            selector      : 'i.icon-HR',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Create new Vacation',
                            message : 'To add a new Vacation, click on the “New” button.',
                            selector: '#top-bar-createBtn',
                            url     : '#easyErp/Vacation/list',
                            step    : 1
                        },
                        {
                            button: '#top-bar-createBtn',
                            step  : 2
                        },
                        {
                            title   : 'Information about Vacation',
                            message : 'Select an employee for a vacation, then click on the vacation date and choose a vacation type',
                            selector: 'td.editable:first',
                            step    : 3,
                            isEnd   : true
                        }
                    ]
                },
                {
                    id     : 'showAttendance',
                    display: 'Get Attendance',
                    steps  : [
                        {
                            title         : 'HR',
                            message       : 'To view Attendance, go to "HR"',
                            selector      : 'i.icon-HR',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Attendance',
                            message : 'You can see Attendance every employee, just select an Employee',
                            selector: 'div.pull-left',
                            url     : '#easyErp/Attendance',
                            step    : 1,
                            isEnd   : true
                        }
                    ]
                },
                {
                    id     : 'HRStatistic',
                    display: 'HR Statistic',
                    steps  : [
                        {
                            title         : 'HR',
                            message       : 'To see a HR Statistic, go to "HR"',
                            selector      : 'i.icon-HR',
                            url           : '#easyErp/reportsDashboard',
                            step          : 0,
                            hidePrevButton: true,
                            isDefault     : 1
                        },
                        {
                            title   : 'Statistic',
                            message : 'You can see different HR statistic',
                            selector: 'ul.dashboard> li:first',
                            url     : '#easyErp/HrDashboard',
                            step    : 1,
                            isEnd   : true
                        }
                    ]
                }
            ]

        };

        if (typeof window === 'object' && this === window) {
            root = window;
        } else if (typeof global === 'object' && this === global) {
            root = global;
        } else {
            root = this;
        }

        if (typeof exports !== 'undefined') {
            if (typeof module !== 'undefined' && module.exports) {
                module.exports = GUIDES;
            }
        } else if (typeof define !== 'undefined' && define.amd) {
            define([], function () {
                return GUIDES;
            });
        } else {
            root.GUIDES = GUIDES;
        }
    }()
);
