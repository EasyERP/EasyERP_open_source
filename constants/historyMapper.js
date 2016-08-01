module.exports = {
    LEAD: {
        collectionName: 'Opportunities',

        map: {
            isOpportunitie: {
                name : 'isOpportunitie',
                isRef: false
            },
            'createdBy.date' : {
                name : 'Creation Date',
                isRef: false
            },

            'expectedRevenue.value': {
                name : 'expectedRevenue',
                isRef: false
            },
            'nextAction.date': {
                name : 'Close Date',
                isRef: false
            },

            salesPerson: {
                name      : 'salesPerson',
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
                name : 'isOpportunitie',
                isRef: false
            },

            'expectedRevenue.value': {
                name : 'expectedRevenue',
                isRef: false
            },
            'nextAction.date': {
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
            'createdBy.date' : {
                name : 'Creation Date',
                isRef: false
            }
        }
    },
    PERSON : {
        collectionName: 'Persons',

        map: {
            skype: {
                name : 'Skype',
                isRef: false
            },
            'createdBy.date' : {
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
                name : 'FaceBook',
                isRef: false
            },
            'dateBirth': {
                name : 'Date of Birth',
                isRef: false
            },
            'fullName': {
                name : 'Name',
                isRef: false
            },
            'jobPosition': {
                name : 'Job Position',
                isRef: false
            },
            'address.country': {
                name : 'Country',
                isRef: false
            }
            /*salesPerson: {
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
            }*/
        }
    },
    COMPANY : {
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
            'website': {
                name : 'Website',
                isRef: false
            },
            'social.FB': {
                name : 'FaceBook',
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
            'createdBy.date' : {
                name : 'Creation Date',
                isRef: false
            }
        }
    }
};
