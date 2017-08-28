'use strict';

(function () {
    var root;

    var GA = {
        TRACKING_ID: 'UA-90566029-3',

        EVENT_CATEGORIES: {
            USER_ACTION: 'User Action'
        },

        EVENT_ACTIONS: {
            CREATE_REPORT_TABS: 'Create Reports Tabs',
            REPORT_BY         : 'Create Report By',
            MAIN_VIEW         : 'Main View',
            TOP_BAR           : 'Top Bar',
            CHARTS_VIEW       : 'CRM Dashboard',
            LEADS             : 'Leads',
            OPPORTUNITIES     : 'Opportunities',
            PERSONS           : 'Persons',
            COMPANIES         : 'Companies',
            ORDER             : 'Order',
            INVOICE           : 'Invoice',
            DEAL_TASKS        : 'Tasks',
            EMPLOYEES         : 'Employees'
        },

        EVENT_LABEL: {
            PROFILE_ICON                 : 'Profile Icon',
            OPEN_PROFILE                 : 'My Profile',
            LOG_OUT                      : 'Log Out',
            INTEGRATIONS                 : 'Integrations',
            MOVE_TO_EDIT                 : 'Edit Top Bar Button',
            CREATE_BTN                   : 'Create Top Bar Button',
            CREATE_STATUS_BTN            : 'New Button',
            CREATE_WAREHOUSE             : 'Create Warehouse',
            CREATE_SHIPPING_METHOD       : 'Create Shipping Method',
            CREATE_PRODUCT_TYPES         : 'Create Product Types Button',
            CREATE_PRODUCT_OPTIONS       : 'Create Product Options Button',
            CREATE_PRODUCT_CATEGORIES    : 'Create Product Categories Button',
            CREATE_PRICE_LISTS           : 'Create Price Lists Button',
            SAVE_ALL_BTN                 : 'Save All Top Bar Button',
            SAVE_BTN                     : 'Save Top Bar Button',
            REMOVE_ALL_BTN               : 'Remove All Top Bar Button',
            CANCEL_BTN                   : 'Cancel Top Bar Button',
            DELETE_BTN                   : 'Delete Top Bar Button',
            REMOVE_BTN                   : 'Delete Button',
            REMOVE_LIST_BTN              : 'Delete List Button',
            REMOVE_CHART                 : 'Remove Chart',
            EDIT_CHART                   : 'Edit Chart',
            EDIT_WAREHOUSE               : 'Edit Warehouse Button',
            EDIT_SHIPPING_METHOD         : 'Edit Shipping Method Button',
            EDIT_PRODUCT_TYPES           : 'Edit Product Types Button',
            EDIT_PRODUCT_OPTIONS         : 'Edit Product Options Button',
            EDIT_PRODUCT_CATEGORIES      : 'Edit Product Categories Button',
            EDIT_PRICE_LISTS             : 'Edit Price Lists Button',
            DELETE_PRODUCT_TYPES         : 'Delete Product Types Button',
            DELETE_SHIPPING_METHOD       : 'Delete Shipping Method Button',
            DELETE_WAREHOUSE             : 'Delete Warehouse Button',
            DELETE_PRODUCT_OPTIONS       : 'Delete Product Options Button',
            DELETE_PRODUCT_CATEGORIES    : 'Delete Product Categories Button',
            DELETE_PRICE_LISTS           : 'Delete Price Lists Button',
            DELETE_WEEKLY_SCHEDULER      : 'Delete Weekly Scheduler Button',
            CREATE_WEEKLY_SCHEDULER      : 'Create Weekly Scheduler Button',
            EDIT_WEEKLY_SCHEDULER        : 'Edit Weekly Scheduler Button',
            EDIT_SCHEDULED_PAY           : 'Edit Scheduler Pay Button',
            DELETE_SCHEDULED_PAY         : 'Delete Scheduler Pay Button',
            CREATE_SCHEDULED_PAY         : 'Create Scheduler Pay Button',
            CREATE_LANGUAGES             : 'Create Languages Button',
            DELETE_LANGUAGES             : 'Delete Languages Button',
            EDIT_LANGUAGES               : 'Edit Languages Button',
            EDIT_NATIONALITIES           : 'Edit Nationalities Button',
            DELETE_NATIONALITIES         : 'Delete Nationalities Button',
            CREATE_NATIONALITIES         : 'Create Nationalities Button',
            CREATE_PAYROLL_DEDUCTIONS    : 'Create Payroll Deductions Button',
            EDIT_PAYROLL_DEDUCTIONS      : 'Edit Payroll Deductions Button',
            DELETE_PAYROLL_DEDUCTIONS    : 'Delete Payroll Deductions Button',
            DELETE_PAYROLL_STRUCTURE     : 'Delete Payroll Structure Button',
            EDIT_PAYROLL_STRUCTURE       : 'Edit Payroll Structure Button',
            CREATE_PAYROLL_STRUCTURE     : 'Create Payroll Structure Button',
            VIEW_ALL                     : 'View All',
            CHANGE_CHARTS_DATE           : 'Change Charts Date',
            CONFIRM_EDITING              : 'Confirm Editing',
            CANCEL_EDITING               : 'Cancel Editing',
            CONFIRM_DIALOG               : 'Confirm Dialog',
            CANCEL_DIALOG                : 'Cancel Dialog',
            DELETE_DIALOG                : 'Delete Dialog',
            CONFIRM_CREATING             : 'Confirm Creating',
            CANCEL_CREATING              : 'Cancel Creating',
            SAVE_CHANGES                 : 'Save Changes',
            CANCEL_CHANGES               : 'Cancel Changes',
            CONVERT_TO_OPPORTUNITY       : 'Convert To Opportunity',
            SETTINGS_BTN                 : 'Settings Button',
            EXPORT_TO_CSV                : 'Export To Csv',
            EXPORT_TO_XLSX               : 'Export To Xlsx',
            THUMBNAILS_EDITING           : 'Thumbnails Editing',
            LIST_EDITING                 : 'List Editing',
            GO_TO_FORM                   : 'Go To Form',
            CONFIGURE_PUBLISHING         : 'Configure Publishing',
            CONFIGURE_UNPUBLISHING       : 'Configure Unpublishing',
            SHOW_SEARCH_CONTENT          : 'Show Search Content',
            PER_PAGE                     : 'Items Per Page',
            PAGE_LIST                    : 'Page List Item',
            PAGE_INPUT                   : 'Page Input',
            TOGGLE_PAGE_LIST             : 'Toggle Page List',
            NEXT_PAGE                    : 'Next Page',
            PREV_PAGE                    : 'Previous Page',
            FIRST_PAGE                   : 'First Page',
            LAST_PAGE                    : 'Last Page',
            FILTER_BY_LETTER             : 'Filter By Letter',
            SETTED_VIEW_TYPE             : 'Setted View Type',
            SAVE_PROFILE                 : 'Save Profile',
            workflowFullContainer        : 'Filter Stage Container',
            sourceFullContainer          : 'Filter Source Container',
            salesPersonFullContainer     : 'Filter Assigned To Container',
            createdByFullContainer       : 'Filter Created By Container',
            contactNameFullContainer     : 'Filter Contact Name Container',
            nameFullContainer            : 'Filter Name Container',
            customerFullContainer        : 'Filter Customer Container',
            servicesFullContainer        : 'Filter Services Container',
            countryFullContainer         : 'Filter Country Container',
            channelFullContainer         : 'Filter Chanel Container',
            fulfilledStatusFullContainer : 'Filter Fulfilled Status Container',
            shippingStatusFullContainer  : 'Filter Shipping Status Container',
            supplierFullContainer        : 'Filter Supplier Container',
            allocationStatusFullContainer: 'Filter Allocation Status Container',
            projectFullContainer         : 'Filter Project Container',
            assignedFullContainer        : 'Filter Assigned Container',
            paymentMethodFullContainer   : 'Filter Payment Way Container',
            refundFullContainer          : 'Filter Type Container',
            assignedToFullContainer      : 'Filter Assigned To Container',
            dealFullContainer            : 'Filter Opportunity Container',
            categoryFullContainer        : 'Filter Category Container',
            managerFullContainer         : 'Filter Manager Container',
            jobPositionFullContainer     : 'Filter Job Position Container',
            departmentFullContainer      : 'Filter Department Container',
            sumFullContainer             : 'Filter Debit/Credit Amount Container',
            journalFullContainer         : 'Filter Journal Container',
            accountFullContainer         : 'Filter Account Container',
            timestampFullContainer       : 'Filter Name Container',
            canBeSoldFullContainer       : 'Filter Can Be Sold Container',
            canBeExpensedFullContainer   : 'Filter Can Be Expensed Container',
            canBePurchasedFullContainer  : 'Filter Can Be Purchased Container',
            warehouseFullContainer       : 'Filter Warehouse Container',
            statusFullContainer          : 'Filter Status Container',
            warehouseToFullContainer     : 'Filter Warehouse To Container',
            filtersContent               : 'Filters Content Tab',
            favoritesContent             : 'Favorites Content Tab'
        },

        EVENTS_VALUES: {}
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
            module.exports = GA;
        }
    } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return GA;
        });
    } else {
        root.GA = GA;
    }
}());
