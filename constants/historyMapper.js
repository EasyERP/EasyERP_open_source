module.exports = {
    LEAD: {
        collectionName : 'Opportunities',
        reverseMap : {
            'isOpportunitie:' : 'isOpportunitie',
            'expectedRevenue' : 'expectedRevenue.value',
            'salesPerson' : 'salesPerson',
            'workflow' : 'workflow'
        },
        map: {
            'isOpportunitie' : {
                name: 'isOpportunitie',
                isRef: false
            },
            'expectedRevenue.value' : {
                name: 'expectedRevenue',
                isRef: false
            },
            'salesPerson' : {
                name: 'salesPerson',
                isRef: true,
                collection: 'Employees',
                project: {$concat: ['$name.first', '$name.last']}
            },
            'workflow' : {
                name: 'workflow',
                isRef: true,
                collection: 'workflows',
                project: '$name'
            }
        }
    },
    OPPORTUNITIE: {
        collectionName : 'Opportunities',
        reverseMap : {
            'isOpportunitie:' : 'isOpportunitie',
            'expectedRevenue' : 'expectedRevenue.value',
            'salesPerson' : 'salesPerson',
            'workflow' : 'workflow'
        },
        map:  {
            'isOpportunitie' : {
                name: 'isOpportunitie',
                isRef: false
            },
            'expectedRevenue.value' : {
                name: 'expectedRevenue',
                isRef: false
            },
            'salesPerson' : {
                name: 'salesPerson',
                isRef: true,
                collection: 'Employees',
                project: {$concat: ['$name.first', '$name.last']}
            },
            'workflow' : {
                name: 'workflow',
                isRef: true,
                collection: 'workflows',
                project: '$name'
            }
        }
    }
};
