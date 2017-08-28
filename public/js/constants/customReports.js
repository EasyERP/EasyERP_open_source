'use strict';

var opportunityDefaultData = {
    name           : 'Carrot industries',
    expectedRevenue: '120',
    salesPerson    : 'Salesperson',
    workflow       : 'New',
    expectedClosing: '03 Feb, 2017',
    country        : 'United States of America',
    convertedDate  : '03 Feb, 2017',
    creationDate   : '03 Feb, 2017'
};
var leadsDefaultData = {
    name       : 'Carrot industries',
    workflow   : 'New',
    priority   : 'Hot',
    salesPerson: 'Alex Lysachenko',
    source     : 'Offline Meetings',
    country    : 'United States of America'
};

var employeesInfo = [{
    imageSrc           : '',
    name               : 'Vilmart Anton',
    workEmail          : 'anton.vilmart@gmail.com',
    personalEmail      : '',
    'workPhones.mobile': '+54725551254',
    'workPhones.phone' : '+54725551254',
    skype              : 'sobaka',
    department         : 'Development',
    jobPosition        : 'Middle CSS',
    manager            : 'Positov Ivan',
    nationality        : 'American',
    homeAddress        : '1600 Pennsylvania Ave NW, Washington, DC 20500,USA',
    dateBirth          : '06 Nov, 1990',
    age                : '27',
    source             : 'www.work.ua',
    marital            : 'married',
    employmentType     : 'FOP',
    gender             : 'Male',
    jobType            : 'Full-time',
    'social.FB'        : 'https://www.facebook.com/111',
    'social.LI'        : 'https://www.link.com/111',
    'social.GP'        : 'https://www.googleplus.com/111',
    userName           : 'igor_grubisic11',
    hired              : '04 Aug, 2015',
    fired              : ''
}, {
    imageSrc           : '',
    name               : 'Little Princes',
    workEmail          : 'littleprinces@gmail.com',
    personalEmail      : 'princes1@gmail.com',
    'workPhones.mobile': '+0204523120',
    'workPhones.phone' : '+0163481418',
    skype              : 'littleprinces',
    department         : 'Development',
    jobPosition        : 'Junior CSS',
    manager            : 'Santa Claus',
    nationality        : 'American',
    homeAddress        : 'Tähtikuja 1, FI-96930 Napapiiri',
    dateBirth          : '15 Nov, 1989',
    age                : '37',
    source             : 'www.work.ua',
    marital            : 'unmarried',
    employmentType     : 'FOP',
    gender             : 'male',
    jobType            : 'Contract',
    FB                 : 'https://www.facebook.com/112',
    LI                 : 'https://www.link.com/112',
    userName           : 'victoria111',
    hired              : '20 Aug, 2015',
    fired              : ''
}];

var employeesType = {
    imageSrc      : 'Image',
    name          : 'String',
    workEmail     : 'String',
    personalEmail : 'String',
    mobile        : 'String',
    phone         : 'String',
    skype         : 'String',
    department    : 'String',
    jobPosition   : 'String',
    manager       : 'String',
    nationality   : 'String',
    homeAddress   : 'Address',
    dateBirth     : 'Date',
    age           : 'Integer',
    source        : 'String',
    marital       : 'String',
    employmentType: 'String',
    gender        : 'String',
    jobType       : 'String',
    FB            : 'String',
    LI            : 'String',
    userName      : 'String',
    hired         : 'Date',
    fired         : 'Date'
};

var personType = {
    name           : 'String',
    imageSrc       : 'Image',
    email          : 'String',
    address        : 'Address',
    country        : 'String',
    shippingAddress: 'Address',
    website        : 'String',
    phone          : 'String',
    mobile         : 'String',
    fax            : 'String',
    salesTeam      : 'String',
    FB             : 'String',
    LI             : 'String',
    ordersCount    : 'Integer',
    invoiceCount   : 'Integer',
    revenueSold    : 'Finance',
    revenuePaid    : 'Finance',
    revenuePrepaid : 'Finance',
    revenueExpenses: 'Finance'
};

var companyType = {
    name           : 'String',
    imageSrc       : 'Image',
    email          : 'String',
    address        : 'Address',
    country        : 'String',
    shippingAddress: 'Address',
    website        : 'String',
    phone          : 'String',
    mobile         : 'String',
    fax            : 'String',
    salesTeam      : 'String',
    FB             : 'String',
    LI             : 'String',
    ordersCount    : 'Integer',
    invoiceCount   : 'Integer',
    revenueSold    : 'Finance',
    revenuePaid    : 'Finance',
    revenuePrepaid : 'Finance',
    revenueExpenses: 'Finance'
};

