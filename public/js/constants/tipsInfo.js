'use strict';

(function () {
    var root;

    var TIPS = {
        Leads: {
            name               : 'Add any description that helps you easily understand Lead idea',
            sourceDd           : 'Add the source where you have contacted this Lead first time',
            salesPerson        : 'Select who is responsible for the communication with Lead at the moment',
            workflowsDd        : 'Track the current stage of work with Lead',
            priorityDd         : 'Prioritize all your Leads to manage your business more effectively',
            expectedClosingDate: 'Set deadlines when you would like to convert Lead into an Opportunity'
        },

        Opportunities: {
            name                : 'Add any description that helps you easily understand Opportunity idea',
            expectedRevenueValue: 'Enter the possible revenue that you can get in case of winning this deal',
            customerDd          : 'Assign the customer contact related to this opportunity',
            companyDd           : 'Assign the company related to this opportunity',
            salesPersonDd       : 'Select who is responsible for this Opportunity at the moment',
            workflowDd          : 'Track the current stage of this Opportunity',
            expectedClosing     : 'Set the date when you expect close the deal'
        },

        Persons: {
            isCustomer   : 'Check this checkbox if you provide any services or sell any products to this customer',
            isSupplier   : 'Check this checkbox if this customer supplies any products or services to you',
            departmentDd : 'Select department related to this customer',
            employeesDd  : 'Assign the Salesperson who sold the products or services to this customer',
            implementedBy: '',
            reference    : ''
        },

        Companies: {
            isCustomer   : 'Check this checkbox if you provide any services or sell any products to this customer',
            isSupplier   : 'Check this checkbox if this customer supplies any products or services to you',
            departmentDd : 'Select department related to this customer',
            employeesDd  : 'Assign the Salesperson who sold the products or services to this customer',
            implementedBy: '',
            reference    : ''
        },

        order: {
            workflowsDd         : 'Set the current status for this order',
            customerDd          : 'Set the customer whom this order will be sent to',
            paymentMethod       : 'Select the bank account that will recieve the payment for this order',
            orderDate           : 'Select the order date. Please pay attention that it is impossible to set future date',
            expectDate          : 'Set the deadline when this order should be paid by your customer',
            priceList           : 'Select the appropriate price list for this order.',
            warehouseDd         : 'Select the warehouse from which you are going to add products to this order',
            currencyDd          : 'Set the currency for this order. Please note that this currency will be used later for generating Invoice',
            assignedTo          : 'Assign the person who will be responsible for this order',
            selectShippingMethod: 'Select the shipping method that will be using  to ship this order',
            resetPrices         : 'Click this button if you have changed price list to apply prices from new price list',
            receiveInvoice      : 'Click this button to generate the invoice for this order. Then you can send it to your customer to be paid.',
            allocateAll         : 'Click this button if you would like to allocate the items in this order and don\'t allow them be sold from another orders',
            unallocateAll       : 'Click this button to unallocate the allocaed itmes in this order and allow them to be sold from aniother orders'
        },

        Tasks: {
            categoryHolder: 'Assign the category that will help you to recognize the task',
            selectWorkflow: 'Setting current stage helps you track up-to-date status of the task',
            dueDate       : 'Set deadlines for the task to force effots',
            assignedToDd  : 'Assign the person who will be responsible for task progress',
            warehouseDd   : 'Select the warehouse where you would like to correct the stock',
            locationDd    : 'Select the location in warehouse where you would like to correct the stock'

        },

        JobPositions: {
            name               : 'Enter name for job position that will be used in your organization',
            departmentDd       : 'Select the department related to this job position',
            expectedRecruitment: 'Set the number of employees that you are going to hire in future',
            workflowsDd        : 'Select the appropriate recruitment stage this position at the moment'
        },

        purchaseOrders: {
            workflowsDd  : 'Set the current status for this order',
            customerDd   : 'Set the person who will supply the product(s) to you',
            paymentMethod: 'Select the bank account that will recieve the payment for this order',
            orderDate    : 'Select the order date. Please pay attention that it is impossible to set future date',
            expectDate   : 'Set the deadline when this order should be paid by your customer',
            priceList    : 'Select the appropriate price list for this order',
            warehouseDd  : 'Select the warehouse from which you are going to add products to this order',
            currencyDd   : 'Set the currency for this order. Please note that this currency will be used later for generating Invoice',
            assignedTo   : 'Assign the person who will be responsible for this order'
        },

        manualEntry: {
            debitAccountDd : 'Select the account that you use for Debit',
            creditAccountDd: 'Select the account that you use for Credit'
        },

        journal: {
            nameInput: 'Enter the name for your journal',
            typeDd   : 'Select the type of transaction that will be used for this account',
            debitDd  : 'Assign Debit Account for this journal',
            creditDd : 'Assign Credit Account for this journal'
        },

        cashTransfer: {
            debitAccount : 'Select the account of type Assets / Current Assets / Bank and Cash  from Chart of Accounts for sending',
            creditAccount: 'Select the account of type Assets / Current Assets / Bank and Cash  from Chart of Accounts for receiving'
        },

        Products: {
            product                : 'This product name will be shown for end users on your storefront',
            sold                   : 'Check this checkbox if you resell this product in future',
            expensed               : '',
            purchased              : 'Check this checkbox if you buy this product only for internal use and not for reselling',
            productType            : 'Select the type for this product. Only one type is allowed',
            variantsCategoriesBlock: 'Assign the categories for this product. One or more categories are allowed',
            SKU                    : 'SKU - Stock Keeping Unit - is a distinct type of item for sale and all attributes assosiated with the item type that distinguish it from other item types',
            UPC                    : 'UPC - Universal Product Code - is a barcode symbology that is widely used for tracking trade items in stores',
            ISBN                   : 'ISBN - International Standard Book Number -',
            EAN                    : 'EAN - European Article Number - is standard describing a barcode symbology used to indentify a specific retail product type',
            mainMinStockLevel      : 'If the number of items in stock is less than this value then you have to pay attention to it'
        },

        stockTransactions: {
            warehouseFrom: 'Select the warehouse where you will transfer products from',
            warehouseTo  : 'Select the warehouse where you will transfer products to'
        },

        Invoices: {
            supplier            : 'Select the person who supplies the products or services to you',
            supplier_invoice_num: 'Enter the Invoice number you have paid for this expense'
        },

        organizationSettings: {
            name     : 'This name will be shown on all documents in EasyERP',
            industry : 'Select the industry for your company',
            currency : 'This base currency will be used for accounting',
            startDate: 'You can set start date only 1 time and this value cannot be changed. Usually this is the date when company has founded.'
        },

        currency: {
            allCurrencies : '3 characters used in International Currency standard. For example, USD, EUR, JPY',
            currencySymbol: 'Currency symbol, if exists. For example, $, €, ¥',
            decPlaces     : 'The number of decimals that will be used in EasyERP',
            active        : 'Check this checkbox is you want to show this currency in EasyERP'
        },

        rates: {
            date: 'For this date will be loaded currency rates'
        },

        paymentMethod: {
            paymentMethodName: 'The full name of bank',
            account          : 'IBAN - International Bank Account Number that helps proceed international payments',
            chartAccount     : 'Select chart of account for this Bank Account',
            currency         : 'Currency that will be used for this bank account',
            bankName         : 'Then shortened bank name',
            address          : 'Location of bank',
            owner            : 'Person who owns this bank account',
            swiftCode        : 'SWIFT (Society for Worldwide Interbank Financial Telecommunication) code is unique identification code for a particular bank'
        },

        taxes: {
            code   : '3 symbols code for this Tax',
            name   : 'Full name for this Tax',
            rate   : 'Rate for this Tax in percents',
            country: 'Country what this Tax will be applied to'
        },

        warehouse: {
            name : 'The name that will be clear for all persons who work with it',
            isOwn: 'Check this checkbox if you own this warehouse',
            main : 'Check this checkbox to use this warehouse as main one'
        },

        priceList: {
            priceListName: 'This name will be shown in EasyERP documents',
            priceListCode: 'This price list code will not be shown in EasyERP documents',
            yes          : 'Check this checkbox to apply this price list for purchase orders',
            no           : 'Check this checkbox to apply this price list for sales orders'
        },

        shippingMethods: {
            name   : 'This shipping name will be shown in EasyERP documents',
            code   : 'Code for this shipping method',
            account: 'Type of account for this shipping method',
            price  : 'Price that user should pay using this shipping method'
        },

        integrations: {
            channelName   : 'This channel name will be shown in EasyERP',
            apishop       : 'Shop name as it is shown on ETSY platform',
            apiuser       : 'API keystring used for connection app on ETSY with EasyERP',
            apipassword   : 'API shared secret string for connection app on ETSY with EasyERP',
            warehouse     : 'Warehouse that will be used for synchronizing the products between EasyERP and this ETSY store',
            location      : 'Location from warehouse that will be used for synchronization with ETSY',
            priceList     : 'Price list that will be used for this integration',
            bankAccount   : 'Bank account that wil be used for all payments linked to this ecommerce channel.',
            shippingStatus: 'Check this checkbox if you want to update the shipping status from EasyERP to ETSY',
            shippingMethod: 'Check this checkbox if you wan to update shipping method from EasyERP to ETSY'
        },

        invoiceEmail: {
            To: 'Enter email you would like to send this invoice to.',
            Cc: 'CC stands for Carbon Copy. Add persons you would like to inform about the content in email.'
        },

        Profiles: {
            profileName       : 'This profile name will be shown in EasyERP.',
            profileDescription: 'Short description for this profile.',
            profilesDd        : 'Settings from this base profile will be applied to this new profile if you check "Use base profile and edit privileges" below',
            baseProfile       : 'Check this checkbox if you would like create new Access Profile by using other already created one editing previleges.',
            newProfile        : 'Check this checkbox if you would like to create absolutely new Access Profile'
        },

        Users: {
            login          : 'This username will be used to log in.',
            confirmpassword: 'Enter password for this system user. This password will be send to the email entered below.',
            password       : 'Confirm password entered above.',
            email          : 'To this email will be send the login and password for new system user.',
            profilesDd     : 'Select the access profile you would like to give this system user.'
        },

        Departments: {
            departmentName   : 'This department name will be used and shown in EasyERP.',
            departmentManager: 'Select the person who manages this Department',
            parentDepartment : 'Select parent department if it exists',
            isDevelopment    : 'Check this checkbox if you would like to track time for this department in Project\'s time card'
        }
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
            module.exports = TIPS;
        }
    } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return TIPS;
        });
    } else {
        root.TIPS = TIPS;
    }
}());
