module.exports = {
    LEAD: {
        collectionName: 'Opportunities',

        map: {
            isOpportunitie: {
                name : 'Is Opportunitie',
                isRef: false
            },

            'createdBy.date': {
                name : 'Creation Date',
                isRef: false
            },

            'expectedRevenue.value': {
                name : 'Amount',
                isRef: false
            },

            expectedClosing: {
                name : 'Close Date',
                isRef: false
            },

            salesPerson: {
                name      : 'Person',
                isRef     : true,
                collection: 'Employees',
                project   : {$concat: ['$tmp.name.first', ' ', '$tmp.name.last']}
            },

            workflow: {
                name      : 'workflow',
                isRef     : true,
                collection: 'workflows',
                project   : '$tmp.name'
            }
        }
    },

    OPPORTUNITIE: {
        collectionName: 'Opportunities',

        map: {
            isOpportunitie: {
                name : 'Is Opportunitie',
                isRef: false
            },

            'expectedRevenue.value': {
                name : 'Amount',
                isRef: false
            },

            expectedClosing: {
                name : 'Close Date',
                isRef: false
            },

            salesPerson: {
                name      : 'Assigned To',
                isRef     : true,
                collection: 'Employees',
                project   : {$concat: ['$tmp.name.first', ' ', '$tmp.name.last']}
            },

            workflow: {
                name      : 'workflow',
                isRef     : true,
                collection: 'workflows',
                project   : '$tmp.name'
            },

            'createdBy.date': {
                name : 'Creation Date',
                isRef: false
            }
        }
    },

    INVOICE: {
        collectionName: 'Invoice',

        map: {
            approved: {
                name : 'Approved',
                isRef: false
            },

            workflow: {
                name      : 'Status',
                isRef     : true,
                collection: 'workflows',
                project   : '$tmp.name'
            },

            dueDate: {
                name : 'Due Date',
                isRef: false
            },

            invoiceDate: {
                name : 'Invoice Date',
                isRef: false
            },

            'createdBy.date': {
                name : 'Creation Date',
                isRef: false
            }
        }
    },

    ORDER: {
        collectionName: 'ORDER',

        map: {
            'status.fulfillStatus': {
                name : 'Fulfilled',
                isRef: false
            },

            orderDate: {
                name : 'Order Date',
                isRef: false
            },

            expectedDate: {
                name : 'Payment Due Date',
                isRef: false
            },

            workflow: {
                name      : 'Status',
                isRef     : true,
                collection: 'workflows',
                project   : '$tmp.name'
            },

            'createdBy.date': {
                name : 'Creation Date',
                isRef: false
            }
        }
    },

    MANUFACTURINGORDER: {
        collectionName: 'manufacturingOrder',

        map: {
            'status.fulfillStatus': {
                name : 'Fulfilled',
                isRef: false
            },

            orderDate: {
                name : 'Order Date',
                isRef: false
            },

            expectedDate: {
                name : 'Payment Due Date',
                isRef: false
            },

            workflow: {
                name      : 'Status',
                isRef     : true,
                collection: 'workflows',
                project   : '$tmp.name'
            },

            'createdBy.date': {
                name : 'Creation Date',
                isRef: false
            }
        }
    },

    PERSON: {
        collectionName: 'Persons',

        map: {
            skype: {
                name : 'Skype',
                isRef: false
            },

            'createdBy.date': {
                name : 'Creation Date',
                isRef: false
            },

            email: {
                name : 'Email',
                isRef: false
            },

            'social.LI': {
                name : 'LinkedIn',
                isRef: false
            },

            'social.FB': {
                name : 'Facebook',
                isRef: false
            },

            dateBirth: {
                name : 'Date of Birth',
                isRef: false
            },

            'name.first': {
                name : 'First Name',
                isRef: false
            },

            'name.last': {
                name : 'Last Name',
                isRef: false
            },

            jobPosition: {
                name : 'Job Position',
                isRef: false
            },

            'address.country': {
                name : 'Country',
                isRef: false
            }
        }
    },

    COMPANY: {
        collectionName: 'Companies',

        map: {
            email: {
                name : 'Email',
                isRef: false
            },

            'social.LI': {
                name : 'LinkedIn',
                isRef: false
            },

            website: {
                name : 'Website',
                isRef: false
            },

            'social.FB': {
                name : 'Facebook',
                isRef: false
            },

            'name.first': {
                name : 'Name',
                isRef: false
            },

            'address.country': {
                name : 'Country',
                isRef: false
            },

            'salesPurchases.salesPerson': {
                name      : 'Assigned To',
                isRef     : true,
                collection: 'Employees',
                project   : {$concat: ['$tmp.name.first', ' ', '$tmp.name.last']}
            },

            'createdBy.date': {
                name : 'Creation Date',
                isRef: false
            }
        }
    },

    DEALTASK: {
        collectionName: 'DealTasks',

        map: {
            description: {
                name : 'Description',
                isRef: false
            },

            assignedTo: {
                name      : 'Assigned To',
                isRef     : true,
                collection: 'Employees',
                project   : {$concat: ['$tmp.name.first', ' ', '$tmp.name.last']}
            },

            workflow: {
                name      : 'Stage',
                isRef     : true,
                collection: 'workflows',
                project   : '$tmp.name'
            },

            'createdBy.date': {
                name : 'Creation Date',
                isRef: false
            }
        }
    }
};