var personInfo = [{
    name           : 'Igor Grubisic',
    imageSrc       : '111',
    email          : 'igor666@gmail.com',
    address        : '1600 Pennsylvania Ave NW, Washington, DC 20500,USA',
    country        : 'USA',
    shippingAddress: '1600 Pennsylvania Ave NW, Washington, DC 20500,USA',
    website        : 'someWebsite@web.com',
    phone          : '+10000000',
    mobile         : '+10000001',
    fax            : '+10000002',
    salesTeam      : 'Team',
    FB             : 'https://www.facebook.com/111',
    LI             : 'https://www.link.com/111',
    ordersCount    : 12,
    invoiceCount   : 34,
    revenueSold    : 12,
    revenuePaid    : 10,
    revenuePrepaid : 100,
    revenueExpenses: 140
}, {
    name           : 'Victoria Grubisic',
    imageSrc       : '112',
    email          : 'victoria666@gmail.com',
    address        : '1600 Pennsylvania Ave NW, Washington, DC 20500,USA',
    country        : 'USA',
    shippingAddress: '1600 Pennsylvania Ave NW, Washington, DC 20500,USA',
    website        : 'someWebsite@web.com',
    phone          : '+10000001',
    mobile         : '+10000002',
    fax            : '+10000003',
    salesTeam      : 'Team',
    FB             : 'https://www.facebook.com/112',
    LI             : 'https://www.link.com/113',
    ordersCount    : 12,
    invoiceCount   : 34,
    revenueSold    : 12,
    revenuePaid    : 10,
    revenuePrepaid : 100,
    revenueExpenses: 140
}];

var companyInfo = [{
    name           : 'HugeCarrot inc.',
    imageSrc       : '111',
    email          : 'hugecarrot@mail.com',
    address        : 'Ukraine,Uzhgorod,Street str. 0/25,HugeCarrot inc.',
    country        : 'Ukraine',
    shippingAddress: 'Ukraine,Uzhgorod,Street str. 0/25,HugeCarrot inc.',
    website        : 'hugecarrot.com',
    phone          : '+58646587415',
    mobile         : '+58646587415',
    fax            : '+58646587415',
    salesTeam      : 'Android',
    FB             : 'https://www.facebook.com/111',
    LI             : 'https://www.link.com/111',
    ordersCount    : 20,
    invoiceCount   : 10,
    revenueSold    : 12,
    revenuePaid    : 10,
    revenuePrepaid : 100,
    revenueExpenses: 140
}, {
    name           : 'Eternity Insurance group',
    imageSrc       : '111',
    email          : 'nopromises@mail.com',
    address        : 'Antarctica, 75446, Transcarpathia, Birmingham, Notsafe str. 6',
    country        : 'Ukraine',
    shippingAddress: 'Antarctica, 75446, Transcarpathia, Birmingham, Notsafe str. 6',
    website        : 'nopromises.com',
    phone          : '+547852145',
    mobile         : '+478520588',
    fax            : '+478520588',
    salesTeam      : 'Android',
    FB             : 'nopromises',
    LI             : 'nopromises',
    ordersCount    : 100,
    invoiceCount   : 200,
    revenueSold    : 12,
    revenuePaid    : 10,
    revenuePrepaid : 100,
    revenueExpenses: 140
}];

