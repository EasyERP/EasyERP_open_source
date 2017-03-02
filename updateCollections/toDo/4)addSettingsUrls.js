var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://144.76.56.111:28017/production';
var mongoose = require('mongoose');

MongoClient.connect(url, function (err, db) {

    var Settings = db.collection('settings');

    Settings.remove({name: 'integration'}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        Settings.save(
            {
                name: 'integration',
                apps: {
                    magento: {
                        v2: {
                            products: {
                                get     : '/rest/V1/products?searchCriteria=0',
                                getBySKU: '/rest/V1/products/',
                                create  : '/rest/V1/products',
                                delete  : '/rest/V1/products/'
                            },

                            customers: {
                                get   : '/rest/V1/customers/search?searchCriteria=0',
                                create: '/rest/V1/customers',
                                put   : '/rest/V1/customers/'
                            },

                            categories: {
                                get   : '/rest/V1/categories',
                                create: '/rest/V1/categories'
                            },

                            orders: {
                                get   : '/rest/V1/orders?searchCriteria=0',
                                create: '/rest/V1/orders'
                            },

                            invoices: {
                                get   : '/rest/V1/invoices?searchCriteria=0',
                                create: '/rest/V1/invoices'
                            }
                        },
                        v1: {
                            products: {
                                get     : '/api/rest/products',
                                getBySKU: '/api/rest/products',
                                create  : '/api/rest/products'
                            },

                            customers: {
                                get   : '/api/rest/customers',
                                create: '/api/rest/customers'
                            },

                            categories: {
                                get   : '/api/rest/products', ///api/rest/products/:productId/categories
                                create: '/api/rest/products'
                            },

                            orders: {
                                get   : '/api/rest/orders',
                                create: '/api/rest/orders'
                            }/*,

                             invoices: {
                             get   : '/rest/V1/invoices',
                             create: '/rest/V1/invoices'
                             }

                             There are not invoices in API
                             */
                        }
                    },
                    shopify: {
                        v1: {
                            products: {
                                get          : '/admin/products.json',
                                create       : '/admin/products.json',
                                createVariant: '/admin/products/',
                                putVariant   : '/admin/variants/',
                                put          : '/admin/products/',
                                delete       : '/admin/products/'
                            },

                            customers: {
                                get   : '/admin/customers.json',
                                create: '/admin/customers.json'
                            },

                            orders: {
                                get   : '/admin/orders.json',
                                create: '/admin/orders.json'
                            }
                        }
                    },
                    etsy   : {
                        v2: {
                            products  : {
                                get   : '/listings',
                                create: '/listings',
                                put   : '/listings',
                                delete: '/listings'
                            },
                            orders    : {
                                get: '/receipts',
                                put: '/receipts'
                            },
                            categories: {
                                get: '/categories'
                            }
                        }
                    }
                }
            }, function (err, res) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }

                if (res) {
                    console.log('successfully created');
                }
            });
    });

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('done');
});