(function () {
        var root;
        var opportunitiesTypes = {
            name           : 'String',
            expectedRevenue: 'Finance',
            jobPosition    : 'String',
            creationDate   : 'Date',
            convertedDate  : 'Date',
            company        : 'String',
            customer       : 'String',
            tags           : 'String',
            dateBirth      : 'Date',
            address        : 'String',
            contactName    : 'String',
            salesPerson    : 'String',
            salesTeam      : 'String',
            expectedClosing: 'Date',
            priority       : 'String',
            email          : 'String',
            phone          : 'String',
            mobile         : 'String',
            fax            : 'String',
            FB             : 'String',
            LI             : 'String',
            skype          : 'String',
            workflow       : 'String',
            source         : 'String',
            country        : 'String'
        };
        var reports = {
            salesReports: {
                salesByProductReport: [{
                    product          : 'Product',
                    sku              : 'SKU',
                    taxes            : 'Taxes',
                    grossSales       : 'Gross sales',
                    grossSalesPercent: 'Gross sales Percent',
                    unitsSold        : 'Units Sold',
                    unitsPercent     : 'Units Percent',
                    groupBy          : 'sku'
                }, {
                    product          : 'Brown Bag',
                    sku              : '00000002',
                    taxes            : '$ 465.00',
                    grossSales       : '$ 3 564.00',
                    grossSalesPercent: '0.28%',
                    unitsSold        : 2,
                    unitsPercent     : '0.41%'
                }, {
                    product          : 'Blue sneakers',
                    sku              : '00000003',
                    taxes            : '$ 90.00',
                    grossSales       : '$ 690.00',
                    grossSalesPercent: '0.05%',
                    unitsSold        : 1,
                    unitsPercent     : '0.21%'
                }],

                salesByMonthReport: [{
                    month      : 'Month',
                    data       : 'Orders',
                    gross_sales: 'Gross sales',
                    discount   : 'Discounts',
                    shipping   : 'Shipping',
                    taxes      : 'Tax',
                    total_sales: 'Total Sales'
                }, {
                    month      : 'March-2017',
                    data       : 10,
                    gross_sales: 15,
                    discount   : 5,
                    shipping   : 2,
                    taxes      : 1,
                    total_sales: 0
                }, {
                    month      : 'April-2017',
                    data       : 10,
                    gross_sales: 0,
                    discount   : 6,
                    shipping   : 1,
                    taxes      : 0,
                    total_sales: 0
                }],

                salesByChannelReport: [{
                    channelName    : 'Sales Channel Name',
                    order          : 'Orders',
                    orderedQuantity: 'Ordered Quantity',
                    discount       : 'Discounts',
                    grossSales     : 'Gross Sales',
                    totalSales     : 'Total Sales',
                    tax            : 'Tax',
                    shipping       : 'Shipping'
                }, {
                    channelName    : 'Magento',
                    order          : 1,
                    orderedQuantity: 17,
                    discount       : 5,
                    grossSales     : 18,
                    totalSales     : 19882,
                    tax            : 5,
                    shipping       : 2000
                }, {
                    channelName    : 'Eatsy',
                    order          : 15,
                    orderedQuantity: 170,
                    discount       : 15,
                    grossSales     : 1899,
                    totalSales     : 0,
                    tax            : 57,
                    shipping       : 345
                }]
            },

            inventoryReports: {
                lowStockReport: [{
                    product      : 'Product',
                    sku          : 'SKU',
                    avalStock    : 'Avali.Stock',
                    lowAlertLevel: 'Low Alert Level',
                    atmLow       : 'Atm. Low',
                    awaiting     : 'Awaiting'
                }, {
                    product      : "Atomic Endurance Running Tee (Crew-Neck)-XL-Blue",
                    sku          : 'MS09-XL-Black',
                    avalStock    : 10,
                    lowAlertLevel: 5,
                    atmLow       : 7,
                    awaiting     : 7
                }, {
                    product      : 'Ryker LumaTech™ Tee (Crew-neck)-XL-Black',
                    sku          : 'MS09-XL-Black',
                    avalStock    : 15,
                    lowAlertLevel: 0,
                    atmLow       : 0,
                    awaiting     : 0
                }],

                incomingStockReport: [{
                    products     : 'Product',
                    variants     : 'Variants',
                    sku          : 'SKU',
                    purchaseOrder: 'PO',
                    onHand       : 'Stock On Hand',
                    incomingStock: 'Incoming Stock',
                    total        : 'Total Cost'
                }, {
                    products     : 'Atomic Endurance Running Tee (Crew-Neck)-XL-Blue',
                    variants     : '3',
                    sku          : 'MS09-XL-Black',
                    purchaseOrder: 'MS09',
                    onHand       : 15,
                    incomingStock: 25,
                    total        : 30
                }, {
                    products     : 'Ryker LumaTech™ Tee (Crew-neck)-XL-Black',
                    variants     : '5',
                    sku          : 'MS09-XL-Black',
                    purchaseOrder: 'MS06',
                    onHand       : 1,
                    incomingStock: 25,
                    total        : 25
                }],

                productListingReport: [{
                    variant     : 'Variant',
                    sku         : 'SKU',
                    salesChannel: 'Sales Channel',
                    listingPrice: 'Products Price',
                    unitSold    : 'Unit Sold',
                    dateLinked  : 'Date Linked'
                }, {
                    variant     : 'Ana Running Short-28-Black',
                    sku         : 'WSH10-28-Black',
                    salesChannel: 'Shopify',
                    listingPrice: 1,
                    unitSold    : 1,
                    dateLinked  : '13 Mar, 2017'
                }, {
                    variant     : 'Ana Running Short-28-White',
                    sku         : 'WSH10-28-White',
                    salesChannel: 'Shopify',
                    listingPrice: 15,
                    unitSold    : 5,
                    dateLinked  : '24.02.2017'
                }, {
                    variant     : 'Red|XL',
                    sku         : 'SKU1',
                    salesChannel: 'TestShopify',
                    listingPrice: 15,
                    unitSold    : 5,
                    dateLinked  : '24.02.2017'
                }],

                warehouseMovementReport: [{
                    sku           : 'SKU',
                    name          : 'Name',
                    warehouse     : 'Warehouse',
                    openingBalance: 'Opening Balance',
                    inwards       : 'Inwards',
                    outwards      : 'Outwards',
                    closingBalance: 'Closing Balance'
                }, {
                    sku           : 'WSH10-28-Black',
                    name          : 'Ana Running Short-28-Black',
                    warehouse     : 'Warehouse1',
                    openingBalance: '100',
                    inwards       : '30',
                    outwards      : '130',
                    closingBalance: '0'
                }, {
                    sku           : 'SKU1',
                    name          : 'Ana Running Short-28-White',
                    warehouse     : 'Warehouse2',
                    openingBalance: '100',
                    inwards       : '40',
                    outwards      : '140',
                    closingBalance: '0'
                }, {
                    sku           : 'WSH10-28-White',
                    name          : 'Red|XL',
                    warehouse     : 'Warehouse3',
                    openingBalance: '100',
                    inwards       : '10',
                    outwards      : '110',
                    closingBalance: '0'
                }]
            },

            employeesReports: {
                employeesByDepartment    : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'department'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByJobPosition   : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'jobPosition'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByGender        : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'gender'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByMaritalStatus : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'marital'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByEmploymentType: (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'employmentType'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByJobType       : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'jobType'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByManager       : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'manager'
                    });

                    return employeesInfoCopy;
                })(),
                employeesBySource        : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'source'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByHiredPeriod   : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'hired'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByFiredPeriod   : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'fired'
                    });

                    return employeesInfoCopy;
                })(),
                employeesByAny           : (function () {
                    var employeesInfoCopy = employeesInfo.slice(0);

                    employeesInfoCopy.unshift({
                        imageSrc      : 'Photo',
                        name          : 'Name',
                        workEmail     : 'Work Email',
                        personalEmail : 'Personal Email',
                        mobile        : 'Mobile phone',
                        phone         : 'Work Phone',
                        skype         : 'Skype',
                        department    : 'Department',
                        jobPosition   : 'Job Position',
                        manager       : 'Manager',
                        nationality   : 'Nationality',
                        homeAddress   : 'Home Address',
                        dateBirth     : 'Date of Birth',
                        age           : 'Age',
                        source        : 'Source',
                        marital       : 'Status',
                        employmentType: 'Employment Type',
                        gender        : 'Gender',
                        jobType       : 'Job Type',
                        FB            : 'FB',
                        LI            : 'LI',
                        userName      : 'User Name',
                        hired         : 'Hired',
                        fired         : 'Fired',
                        groupBy       : 'name'
                    });

                    return employeesInfoCopy;
                })()
            },

            personReports: {
                personByCountry        : (function () {
                    var personInfoCopy = personInfo.slice(0);

                    personInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'country'
                    });

                    return personInfoCopy;
                })(),
                personBySalesTeam      : (function () {
                    var personInfoCopy = personInfo.slice(0);

                    personInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'salesPurchases.salesTeam'
                    });

                    return personInfoCopy;
                })(),
                personByRevenueSold    : (function () {
                    var personInfoCopy = personInfo.slice(0);

                    personInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'revenueSold'
                    });
                    return personInfoCopy;
                })(),
                personByRevenuePaid    : (function () {
                    var personInfoCopy = personInfo.slice(0);

                    personInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'revenuePaid'
                    });
                    return personInfoCopy;
                })(),
                personByRevenuePrepaid : (function () {
                    var personInfoCopy = personInfo.slice(0);

                    personInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'revenuePrepaid'
                    });
                    return personInfoCopy;
                })(),
                personByRevenueExpenses: (function () {
                    var personInfoCopy = personInfo.slice(0);

                    personInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'revenueExpenses'
                    });
                    return personInfoCopy;
                })(),
                personByAnyFiled       : (function () {
                    var personInfoCopy = personInfo.slice(0);

                    personInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'name'
                    });
                    return personInfoCopy;
                })()
            },

            companyReports: {
                companyByCountry        : (function () {
                    var companyInfoCopy = companyInfo.slice(0);

                    companyInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'country'
                    });

                    return companyInfoCopy;
                })(),
                companyBySalesTeam      : (function () {
                    var companyInfoCopy = companyInfo.slice(0);

                    companyInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'salesPurchases.salesTeam'
                    });

                    return companyInfoCopy;
                })(),
                companyByRevenueSold    : (function () {
                    var companyInfoCopy = companyInfo.slice(0);

                    companyInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'revenueSold'
                    });
                    return companyInfoCopy;
                })(),
                companyByRevenuePaid    : (function () {
                    var companyInfoCopy = companyInfo.slice(0);

                    companyInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'revenuePaid'
                    });
                    return companyInfoCopy;
                })(),
                companyByRevenuePrepaid : (function () {
                    var companyInfoCopy = companyInfo.slice(0);

                    companyInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'revenuePrepaid'
                    });
                    return companyInfoCopy;
                })(),
                companyByRevenueExpenses: (function () {
                    var companyInfoCopy = companyInfo.slice(0);

                    companyInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'revenueExpenses'
                    });
                    return companyInfoCopy;
                })(),
                companyByAnyFiled       : (function () {
                    var companyInfoCopy = companyInfo.slice(0);

                    companyInfoCopy.unshift({
                        name           : 'Name',
                        imageSrc       : 'Photo',
                        email          : 'Email',
                        address        : 'Address',
                        country        : 'Country',
                        shippingAddress: 'Shipping Address',
                        website        : 'Website',
                        phone          : 'Phone',
                        mobile         : 'Mobile Phone',
                        fax            : 'Fax',
                        salesTeam      : 'Team',
                        FB             : 'FB',
                        LI             : 'LI',
                        ordersCount    : 'Orders Count',
                        invoiceCount   : 'Invoice Count',
                        revenueSold    : 'Revenue Sold',
                        revenuePaid    : 'Revenue Paid',
                        revenuePrepaid : 'Revenue Prepaid',
                        revenueExpenses: 'Revenue Expenses',
                        groupBy        : 'name'
                    });
                    return companyInfoCopy;
                })()
            },

            leadsReports: {
                leadsByStage: [{
                    name       : 'Name',
                    workflow   : 'Stage',
                    priority   : 'Priority',
                    salesPerson: 'Salesperson',
                    source     : 'Source',
                    country    : 'Country',
                    groupBy    : 'workflow'
                }, leadsDefaultData, leadsDefaultData],

                leadsByPriority: [{
                    name       : 'Name',
                    workflow   : 'Stage',
                    priority   : 'Priority',
                    salesPerson: 'Salesperson',
                    source     : 'Source',
                    country    : 'Country',
                    groupBy    : 'priority'
                }, leadsDefaultData, leadsDefaultData],

                leadsByAssignee: [{
                    name       : 'Name',
                    workflow   : 'Stage',
                    priority   : 'Priority',
                    salesPerson: 'Salesperson',
                    source     : 'Source',
                    country    : 'Country',
                    groupBy    : 'salesPerson'
                }, leadsDefaultData, leadsDefaultData],

                leadsBySource: [{
                    name       : 'Name',
                    workflow   : 'Stage',
                    priority   : 'Priority',
                    salesPerson: 'Salesperson',
                    source     : 'Source',
                    country    : 'Country',
                    groupBy    : 'source'
                }, leadsDefaultData, leadsDefaultData],

                leadsByCountry: [{
                    name       : 'Name',
                    workflow   : 'Stage',
                    priority   : 'Priority',
                    salesPerson: 'Salesperson',
                    source     : 'Source',
                    country    : 'Country',
                    groupBy    : 'country'
                }, leadsDefaultData, leadsDefaultData],

                leadsWithContactInfo: [{
                    name       : 'Name',
                    workflow   : 'Stage',
                    priority   : 'Priority',
                    salesPerson: 'Salesperson',
                    source     : 'Source',
                    country    : 'Country',
                    email      : 'Email',
                    phone      : 'Phone',
                    mobile     : 'Mobile',
                    fax        : 'Fax',
                    FB         : 'Facebook',
                    LI         : 'LinkedIn',
                    skype      : 'Skype',
                    groupBy    : 'contactName'
                }, {
                    name       : 'Carrot industries',
                    workflow   : 'New',
                    priority   : 'Hot',
                    salesPerson: 'Alex Fedorhuk',
                    source     : 'Offline Meetings',
                    country    : 'Canada',
                    email      : 'Gdsgsdgsa@gmail.com',
                    phone      : 'Phone',
                    mobile     : 'Mobile',
                    fax        : 'Fax',
                    FB         : 'https://www.facebook.com/profile.php?id=example_id',
                    LI         : 'https://www.linkedin.com/in/one-more-example-465484wef58/',
                    skype      : 'aaronius0000'
                }, {
                    name       : 'Little Pipi',
                    workflow   : 'New',
                    priority   : 'Cold',
                    salesPerson: 'Alex Lysachenko',
                    source     : 'Offline Meetings',
                    country    : 'United States of America.',
                    email      : 'Gdsgsdgsa@gmail.com',
                    phone      : 'Phone',
                    mobile     : 'Mobile',
                    fax        : 'Fax',
                    FB         : 'https://www.facebook.com/profile.php?id=example_id',
                    LI         : 'https://www.linkedin.com/in/one-more-example-465484wef58/',
                    skype      : 'aaronius0000'
                }],

                leadsExtended: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    jobPosition    : 'Job Position',
                    creationDate   : 'Creation Date',
                    company        : 'Company',
                    customer       : 'Customer',
                    tags           : 'Tags',
                    dateBirth      : 'Date Of Birth',
                    address        : 'Address',
                    contactName    : 'Contact Name',
                    salesPerson    : 'Salesperson',
                    salesTeam      : 'Sales Team',
                    expectedClosing: 'Expected Closing',
                    priority       : 'Priority',
                    email          : 'Email',
                    phone          : 'Phone',
                    mobile         : 'Mobile',
                    fax            : 'Fax',
                    FB             : 'FB',
                    LI             : 'LI',
                    skype          : 'Skype',
                    workflow       : 'Stage',
                    source         : 'Source',
                    country        : 'Country'
                }, {
                    name           : 'Android and iOS application + design',
                    expectedRevenue: '0',
                    jobPosition    : 'Owner and Founder',
                    creationDate   : '07 Sep, 2016',
                    company        : 'Cute Mushroom',
                    customer       : 'Justin Hillbert',
                    tags           : 'Smth',
                    dateBirth      : '16 Feb, 2017',
                    address        : 'Smth',
                    contactName    : 'Alex Lysachenko',
                    salesPerson    : 'Alex Lysachenko',
                    salesTeam      : 'Smth',
                    expectedClosing: '03 Feb, 2017',
                    priority       : 'Hot',
                    email          : 'Gdsgsdgsa@gmail.com',
                    phone          : '+100000000',
                    mobile         : '+100000000',
                    fax            : '+100000000',
                    FB             : 'https://www.facebook.com/profile.php?id=example_id',
                    LI             : 'https://www.linkedin.com/in/one-more-example-465484wef58/',
                    skype          : 'aaronius0000',
                    workflow       : 'New',
                    source         : 'Offline Meetings',
                    country        : 'United States of America'
                }, {
                    name           : 'Application using ReactJS',
                    expectedRevenue: '100',
                    jobPosition    : 'PM',
                    creationDate   : '03 Feb, 2017',
                    company        : 'Mushroom',
                    customer       : 'Aaron Silver',
                    tags           : 'Smth',
                    dateBirth      : '03 Feb, 2017',
                    address        : 'Smth',
                    contactName    : 'Alex Pipi',
                    salesPerson    : 'Alex Pipi',
                    salesTeam      : 'Smth',
                    expectedClosing: '03 Feb, 2017',
                    priority       : 'Cold',
                    email          : 'Gds111@gmail.com',
                    phone          : '+10000333',
                    mobile         : '+10000333',
                    fax            : '+10000333',
                    FB             : 'https://www.facebook.com/profile.php?id=example_id',
                    LI             : 'https://www.linkedin.com/in/one-more-example-465484wef58/',
                    skype          : 'sobakas0000',
                    workflow       : 'New',
                    source         : 'Outbound Cold Call',
                    country        : 'Canada'
                }]
            },

            opportunitiesReports: {
                opportunitiesByRevenue: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    salesPerson    : 'Salesperson',
                    workflow       : 'Stage',
                    expectedClosing: 'Expected Closing',
                    country        : 'Country',
                    convertedDate  : 'Converted Date',
                    creationDate   : 'Creation Date',
                    groupBy        : 'expectedRevenue'
                }, opportunityDefaultData, opportunityDefaultData],

                opportunitiesByStage: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    salesPerson    : 'Salesperson',
                    workflow       : 'Stage',
                    expectedClosing: 'Expected Closing',
                    country        : 'Country',
                    convertedDate  : 'Converted Date',
                    creationDate   : 'Creation Date',
                    groupBy        : 'workflow'
                }, opportunityDefaultData, opportunityDefaultData],

                opportunitiesByExpires: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    salesPerson    : 'Salesperson',
                    workflow       : 'Stage',
                    expectedClosing: 'Expected Closing',
                    country        : 'Country',
                    convertedDate  : 'Converted Date',
                    creationDate   : 'Creation Date',
                    groupBy        : 'expectedClosing'
                }, opportunityDefaultData, opportunityDefaultData],

                opportunitiesByCountry: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    salesPerson    : 'Salesperson',
                    workflow       : 'Stage',
                    expectedClosing: 'Expected Closing',
                    country        : 'Country',
                    convertedDate  : 'Converted Date',
                    creationDate   : 'Creation Date',
                    groupBy        : 'country'
                }, opportunityDefaultData, opportunityDefaultData],

                opportunitiesByConvertedDate: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    salesPerson    : 'Salesperson',
                    workflow       : 'Stage',
                    expectedClosing: 'Expected Closing',
                    country        : 'Country',
                    convertedDate  : 'Converted Date',
                    creationDate   : 'Creation Date',
                    groupBy        : 'convertedDate'
                }, opportunityDefaultData, opportunityDefaultData],

                opportunitiesByCreationDate: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    salesPerson    : 'Salesperson',
                    workflow       : 'Stage',
                    expectedClosing: 'Expected Closing',
                    country        : 'Country',
                    convertedDate  : 'Converted Date',
                    creationDate   : 'Creation Date',
                    groupBy        : 'creationDate'
                }, opportunityDefaultData, opportunityDefaultData],

                opportunitiesBySalesPerson: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    salesPerson    : 'Salesperson',
                    workflow       : 'Stage',
                    expectedClosing: 'Expected Closing',
                    country        : 'Country',
                    convertedDate  : 'Converted Date',
                    creationDate   : 'Creation Date',
                    groupBy        : 'salesPerson'
                }, opportunityDefaultData, opportunityDefaultData],

                opportunitiesWithContactInfo: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    salesPerson    : 'Salesperson',
                    workflow       : 'Stage',
                    expectedClosing: 'Expected Closing',
                    country        : 'Country',
                    email          : 'Email',
                    phone          : 'Phone',
                    mobile         : 'Mobile',
                    fax            : 'Fax',
                    FB             : 'FaceBook',
                    LI             : 'LinkedIn',
                    skype          : 'Skype',
                    groupBy        : 'contactName'
                }, {
                    salesPerson    : 'Jon Doe',
                    email          : 'Gdsgsdgsa@gmail.com',
                    phone          : 'Phone',
                    mobile         : 'Mobile',
                    fax            : 'Fax',
                    FB             : 'https://www.facebook.com/profile.php?id=example_id',
                    LI             : 'https://www.linkedin.com/in/one-more-example-465484wef58/',
                    skype          : 'aaronius0000',
                    name           : 'Carrot industries',
                    expectedRevenue: '$ 7 100',
                    workflow       : 'New',
                    expectedClosing: '03 Feb, 2017',
                    country        : 'Canada',
                    convertedDate  : '03 Feb, 2017',
                    creationDate   : '03 Feb, 2017'
                }, {
                    name           : 'Jon Due',
                    expectedRevenue: '$ 7 188',
                    workflow       : 'New',
                    expectedClosing: '12 Jul, 2014',
                    country        : 'United States of America',
                    convertedDate  : '03 Feb, 2017',
                    creationDate   : '03 Feb, 2017',
                    salesPerson    : 'Salesperson',
                    email          : 'Gdsgsdgsa@gmail.com',
                    phone          : 'Phone',
                    mobile         : 'Mobile',
                    fax            : 'Fax',
                    FB             : 'https://www.facebook.com/profile.php?id=example_id',
                    LI             : 'https://www.linkedin.com/in/one-more-example-465484wef58/',
                    skype          : 'aaronius0000'
                }],

                opportunitiesExtendedFields: [{
                    name           : 'Name',
                    expectedRevenue: 'Expected Revenue',
                    jobPosition    : 'Job Position',
                    creationDate   : 'Creation Date',
                    convertedDate  : 'Converted Date',
                    company        : 'Company',
                    customer       : 'Customer',
                    tags           : 'Tags',
                    dateBirth      : 'Date Of Birth',
                    address        : 'Address',
                    contactName    : 'Contact Name',
                    salesPerson    : 'Salesperson',
                    salesTeam      : 'Sales Team',
                    expectedClosing: 'Expected Closing',
                    email          : 'Email',
                    phone          : 'Phone',
                    mobile         : 'Mobile',
                    fax            : 'Fax',
                    FB             : 'FB',
                    LI             : 'LI',
                    skype          : 'Skype',
                    workflow       : 'Stage',
                    country        : 'Country'
                }, {
                    name           : '.Net Screensaver',
                    expectedRevenue: '$ 2 500.00',
                    jobPosition    : 'CEO',
                    creationDate   : '06 Sep, 2016',
                    convertedDate  : '03 Feb, 2017',
                    company        : 'Kanakia',
                    customer       : 'Sudhir Kumar',
                    tags           : 'Smth',
                    dateBirth      : '03 Feb, 1980',
                    address        : 'India 400008 Mumbai City Mumba BKC Annexe, Junction of CST Road and LBS Road, Lal Bahadur Shastri Marg, Kurla West, Mumbai, Maharashtra 400070, India',
                    contactName    : 'Alex Lysa',
                    salesPerson    : 'Alex Lysa',
                    salesTeam      : '',
                    expectedClosing: '18 Sep, 2016',
                    priority       : 'Hot',
                    email          : 'skumar@kanakia.com',
                    phone          : '91 1800 267 1200',
                    mobile         : '91 1800 267 1200',
                    fax            : '91 1800 267 1200',
                    FB             : 'https://www.facebook.com/profile.php?id=example_id',
                    LI             : 'https://www.linkedin.com/in/one-more-example-465484wef58/',
                    skype          : 'aaronius0000',
                    workflow       : 'New',
                    country        : 'United States of America'
                }, {
                    name           : 'Android and iOS apps for drivers',
                    expectedRevenue: '$ 22 000.00',
                    jobPosition    : 'Owner and Founder',
                    creationDate   : '06 Sep, 2016',
                    convertedDate  : '06 Sep, 2016',
                    company        : 'Almaa',
                    customer       : 'Johan Van Hollen',
                    tags           : 'Smth',
                    dateBirth      : '03 Feb, 2017',
                    address        : 'Netherlands 12010 Montgomery Amsterda Jonge Roelensteeg 12-14, 1012 PL',
                    contactName    : 'Alex Lysa',
                    salesPerson    : 'Alex Lysa',
                    salesTeam      : 'Smth',
                    expectedClosing: '16 Sep, 2016',
                    priority       : 'Medium',
                    email          : 'johan@almaa.com',
                    phone          : '+31 20 625 5767',
                    mobile         : '+31 20 625 5767',
                    fax            : '+31 20 625 5763',
                    FB             : 'https://www.facebook.com/profile.php?id=example_id',
                    LI             : 'https://www.linkedin.com/in/one-more-example-465484wef58/',
                    skype          : 'johan_almaa',
                    workflow       : 'New',
                    source         : 'Offline Meetings',
                    country        : 'Netherlands'
                }]
            }
        };
        var dataTypes = {
            salesReports: {
                salesByProductReport: {
                    product          : 'String',
                    sku              : 'String',
                    taxes            : 'Finance',
                    grossSales       : 'Finance',
                    grossSalesPercent: 'Percent',
                    unitsSold        : 'Integer',
                    unitsPercent     : 'Percent'
                },

                salesByMonthReport: {
                    month      : 'String',
                    data       : 'Integer',
                    gross_sales: 'Finance',
                    discount   : 'Finance',
                    shipping   : 'Finance',
                    taxes      : 'Finance',
                    total_sales: 'Finance'
                },

                salesByChannelReport: {
                    channelName    : 'String',
                    order          : 'Integer',
                    orderedQuantity: 'Integer',
                    grossSales     : 'Finance',
                    totalSales     : 'Finance',
                    tax            : 'Finance',
                    shipping       : 'Finance'
                }
            },

            inventoryReports: {
                lowStockReport: {
                    product      : 'String',
                    sku          : 'String',
                    avalStock    : 'Integer',
                    lowAlertLevel: 'Integer',
                    atmLow       : 'Integer',
                    awaiting     : 'Integer'
                },

                incomingStockReport: {
                    products     : 'String',
                    variants     : 'String',
                    sku          : 'String',
                    purchaseOrder: 'String',
                    onHand       : 'Integer',
                    incomingStock: 'Integer',
                    total        : 'Finance'
                },

                productListingReport: {
                    variant     : 'String',
                    sku         : 'String',
                    salesChannel: 'Channel',
                    listingPrice: 'Integer',
                    unitSold    : 'Integer',
                    dateLinked  : 'Date'
                },

                warehouseMovementReport: {
                    sku           : 'String',
                    name          : 'String',
                    warehouse     : 'String',
                    openingBalance: 'Number',
                    inwards       : 'Number',
                    outwards      : 'Number',
                    closingBalance: 'Number'
                }
            },

            leadsReports: {
                leadsByStage        : opportunitiesTypes,
                leadsByPriority     : opportunitiesTypes,
                leadsByAssignee     : opportunitiesTypes,
                leadsBySource       : opportunitiesTypes,
                leadsByCountry      : opportunitiesTypes,
                leadsWithContactInfo: opportunitiesTypes,
                leadsExtended       : opportunitiesTypes
            },

            opportunitiesReports: {
                opportunitiesByRevenue      : opportunitiesTypes,
                opportunitiesByStage        : opportunitiesTypes,
                opportunitiesByExpires      : opportunitiesTypes,
                opportunitiesByCountry      : opportunitiesTypes,
                opportunitiesByConvertedDate: opportunitiesTypes,
                opportunitiesByCreationDate : opportunitiesTypes,
                opportunitiesBySalesPerson  : opportunitiesTypes,
                opportunitiesWithContactInfo: opportunitiesTypes,
                opportunitiesExtendedFields : opportunitiesTypes
            },
            employeesReports    : {
                employeesByDepartment    : employeesType,
                employeesByJobPosition   : employeesType,
                employeesByGender        : employeesType,
                employeesByMaritalStatus : employeesType,
                employeesByEmploymentType: employeesType,
                employeesByJobType       : employeesType,
                employeesByManager       : employeesType,
                employeesBySource        : employeesType,
                employeesByHiredPeriod   : employeesType,
                employeesByFiredPeriod   : employeesType,
                employeesByAny           : employeesType
            },

            personReports: {
                personByCountry        : personType,
                personBySalesTeam      : personType,
                personByRevenueSold    : personType,
                personByRevenuePaid    : personType,
                personByRevenuePrepaid : personType,
                personByRevenueExpenses: personType
            }
        };

        var typesReports = {
            salesByProductReport        : 'By product',
            salesByMonthReport          : 'By month',
            salesByChannelReport        : 'By channel',
            stockDetailsReport          : 'Stock details',
            salesReports                : 'Sales',
            stockDetails                : 'Stock details',
            inventoryReports            : 'Inventory',
            productListingReport        : 'Products',
            incomingStockReport         : 'Incoming stock',
            lowStockReport              : 'Low stock report',
            warehouseMovementReport     : 'Warehouse movement',
            leadsByStage                : 'By stage',
            leadsByPriority             : 'By priority',
            leadsByAssignee             : 'By assignee',
            leadsBySource               : 'By source',
            leadsByCountry              : 'By country',
            leadsWithContactInfo        : 'With contact info',
            leadsExtended               : 'Extended report',
            leadsReports                : 'Leads',
            opportunitiesReports        : 'Opportunities',
            opportunitiesByRevenue      : 'By revenue',
            opportunitiesByStage        : 'By stage',
            opportunitiesByExpires      : 'By expected closing date',
            opportunitiesByCountry      : 'By country',
            opportunitiesByConvertedDate: 'By converted date',
            opportunitiesByCreationDate : 'By creation date',
            opportunitiesBySalesPerson  : 'By Salesperson',
            opportunitiesWithContactInfo: 'With contact info',
            opportunitiesExtendedFields : 'Extended report',
            employeesReports            : 'Employees',
            employeesByHiredPeriod      : 'By Hired Period',
            employeesByFiredPeriod      : 'By Fired Period',
            employeesByDepartment       : 'By Department',
            employeesByJobPosition      : 'By Job Position',
            employeesByGender           : 'By Gender',
            employeesByMaritalStatus    : 'By Marital Status',
            employeesByEmploymentType   : 'By Employment Type',
            employeesByJobType          : 'By Job Type',
            employeesByManager          : 'By Manager',
            employeesBySource           : 'By Source',
            employeesByAny              : 'Extended report',
            personReports               : 'Persons',
            personByCountry             : 'By Country',
            personBySalesTeam           : 'By Sales Team',
            personByRevenueSold         : 'By Revenue Sold',
            personByRevenuePaid         : 'By Revenue Paid',
            personByRevenuePrepaid      : 'By Revenue Prepaid',
            personByRevenueExpenses     : 'By Revenue Expenses',
            personByAnyFiled            : 'Extended report',
            companyReports              : 'Companies',
            companyByCountry            : 'By Country',
            companyBySalesTeam          : 'By Sales Team',
            companyByRevenueSold        : 'By Revenue Sold',
            companyByRevenuePaid        : 'By Revenue Paid',
            companyByRevenuePrepaid     : 'By Revenue Prepaid',
            companyByRevenueExpenses    : 'By Revenue Expenses',
            companyByAnyFiled           : 'Extended report'
        };

        var total = {
            salesReports: {
                salesByProductReport: [
                    'grossSales',
                    'grossSalesPercent',
                    'unitsSold',
                    'unitsPercent'
                ],

                salesByMonthReport: [
                    'gross_sales',
                    'discount',
                    'shipping',
                    'taxes',
                    'total_sales'
                ],

                salesByChannelReport: [
                    'order',
                    'orderedQuantity',
                    'grossSales',
                    'totalSales',
                    'tax',
                    'shipping'
                ]
            },

            inventoryReports: {
                stockDetailsReport: [
                    'inStock',
                    'lowStock',
                    'allocated',
                    'onHand',
                    'unitCost',
                    'totalCost'
                ]
            }
        };

        if (typeof exports !== 'undefined') {
            if (typeof module !== 'undefined' && module.exports) {
                module.exports = {
                    reports     : reports,
                    dataType    : dataTypes,
                    total       : total,
                    typesReports: typesReports
                };
            }
        } else if (typeof define !== 'undefined' && define.amd) {
            define([], function () {
                return {
                    reports     : reports,
                    dataType    : dataTypes,
                    total       : total,
                    typesReports: typesReports
                };
            });
        } else {
            root.REPORTS = {
                reports     : reports,
                dataType    : dataTypes,
                total       : total,
                typesReports: typesReports
            };
        }
    }()
);